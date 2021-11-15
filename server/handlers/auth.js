const {Prisma} = require('@prisma/client')
const {signupValidator, loginValidator} = require('../validators/auth')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {main, isEmail, isAuthorized} = require('../utils')
const cookieParser = require('cookie-parser')

const  {prisma} = require('../prisma/connection')
const { user } = require('../prisma/connection')



const signup = async (req, res) => {
    let errors = await signupValidator(req.body)
    

    const {firstname, lastname, username, email, password} = req.body

    if (_.isEmpty(errors)) {

        hashed = await bcrypt.hash(password, 12)

        let privateKey = process.env.SECRET_KEY
        let activationToken = jwt.sign({email}, privateKey, {expiresIn: 60*10})


        try {
            let user = await prisma.user.create({
                data: {
                    firstname,
                    lastname,
                    email,
                    username,
                    password: hashed,
                }
            })
            
           

            let emailResponse = await main({firstname, email, activationToken, domain: req.get('host')})
          
            if (emailResponse == 'error') {
                await prisma.user.delete({where: {email}})
                return res.status(500).json({'details': 'internal server error'})
            }

            
            return res.status(201).send(user)

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    errors[e.meta.target[0]] = [`${e.meta.target} already exists`]
                    return res.status(400).send(errors)
                }

            }
            return res.status(500)
        }
        
    } else {
        return res.status(400).send(errors)
    }
}


const login = async (req, res) => {
   
    
    
    let output = await loginValidator(req.body)
    let errors = output.errors
    let user = output.user

    if (_.isEmpty(errors)) {
        let privateKey = process.env.SECRET_KEY
        let access = jwt.sign({id: user.id, type: 'access'}, privateKey, {expiresIn: 60*15})
        let refresh = jwt.sign({id: user.id, type: 'refresh'}, privateKey, {expiresIn: 60*60*12})
        
       
        res.cookie('refresh', refresh, {httpOnly: true, secure: true, samesite: "none", maxAge: 1000*60*60*12})
        return res.status(200).json({access: access})
    }
    else {
        
        return res.status(400).send(errors)
    }
}



const current = async (req, res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    } else {
        const {firstname, lastname, username, email} = isAuth
        return res.status(200).json({firstname, lastname, username, email})
    }
    
}

const refresh = async (req, res) => {
    let refresh = req.headers.cookie
    if (refresh) {
        try {
        
            refresh = refresh.split('=')[1]
            const privateKey = process.env.SECRET_KEY
            let decoded = jwt.verify(refresh, privateKey)
    
            const access = jwt.sign({id: decoded.id, type: 'access'}, privateKey, {expiresIn: 60*15})
            
            
            return res.status(200).json({'access': access})
        } catch (e) {
            console.log(e)
            return res.status(401).json({details: 'bad token'})
        }
    }
    return res.status(500)
    
}


const logout = async (req, res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    }
    
    return res.clearCookie('refresh').status(200).json({'details': 'successfully logged out'})
}


const activate = async (req, res) => {
    
    let token = req.query.token
    
    
    try {
        let decoded = await jwt.verify(token, process.env.SECRET_KEY)
        
        await prisma.user.update({
            where: {email: decoded.email},
            data: {
                isActive: true,
            }
        })
        
        res.redirect('http://localhost:3000')
            
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            let email = jwt.decode(token).email
            let user = await prisma.user.findUnique({where: {email}})
            if (user) {
                await prisma.user.delete({where: {email}})
            }
            res.redirect(`http://localhost:3000/signup/?error=${e.name}&message=${e.message}`)
        }
        
        res.redirect(`http://localhost:3000/signup/?error=${e.name}&message=${e.message}`)
        
    }
}


module.exports = {signup, activate, login, current, refresh, logout}