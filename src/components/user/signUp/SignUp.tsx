import React from 'react'
import styles from './styles.module.css'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../../hook'
import { notification } from 'antd'
import { registerUser } from '../../../store/userSlice'
import { useNavigate } from 'react-router-dom'

interface FormData {
  username: string
  email: string
  password: string
  repeatPassword: string
  privacyPolicy: boolean
}

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' })

  const onSubmit = (data: FormData) => {
    dispatch(registerUser({ username: data.username, password: data.password, email: data.email }))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch(() =>
        notification.error({
          message: 'Ошибка!',
          description: 'Пользователь с таким именем или почтой уже зарегестрирован.',
        }),
      )
  }

  const goSignIn = () => {
    navigate('/sign-in')
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  const password = watch('password')

  return (
    <div className={styles.wrapSignUp}>
      <h1 className={styles.title}>Create new account</h1>
      <div className={styles.formWrap}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className={styles.headerInput}>Username</span>
            <input
              type="text"
              {...register('username', {
                required: 'Обязательное поле',
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
              placeholder="Username"
              className={errors.username ? styles.errorInput : ''}
            />
            {errors.username?.message && <p>{errors.username.message}</p>}
          </div>
          <div>
            <span className={styles.headerInput}>Email address</span>
            <input
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Обязательное поле',
                pattern: {
                  value: emailPattern,
                  message: 'Email должен быть в формате user@example.com',
                },
              })}
              placeholder="Email address"
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <span className={styles.headerInput}>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Обязательное поле',
                minLength: {
                  value: 6,
                  message: 'Пароль должен быть не менее 6 символов',
                },
                maxLength: {
                  value: 40,
                  message: 'Пароль должен быть не более 40 символов',
                },
              })}
              placeholder="Password"
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password?.message && <p>{errors.password.message}</p>}
          </div>
          <div>
            <span className={styles.headerInput}>Repeat password</span>
            <input
              type="password"
              autoComplete="new-password"
              {...register('repeatPassword', {
                validate: (value) => value === password || 'Пароли должны совпадать',
              })}
              placeholder="Repeat password"
              className={errors.repeatPassword ? styles.errorInput : ''}
            />
            {errors.repeatPassword?.message && <p>{errors.repeatPassword.message}</p>}
          </div>

          <label className={styles.checkboxInp}>
            <input
              type="checkbox"
              {...register('privacyPolicy', { required: 'You must agree to the Privacy Policy' })}
              className={errors.privacyPolicy ? styles.errorInput : ''}
            />
            <p>I agree to the processing of my personal information</p>
          </label>
          {errors.privacyPolicy?.message && <p>{errors.privacyPolicy.message}</p>}
          <button type="submit" className={styles.submitBtn}>
            Create
          </button>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <button className={styles.spanButton} onClick={goSignIn}>
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
