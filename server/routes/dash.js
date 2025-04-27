const express=require('express');
const router=express.Router();
const {validateToken}=require('../middlewares/validateToken');

router.get('/dashboard', validateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard!' });
  });

module.exports=router