import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { toast } from 'react-toastify';

import { loginStart, loginSuccess, loginFailed } from '../../store/actions'
import httpRequest from '../../utils/httpRequest'
import LogoIcon from '../../assets/img/logo-login.png'
import GoogleIcon from '../../assets/img/google.png'
import LoginHero from '../../assets/img/login-hero.jpg'
import Button from '../../components/Button'
import { useStore } from '../../store/UserContext'
import classNames from 'classnames/bind';
import styles from './Login.module.scss';

const cl = classNames.bind(styles);

function Login() {
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('user')) ?? null)
  const navigate = useNavigate()
  const [state, dispatch] = useStore()

  useEffect(() => {
    if (profile)
      navigate('/')
  }, [])

  const [user, setUser] = useState({ username: '', password: '' })
  const handleChangeInput = ({ name, value }) => {
    setUser(prev => (
      {
        ...prev,
        [name]: value
      }
    ))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    const res = await httpRequest.post('/auth/login', user)
    if (res.data.message)
      dispatch(loginFailed(res.data.message))
    else {
      toast.success('Login successfully')
      dispatch(loginSuccess(res.data))
      navigate('/')
    }
  }

  const handleLoginGoogle = () => {
    window.open('http://localhost:5000/auth/google', '_self')
  }

  const handleLoginFacebook = () => {
    window.open('http://localhost:5000/auth/facebook', '_self')
  }

  return (
    <div className={cl('login')}>
      <div className={cl('left')}>
        <img src={LogoIcon} alt="" className={cl('logo')} />
        <h3 className={cl('title')}>Welcome back</h3>
        <form className={cl('form')} onSubmit={handleSubmit}>
          <input className={cl('input')} type="text" autoComplete="on" id="username" placeholder="Enter your username" name="username" value={user.username} onChange={(e) => handleChangeInput(e.target)} />
          <input className={cl('input')} type="password" autoComplete="on" id="password" name="password" placeholder="Enter your password" value={user.password} onChange={(e) => handleChangeInput(e.target)} />
          <Button filled className={cl('submit')}>Continue</Button>
        </form>
        <div className={cl('separator')}>
          <span className={cl('line')}></span>
          <span className={cl('line-text')}>OR</span>
        </div>
        <div className={cl('socials')}>

          <Button onClick={handleLoginGoogle}><img className={cl('icon')} src={GoogleIcon} alt="google" />Login with Google</Button>
          <Button onClick={handleLoginFacebook} leftIcon={faFacebook}>Login with Facebook</Button>
        </div>
        <div className={cl('bottom')}>
          Don't have an account? <Link to='/register' className={cl('signup')}>Sign up</Link>
        </div>
      </div>
      <div className={cl('right')}>
        <img src={LoginHero} alt="" className={cl('hero')} />
      </div>
    </div>
  )
}

export default Login