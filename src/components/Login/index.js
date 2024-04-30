import {Component} from 'react'
import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    errorMsg: '',
    error: false,
  }

  userInput = event => {
    this.setState({userId: event.target.value})
  }

  pinInput = event => {
    this.setState({pin: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  fail = errorMsg => {
    this.setState({error: true, errorMsg})
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, error, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg">
        <div className="container">
          <div className="left-part">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <form onSubmit={this.BankLogin} className="form">
            <h1 className="heading">Welcome Back!</h1>
            <div className="user-container">
              <label htmlFor="user" className="user-heading">
                User ID
              </label>
              <input
                id="user"
                placeholder="Enter User ID"
                className=""
                type="text"
                value={userId}
                onChange={this.userInput}
                className="input-container"
              />
            </div>
            <div className="user-container">
              <label htmlFor="pin" className="user-heading">
                PIN
              </label>
              <input
                id="pin"
                placeholder="Enter Pin"
                type="password"
                className=""
                value={pin}
                onChange={this.pinInput}
                className="input-container"
              />
            </div>
            <button type="submit" className="button">
              Login
            </button>
            <div>{error === true && <p className="error">*{errorMsg}</p>}</div>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
