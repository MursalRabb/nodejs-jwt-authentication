import React from 'react'

import axios from 'axios'

import './static/css/login.css'
import {url} from '../utils'
import {TextField, FormLabel, Typography, Button, CircularProgress} from '@material-ui/core'


const Login = (props) => {

    const {handleAccess} = props
    const initialErrors = {
        credentials: {bool: false, msg: ' '},
        password: {bool: false, msg: ' '}
    }
    const [errors, setErrors] = React.useState(initialErrors)
    const [loading, setLoading] = React.useState(false)


    const handleFocus = (event) => {
        let name = event.target.name
        setErrors({...errors, [name]: {bool: false, msg: ' '}})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        setErrors(initialErrors)
        let data = new FormData(event.target)
        data = Object.fromEntries(data)
        let config = {
            withCredentials: true,
            headers: {"Content-Type": 'application/json'}
        }

        async function fetch () {
            try {
                let res = await axios.post(`${url}auth/login`, data, config)
                handleAccess(res.data.access)
                setLoading(false)
            } catch (e) {
                setLoading(false)
                if (e.response && e.response.status === 400) {
                    let errs = Object.entries(e.response.data)
                    let errorCopy = {...initialErrors}
                    errs.forEach((err)=>{
                        let entrie = err[0]
                        let value = err[1]
                        errorCopy[entrie] = {bool: true, msg: value}
                        
                    })
                    setErrors(errorCopy)
                }
            
            }
        }
        fetch()
    }

    return (
        <>
            <div className='login'>
                <form className='login-cnt' onSubmit={handleSubmit}>
                    <FormLabel className='m-b-12'>
                        <Typography variant='h6' >
                                Login to your twatter account
                        </Typography>
                    </FormLabel>
                    <TextField
                    name='credentials'
                    label='Email or username'
                    error={errors.credentials.bool}
                    helperText={errors.credentials.msg}
                    onFocus={handleFocus}
                    />
                    <TextField
                    name='password'
                    label='Password'
                    type='password'
                    error={errors.password.bool}
                    helperText={errors.password.msg}
                    onFocus={handleFocus}
                    />
                    <Button 
                    color='primary' 
                    variant='contained'
                    disableElevation
                    type='submit'
                    disabled={loading}
                    >
                        {
                            loading? <CircularProgress color='primary' size={24}/> :
                            'Login'
                        }
                    </Button>
                </form>
            </div>
        </>
    )
}


export default Login