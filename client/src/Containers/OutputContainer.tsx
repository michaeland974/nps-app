import * as React from 'react';
import styles from './styles/OutputContainer.module.css'
import { OptionsContext, OutputContainerContext } from './../Containers/Main';
import { Json } from './../Containers/Main';
import { classMerger } from '../utils/classMerger';
//Hooks
import { useState, useEffect, useContext, useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
import { InputValueContext } from './../Containers/Main';
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

export interface DisplayType {
  type: 'rows' | 'card'
}

interface NewsType {
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

export const renderDate = (releaseDate: string | undefined): string => {
    if(!releaseDate){
      return ''
    }
    const date = new Date(releaseDate).toLocaleString('en-us',{dateStyle: 'full'})
    const parsedDate = date.substring(date.indexOf(' ') + 1)
    return parsedDate
}

export const OutputContainer: React.FC<Props> = ({inputValueCode, 
                                                  //setInputValueCode, currentPark
                                                }) => {
  
  const [scrollPos, setScrollPos] = useState(0)
  const {scrollRef, 
         displayType, 
         setDisplayType} = useContext(OutputContainerContext)
  const [endpoint, setEndpoint] = useState("recent")
  
  //contentDisplay gets cached, if users toggles between recent/park news
  const [previousParkContent, setPreviousParkContent] = useState<Article[]>([])
  const [{ response,
           recentNews,
           contentDisplay,
           setContentDisplay,
           handleNewsData }] = useFetch(`/api/${endpoint}`, [endpoint]) 
  
  const [cardProps, setCardProps] = useState<Article>({});                                                 
 // const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});
  const {parkOptions} = useContext(OptionsContext)
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
      if(displayType.type === 'card'){
        scrollRef.current.style.overflow = 'hidden';
        scrollRef.current.scrollTo(0, 0)
        
        // scrollRef.current?.scrollTo(0, 0)
      }
    }

  }, [displayType])

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if(displayType.type === 'rows'){
      setScrollPos(e.currentTarget.scrollTop);
    }
  }

 //change parkName
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
    setDisplayType({type: 'card'})
  }

  const renderChips = () => {
    
    const handleClick = (type: NewsType) => {
      setNewsType(type)
      
      if(type.type==='recent'){
        setPreviousParkContent(contentDisplay)
        setContentDisplay(recentNews);
      }
      else if(type.type==='park'){
        setContentDisplay(previousParkContent);
      }
      setDisplayType({type: 'rows'})
    }

    const renderArticleQuantity = (typeCondition: boolean): string => {
      if(contentDisplay.length > 0 && typeCondition){
        return `(${contentDisplay.length})`
      }else{
        return ''
      }
    }
    
    const recentDisplayTypeBool = (newsType.type === 'recent');
    const parkDisplayTypeBool = (newsType.type === 'park');

    return (<>
              <h1 onClick={() => handleClick({type: 'recent'})}
                  className={classMerger(recentDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    RECENT NEWS {renderArticleQuantity(recentDisplayTypeBool)}
              </h1>
              <h1 onClick={() => handleClick({type: 'park'})}
                  className={classMerger(parkDisplayTypeBool, 
                                         styles["chip"], 
                                         styles["selected"])}>
                    PARK RELATED NEWS {renderArticleQuantity(parkDisplayTypeBool)}
              </h1>
            </>
    )
  }

  const RowDisplayMapped = (displayList: Article[]) => {
    const isEmpty = (displayList.length === 0)   
    //CHECK                      
    const rowMap = displayList.map((article, i) => {
      const parkName = getParkNameFromCode(parkOptions, article.parkCode)

      return (
        <RowDisplay key={i}
                    tabIndex={i+2}
                    onClick={() => handleRowClick(article, parkName)}
                    parkName={parkName}
                    //parkName={currentPark}
                    releaseDate={renderDate(article.releaseDate)}
                    title={article.title}
                    url={article.url}
                    image={article.image}
                    abstract={article.abstract}
      />)
    })
    const maxHeight = response.isLoading ? '100vh' : '100%'
    
    const handleLoading = () => {
      if(response.isLoading){
        return <Loading />
      } //if user toggles to "park related news" before selecting a park
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
        {/* {response.isLoading ? <Loading /> : rowMap} */}
        {handleLoading()}
      </div>
    )
  }

  const renderDisplaySwitch = (type: string, displayList: Article[]) => {
    switch(type){
      case 'rows':
        return RowDisplayMapped(displayList)
      case 'card':
        return (<Card onClick={() => {setDisplayType({type: 'rows'})}}
                      type={displayType.type}
                           {...cardProps} />)
    }
  }

  return (
    <div className={styles["container"]}
         ref={scrollRef}
         onScroll={handleScroll}>
     
      <div className={styles['header-container']}>
        <div className={styles['chip-group']}>
          {renderChips()}
        </div>
      </div>

      <>
        {renderDisplaySwitch(displayType.type, 
                              contentDisplay)}
      </>
    </div>
    )
}