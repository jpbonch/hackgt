from flask import Flask, jsonify, request, render_template
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS, cross_origin
import random
import os

app = Flask(__name__, static_folder="build/static", template_folder="build")
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

@socketio.on('userFinished')
def userFinished(message, room):
    print('function called')
    emit('otherUserFinished', {'message': message}, to=room, include_self=False)
    
@app.route('/')
@cross_origin(origin='*')
def index():
    return render_template('index.html')

@app.route('/movies')
@cross_origin(origin='*')
def return_movies():
    return jsonify({
            'id': 1,
            'title': "The Grumpy Collection",
            'ageRating': "PG-13",
            'duration': "1h 56m",
            'genres': "Comedy, Family",
            'cast': "Evan Peters, Chris Hemsworth",
            'year': "1993",
            'synopsis':
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            'id': 2,
            'title': "VKMFLVKSMVMLKMV",
            'ageRating': "PG-13",
            'duration': "1h 56m",
            'genres': "Comedy, Family",
            'cast': "Evan Peters, Chris Hemsworth",
            'year': "1993",
            'synopsis':
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        }
    )

@app.route('/getCode')
@cross_origin(origin='*')
def return_code():
    print('call has been made')
    return str(random.randint(10000, 99999))

@app.route('/userRatings', methods = ['POST'])
@cross_origin(origin='*')
def receive_user_ratings():
    print(request.get_data().decode('ascii'))
    return request.get_data().decode('ascii')

@app.route('/finalMovies')
@cross_origin(origin='*')
def get_final_movies():
    return jsonify({
            'id': 1,
            'title': "The Grumpy Collection",
            'ageRating': "PG-13",
            'duration': "1h 56m",
            'genres': "Comedy, Family",
            'cast': "Evan Peters, Chris Hemsworth",
            'year': "1993",
            'synopsis':
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            'id': 2,
            'title': "VKMFLVKSMVMLKMV",
            'ageRating': "PG-13",
            'duration': "1h 56m",
            'genres': "Comedy, Family",
            'cast': "Evan Peters, Chris Hemsworth",
            'year': "1993",
            'synopsis':
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        }
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=int(os.environ.get('PORT', 5000)))