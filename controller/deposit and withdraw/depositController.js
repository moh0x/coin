const { validationResult } = require("express-validator");
const { User } = require("../../model/User");
const httpsStatus = require('../../constant/httpStatus');
const { Deposit } = require("../../model/deposit and withdraw/Deposit");
const { Withdraw } = require("../../model/deposit and withdraw/Withdraw");
const deposit = async(req,res)=>{
    try {
        const token = req.headers.token;
        const user = await User.findOne({token:token});
        const valid = validationResult(req)
        if (valid.isEmpty()) {
            const newDeposit = await new Deposit({
                txId:req.body.txId,
                state:"new",
                userNameSender:user.userName,
                senderId:user._id,
                price:0
            });
            await newDeposit.save();
            res.status(200).json({"status":httpsStatus.SUCCESS,"data":newDeposit})
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg})
        }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"})
    }
}
const withdraw = async(req,res)=>{
    try {
        const token = req.headers.token;
        const user = await User.findOne({token:token});
        const valid = validationResult(req)
        if (valid.isEmpty()) {
            const price =+req.body.price;
          if (price >=10 && price <=10000) {
            const newWithdraw = await new Withdraw({
                state:"new",
                userNameSender:user.userName,
                senderId:user._id,
                price:price
            });
            await newWithdraw.save();
            res.status(200).json({"status":httpsStatus.SUCCESS,"data":newWithdraw})
          } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"min 10 max 10000"})
          }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg})
        }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"})
    }
}
const getDeposits = async (req,res) => {
    const limit = 15;
    const page = req.headers.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const deposits = await Deposit.find({senderId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":deposits}); 
     } catch (error){
        console.log(error);
        
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
}
const getWithdraws= async (req,res) => {
    const limit = 15;
    const page = req.headers.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const withdraws = await Withdraw.find({senderId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":withdraws}); 
     } catch (error){
        console.log(error);
        
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
}
module.exports = {deposit,withdraw,getDeposits,getWithdraws}