import * as React from 'react'
import styles from './styles/Loading.module.css'

export const Loading = () => {
  return (
    <div className={styles["loading"]}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    )
}