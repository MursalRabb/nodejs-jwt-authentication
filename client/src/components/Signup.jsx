import React from 'react'
import {useLocation, Link} from 'react-router-dom'


import {url, emailSplitter} from '../utils'

import './static/css/signup.css'

import {Typography, FormLabel, TextField, Button, CircularProgress, Link as MUILink} from '@material-ui/core'
import axios from 'axios'



const Signup = () => {

    const location = useLocation()
    const [error, setError] = React.useState(null)
    
    React.useEffect(()=>{
        
        let urlparams = new URLSearchParams(location.search)
        let error = Object.fromEntries(urlparams)
        
        if (error.error) {
            setError({name: error.error, msg: `${error.message}. `})
        }
        else {
            setError(null)
        }
        
        
    },
    [location])

    const initialErrors = {
        firstname: {bool: false, msg: ' '},
        lastname: {bool: false, msg: ' '},
        email: {bool: false, msg: ' '},
        username: {bool: false, msg: ' '},
        password: {bool: false, msg: ' '},
        confirm: {bool: false, msg: ' '}
    }

    const [errors, setErrors] = React.useState(initialErrors)
    const [loading, setLoading] = React.useState(false)
    const [created, setCreated] = React.useState(false)
    const [email, setEmail] = React.useState(null)

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        setErrors(initialErrors)
        let data = new FormData(event.target)
        data = Object.fromEntries(data)
        const config = {headers:{"Content-Type": 'application/json'}}

        async function fetch() {
            
            
            try {
                const res = await axios.post(`${url}auth/signup`, data, config)
                if (res.status === 201) {
                    setCreated(true)
                    setLoading(false)
                    setEmail(emailSplitter(data.email))
                }
            } catch (e) {
                setLoading(false)
                if (e.response && e.response.status === 400) {
                    let errs = Object.entries(e.response.data)
                    let errorCopy = {...initialErrors}
                    errs.forEach((err)=>{
                        let entrie = err[0]
                        let value = err[1]
                        errorCopy[entrie] = {bool: true, msg: value[0]}
                        
                    })
                    setErrors(errorCopy)
                }
                
            }
        }
        fetch()
        
    }


    const handleFocus = (event) => {
        let name = event.target.name
        setErrors({...errors, [name]: {bool: false, msg: ' '}})
    }

    if (error !== null) {
        return (
            <>
                <div className='signup'>
                    <div className='signup-cnt'>
                        <div className='m-b-12'>
                            <Typography variant='h4' >
                                Oops!
                            </Typography>
                        </div>
                        <Typography variant='h5'>
                            {error.name}
                        </Typography>
                        <Typography variant='h6'>
                            {error.msg}
                            {'Try '}
                            {
                                <Link exact to='/signup/'>
                                    <MUILink>signing up</MUILink>
                                </Link>
                            }
                            {' again.'}
                        </Typography>
                    </div>
                </div>
            </>
        )
    }

    if (created === false) {
        return (
            <>
                <div className='signup'>
                    <form className='signup-cnt' onSubmit={handleSubmit}>
                        <FormLabel className='m-b-12'>
                            <Typography variant='h6' >
                                Create an account
                            </Typography>
                        </FormLabel>
                        <div
                        className='d-flex wd-100'
                        >
                            <TextField 
                            className='f-1'
                            name='firstname'
                            label='First Name'
                            error={errors.firstname.bool}
                            onFocus={handleFocus}
                            helperText={errors.firstname.msg}
                            />
                            <div className='m-l-12'></div>
                            <TextField 
                            className='f-1'
                            
                            name='lastname'
                            label='Last Name'
                            error={errors.lastname.bool}
                            onFocus={handleFocus}
                            helperText={errors.lastname.msg}
                            />
                            
                        </div>
                            <TextField 
                                className='f-1'
                                
                                name='email'
                                label='Email'
                                error={errors.email.bool}
                                onFocus={handleFocus}
                                helperText={errors.email.msg}
                                />
                                <TextField 
                                className='f-1'
                                name='username'
                                label='Username'
                                error={errors.username.bool}
                                onFocus={handleFocus}
                                helperText={errors.username.msg}
                            />
                        <div
                        className='d-flex wd-100'
                        >
                            <TextField 
                            className='f-1'
                            helperText={errors.password.msg}
                            name='password'
                            label='password'
                            type='password'
                            error={errors.password.bool}
                            onFocus={handleFocus}
                            />
                            <div className='m-l-12'></div>
                            <TextField 
                            className='f-1'
                            name='confirm'
                            label='Confirm'
                            type='password'
                            error={errors.confirm.bool}
                            onFocus={handleFocus}
                            helperText={errors.confirm.msg}
                            />
                            
                        </div>
                        
                        <Button
                        type='submit'
                        color='primary'
                        variant='contained'
                        disableElevation
                        disabled={loading}
                        >
                        {loading===true? <CircularProgress size={24}/> : 'Sign up'}
                        </Button>
                        
                    </form>
                    
                </div>
            </>
        )
    } else if (created === true) {
        return (
            <>
                <div className='signup'>
                    <div className='signup-cnt'>
                        <div className='m-b-12'>
                            <Typography variant='h4' >
                                Success
                            </Typography>
                        </div>
                        <Typography variant='h5'>
                            Account created successfully!
                        </Typography>
                        <Typography variant='h6'>
                            {'A confirmation message has been sent. Please visit your '}
                            {<MUILink href={email}>Email Account</MUILink>}
                            {' to activate your account or '}
                            {<MUILink>Log In</MUILink>}
                        </Typography>
                    </div>
                </div>
            </>
        )
    }
    
}



export default Signup