import * as React from 'react';
import styles from './styles/OutputContainer.module.css'
import { OptionsContext } from './../Containers/Main';
//Hooks
import { useState, useEffect, useContext } from 'react';
import { useFetch } from '../hooks/useFetch';
//Components
import { Article } from './Main';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import { Loading } from '../Components/Loading';

type Props = {
 inputValueCode: string,
 setInputValueCode?: React.Dispatch<React.SetStateAction<string>>
 currentPark?: string
}

type DisplayType = {
  type: 'rows' | 'card'
}

//json response from API does not include park name property
const getParkNameFromCode = (options: Array<Array<string>>, 
                              parkCode: string | undefined): string => {
  const keys = options.find((item) => {
    const optionsParkName = item[0];
    const optionsParkCode = item[1].toLowerCase();
  
    if(optionsParkCode === parkCode){
      return optionsParkName;
    }
  })
  return keys && parkCode ? keys[0] : ''
}

export const OutputContainer: React.FC<Props> = ({inputValueCode, 
                                                  setInputValueCode, 
                                                  currentPark}) => {
  
  const [endpoint, setEndpoint] = useState("recent")  
  const [{ response,
           contentDisplay, 
           handleNewsData }] = useFetch(`/api/${endpoint}`, [endpoint]) 
  
  const [cardProps, setCardProps] = useState<Article>({});                                                 
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});
  const {parkOptions} = useContext(OptionsContext)
    
  useEffect(() => {
    handleNewsData(response.data)
  }, [response])
  
  useEffect(() => {
    setEndpoint(inputValueCode)
  }, [inputValueCode])

 //change parkName
  const passProps = (obj: Article) => {
    const props = { parkName: obj.parkName,
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
    const text = (currentPark === "" ? `Recent National Park News` : 
                                       `National Park News from ${currentPark}`)

    return <h1 className={styles["header"]}>
                {response.isLoading ? "" : text}
            </h1>
  }

  const RowDisplayMapped = (displayList: Article[]) => {
    const isEmpty = (displayList.length === 0)   
    //CHECK                      
    const rowMap = displayList.map((article, i) => {
      //const parkName

      return (
        <RowDisplay key={i}
                    onClick={() => handleRowClick(article)}
                    //parkName = {article.parkCode}
                    //parkName={currentPark}
                    parkName={getParkNameFromCode(parkOptions, 
                                                  article.parkCode)}
                    title={article.title}/> )
    })
    return (
      <div className={styles["news-display"]}>
        {response.isLoading ? <Loading /> : rowMap}
      </div>
    )
  }

  const renderDisplaySwitch = (type: string, displayList: Article[]) => {
    switch(type){
      case 'rows':
        return RowDisplayMapped(displayList)
      case 'card':
        return (<Card onClick={() => { setDisplayType({type: 'rows'})} }
                              {...cardProps} />)
    }
  }

  return (
    <div className={styles["container"]}>
      {renderHeader()}
      <>
        {renderDisplaySwitch(displayType.type, 
                             contentDisplay)}
      </>
    </div>
    )
}