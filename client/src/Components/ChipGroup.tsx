import * as React from 'react'
import styles from './styles/ChipGroup.module.css'
import { ParkState, ParkStateKeys } from '../hooks/useFetch'
import { classMerger } from '../utils/classMerger'
import { NewsType } from '../Containers/OutputContainer'
import { DisplayType } from '../Containers/OutputContainer'
import { Article } from '../Containers/Main'

type Props = {
  state: ParkState,
  newsType: NewsType
  dispatchers: {
    input: React.Dispatch<{type: "code" | "view" | "value", payload: string}>
    fetched: React.Dispatch<{type: ParkStateKeys, payload: ParkState}>
  }
  setNewsType: (value: React.SetStateAction<NewsType>) => void
  setDisplayType?: (value: React.SetStateAction<DisplayType>) => void
}

export const ChipGroup: React.FC<Props> = ({...props}) => {
  const {dispatchers, setNewsType} = props;
  const {newsDisplay} = props.state;
  
  const handleClick = (newsType: NewsType) => {
    setNewsType(newsType)
    
    if(newsType.type==='recent'){
      dispatchers.fetched({type: 'previous', payload: {
        ...props.state,
        newsDisplay: {...newsDisplay,
          selected: newsDisplay.recent,
          previous: newsDisplay.selected
        }}
      })
    }
    else if(newsType.type==='park'){
      dispatchers.fetched({type: 'selected', payload: {
        ...props.state,
        newsDisplay: {...newsDisplay,
          selected: newsDisplay.previous,
        }}
      })
    }
    dispatchers.input({type: 'view', payload: 'rows'})
  }

  const renderArticleQuantity = (typeCondition: boolean): string => {
    return (newsDisplay.selected.length > 0 && typeCondition) ?
      `(${newsDisplay.selected.length})` : ``;
  }
  
  const recentDisplayTypeBool = (props.newsType.type === 'recent');
  const parkDisplayTypeBool = (props.newsType.type === 'park');

  return (<div className={styles["chip-group"]}>
              <h1 onClick={() => handleClick({type: 'recent'})}
                  className={classMerger(recentDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    RECENT NEWS {renderArticleQuantity(recentDisplayTypeBool)}
              </h1>
              <h1 onClick={() => handleClick({type: 'park'})}
                  className={classMerger(parkDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    PARK RELATED NEWS {renderArticleQuantity(parkDisplayTypeBool)}
              </h1>
          </div>
  )
}