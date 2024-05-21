import React from 'react'
import styles from './styles.module.css'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../../store/userSlice'
import { useAppDispatch } from '../../../hook'
import { useNavigate } from 'react-router-dom'
import { isValidImageURL } from '../../../functions'
import { useClientAuthorName, useIsLoadingUser, useUserEmail } from '../../../store/selectors'
import NavigateButtons from '../../navigateButtons/NavigateButtons'
import { Spin } from 'antd'

interface FormData {
  email: string
  password: string
  username: string
  image: string
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate()
  const name = useClientAuthorName()
  const email = useUserEmail()
  const dispatch = useAppDispatch()

  const isLoading = useIsLoadingUser()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' })

  const onSubmit = (data: FormData, setError: any) => {
    dispatch(
      updateUser({
        password: data.password,
        email: data.email,
        username: data.username,
        image: data.image,
      }),
    )
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        if (error instanceof Object) {
          if (error.username) {
            setError('username', { type: 'manual', message: error.username })
          }
          if (error.email) {
            setError('email', { type: 'manual', message: error.email })
          }
        } else {
          setError('server', { type: 'manual', message: 'Неизвестная ошибка при авторизации.' })
        }
      })
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  return (
    <>
      <NavigateButtons />
      {isLoading ? (
        <div className={styles.wrapSpinner}>
          <h3 style={{ textAlign: 'center' }}>
            <Spin />
          </h3>
        </div>
      ) : (
        <div className={styles.wrapSignIn}>
          <h1 className={styles.title}>Edit profile</h1>
          <div className={styles.formWrap}>
            <form onSubmit={handleSubmit((data) => onSubmit(data, setError))}>
              <div>
                <span className={styles.headerInput}>Username</span>
                <input
                  type="text"
                  autoComplete=""
                  {...register('username', {
                    minLength: {
                      value: 3,
                      message: 'должен быть не менее 3 символов',
                    },
                    maxLength: {
                      value: 20,
                      message: 'должен быть не более 20 символов',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'может содержать только буквы и цифры',
                    },
                  })}
                  defaultValue={name || ''}
                  placeholder="Username"
                  className={errors.username ? styles.errorInput : ''}
                />
                {errors.username?.message && <p>Username {errors.username.message}</p>}
              </div>
              <div>
                <span className={styles.headerInput}>Email address</span>
                <input
                  autoComplete="email"
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: emailPattern,
                      message: 'Некорректный формат',
                    },
                  })}
                  defaultValue={email || ''}
                  placeholder="Email address"
                  className={errors.email ? styles.errorInput : ''}
                />
                {errors.email?.message && <p>Email {errors.email.message}</p>}
              </div>
              <div>
                <span className={styles.headerInput}>New password</span>
                <input
                  autoComplete="new-password"
                  type="password"
                  {...register('password', {
                    required: 'Обязательное поле',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен быть не менее 6 символов',
                    },
                    maxLength: {
                      value: 40,
                      message: 'Пароль не должен превышать 40 символов',
                    },
                  })}
                  placeholder="New password"
                  className={errors.password ? styles.errorInput : ''}
                />
                {errors.password?.message && <p>{errors.password.message}</p>}
              </div>
              <div>
                <span className={styles.headerInput}>Image URL</span>
                <input
                  type="url"
                  {...register('image', {
                    validate: (value) => isValidImageURL(value),
                  })}
                  placeholder="URL картинки"
                  className={errors.image ? styles.errorInput : ''}
                />
                {errors.image?.message && <p>{errors.image.message}</p>}
              </div>
              <button type="submit" className={styles.submitBtn}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default EditProfile
