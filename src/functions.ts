import { useEffect } from 'react'

// валидация изображений
export const isValidImageURL = (url: string) => {
  if (!url) return true
  const imageFileExtensions = /\.(jpg|jpeg|png|gif)$/
  if (!imageFileExtensions.test(url)) {
    return 'Введите корректный URL картинки с форматом .jpg, .jpeg, .png или .gif'
  }
  return true
}

const checkImage = (src: string): Promise<{ src: string; status: 'ok' | 'error' }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ src, status: 'ok' })
    img.onerror = () => resolve({ src, status: 'error' })
    img.src = src
  })
}

export const useProfileImage = (userAva: string | null | undefined, avaImageStatic: string, setProfileImage: (url: string) => void) => {
  useEffect(() => {
    if (userAva && isValidImageURL(userAva)) {
      checkImage(userAva).then((result) => {
        setProfileImage(result.status === 'ok' ? userAva : avaImageStatic)
      })
    } else {
      setProfileImage(avaImageStatic)
    }
  }, [userAva, avaImageStatic, setProfileImage])
}

// сохранение данных пользователя
type UserData = {
  email: string
  username: string
  token: string
  image: string
}

export const saveUserData = (userData: UserData) => {
  localStorage.setItem('email', userData.email)
  localStorage.setItem('username', userData.username)
  localStorage.setItem('token', userData.token)
  localStorage.setItem('image', userData.image)
}
