const express = require('express');
const router = express.Router();
const userControler = require('../controller/userController');
const { verifyToken } = require("../utility/verifyToken");
const {body,validationResult } = require("express-validator");
const { verifyUser } = require('../utility/verify_role_user');
router.post('/register',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),body("userName").isLength({min:6,max:30}).withMessage("type valid user name"),userControler.registerFunc);

router.patch('/verifyAccount',body("verifyCode").isString().isLength({min:1,max:5}).withMessage("type valid code"),verifyToken,userControler.confirmAccountFunc);
router.get('/userInfo',verifyToken,verifyUser,userControler.getUserInfo);
router.patch('/resetPassword',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("resetPasswordCode").isString().isLength({min:1,max:5}).withMessage("type valid code"),body("resetPasswordCode").isString().isLength({min:1,max:6}),body('password').isString().isLength({min:8,max:30}).withMessage("type valid password"),userControler.resetPasswordFunc);//email

router.post('/login',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),userControler.loginFunc);
  
router.patch('/sendResetCode',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),userControler.logout);
router.patch('/logout',verifyToken,verifyUser,userControler.logout);
  module.exports = 
    router