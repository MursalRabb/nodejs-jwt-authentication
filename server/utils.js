const nodemailer = require('nodemailer')
const Validator = require('Validator')
const jwt = require('jsonwebtoken')

const {prisma} = require('./prisma/connection')

async function main (data) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        connectionTimeout: 1000,
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.PASSWORD, 
        },
      });

      let link = 'http://' + data.domain + '/activate/?token=' + data.activationToken

      
      try {
          let info = await transporter.sendMail({
            from: 'Twatter Info Centre',
            to: data.email,
            subject: 'Activate Your Twatter Account',
            

            html: `
                    <h4>Hi ${data.firstname}!</h4>
                    <br/>
                    <br/>
                    Please click <a href='${link}'>here</a> to activate your account
                    
                    <br/>
                    <br/>
                    Thanks,
                    <br/>
                    Twatter

            `
          })
        return info
      } catch (e) {
        return 'error'
      }

}




function isEmail (data) {
  const rules = {
    email: 'email'
  }

  const messages = {
    email: 'should be an email'
  }

  let v = Validator.make(data, rules, messages)
  v.passes()
  let errors = v.getErrors()
  if (errors.email) {
    return false
  }
  return true

} 


async function isAuthorized (token) {
  let access = token.split(' ')
  access = access[1]
  
  let user
  try {
    let privateKey = process.env.SECRET_KEY
    let decoded = jwt.verify(access, privateKey)
    
    user = await prisma.user.findUnique({where: {id: decoded.id}})
    
  } catch (e) {
    return 401
  }
  if (!user) {
    return 401
  }
  
  return user
}

module.exports = {main, isEmail, isAuthorized}