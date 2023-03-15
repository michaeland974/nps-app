import * as React from 'react'
import styles from './styles/Header.module.css'

const Icon = () => {
  return (<span>
            <img src="/images/noun-trees.png"
                 className={styles['icon']}></img>
          </span>)
}

export const Header = () => {
  return (
    <header className={styles['page-header']}>
      <h1>
        National Park Service News Releases
      </h1>
      <Icon />
    </header>
  )
}