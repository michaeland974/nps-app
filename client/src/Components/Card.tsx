import * as React from 'react'
import styles from './styles/Card.module.css'
import { Article } from '../Containers/Main'

interface Props extends Article{
  onClick?: (React.MouseEventHandler<HTMLButtonElement>)
 }

//Fix BACK button

export const Card: React.FC<Props> = ({...props}) => {
  return(
    <div className={styles["card"]}>
      <button id={styles["back"]}
              onClick={props.onClick}> Back </button>
      <div>Park Name: {props.parkName}</div>
      <div>Title: {props.title}</div>
      <div>Date: {props.releaseDate}</div>
    </div>
  )
}