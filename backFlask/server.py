from flask import Flask, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS, cross_origin
import random

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

@app.route('/movies')
@cross_origin(origin='*')
def return_movies():
    return jsonify([{
        'image': 'link',
        'synopsis': 'Sample',
        'title': 'My movie'
    }])

@app.route('/getCode')
@cross_origin(origin='*')
def return_code():
    print('call has been made')
    return str(random.randint(10000, 99999))

if __name__ == '__main__':
    socketio.run(app, port=3000)