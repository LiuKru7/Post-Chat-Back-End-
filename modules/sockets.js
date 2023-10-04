const { Server } = require('socket.io');
const jwt = require("jsonwebtoken");
const playerDb = require("../schemas/userSchema");

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });

}


