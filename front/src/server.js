const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:3001']
    }
});

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('ready-event', (message, room) => {
        if (room !== '') {
            console.log(message);
            socket.to(room).emit('receive-from-server', {"message": message, "bool": true});
        }
    })
    socket.on('join-room', room => {
        socket.join(room);
        socket.to(room).emit('userHasJoined', {"message": 'user has joined', "bool": true});
    })
})