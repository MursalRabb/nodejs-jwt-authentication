import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import axios from 'axios'
import {url} from './utils'

import {createTheme, ThemeProvider} from '@material-ui/core/styles'
import {CircularProgress, Button} from '@material-ui/core'

import './components/static/css/generics.css'

import Main from './components/Main'



const theme = createTheme({
  palette: {
    primary: {
      main: '#00acee'
    },
    
  }
})


const App = () => {

  const [access, setAccess] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  

  const handleAccess = (access) => {
    setAccess(access)
    currentUser(access)
    
    
  }

  const handleLogout = async () => {
    async function fetch () {
      let config = {
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`
      }}
      try {
        let res = await axios.get(`${url}auth/logout`, config)
        if (res.status === 200) {
          setUser(null)
          setAccess(null)
        }
      } catch (e) {
        return
      }
    }
    fetch()
  }

  //gets user first time access updates
  async function currentUser (token) {
    
    let config = {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }}
    try {
      let res = await axios.get(`${url}auth/current`, config)
      if (res.status === 200) {
        setUser(res.data)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      return
    }
  }


//getting access on reload
  React.useEffect(
    ()=>{
      setLoading(true)
      async function fetch () {
        const config = {
          timeout: 1000 * 10,
          withCredentials: true,
          headers: {'Content-Type': 'application/json'}
        }
        try {
          let res = await axios.get(`${url}auth/refresh`, config)
          if (res.status === 200) {
            setAccess(res.data.access)
            currentUser(res.data.access)
            
            
          }
        } catch (e) {
          setLoading(false)
          return
        }
      }
      if (!access) {
        fetch()
      }
    },
    []
  )


//refetching access after 14 mins
React.useEffect(
  ()=>{
    

    async function fetch () {
      const config = {
        withCredentials: true,
        headers: {'Content-Type': 'application/json'}
      }
      try {
        let res = await axios.get(`${url}auth/refresh`, config)
        if (res.status === 200) {
          setAccess(res.data.access)
          
        }
      } catch (e) {
        setLoading(false)
        if(e.response && e.response.status === 401) {
          handleLogout()
        }
      }
    }
    
    if (access) {
      setTimeout(fetch, 1000*60*14)
    }

  },
  [access]
)



  return (
    <>
      <ThemeProvider theme={theme}>
        <Button
        onClick={handleLogout}
        style={{'zIndex': '10000'}}
        >
          Log out
        </Button>
      
        <Router>
          {
            loading===false?
            <Main user={user} access={access} handleAccess={handleAccess}/>:
            <CircularProgress size={68} color='primary'/>
          }
          
        </Router>
      </ThemeProvider>
    </>
  )
}


export default App