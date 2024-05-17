import React from 'react'
import styles from './styles.module.css'
import backImg from '../../assets/back.png'
import homeImg from '../../assets/home.png'
import { useNavigate } from 'react-router-dom'

const NavigateButtons: React.FC = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="wrapButtons">
      <button onClick={goBack} className={styles.btnBack}>
        <img src={backImg} alt="back" />
      </button>
      <button onClick={goHome} className={styles.btnHome}>
        <img src={homeImg} alt="home" />
      </button>
    </div>
  )
}

export default NavigateButtons
