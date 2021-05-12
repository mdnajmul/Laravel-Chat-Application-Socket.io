var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: true,
        methods: ['GET', 'PATCH', 'POST', 'PUT']
    }
});
var Redis = require('ioredis');
var redis = new Redis();
var users = [];

http.listen(3000, function () {
    console.log('Listenig to port 3000');
});

redis.subscribe('private-channel', function (){
    console.log('Subscribed to private channel');
});

redis.on('message', function (channel, message){
    console.log(channel);
    console.log(message);
})

io.on('connection', function (socket){
    socket.on("user_connected", function (user_id){
        users[user_id] = socket.id;
        io.emit('updateUserStatus', users);
        console.log("user connected " + user_id);
    });

    socket.on("disconnect", function (){
        var i = users.indexOf(socket.io);
        users.splice(i, 1, 0);
        io.emit('updateUserStatus', users);
        console.log(users);
    });
});

// io.on('connection', function (socket) {
//     socket.on("user_connected", function (user_id) {
//         users[user_id] = socket.id;
//         io.emit('updateUserStatus', users);
//         console.log("user connected "+ user_id);
//     });
// });
