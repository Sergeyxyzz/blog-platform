import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import HeaderButtons from './headerButtons/HeaderButtons'

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
  }

  return (
    <div className={styles.wrap}>
      <div>
        <button onClick={handleClick}>
          <h6>Realworld Blog</h6>
        </button>
      </div>
      <div>
        <HeaderButtons />
      </div>
    </div>
  )
}

export default Header
