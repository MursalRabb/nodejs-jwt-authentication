import React from 'react'
import {Link} from 'react-router-dom'
import './static/css/navbar.css'
import {Button, Typography} from '@material-ui/core'


const Navbar = (props) => {

    const {user} = props

    const signupRef = React.useRef()
    const loginRef = React.useRef()

    if (!user) {
        return (
            <>
                <div className='navbar'>
                    <div className='f-1'></div>
                    <div
                    className='d-flex d-flex-clm wht bld'
                    >
                        <Typography variant='h6'>
                            Don't heed whats happening 
                        </Typography>
                        
                        <Typography>
                            It ain't worth your peace
                        </Typography>
                    </div>
                    <div className='f-1'></div>
                    <div className='navbar-cnt'>
                        <Button
                        variant='contained'
                        color='primary'
                        disableElevation
                        style={{'color': '#fff'}}
                        onClick={()=>{loginRef.current.click()}}
                        >
                            Log In
                        </Button>
                        <Button
                        variant='contained'
                        disableElevation
                        onClick={()=>{signupRef.current.click()}}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
                <Link exact to='/signup' hidden ref={signupRef}></Link>
                <Link exact to='/login' hidden ref={loginRef}></Link>
            </>
        )
    }
    else {
        return <></>
    }
}


export default Navbar