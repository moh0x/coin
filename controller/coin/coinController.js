const { User } = require("../../model/User");
const { Coin } = require("../../model/Coin");
const { Transform } = require("../../model/transformation/Transfomr");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constant/httpStatus');
const { Agent } = require("../../model/agent/Agent");
const addUserCode =async(req,res)=>{
    try {
        const token = req.headers.token;
        const valid = validationResult(req);
        if (valid.isEmpty()) {
            const codeUser = req.body.codeUser;
            const userCode = await User.findOne({code:codeUser});
            const userCodeDolladrs = userCode.dollars;
            const user = await User.findOne({token:token});
            const cois = await Coin.findOne({name:"Moh"});
         if (user.codeUser == null) {
            
            const userNewDollars= user.dollars + 1;
            await User.findByIdAndUpdate(user._id,{
                $set:{
                    codeUser:codeUser,
                    dollars:userNewDollars
                }
            })
            if (userCode.affilate < 3) {
                let newAffilate = userCode.affilate + 1;
                if (newAffilate == 3) {
                   let userCodeDollars = userCodeDolladrs + 1;
                   await User.findByIdAndUpdate(userCode._id,{
                       $set:{
                           affilate:newAffilate,
                           dollars:userCodeDollars
                       }
                       
                   })
                   await user.save();
                   await userCode.save();
                   res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
                }else{
                   await User.findByIdAndUpdate(userCode._id,{
                       $set:{
                           affilate:newAffilate,
                       }
                       
                   })
                }
                res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
               } else {
                   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"max is 3"});
               }
         } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"just 1 time"});
         }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"check your input"});
        }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"message":error});
    }
}
const addAgentCode =async(req,res)=>{
    try {
        const token = req.headers.token;
        const valid = validationResult(req);
        if (valid.isEmpty()) {
            const codeAgent = req.body.codeAgent;
            const agent = await Agent.findOne({code:codeAgent});
            const user = await User.findOne({token:token});
            const cois = await Coin.findOne({name:"Moh"});
         if (user.codeAgent == null) {      
            const userNewDollars= user.dollars + 1;
            await User.findByIdAndUpdate(user._id,{
                $set:{
                    codeAgent:codeAgent,
                    dollars:userNewDollars
                }
            })
                let newAffilate = agent.affilate + 1;
                   await Agent.findByIdAndUpdate(agent._id,{
                       $set:{
                           affilate:newAffilate,
                       }
                       
                   })
                   await user.save();
                   await agent.save();
                   res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
                res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
         } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"just 1 time"});
         }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"check your input"});
        }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"message":error});
    }
}
module.exports ={addUserCode,addAgentCode}