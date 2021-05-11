var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: true,
        methods: ['GET', 'PATCH', 'POST', 'PUT']
    }
});
var users = [];

http.listen(3000, function () {
    console.log('Listenig to port 3000');
});

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
