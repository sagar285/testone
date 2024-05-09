const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        default:"adminapp@gmail.com",
    },
    password:{
        type:String,
        default:"adminpassword123"
    }
})


module.exports = mongoose.model("Admin", adminSchema)