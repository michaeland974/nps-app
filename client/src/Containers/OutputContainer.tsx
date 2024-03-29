import * as React from 'react';
import styles from './styles/OutputContainer.module.css'
import { OptionsContext, OutputContainerContext } from './../interfaces/contexts';
import { renderDate } from '../utils/renderDate';
import { useState, useEffect, useContext } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Article, NewsToggle, ViewToggle } from '../interfaces/interfaces';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import { Loading } from '../Components/Loading';
import { ChipGroup } from '../Components/ChipGroup';

type Props = {
 inputValueCode: string,
 setInputValueCode?: React.Dispatch<React.SetStateAction<string>>
 currentPark?: string
}

// json response from API does not include park name property
const getParkNameFromCode = ( options: Array<Array<string>>, 
                              parkCode: string | undefined): string => {
  const keys = options.find((item) => {
    const optionsParkName = item[0];
    const optionsParkCode = item[1].toLowerCase();
  
    if(parkCode?.includes(optionsParkCode)){
      return optionsParkName;
    }
  })
  return keys && parkCode ? keys[0] : ''
}

export const OutputContainer: React.FC<Props> = ({inputValueCode, }) => {
  const [endpoint, setEndpoint] = useState("recent")
  const [newsType, setNewsType] = useState<NewsToggle>('recent');
  const [cardProps, setCardProps] = useState<Article>({}); 
  const [scrollPos, setScrollPos] = useState(0)
  const {list: parkOptions} = useContext(OptionsContext)
  const {scrollRef, view: displayToggle, 
         dispatch: inputDispatcher} = useContext(OutputContainerContext)
  const [{response, state, handleNewsData,
          dispatch: fetchDispatcher }] = useFetch(`/api/${endpoint}`, [endpoint]) 
  
  useEffect(() => {
    if(endpoint !== 'recent'){
      setNewsType('park')
    }
    handleNewsData(response.data, endpoint)
  }, [response])
  
  useEffect(() => {
    setEndpoint(inputValueCode)
  }, [inputValueCode])

  useEffect(() => {
    if(scrollRef && scrollRef.current){
      if(displayToggle === 'rows'){
      scrollRef.current.style.overflow= 'scroll'
      scrollRef.current.scrollTo(0, scrollPos)
      }
      else if(displayToggle === 'card'){
      scrollRef.current.style.overflow = 'hidden';
      scrollRef.current.scrollTo(0, 0) 
      }
    }
  }, [displayToggle])

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if(displayToggle === 'rows'){
      setScrollPos(e.currentTarget.scrollTop);
    }
  }

  const passProps = (obj: Article, parkName: string) => {
    const props = { parkName: parkName,
                    title: obj.title,
                    releaseDate: obj.releaseDate,
                    abstract: obj.abstract,
                    url: obj.url,
                    image: { 
                      url: obj.image?.url,
                      caption: obj.image?.caption,
                      altText: obj.image?.altText }
                  }
    setCardProps(props);
  }

  const handleRowClick = (obj: Article, parkName: string) => {
    passProps(obj, parkName)
    inputDispatcher({type: 'view', payload: 'card'}) 
  }

  const RowDisplayMapped = (displayList: Article[]) => {                 
    const rowMap = displayList.map((article, i) => {
      const parkName = getParkNameFromCode(parkOptions, article.parkCode)

      return (
        <RowDisplay key={i}
                    tabIndex={i+2}
                    onClick={() => handleRowClick(article, parkName)}
                    parkName={parkName}
                    releaseDate={renderDate(article.releaseDate)}
                    title={article.title}
                    url={article.url}
                    image={article.image}
                    abstract={article.abstract} />)
    })
    const maxHeight = response.isLoading ? '100vh' : '100%'
    
    const handleLoading = () => {
      if(response.isLoading){
        return <Loading />
      } 
      else if((state.newsDisplay.previous).length===0 && 
              newsType==='park' && 
              endpoint === 'recent'){
        return <h1 id={styles["empty-state-message"]}>
                Select a park
               </h1>
      }else{
        return rowMap
      }
    }
  return (
    <div className={styles["news-display"]}
          style={{height: maxHeight}}>
      {handleLoading()}
    </div>
  )
  }

  const renderDisplaySwitch = (type: string, displayList: Article[]) => {
    switch(type){
      case 'rows':
        return RowDisplayMapped(displayList)
      case 'card':
        return ( <Card onClick={() => {inputDispatcher({type: 'view', payload: 'rows'})}}
                       type={displayToggle as ViewToggle}
                        {...cardProps} />)
    }
  }

  return (
    <div className={styles["container"]}
         ref={scrollRef}
         onScroll={handleScroll}>
      <div className={styles['header-container']}>
        <ChipGroup newsType={newsType}
                   setNewsType={setNewsType}
                   dispatchers={{input: inputDispatcher, 
                                 fetched: fetchDispatcher}}
                   state={state}/>
      </div>
      <>
        {renderDisplaySwitch(displayToggle, 
                             state.newsDisplay.selected)}
                              
      </>
    </div>
    )
}