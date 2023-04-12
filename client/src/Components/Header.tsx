import * as React from 'react'
import { BirdAnimation } from './BirdAnimation'
import styles from './styles/Header.module.css'

const Icon = () => {
  return (<span>
            <img src="/images/noun-trees.png"
                 id={styles['icon']}></img>
          </span>)
}

export const Header = () => {
  return (
    <header>
      <BirdAnimation />
      <div className={styles['page-header']}>

        <span id={styles['text']}>
          National Park Service News
        </span>
        <Icon />
      </div>
    </header>
  )
}