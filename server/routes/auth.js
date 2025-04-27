const express=require('express')
const {register,login}=require('../controllers/authController')
const {validatePassword}=require('../middlewares/validation')

const router=express.Router()

//router.post('/register',validatePassword,register)
router.post('/register', validatePassword, register);
  

router.post('/login',login)



module.exports=router