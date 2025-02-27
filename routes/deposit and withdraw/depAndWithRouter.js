const express = require('express');
const router = express.Router();
const depAndWithController = require('../../controller/deposit and withdraw/depositController');
const { verifyToken } = require("../../utility/verifyToken");
const {body,validationResult } = require("express-validator");
const { verifyUser } = require('../../utility/verify_role_user');
router.post('/addDeposit',body("txId").isNumeric().isLength({min:1,max:88}).withMessage("type valid txId"),verifyToken,verifyUser,depAndWithController.deposit);
router.post('/addWithDraw',body("price").isNumeric().isLength({min:1,max:5}).withMessage("type valid price"),verifyToken,verifyUser,depAndWithController.withdraw);
router.get('/getMyWithDraws',verifyToken,verifyUser,depAndWithController.getWithdraws);
router.get('/getMyDeposits',verifyToken,verifyUser,depAndWithController.getDeposits);

  module.exports = 
    router
  