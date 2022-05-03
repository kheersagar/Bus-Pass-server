const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  branch: {
    type: String,
  },
  semester: {
    type: Number,
  },
  phone_no: {
    type: Number,
  },
  address: {
    type: String,
  },
  bus_no: {
    type: Number,
  },
  pickup_point: {
    type: String,
  },
  status: {
    type: Number,
  },
  decline_reason:{
    type:String
  },
  profile_img:{
    type:String
  },
  receipt_img: {
    type: String,
  },
  qr_code:{
    type:String
  }

});

const user = mongoose.model("user", userSchema);

module.exports = user;
