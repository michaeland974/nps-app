import * as React from 'react'
import styles from './styles/BirdAnimation.module.css'

export const BirdAnimation = () => {
  return(
      <div className={[styles['mobile-condition'],
                       styles['bird-container']].join(' ')}>
        <div className={styles['bird']}></div>
      </div>
  );
}