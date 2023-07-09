import * as React from 'react'
import styles from './styles/Header.module.css'

const Icon = () => {
  return (
    <span>
      <img src="/images/noun-trees.png" id={styles['icon']} alt='icon'></img>
    </span>
  )
}

export const Header = () => {
  return (
    <header>
      <div className={styles['page-header']}>
        <span id={styles['text']}>
          National Park Service News
        </span>
        <Icon />
      </div>
    </header>
  )
}