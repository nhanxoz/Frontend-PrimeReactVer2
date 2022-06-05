import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import AlertMessage from '../layout/AlertMessage'

const RegisterForm = () => {
	// Context
	const { registerUser } = useContext(AuthContext)

	// Local state
	const [registerForm, setRegisterForm] = useState({
		Email: '',
		Password: '',
		confirmPassword: ''
	})

	const [alert, setAlert] = useState(null)

	const { Email, Password, confirmPassword } = registerForm

	const onChangeRegisterForm = event =>
		setRegisterForm({
			...registerForm,
			[event.target.name]: event.target.value
		})

	const register = async event => {
		event.preventDefault()

		if (Password !== confirmPassword) {
			setAlert({ type: 'danger', message: 'Passwords do not match' })
			setTimeout(() => setAlert(null), 5000)
			return
		}

		try {
			const registerData = await registerUser(registerForm)
			if (!registerData.success) {
				setAlert({ type: 'danger', message: registerData.message })
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
					   <h2>Register</h2>
				   <Form  class="form-container" onSubmit={register}>
					   <input type="text" placeholder="Email address" autoFocus name="Email" required value={Email} onChange={onChangeRegisterForm}/>
					   <input type="password" placeholder="Password" name ="Password" required value={Password} onChange={onChangeRegisterForm}/>
					   <input type="password" placeholder="Confirm Password" name ="confirmPassword" required value={confirmPassword} onChange={onChangeRegisterForm}/>
					   <button class="btn-login" type ="submit">Register</button>
					  
				   </Form>
				  <p>Already have an account?</p> 
				<Link to='/login'>
					<Button variant='info' size='sm' className='ml-2'>
						Login
					</Button>
				</Link>
				   </div>
				   <p>
				
			</p>
			   </div>
		   </div>
	)
}

export default RegisterForm
