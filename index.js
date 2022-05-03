const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const QRCode = require('qrcode')

const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const multer = require("multer");
const dotenv = require('dotenv').config()
const jsonparser = bodyParser.json();
const app = express();
app.use(jsonparser);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const database = require("./mongoDB-connection");
const User = require("./UserSchema");
//connection to mongoDB
database();

const generateQR = async text => {
  try {
    const encoded_data = await QRCode.toDataURL(text);
    // console.log(encoded_data);
    return encoded_data;
  } catch (err) {
    console.error(err)
  }
}

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/sign-in", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  await user.save();
});

app.get("/Auth", (req, res) => {
  console.log("called");
  const { username, password } = req.query;

  User.findOne({ username: username, password: password }, (err, result) => {
    // console.log(result);
    if (err || result === null) {
      const state = { state: false };
      console.log(err);
      res.send(state);
    } else if (result != null) {
      var obj = { status: true, token: result._id };
      result = { ...result, ...obj };
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/update-profile", async (req,res)=>{
  // console.log(req.body.userId, req.file.path);
  try{
    let result = await User.findOneAndUpdate({_id:req.body.userId},{profile_img: req.body.profileUrl});
    console.log(result);
    res.send(result);
  }catch(e){
    console.log(e);
    res.sendStatus(400);
  }
});

app.get("/studentData", async (req, res) => {
  try{
    const result = await User.find({ status: 1 }).exec();
    console.log(result);
    res.send(result);
  }catch(e){
    console.log(e)
  }
});

app.get("/student-status-list", async (req, res) => {
  try{
    const result = await User.find({$or:[{status:2},{status:3}]}).exec();
    console.log(" status"  + result);
    res.send(result);
  }catch(e){
    console.log(e)
  }
});

app.post("/apply-buss-pass",  async (req, res) => {
  // console.log(req.body.userId, req.file.path);
  let result ;
  try{
    result = await User.findOneAndUpdate({_id:req.body.userId},{receipt_img: req.body.receiptUrl , status:1},{
      new: true,
    });
    console.log(result);
  }catch(e){
    console.log(e);
  }
  res.send(result);
});

app.post("/buss-pass-status",async(req,res)=>{

  const result = await User.findOneAndUpdate({_id:req.body.userId},{status: req.body.status, decline_reason:req.body.reason});
  // console.log(result);
  const {first_name ,last_name,status,branch,username,email,pickup_point,semester} = result;
  if(req.body.status === 2){
    generateQR(`${first_name} ${last_name}  is  ${status === 2 ? "Approved" : "Not Approved"} for Bus Pass of Course- ${branch},semester- ${semester}th Enrollment No.- ${username}, email- ${email}, pickup point- ${pickup_point}`).then(async(ress)=>{
      // console.log("Result" + ress)
     const ans =  await User.findOneAndUpdate({_id:req.body.userId},{qr_code: ress});
    //  console.log(ans);
    })

  }
  // console.log(result);
  res.send(result);
})

app.post("/get-buss-pass",async (req,res)=>{
  try{
    const result = await User.findOne({$and:[{_id:req.body.userId},{status:2}]}).exec();
    if(result != null ){
      console.log(result + "ASdsd")
      res.send(result);
    }else{
      res.send(false);
    }
  }catch(e){
    console.log(e)
  }



})

app.listen(8080, (req, res) => {
  console.log("server started on port " + 8080);
});
