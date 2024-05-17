import React from 'react'
import styles from './styles.module.css'
import errorImg from '../../assets/404.jpeg'
import NavigateButtons from '../navigateButtons/NavigateButtons'

const NotFound: React.FC = () => {
  return (
    <>
      <NavigateButtons />
      <div className={styles.wrap}>
        <img src={errorImg} alt="404" />
      </div>
    </>
  )
}

export default NotFound
