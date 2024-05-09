const ChatModel =require("../modals/chats");
const crypto =require("crypto")

const { uploadFile } = require('../middleware/S3');
const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");


const createPrivateChat = async (req, res) => {
    const { userId } = req.body
    let userIds = [req.user._id, userId]
    try {
        const chat = await ChatModel.findOne({
            users: { $all: userIds },
            type: "private"
        })
        if (chat) {
            res.send({
                data: chat,
                status: true,
            })
            return;
        }
        const newChat = await ChatModel.create({
            users: userIds
        })
        res.send({
            data: newChat,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}
const createGroupChat = async (req, res) => {
    let image;
    const { userIds, chatName } = req.body
    console.log(req.body,req.files);
    let allUsers = userIds
    allUsers.push(req.user._id)
    const imageFile = req.files['image']?.[0];
    const imgname = imageFile ? generateFileName() :null
    if(imageFile && imageFile?.buffer && imageFile?.mimetype){
        await uploadFile(imageFile?.buffer, imgname, imageFile.mimetype);
    }  

    image = imgname ?  "https://d1ccjanqkg9zka.cloudfront.net/" +imgname  : null
    try {
        // const chat = await ChatModel.findOne({
        //     users: { $all: allUsers },
        //     type: "group"
        // })
        // if (chat) {
        //     res.send({
        //         data: chat,
        //         status: true,
        //     })
        //     return;
        // }
        const newChat = await ChatModel.create({
            users: userIds,
            chatName: chatName,
            type: "group",
            groupAdmin: req.user._id,
            groupimage:image
        })
        res.send({
            data: newChat,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}
 
const myChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({
            users: req.user._id
        }).populate({
            path: "users",
            select: "userName email online lastSeen phone profileImage"
        }).sort({ updatedAt: -1 })
        res.send({
            data: chats,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

const chatById = async (req, res) => {
    const {chatId} = req.body;

    try {
        const chats = await ChatModel.findById(chatId).populate({
            path: "users",
            select: "userName email online lastSeen phone"
        })
        res.send({
            data: chats,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

module.exports = {
    createPrivateChat,
    createGroupChat,
    myChats,
    chatById
}