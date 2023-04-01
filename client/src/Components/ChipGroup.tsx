import * as React from 'react'
import styles from './styles/ChipGroup.module.css'
import { classMerger } from '../utils/classMerger'
import { NewsType } from '../Containers/OutputContainer'
import { DisplayType } from '../Containers/OutputContainer'
import { Article } from '../Containers/Main'

/**
 * Allow users to toggle between recent news articles and 
 * park related news articles
 */
type Props = {
  //onClick?: (React.MouseEventHandler<HTMLDivElement>)
  newsType: NewsType
  setNewsType: (value: React.SetStateAction<NewsType>) => void
  previousParkContent: Article[]
  setPreviousParkContent: (value: React.SetStateAction<Article[]>) => void
  recentNews: Article[]
  contentDisplay: Article[]
  setContentDisplay: (value: React.SetStateAction<Article[]>) => void
  setDisplayType: (value: React.SetStateAction<DisplayType>) => void
}

export const ChipGroup: React.FC<Props> = ({...props}) => {
    const handleClick = (newsType: NewsType) => {
      // props!.setNewsType(props?.newsType)
      props.setNewsType(newsType)
      
      if(newsType.type==='recent'){
        props.setPreviousParkContent(props.contentDisplay)
        props.setContentDisplay(props.recentNews);
      }
      else if(newsType.type==='park'){
        props.setContentDisplay(props.previousParkContent);
      }
      props.setDisplayType({type: 'rows'})
    }

    const renderArticleQuantity = (typeCondition: boolean): string => {
      if(props.contentDisplay.length > 0 && typeCondition){
        return `(${props.contentDisplay.length})`
      }else{
        return ''
      }
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