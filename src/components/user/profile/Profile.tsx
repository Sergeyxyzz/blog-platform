import React from 'react'
import styles from './styles.module.css'
import { useForm } from 'react-hook-form'
import { notification } from 'antd'
import { updateUser } from '../../../store/userSlice'
import { useAppDispatch } from '../../../hook'
import { useNavigate } from 'react-router-dom'
import { isValidImageURL } from '../../../functions'
import { useClientAuthorName, useUserEmail } from '../../../store/seletors'

interface FormData {
  email: string
  password: string
  username: string
  image: string
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const name = useClientAuthorName()
  const email = useUserEmail()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' })

  const onSubmit = (data: FormData) => {
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
      .catch(() => {
        notification.error({
          message: 'Ошибка!',
          description: 'Такой login или email уже зарегестрированы.',
        })
      })
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  return (
    <div className={styles.wrapSignIn}>
      <h1 className={styles.title}>Edit profile</h1>
      <div className={styles.formWrap}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className={styles.headerInput}>Username</span>
            <input
              type="text"
              autoComplete=''
              {...register('username', {
                minLength: {
                  value: 3,
                  message: 'Username должен быть не менее 3 символов',
                },
                maxLength: {
                  value: 20,
                  message: 'Username должен быть не более 20 символов',
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: 'Username может содержать только буквы и цифры',
                },
              })}
              defaultValue={name || ''}
              placeholder="Username"
            />
            {errors.username?.message && <p>{errors.username.message}</p>}
          </div>
          <div>
            <span className={styles.headerInput}>Email address</span>
            <input
            autoComplete='email'
              type="email"
              {...register('email', {
                pattern: {
                  value: emailPattern,
                  message: 'Некорректный формат email',
                },
              })}
              defaultValue={email || ''}
              placeholder="Email address"
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email?.message && <p>{errors.email.message}</p>}
          </div>
          <div>
            <span className={styles.headerInput}>New password</span>
            <input
            autoComplete='new-password'
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
  )
}

export default Profile
