import React from 'react'



const Home = (props) => {

    const {user} = props

    return (
        <>
            <h1>{user.firstname}</h1>
            <h1>{user.lastname}</h1>
            <h1>{user.username}</h1>
        </>
    )
}


export default Home