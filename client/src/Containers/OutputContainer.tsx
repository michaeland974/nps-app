import * as React from 'react';
import { useState, useEffect } from 'react';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import styles from './styles/OutputContainer.module.css'

export interface Json extends Object{
  data?: Object[]
}

type Props = {
  newsDataByPark?: [], 
  setNewsDataByPark?: React.Dispatch<React.SetStateAction<[]>>
}

type Park = {
  parkCode?: string,
  fullName?: string,
  url?: string
}

export interface Article{
  parkName?: string,
  title?: string,
  releaseDate?: string //or date
  desc?: string,
  image?: {
    url?: string,
    caption?: string,
    altText?: string
  },
  relatedParks?: Park[]
} 

type DisplayType = {
  type: 'rows' | 'card'
}

export const OutputContainer: React.FC<Props> = ({newsDataByPark, 
                                                  setNewsDataByPark}) => {
  const [cardProps, setCardProps] = useState<Article>({});                                                 
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});                                                 
  const [display, setDisplay] = useState<Article[]>([]);
  //const [newsDataRecent, setNewsDataRecent] = useFetch("/api/recent", []);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/recent");
      const json: Promise<Json> = (await response.json())
      const data: Article[] | undefined = (await json).data
      
      let recentArticlesList: Article[] = [];

      if(typeof data !== undefined && data?.length !== 0){
        recentArticlesList = data!.slice(0, 25);
      }
      setDisplay(recentArticlesList)
    })()
  }, [])

  const passProps = (obj: Article) => {
    const props = { parkName: obj.relatedParks![0].fullName,
                    title: obj.title,
                    releaseDate: obj.releaseDate,
                    desc: obj.desc,
                    image: { 
                      url: obj.image?.url,
                      caption: obj.image?.caption,
                      altText: obj.image?.altText }
                  }
    setCardProps(props);
  }

  const handleRowClick = (obj: Article) => {
    passProps(obj)
    setDisplayType({type: 'card'})
  }

  const RowDisplayMapped = () => {
    const isEmpty = (display.length === 0)                         
    const rowMap = display.map((article, i) => {
      return (
        <RowDisplay key={i}
                    onClick={() => handleRowClick(article)}
                    parkName={article.relatedParks![0].fullName}
                    title={article.title}/> )
    })
    return (
      <div>
        {isEmpty ? "Loading" : rowMap}
      </div>
    )
  }

  const renderDisplaySwitch = (type: string) => {
    switch(type){
      case 'rows':
        return RowDisplayMapped()
      case 'card':
        return <Card onClick={() => { setDisplayType({type: 'rows'})} }
                              {...cardProps} />
    }
  }

  return (
    <div className={styles["display-container"]}>
      <h1>National Park Recent News</h1>
       <>{renderDisplaySwitch(displayType.type)}</>
    </div>
    )
}