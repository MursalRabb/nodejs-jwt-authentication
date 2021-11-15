import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Navbar from './Navbar'

import './static/css/main.css'


const Main = (props) => {

    const {user, access, handleAccess} = props

    return (
        <>
            <div 
            className='main'
            >
                <Switch>
                    <Route exact path='/'>
                        {user? <Home user={user}/> : <Redirect to='/login'/>}
                    </Route>
                    <Route exact path='/signup'>
                        {user? <Redirect to='/'/> : <Signup/>}
                    </Route>
                    <Route exact path='/login'>
                        {user? <Redirect to='/'/> : <Login handleAccess={handleAccess}/>}
                    </Route>
                </Switch>
            </div>
            <Navbar user={user} />
        </>
    )
}



export default Main