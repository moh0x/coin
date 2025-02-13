const { User } = require("../../model/User");
const { Coin } = require("../../model/Coin");
const { Transform } = require("../../model/transformation/Transfomr");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constant/httpStatus');
const sendCoin = async(req,res)=>{
    try {
        const token = req.headers.token;
        const reciverId = req.body.reciverId;
        const count = req.body.count;
        const senderUser = await User.findOne({token:token});
        const reciverUser = await User.findById(reciverId);
        const coin = await Coin.findOne();
        if (senderUser && reciverUser) {
            if (senderUser.coin > count) {
                if ( senderUser.dollars > 0.25) {
                    senderUser.coin = senderUser.coin - count;
                    senderUser.dollars = senderUser.dollars - 0.25;
                await senderUser.save();
                reciverUser.coin = reciverUser.coin + count;
                await reciverUser.save();
                const transform = new Transform({
                    count:count,
                    senderId:senderUser._id,
                    userNameSender:senderUser.userName,
                    reciverId:reciverId,
                    userNameReciver:reciverUser.userName
                });
                await transform.save();
            coin.price =+ 0.0001;
            await coin.save();
                } else {
                    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"you don't have dollars"});
                }
            } else {
                res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"you don't have coins"});
            }
        } else {
            res.status(404).json({"status":httpsStatus.FAIL,"data":null,"message":"user not exist"});
        }  
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
}
const getMyTransformSender = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const transforms = await Transform.find({senderId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":transforms}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  const getMyTransformReciver = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const transforms = await Transform.find({reciverId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":transforms}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  const getMyTransformAll = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const transforms = await Transform.find({$or:[{reciverId:user._id},{senderId:user._id}]}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":transforms}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  // valid and valid message hona w 7ata users and routes  