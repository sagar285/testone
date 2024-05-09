const admin = require("../modals/admin");
const user = require("../modals/user");
const ChatModel =require("../modals/chats")

const loginadmin =async(req,res)=>{
    const {email,password}=req.body;
    if(email!= "adminapp@gmail.com" || password!== "adminpassword123"){
        console.log(req.body);
        return res.status(401).send({message:"admin is not valid"});
    }
    try {
        const data = await admin.findOne({email:email})
        if(data){
            const passwordverify = data.password == password;
            if(passwordverify){
                return res.status(200).send({adminexist:true,data})
            }
            else{
                console.log(passwordverify)
                return res.status(403).send({adminexist:false,message:"un authorised access"})
            }
        }
        else{
           const newadmin = await admin.create({email,password})
           return res.status(200).send({adminregister:newadmin})
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}


const admingetallusers =async(req,res)=>{
    try {
        const data = await user.find({});
        return res.status(200).send({data:data})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}


const oneuserchatforadmin = async (req, res) => {
    const {id}=req.params;
    try {
        const chats = await ChatModel.find({
            users:id
        }).populate({
            path: "users",
            select: "userName email online lastSeen phone profileImage"
        }).sort({ updatedAt: -1 })
        console.log(chats)
        res.send({
            data: chats,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

module.exports = {
    loginadmin,
    admingetallusers,
    oneuserchatforadmin
}