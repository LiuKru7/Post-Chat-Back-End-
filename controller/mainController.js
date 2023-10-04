const userDb = require("../schemas/userSchema"); // Import the model
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

module.exports= {
    register: async (req,res) => {
        const info = req.body


        const singleUser = await userDb.findOne({username: info.username})
        if (singleUser) return res.send ({error: true, data:[], message:"username exist" })
            const user = new userDb  ({
            username: info.username,
            password: info.password,
        })
        console.log(user)
        const hash = await bCrypt.hash(user.password, 10);
        user.password = hash

        user.save().then(() => {
            res.send({ error: false, data: [], message: "REGISTER" });
        }).catch(e => {
            res.send({ error: true, data: [], message: "FAULT" });
        });
    },
    login : async  (req,res) => {
        const info = req.body
        const singleUser = await userDb.findOne({ username: info.username});
        if (!singleUser) return res.send ({error: true, data:[], message:"Login Fault" })
        const samePass= await bCrypt.compare (info.password, singleUser.password)
        if (samePass) {
            const newUser = {
                username: singleUser.username,
                _id: singleUser._id
            }
            const token = jwt.sign(newUser, process.env.JWT_SECRET)
            res.send({error: false, data:[token, singleUser.username], message: "login successful"})
        } else {
            res.send({ error: true, data: [], message: "Login failed. Bad username or password." });
        }
    },
    profileInfo : async (req,res) => {
        const singleUser = await userDb.findOne({_id: req.user._id}, {password: 0})
        if (!singleUser) return  res.send ({error: true, data: [], message: "error"})
        res.send ({error: false, data: singleUser, message:""})
    },
    changeImage : async  (req,res) => {

        const singleUser = await userDb.findOneAndUpdate(
            {_id: req.user._id},
            {$set:{image:req.body.img}},
            {new: true},
            {password:0})
        if (!singleUser) return res.send ({error: true, data: [], message: "error"})
        res.send ({error: false, data: singleUser, message: ""})
    },
    changePassword: async (req, res) => {
        const info = req.body;
        const singleUser = await userDb.findOne({ _id: req.user._id });
        if (!singleUser) {
            return res.send({ error: true, data: [], message: "User not found" });
        }
        const match = await bCrypt.compare(info.oldPassword, singleUser.password);
        if (!match) {
            return res.send({ error: true, data: [], message: "Old password does not match" });
        }
        const newHashedPassword = await bCrypt.hash(info.password, 10);
        singleUser.password = newHashedPassword;
        await singleUser.save();
        res.send({ error: false, data: [], message: "Password changed successfully" });
    }
}