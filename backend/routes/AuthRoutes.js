import express from 'express'
import { CheckUser, Register, login, logout, refreshToken } from '../controllers/Authcontroller.js'
import { User } from '../middleware/verifyToken.js'

const AuthRoutes = express.Router()

AuthRoutes.post('/register', Register)
AuthRoutes.get('/checkUser', User, CheckUser)
AuthRoutes.post('/login', login)
AuthRoutes.post('/logout', logout)

// New route for refreshing tokens
AuthRoutes.post('/refresh-token', refreshToken)

export default AuthRoutes
