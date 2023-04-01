import * as React from 'react';
import styles from './styles/OutputContainer.module.css'
import { OptionsContext, OutputContainerContext } from './../Containers/Main';
//Utils
import { classMerger } from '../utils/classMerger';
import { renderDate } from '../utils/renderDate';
//Hooks
import { useState, useEffect, useContext, useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
//Components
import { Article } from './Main';
import { RowDisplay } from '../Components/RowDisplay';
import { Card } from '../Components/Card';
import { Loading } from '../Components/Loading';
import { ChipGroup } from '../Components/ChipGroup';

type Props = {
 inputValueCode: string,
 setInputValueCode?: React.Dispatch<React.SetStateAction<string>>
 currentPark?: string
}

export interface DisplayType {
  type: 'rows' | 'card'
}

export interface NewsType {
  type: 'recent' | 'park'
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
  const {parkOptions} = useContext(OptionsContext)
  const {scrollRef, 
         displayType, 
         setDisplayType} = useContext(OutputContainerContext)
  const [scrollPos, setScrollPos] = useState(0)
  
  const [endpoint, setEndpoint] = useState("recent")
  const [{ response,
    recentNews,
    contentDisplay,
    setContentDisplay,
    handleNewsData }] = useFetch(`/api/${endpoint}`, [endpoint]) 
  const [cardProps, setCardProps] = useState<Article>({});                                                 
    
  //contentDisplay gets cached, if users toggles between recent/park news
  const [previousParkContent, setPreviousParkContent] = useState<Article[]>([])
  const [newsType, setNewsType] = useState<NewsType>({type: 'recent'});
   
  useEffect(() => {
    if(endpoint !== 'recent'){
      setNewsType({type: 'park'})
    }
    handleNewsData(response.data, endpoint)
  }, [response])
  
  useEffect(() => {
    setEndpoint(inputValueCode)
  }, [inputValueCode])

  useEffect(() => {
    if(scrollRef.current){
      if(displayType.type === 'rows'){
        scrollRef.current.style.overflow= 'scroll'
        scrollRef.current.scrollTo(0, scrollPos)
      }
      else if(displayType.type === 'card'){
        scrollRef.current.style.overflow = 'hidden';
        scrollRef.current.scrollTo(0, 0) 
      }
    }
  }, [displayType])

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if(displayType.type === 'rows'){
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
    setDisplayType({type: 'card'})  }

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
      //if user toggles to "park related news" before selecting a park
      else if(previousParkContent.length===0 && 
              newsType.type==='park' && 
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
        return ( <Card onClick={() => {setDisplayType({type: 'rows'})}}
                       type={displayType.type}
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
                   previousParkContent={previousParkContent}
                   setPreviousParkContent={setPreviousParkContent}
                   recentNews={recentNews}
                   contentDisplay={contentDisplay}
                   setContentDisplay={setContentDisplay}
                   setDisplayType={setDisplayType}/>
      </div>
      <>
        {renderDisplaySwitch(displayType.type, 
                              contentDisplay)}
      </>
    </div>
    )
}