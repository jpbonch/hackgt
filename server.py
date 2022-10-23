from flask import Flask, jsonify, request, render_template
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS, cross_origin
import random
import os
import json
import keras
import numpy as np
import pandas as pd

# Load ML model and weights, process data
reconstructed_model = keras.models.load_model("myModel2.1")
movies = pd.read_csv('top500.csv')

item_data = list(set(movies.id))
item_data = [x for x in item_data if x < 1000000]
item_data = np.array(item_data)
num_movies = len(item_data)



app = Flask(__name__, static_folder="front/build/static", template_folder="front/build")
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

dictionary = {}

@app.route('/userRatings', methods = ['POST'])
@cross_origin(origin='*')
def receive_user_ratings():
    print(dictionary)
    code = json.loads(request.get_data().decode('ascii'))["id"]
    key_list = json.loads(request.get_data().decode('ascii'))["array"]
    
    user_ratings = []
    movies_rated = []
    for pair in key_list:
        movies_rated.append(pair['id'])
        user_ratings.append(pair['value'])
    # user_ratings = np.array([2.0, 3.0, 3.0, 3.0, 3.0, 3.0])
    # movies_rated = np.array([98, 673, 557, 8844, 254, 58])

    user_ratings = np.array([user_ratings for x in range(num_movies)])
    movies_rated = np.array([movies_rated for x in range(num_movies)])

    predictions = reconstructed_model.predict([movies_rated, user_ratings, item_data])
    predictions = np.array([a[0] for a in predictions])

    recommended_movie_index_list = (-predictions).argsort()[:101]

    movie_and_prediction_dict = {}
    for i in range(50):
        movie_list = movies.loc[movies['id'] == item_data[recommended_movie_index_list[i]]]
        prediction = predictions[i]
        movie_id = movie_list.iloc[0]['id']
        movie_and_prediction_dict[movie_id] = prediction

    if code in dictionary:
        others_movie_prediction_dict = dictionary[code][1]
        common_movies = [(x, others_movie_prediction_dict[x], movie_and_prediction_dict[x]) for x in movie_and_prediction_dict.keys() if x[0] in others_movie_prediction_dict]
        
        common_movies_list = [movie for movie in common_movies.keys()]
        
        if len(common_movies_list) > 0:
            common_movies_list.sort(reverse=True, key= lambda x: (
                others_movie_prediction_dict[x] + movie_and_prediction_dict[x] -
                abs(others_movie_prediction_dict[x] + movie_and_prediction_dict[x])/3
            ))

        else:
            # nothing in common
            pass

    
    else:
        user_dict = dict()
        user_dict[1] = movie_and_prediction_dict
        dictionary[code] = user_dict

        
        request.get_data().decode('ascii')['array']
    emit('finished-training', 'sampleMessage', to=code, include_self=False)
    print(request.get_data().decode('ascii')['array'])
    return request.get_data().decode('ascii')['array']


@app.route('/finalMovies')
@cross_origin(origin='*')
def get_final_movies():
    code =  request.args.get('code')
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
    app.run(host='0.0.0.0',port=int(os.environ.get('PORT', 3000)))