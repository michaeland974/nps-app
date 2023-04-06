import * as React from 'react'
import { useState, useEffect } from 'react'
import styles from './styles/Card.module.css'
//Components
import { Loading } from './Loading'
import { Article } from '../Containers/Main'
import { renderDate } from '../utils/renderDate'
import { DisplayType } from '../Containers/OutputContainer'

interface Props extends Article, DisplayType{
  onClick?: (React.MouseEventHandler<HTMLButtonElement>)
}

const Placeholder = () => {
  return <img className={styles["article-image"]}
              src="/images/noun-hiking.png" 
              alt="placeholder hikers"></img>
}

const Image = ({...props}) => {
  return <img className={styles["article-image"]}
              crossOrigin="anonymous"
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
  }, [props.image])
  
  return(
    <div className={styles["container"]}>
     
      <div className={styles["card"]}>

        <div className={styles["header"]}>
          {props.parkName}
        </div>
        
        <main className={styles["content"]}>
          <h1 className={styles["title"]}>{props.title}</h1>
            {isImageAvailable ? <Image url={props.image?.url}/>: 
                                <Placeholder />}
          <p className={styles["abstract"]}>{props.abstract}</p>
          <span className={styles["date"]}>{renderDate(props.releaseDate)}</span>            
        </main>
        
        <div className={styles["footer"]}>
          <button id={styles["previous"]}
                  onClick={props.onClick}></button>  
          <a id={styles["visit"]}
             href={props.url} 
             target="_blank"
             rel="noreferrer">Visit</a>
        </div>
      </div>

    </div>
  )
}