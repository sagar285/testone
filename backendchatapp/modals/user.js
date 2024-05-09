const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: 'https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg'
  },
  userName: {
    type: String,
  },
  phone: {
    type: Number,
    required: true
  },
  fullName: {
    type: String,
  },
  imgname:{
    type:String,
  },

  bio: {
    type: String,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },

  fcmToken: {
    type: String,
    default: null
  },
  validOTP: {type: Boolean, default: false},
  deviceType: {type: String, default: null}, 
  token: {type: String, default: null},
  online: {
    type: Boolean,
    default: false,  
  },
  lastSeen: {
    type: Date,
    default: null
  }
})

module.exports = mongoose.model("User", userSchema)



