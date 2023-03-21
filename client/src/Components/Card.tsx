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
               loading="eager"
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
    console.log("test")
  }, [props.type])
  
  return(
    <div className={styles["card"]}>
      
        {//<h1>Park Name: {props.parkName}</h1>
        }
        {isImageAvailable ? <Image url={props.image?.url}/> : 
                            <Placeholder />}

        <span>Date: {renderDate(props.releaseDate)}</span>            
        <h1 className={styles["title"]}>Title: {props.title}</h1>
        <p>Abstract: {props.abstract}</p>
        
        <div className={styles["footer"]}>
          <button id={styles["previous"]}
                  onClick={props.onClick}></button>  
          <a id={styles["visit"]}
             href={props.url} 
             target="_blank"
             rel="noreferrer">Visit</a>
        </div>
    </div>
  )
}