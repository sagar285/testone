const MessageModel = require('../modals/messages');
const ChatModel = require('../modals/chats');
const { uploadFile } = require('../middleware/S3');
const crypto =require("crypto")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const getPresignedUrl = async (file,name) => {

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${name}.${fileExtension}`;
    console.log(fileName)
    const params = {
      Bucket: process.env.bucketName,
      Key: fileName, 
      ContentType: file.mimetype,
    };
  
    try {
      const command = new PutObjectCommand(params);
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      
      return signedUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  };

const sendMessage = async (req, res) => {
  
    const { chatId, text,receiverId, type,time,image } = req.body
    // console.log(req.body);
    try {
        const newMessage = await MessageModel.create({
            text,
            chatId,
            time,
            image:image,
            type:type,
            user: req.user._id
        })
        const chatUpdate = await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: text
        }, {
            new: true
        }).populate({
            path:"users",
            select:"userName"
        })
        res.send({
            data: newMessage,
            roomData: chatUpdate,
            status: true,

        })
    } catch (error) {
        console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",error)
        res.status(403).json({ status: false, error: error })
    }
}
const sendmessagewithimage = async (req, res) => {
    let image;
    const { chatId, text,receiverId, type,time } = req.body
    console.log("dataaa",req.body)
    const imageFile = req.files['image']?.[0];
    // const Types = imageFile?.mimetype ? imageFile?.mimetype :null
    const imgname = imageFile ? generateFileName() :null
    if(imageFile && imageFile?.buffer && imageFile?.mimetype){
        await uploadFile(imageFile?.buffer, imgname, imageFile.mimetype);
    }   
     
    //    image = imgname ?  "https://d3bjtrjgvxo65.cloudfront.net/" +imgname  : null
       image = imgname ?  "https://d1ccjanqkg9zka.cloudfront.net/" +imgname  : null
    try {
        const newMessage = await MessageModel.create({
            text,
            chatId,
            time,
            image:image,
            type:type,
            user: req.user._id
        })
        const chatUpdate = await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage:"image"
        }, {
            new: true   
        }).populate({
            path:"users",
            select:"userName"
        })
        res.send({
            data: newMessage,
            roomData: chatUpdate,
            status: true,

        })
    } catch (error) {
        console.log(error)
        res.status(403).json({ status: false, error: error })
    }
}

const s3Client = new S3Client({
    region:process.env.region,
    credentials: {
      accessKeyId:process.env.accessKeyId,
      secretAccessKey:process.env.secretAccessKey
    } 
  })




const sendaudioMessage = async (req, res) => {
    let audio;
    const { chatId, receiverId, type,time } = req.body
    const audioFile = req.files['audio']?.[0];
    // const Types = imageFile?.mimetype ? imageFile?.mimetype :null


    const audioname = audioFile && generateFileName() 
    await uploadFile(audioFile?.buffer, audioname, audioFile.mimetype);
    // const AudioUploadUrl = audioFile ? await getPresignedUrl(audioFile,audioname) : null;
    
    //    image = imgname ?  "https://d3bjtrjgvxo65.cloudfront.net/" +imgname  : null
       audio = audioname ?  "https://d1ccjanqkg9zka.cloudfront.net/" +audioname  : null
    try {  
        const newMessage = await MessageModel.create({
            chatId,
            time,  
            audio:audio,
            type:type,
            user: req.user._id
        })
        const chatUpdate = await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage:"audio"
        }, {
            new: true   
        }).populate({
            path:"users",
            select:"userName"
        })
        res.send({
            data: newMessage,
            roomData: chatUpdate,
            status: true,
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({ status: false, error: error })
    }
}


const myMessages = async (req, res) => {
    const chatId = req.body.chatId
    const page = parseInt(req.query.pag3) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit 
    try {
        const messages = await MessageModel.find({
            chatId: chatId
        }).populate({
            path: "user",
            select:"userName"
        }).sort({createdAt: 1})
        res.send({
            data: messages,
            status: true,
        })
    } catch (error) {
        console.log("errrrorrrrrr",error)
        res.status(403).json({ status: false, error: error })
    }
}


module.exports = {
    sendMessage,
    myMessages,
    sendaudioMessage,
    sendmessagewithimage,
    s3Client,
}