import * as React from 'react'
import styles from './styles/RowDisplay.module.css'
import { Article } from '../Containers/Main'

interface Props extends Article {
  onClick?: (React.MouseEventHandler<HTMLDivElement>)
}

export const RowDisplay: React.FC<Props> = ({parkName, title, releaseDate, onClick}) => {
  return(
    <div className={styles["row"]}
         onClick={onClick}>
      RowDisplay
      <div>Park Name: {parkName}</div>
      <div>Title: {title}</div>
      <div>Date: {releaseDate}</div>
    </div>
  )
}