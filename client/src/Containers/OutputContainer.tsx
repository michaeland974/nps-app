import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Json, Article } from './Main';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import styles from './styles/OutputContainer.module.css'

type Props = {
  newsDataByPark?: [], 
  setNewsDataByPark?: React.Dispatch<React.SetStateAction<[]>>
}

type DisplayType = {
  type: 'rows' | 'card'
}
                                                //set display
export const OutputContainer: React.FC<Props> = ({newsDataByPark, 
                                                  setNewsDataByPark}) => {
  const [cardProps, setCardProps] = useState<Article>({});                                                 
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});                                                 

  const [{ data, 
           contentDisplay, 
           handleRecentNewsData }] = useFetch("/api/recent", [])

  useEffect(() => {
    handleRecentNewsData(data)
  }, [data])
 
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

  const RowDisplayMapped = (displayList: Article[]) => {
    const isEmpty = (displayList.length === 0)                         
    const rowMap = displayList.map((article, i) => {
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

  const renderDisplaySwitch = (type: string, displayList: Article[]) => {
    switch(type){
      case 'rows':
        return RowDisplayMapped(displayList)
      case 'card':
        return <Card onClick={() => { setDisplayType({type: 'rows'})} }
                             {...cardProps} />
    }
  }

  return (
    <div className={styles["container"]}>
      <h1>National Park Recent News</h1>
       <div className={styles["display"]}>
          {renderDisplaySwitch(displayType.type, 
                               contentDisplay )}
       </div>
    </div>
    )
}