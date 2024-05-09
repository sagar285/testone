const mongoose =require("mongoose")

 
mongoose.connect('mongodb+srv://sagardeveloperfullstack:5PS7mT6tS7EtVogZ@cluster0.nsznfcw.mongodb.net/newchatapp').then(()=>{
    console.log("connetion succefull")
}).catch((e)=>{
    console.log(e)
})