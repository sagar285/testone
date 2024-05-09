const { userlogin, usergetallphonenumbers, updateusername, getuserbyid,updateuserprofile } = require("../controllers/user");
const verifyToken = require("../middleware/auth");

const multer =require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const router = require("express").Router()



router.post("/userlogin",userlogin);
router.post("/getuserbyid",verifyToken,getuserbyid);
router.post("/usergetallphonenumbers",verifyToken,usergetallphonenumbers);
router.put("/username",verifyToken,updateusername)
router.put("/updateuserprofile",verifyToken,upload.fields([{ name: 'image', maxCount: 1 }]),updateuserprofile)

module.exports =router