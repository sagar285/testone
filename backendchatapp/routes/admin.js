const { loginadmin, admingetallusers, oneuserchatforadmin } = require("../controllers/admin");

const router = require("express").Router()


router.post("/adminlogin",loginadmin);
router.get("/admingetallusers",admingetallusers);
router.get("/admingetsinglusers/:id",oneuserchatforadmin);


module.exports =router