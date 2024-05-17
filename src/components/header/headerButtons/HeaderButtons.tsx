import React, { useState } from 'react'
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../hook'
import { logOut } from '../../../store/userSlice'
import avaImageStatic from '../../../assets/ava.jpg'
import { useProfileImage } from '../../../functions'
import { useClientAuthorName, useUserAva, useUserEmail } from '../../../store/selectors'

const HeaderButtons: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const name = useClientAuthorName()
  const email = useUserEmail()
  const userAva = useUserAva()
  const [profileImage, setProfileImage] = useState<string>(avaImageStatic)

  useProfileImage(userAva, avaImageStatic, setProfileImage)

  const goSignUp = () => {
    navigate('/sign-up')
  }

  const goSignIn = () => {
    navigate('/sign-in')
  }

  const goProfile = () => {
    navigate('/profile')
  }

  const goArticle = () => {
    navigate('/new-article')
  }

  const handleLogOut = () => {
    dispatch(logOut())
    navigate('/')
  }

  return (
    <div className={styles.wrap}>
      {!email ? (
        <>
          <button className={styles.signInBtn} onClick={goSignIn}>
            Sign In
          </button>
          <button className={styles.signUpBtn} onClick={goSignUp}>
            Sign Up
          </button>
        </>
      ) : (
        <>
          <button className={styles.creArticle} onClick={goArticle}>
            Create Article
          </button>
          <span className={styles.nameSpan}>{name}</span>
          <button className={styles.goProfileBtn} onClick={goProfile}>
            <img src={profileImage} alt="profile" className={styles.profileAva} />
          </button>
          <button className={styles.logoutBtn} onClick={handleLogOut}>
            Log Out
          </button>
        </>
      )}
    </div>
  )
}

export default HeaderButtons
