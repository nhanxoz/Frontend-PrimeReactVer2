
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import Button from "react-bootstrap/Button";
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import AlertMessage from '../layout/AlertMessage'
import "./Login.css";

function LoginForm() {
  // Context
  const { loginUser } = useContext(AuthContext)

  // Local state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  })

  const [alert, setAlert] = useState(null)

  const { username, password } = loginForm

  const onChangeLoginForm = (event) => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

  const login = async (event) => {
    event.preventDefault()

    try {
      const loginData = await loginUser(loginForm)
      if (!loginData.success) {
        setAlert({ type: "danger", message: loginData.message })
        setTimeout(() => setAlert(null), 5000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
            <div class="row">
               
                <div class="colm-form">
                    <div class="form-container">
                      <h2>Login</h2>
                    <Form  class="form-container" onSubmit={login}>
                        <input type="text" placeholder="username" autoFocus name="username" required value={username} onChange={onChangeLoginForm}/>
                        <input type="password" placeholder="password" name ="password" required value={password} onChange={onChangeLoginForm}/>
                        <button class="btn-login" type ="submit">Login</button>
                       
                    </Form>
                 
           
            <Link to='/register'>
              <Button variant='info' size='sm' className='ml-2'>
                Register
              </Button>
            </Link>
         
                    </div>
                   
                </div>
            </div>
  );

}

export default LoginForm
