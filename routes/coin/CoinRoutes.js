const express = require('express');
const router = express.Router();
const coinController = require('../../controller/coin/coinController');
const { verifyToken } = require("../../utility/verifyToken");
const {body,validationResult } = require("express-validator");
const { verifyUser } = require('../../utility/verify_role_user');
router.patch('/addUserCode',body("codeUser").isLength({min:1,max:6}).withMessage("type valid code"),verifyToken,verifyUser,coinController.addUserCode);
router.patch('/addAgentCode',body("codeAgent").isLength({min:1,max:6}).withMessage("type valid code"),verifyToken,verifyUser,coinController.addAgentCode);
router.get('/coinInfo',verifyToken,verifyUser,coinController.getCoin);

  module.exports = 
    router
