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
    <header>
      <span className={styles['page-header']}>
         <span>
            National Park Service News
          </span>
         <Icon />
      </span>
    </header>
  )
}