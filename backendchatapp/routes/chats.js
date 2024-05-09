const { createPrivateChat, myChats, createGroupChat, chatById } = require("../controllers/chats");
const verifyToken = require("../middleware/auth");

const router = require("express").Router()
const multer =require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post("/createChat",verifyToken,createPrivateChat);
router.get("/mychats",verifyToken,myChats);
router.post("/groupChat",verifyToken,upload.fields([{ name: 'image', maxCount: 1 }]),createGroupChat);
router.post("/Chatbyid",verifyToken,chatById);

module.exports =router