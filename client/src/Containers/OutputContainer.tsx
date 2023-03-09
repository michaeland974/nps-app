import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { InputValueContext } from './Main';
import { useFetch } from '../hooks/useFetch';
import { Json, Article } from './Main';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import styles from './styles/OutputContainer.module.css'

type Props = {
  //newsDataByPark?: [], 
 // setNewsDataByPark?: React.Dispatch<React.SetStateAction<[]>>
 inputValueCode: string,
 setInputValueCode?: React.Dispatch<React.SetStateAction<string>>
 currentPark?: string
}

type DisplayType = {
  type: 'rows' | 'card'
}
                                                //set display
export const OutputContainer: React.FC<Props> = ({inputValueCode, 
                                                  setInputValueCode, 
                                                  currentPark}) => {
  const [cardProps, setCardProps] = useState<Article>({});                                                 
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});
  const [endpoint, setEndpoint] = useState("recent")  
  const {inputValue, setInputValue} = useContext(InputValueContext)
  
  const [{ response,
          contentDisplay, 
          handleNewsData }] = useFetch(`/api/${endpoint}`, [endpoint]) 
    
  // useEffect(() => {
  //   renderHeader()
  // }, [contentDisplay])

  useEffect(() => {
    //fetchData
    console.log(response.isLoading)
    console.log(`testing endpoint => ${endpoint}`)
    handleNewsData(response.data)
    
    //return (() => {se(false)})
  }, [response])
  
  useEffect(() => {
    setEndpoint(inputValueCode)
    //console.log(fetchUrl)
  }, [inputValueCode])
 
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

  const renderHeader = () => {
    let text = "";
    
    if(currentPark === ""){
      text = "Recent National Park News"
    }
    else{
      text = `National Park News from ${currentPark}`
    }

    return <h1 className={styles["header"]}>
                {response.isLoading ? "isLoading..." : text}
            </h1>
  }

  const RowDisplayMapped = (displayList: Article[]) => {
    const isEmpty = (displayList.length === 0)   
    //CHECK                      
    const rowMap = displayList.map((article, i) => {
      return (
        <RowDisplay key={i}
                    onClick={() => handleRowClick(article)}
                    //parkName={article.relatedParks![0].fullName}
                    parkName={currentPark}
                    title={article.title}/> )
    })
    return (
      <div>
        {response.isLoading ? "isLoading..." : rowMap}
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
      {renderHeader()}
       <div className={styles["display"]}>
          {renderDisplaySwitch(displayType.type, 
                               contentDisplay )}
       </div>
    </div>
    )
}