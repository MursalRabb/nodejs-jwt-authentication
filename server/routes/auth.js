const express = require('express')
const {signup, login, current, refresh, logout} = require('../handlers/auth')
const router = express.Router()



router.post('/signup', signup)
router.post('/login', login)
router.get('/current', current)
router.get('/refresh', refresh)
router.get('/logout', logout)

module.exports  = router