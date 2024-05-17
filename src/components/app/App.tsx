import React from 'react'
import styles from './styles.module.css'
import Header from '../header/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../../PrivateRouter'
import { useClientAuthorName } from '../../store/seletors'
import HomePage from '../../pages/HomePage'
import UserLoginPage from '../../pages/UserLoginPage'
import UserProfilePage from '../../pages/UserProfilePage'
import UserRegistrationPage from '../../pages/UserRegistration'
import CreatePostPage from '../../pages/CreatePostPage'
import PostPage from '../../pages/PostPage'
import EditPostPage from '../../pages/EditPostPage'
import NotFoundPage from '../../pages/NotFoundPage'

const App: React.FC = () => {
  const userName = useClientAuthorName()
  const isAuthenticated = Boolean(userName)

  return (
    <BrowserRouter>
      <div className={styles.appWrap}>
        <Header />
        <div className={styles.bodyWrap}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<UserRegistrationPage />} />
            <Route path="/sign-in" element={<UserLoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route
              path="/new-article"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CreatePostPage />
                </PrivateRoute>
              }
            />
            <Route path="/articles" element={<HomePage />} />
            <Route path="/articles/:slug" element={<PostPage />} />
            <Route
              path="/articles/:slug/edited"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <EditPostPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
