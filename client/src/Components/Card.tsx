import * as React from 'react'
import { useState, useEffect } from 'react'
import styles from './styles/Card.module.css'
import { Article } from '../Containers/Main'
import { renderDate } from '../Containers/OutputContainer'
import { DisplayType } from '../Containers/OutputContainer'

interface Props extends Article, DisplayType{
  onClick?: (React.MouseEventHandler<HTMLButtonElement>)
 }

//Fix BACK button
const Placeholder = () => {
  return <img src="/images/noun-bear.png" alt="placeholder bear"></img>
}

const Image = ({...props}) => {
  return <img src={props.url} alt="test"></img>
}

export const Card: React.FC<Props> = ({...props}) => {
  const [isImageAvailable, setImageAvailability] = useState<boolean>()

  useEffect(() => {
    if(props.image?.url !== ''){
      setImageAvailability(true)
    } else{
      console.log("error")
      setImageAvailability(false)
    }
  }, [props.type])
  
  return(
    <div className={styles["card"]}>
      <button id={styles["back"]}
              onClick={props.onClick}> Back </button>
        <h1>Park Name: {props.parkName}</h1>
        <h2>Title: {props.title}</h2>
        {isImageAvailable ? <Image url={props.image?.url}/> : 
                                   <Placeholder />}
        <p>Abstract: {props.abstract}</p>
        <a href={props.url} 
          target="_blank">Link Click</a>
        <span>Date: {renderDate(props.releaseDate)}</span>
    </div>
  )
}