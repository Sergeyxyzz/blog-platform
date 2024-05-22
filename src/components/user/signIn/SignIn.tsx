import React from 'react'
import styles from './styles.module.css'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../../hook'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../../store/userSlice'
import NavigateButtons from '../../navigateButtons/NavigateButtons'

interface FormData {
  email: string
  password: string
  username: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' })


  const onSubmit = (data: FormData) => {
    dispatch(loginUser({ password: data.password, email: data.email, username: data.username }))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          const { email, password } = error.response.data
          if (email) {
            setError('email', { type: 'manual', message: email })
          }
          if (password) {
            setError('password', { type: 'manual', message: password })
          }
        } else {
          setError('email', { type: 'manual', message: 'Incorrect email or password.' })
          setError('password', { type: 'manual', message: 'Incorrect email or password.' })
        }
      })
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  const goSignUp = () => {
    navigate('/sign-up')
  }

  return (
    <>
      <NavigateButtons />
      <div className={styles.wrapSignIn}>
        <h1 className={styles.title}>Sign In</h1>
        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <span className={styles.headerInput}>
                Email <address></address>
              </span>
              <input
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: emailPattern,
                    message: 'Некорректный формат email',
                  },
                })}
                placeholder="Email address"
                className={errors.email ? styles.errorInput : ''}
              />
              {errors.email?.message && <p>{errors.email.message}</p>}
            </div>
            <div>
              <span className={styles.headerInput}>Password</span>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен быть не менее 6 символов',
                  },
                  maxLength: {
                    value: 40,
                    message: 'Пароль не должен превышать 40 символов',
                  },
                })}
                placeholder="Password"
                className={errors.password ? styles.errorInput : ''}
              />
              {errors.password?.message && <p>{errors.password.message}</p>}
            </div>
            <button type="submit" className={styles.submitBtn}>
              Login
            </button>

            <p className={styles.footerText}>
              Don’t have an account?{' '}
              <button className={styles.spanButton} onClick={goSignUp}>
                Sign Up
              </button>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
