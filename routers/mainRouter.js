const express = require("express")
const router = express.Router()

const {
    register, login,profileInfo,changeImage,changePassword
} = require("../controller/mainController")

const validators = require ('../middleWare/validation')

router.post ("/register",validators.validation, register)
router.post ("/login",validators.validation, login)
router.get ("/profile", validators.authorization, profileInfo)
router.post ("/changeImage", validators.authorization, changeImage)
router.post ("/changePassword", validators.authorization, changePassword)

module.exports=router