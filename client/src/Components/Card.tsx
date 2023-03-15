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
  return <img src="/images/noun-hiking.png" alt="placeholder hikers"></img>
}

const Image = ({...props}) => {
   return <img crossOrigin="anonymous"
               src={props.url} 
               alt="display image for news release" ></img>
}

export const Card: React.FC<Props> = ({...props}) => {
  const [isImageAvailable, setImageAvailability] = useState<boolean>()

  useEffect(() => {
    if(props.image?.url !== ''){
      setImageAvailability(true)
    } else{
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
           target="_blank"
           rel="noreferrer">Visit</a>
        <span>Date: {renderDate(props.releaseDate)}</span>
    </div>
  )
}