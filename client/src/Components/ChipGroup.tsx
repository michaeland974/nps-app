import * as React from 'react'
import styles from './styles/ChipGroup.module.css'
import { classMerger } from '../utils/classMerger'
import { NewsToggle, ViewToggle, ParkState, ParkStateKeys } from '../interfaces/interfaces'

type Props = {
  state: ParkState,
  newsType: NewsToggle
  dispatchers: {
    input: React.Dispatch<{type: "code" | "view" | "value", payload: string}>
    fetched: React.Dispatch<{type: ParkStateKeys, payload: ParkState}>
  }
  setNewsType: (value: React.SetStateAction<NewsToggle>) => void
  setDisplayType?: (value: React.SetStateAction<ViewToggle>) => void
}

export const ChipGroup: React.FC<Props> = ({...props}) => {
  const {dispatchers, setNewsType} = props;
  const {newsDisplay} = props.state;
  
  const handleClick = (newsType: NewsToggle) => {
    setNewsType(newsType)
    
    if(newsType==='recent'){
      dispatchers.fetched({type: 'previous', payload: {
        ...props.state,
        newsDisplay: {...newsDisplay,
          selected: newsDisplay.recent,
          previous: newsDisplay.selected
        }}
      })
    }
    else if(newsType==='park'){
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
  
  const recentDisplayTypeBool = (props.newsType === 'recent');
  const parkDisplayTypeBool = (props.newsType === 'park');

  return (<div className={styles["chip-group"]}>
              <h1 onClick={() => handleClick('recent')}
                  className={classMerger(recentDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    RECENT NEWS {renderArticleQuantity(recentDisplayTypeBool)}
              </h1>
              <h1 onClick={() => handleClick('park')}
                  className={classMerger(parkDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    PARK RELATED NEWS {renderArticleQuantity(parkDisplayTypeBool)}
              </h1>
          </div>
  )
}