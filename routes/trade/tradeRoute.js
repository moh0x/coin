const express = require('express');
const router = express.Router();
const tradeController = require('../../controller/trade/tradeController');
const { verifyToken } = require("../../utility/verifyToken");
const {body,validationResult } = require("express-validator");
const { verifyUser } = require('../../utility/verify_role_user');
router.post('/create',body("count").isNumeric().isLength({min:6,max:50}).withMessage("type valid count coin"),body("price").isNumeric().isLength({min:8,max:30}).withMessage("type valid price"),body("priceCoin").isLength({min:6,max:30}).withMessage("type valid price coin"),verifyToken,verifyUser,tradeController.createTradeSell);

router.patch('/buyCoin',body("tradeId").isMongoId().withMessage("type valid trade id"),verifyToken,tradeController.buyCoin);
router.get('/getMyTradesSell',verifyToken,verifyUser,tradeController.getMyTradesSell);
router.get('/getAllTradesSell',verifyToken,verifyUser,tradeController.getAllTradesSell);
router.get('/getMyTradesBuy',verifyToken,verifyUser,tradeController.getMyTradesBuy);
router.get('/getMyTradesSellOpen',verifyToken,verifyUser,tradeController.getMyTradesSellOpen);

  module.exports = 
    router
