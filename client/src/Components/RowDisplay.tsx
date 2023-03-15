import * as React from 'react'
import styles from './styles/RowDisplay.module.css'
import { Article } from '../Containers/Main'

interface Props extends Article {
  onClick?: (React.MouseEventHandler<HTMLDivElement>)
}

//conditional on input of park
//dont need title and 
export const RowDisplay: React.FC<Props> = ({parkName, title, releaseDate, onClick}) => {
  return(
    <div className={styles["row"]}
         onClick={onClick}>
      
      <h1 className={styles["park-name"]}>{parkName}</h1>
      <div className={styles["content"]}>
        <span className={styles["title"]}>{title}</span>
        <span className={styles["date"]}>{releaseDate}</span>
      </div>
    
    </div>
  )
}