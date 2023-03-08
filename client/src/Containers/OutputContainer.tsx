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
}

type DisplayType = {
  type: 'rows' | 'card'
}
                                                //set display
export const OutputContainer: React.FC<Props> = ({inputValueCode, 
                                                  setInputValueCode}) => {
  const [cardProps, setCardProps] = useState<Article>({});                                                 
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});
  const [endpoint, setEndpoint] = useState("recent")  
  const {inputValue, setInputValue} = useContext(InputValueContext)                                             

  const [{ data,
           contentDisplay, 
           handleNewsData }] = useFetch(`/api/${endpoint}`, [endpoint]) //on fetchUrl

  useEffect(() => {
    //fetchData
    console.log(endpoint)
    handleNewsData(data)
  }, [data])

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
    /* The Park name in the header will persist if the user
       changes input without submitting
     */ 
    const currentPark = inputValue;
    const currentParkCode = inputValueCode;

    if(currentParkCode === inputValueCode){
      console.log(`testing => ${inputValueCode}`)
    }

    if(inputValueCode === "recent"){
      return <h1 className={styles["header"]}>
                Recent National Park News
             </h1>
    }
    else{
      return <h1 className={styles["header"]}>
                National Park News from {currentPark}
             </h1>
    }

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
          {renderHeader()}
       <div className={styles["display"]}>
          {renderDisplaySwitch(displayType.type, 
                               contentDisplay )}
       </div>
    </div>
    )
}