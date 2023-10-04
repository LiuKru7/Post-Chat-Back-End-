const { Server } = require('socket.io');
const jwt = require("jsonwebtoken");
const userDb = require("../schemas/userSchema");
const postsDb = require("../schemas/postSchema");

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
        },
    });





    io.on('connection', (socket)=> {
        socket.on("newPost", info => {
            console.log(info);


            if (!info.image.startsWith('http://') && !info.image.startsWith('https://')) {
                return
            }
            console.log("LABAS")


            const user = new postsDb({
                username: info.username,
                userId: info.userId,
                title: info.title,
                image: info.image
            });
            console.log(user)

            user.save().then(async () => {
                const allPost = await postsDb.find();
                socket.emit('addAllPost', allPost)

            }).catch(error => {
                console.error("Error saving post:", error);
            });
        });
    });


}


