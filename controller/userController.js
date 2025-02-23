const { User } = require("../model/User");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../constant/httpStatus');
const { Coin } = require("../model/Coin");
const { Agent } = require("../model/agent/Agent");
const { PriceCoin } = require("../model/price/PriceCoin");

const getUserInfo = async(req,res)=>{
  try {
   const token = req.headers.token;
   const user = await User.findOne({token:token},{__v:false,password:false});  
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":user});
   
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
  }
}
const registerFunc = async(req,res)=>{
    try {
     const email = await User.findOne({email : req.body.email});
     const valid = validationResult (req);
    if (valid.isEmpty()) {
     if (!email) {
         const token = jwt.sign({ email: req.body.email,password:req.body.password }, "token");
         const verifyCode = gen(5,"0123456789");

         const code = gen(6,"0123456789abcdefghijklmnpkrestuvwxyz");  
  
         while (await User.findOne({code:code} || await Agent.findOne({code:code}))) {
          code = gen(6,"0123456789abcdefghijklmnpkrestuvwxyz");  
         }
         var password =await  bcrypt.hash(req.body.password,10)
         const user =  new User({
             userName:req.body.userName,
             token:token,
             email:req.body.email,
             password:password,
             verifyCode:verifyCode,     
             code:code ,
             coin:0
     });
         await user.save();
         const newUser = await User.findOne({email : req.body.email},{__v:false,password:false}); 
         res.status(200).json({"status":httpsStatus.SUCCESS,"data":newUser});
        } else {
         res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"user already exist"});
        }
    }
    else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
    }
    } catch (error) {
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     
    }
 }
 const loginFunc = async(req,res)=>{
  try {
     const user = await User.findOne({email : req.body.email},{__v:false});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,user.password);
if (valid.isEmpty()) {
 if (user) {
     if (passwordMatch == true) {
         if (user.isVerified) {
             const userRet = await User.findOne({email : req.body.email},{__v:false,password:false});
             res.status(200).json({"status":httpsStatus.SUCCESS,"data":userRet});
         } else {
             const userRet = await User.findOne({email : req.body.email},{__v:false,password:false});
             const verifyCode = gen(5,"0123456789");
            await User.findByIdAndUpdate(userRet._id,{
                 $set:{
                     verifyCode:verifyCode
                 }
             })
             await userRet.save()
             const userRetWithNewInfos = await User.findOne({email : req.body.email},{__v:false,password:false});
               res.status(200).json({"status":httpsStatus.SUCCESS,"data":userRetWithNewInfos});
         }
     } else {
         res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"password not match"});
     }
    } else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no user with this email"});
    }
} else {
 res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
  } catch (error) {
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }

}
const sendResetCodeFunc = async(req,res)=>{
  try {
    const valid = validationResult(req);
  if (valid.isEmpty()) {
    const user = await User.findOne({email:req.body.email},{__v:false,password:false,token:false});
    if (user) {
                const resetPasswordCode = gen(5,"0123456789");
            await    User.findByIdAndUpdate(user._id,{
                    $set:{
                        resetPasswordCode:resetPasswordCode
                    }
                });  
                await user.save();
                const userWithNewInfos =   await User.findOne({email:req.body.email},{__v:false,password:false});
                  res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"we don't have user with this email"});
    }
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
  }
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const resetPasswordFunc = async(req,res)=>{
  try {     
      const email = req.body.email;
      const user = await User.findOne({email:email},{__v:false,password:false,token:false});
      const resetPasswordCode = req.body.resetPasswordCode;
      const password =await bcrypt.hash(req.body.password,10);
      const valid = validationResult (req);
if (valid.isEmpty()) {
  if (user) {
    if (resetPasswordCode == user.resetPasswordCode && user.resetPasswordCode != 0 ) {
      await User.findByIdAndUpdate(user._id,{
          $set:{
              isVerified:true,
              verifyCode:0,
              resetPasswordCode:0,
              password:password
          }
      });
      await user.save();
      const userWithNewInfos = await  User.findOne({email:email},{__v:false,password:false});
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
    }
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
    }
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 
  } catch (error) {
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
const confirmAccountFunc = async(req,res)=>{
  try {    
    const valid = validationResult (req); 
     if (valid.isEmpty()) {
      const token = req.headers.token;
      const user = await User.findOne({token:token},{__v:false,password:false,token:false});
      const verifyCode = req.body.verifyCode;
if (user) {
if (user.isVerified == false && verifyCode == user.verifyCode && user.verifyCode != 0 ) {
  await User.findByIdAndUpdate(user._id,{
      $set:{
          isVerified:true,
          verifyCode:0,
          resetPasswordCode:0,
      }
  });
  const coin = await Coin.findOne({name:"Moh"});
  
 let newPrice =  coin.price + 0.000001;
  await Coin.findByIdAndUpdate(coin._id,{
    $set:{
      price:newPrice
    }
  })
  await coin.save();
  let newPriceCoin = await new PriceCoin({
    name:coin.name,
    price:coin.price,
  });
  await newPriceCoin.save();
  await user.save();
  const userWithNewInfos = await User.findOne({token:token},{__v:false,password:false});
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});;
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
}
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
}

     } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
     }
  } catch (error) {
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
const logout = async(req,res)=>{
 try {
  const token = req.headers.token;
  const user = await User.findOne({token:token});
  await User.findByIdAndUpdate(user._id,{
    $set:{
      token:null
    }
  })
  await user.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,data:null})
 } catch (error) {
  res.status(400).json({"status":httpsStatus.ERROR,data:null,"message":"error"})
 }
}
module.exports = {registerFunc,getUserInfo,loginFunc,sendResetCodeFunc,resetPasswordFunc,confirmAccountFunc,logout}