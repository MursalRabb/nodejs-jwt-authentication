const Validator = require('Validator')
const bcrypt = require('bcrypt')
const {isEmail} = require('../utils')

const {prisma} = require('../prisma/connection')



const signupValidator = async (data) => {

    let {username, email, password, confirm} = data
    let errors = {}

    if (password !== confirm) {
            errors["password"] = ["password mismatched"]
            errors["confirm"] = ["password mismatched"]
        }

    const rules = {
        firstname: ['required', 'max:20'],
        username: ['required', 'regex:/^[a-zA-Z0-9_\.\-]*$/', 'max:20'],
        email: ['required', 'email'],
        password: ['min:8'],
        confirm: 'required'
    }

    const messages = {
        required: ':attr field is required',
        email: 'Invalid email address',
        regex: 'Invalid username',
        max: 'Maximum 20 characters are allowed',
        min: 'Minimum 8 characters are required'
    }

    let v = Validator.make(data, rules, messages)
    v.passes()
    let otherErrors = v.getErrors()
    errors = {...errors, ...otherErrors}

    return errors
}


const loginValidator = async (data) => {

    const {credentials, password} = data
    let errors = {}


    let param
    
    if (isEmail({email: credentials})) {
        param = 'email'
    } else {
        param = 'username'
    }
    

    let user = await prisma.user.findUnique({where: {[param]: credentials}})
    if (!user) {
        errors['credentials'] = 'No active account found on the provided credentials'
    }
    else {
        let isAuth = await bcrypt.compare(password, user.password)
        if (isAuth === false) {
            
            errors['password'] = 'Incorrect password'
        }
    }
        

    const rules = {
        credentials: 'required',
        password: 'required'
    }
    const messages = {
        required: ':attr field is required'
    }

    const v = Validator.make(data, rules, messages)
    v.passes()
    let otherErrors = v.getErrors()
    errors = {...errors, ...otherErrors}
    return {errors, user}
}

module.exports = {signupValidator, loginValidator}