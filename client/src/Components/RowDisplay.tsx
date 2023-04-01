import * as React from 'react'
import styles from './styles/RowDisplay.module.css'
//Components
import { Article } from '../Containers/Main'

interface Props extends Article {
  onClick?: (React.MouseEventHandler<HTMLDivElement>)
  tabIndex?: number
}

//conditional on input of park
//dont need title and 
export const RowDisplay: React.FC<Props> = ({parkName, title, releaseDate, onClick, tabIndex}) => {
  return(
    <div className={styles["row"]}
         onClick={onClick}
         tabIndex={tabIndex}>
      
      <h1 className={styles["park-name"]}>
        {parkName}
      </h1>
      <div className={styles["content"]}>
        <span className={styles["title"]}>{title}</span>
        <div className={styles["footer"]}>
          <span className={styles["date"]}>{releaseDate}</span>
          <i className={styles["arrow"]}></i>
        </div>
      </div>
    
    </div>
  )
}