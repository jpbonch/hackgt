from flask import Flask
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('ready-event')
def handle_ready_event(message, room):
    if room != '':
        emit('receive-from-server', {'message': message, 'bool': True}, to=room, include_self=False)

@socketio.on('join-room')
def on_join(room):
    join_room(room)
    emit('userHasJoined', {'message': 'user has joined', 'bool': True}, to=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, port=3000)