
const { sendMessage, myMessages, sendaudioMessage, sendmessagewithimage } = require("../controllers/messages");
const verifyToken = require("../middleware/auth");
const router = require("express").Router()
const multer =require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post("/sendmessage",verifyToken,sendMessage);
router.post("/sendmessagewithimage",verifyToken,upload.fields([{ name: 'image', maxCount: 1 }]),sendmessagewithimage);
router.post("/sendaudiomessage",verifyToken,upload.fields([{ name: 'audio', maxCount: 1 }]),sendaudioMessage);
router.post("/mymessages",verifyToken,myMessages);

module.exports =router 