from codecs import getdecoder
from flask import Flask, jsonify, request, render_template
from matplotlib.pyplot import title
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS, cross_origin
import random
import os
import json
import tensorflow
import numpy as np
import pandas as pd

# Load ML model and weights, process data
reconstructed_model = tensorflow.keras.models.load_model("myModel2")
movies = pd.read_csv('movies500.csv')

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

# @socketio.on('finish')
# def finish_training(room):
#     emit('finished-training', 'sampleMessage', to=room, include_self=False)
    
@app.route('/')
@cross_origin(origin='*')
def index():
    return render_template('index.html')

@app.route('/movies')
@cross_origin(origin='*')
def return_movies():
    return_object = []

    for i in range(6):
        r = random.randint(0,500)
        movie = movies.iloc[r]
        movie_title = movie['title']
        genres = movie['genres']
        id = movie['id']
        movie_genres = ", ".join([x.name for x in genres])
        movie_poster_path = movie['poster_path']
        movie_vote_average = movie['vote_average']
        movie_description = movie['overview']
        
        return_object.append({
            'id': id,
            'title': movie_title,
            'genres': movie_genres,
            'synopsis': movie_description,
            'ageRating': movie_vote_average,
            'poster_path': movie_poster_path,

        })

    return jsonify(return_object)


    
    # return jsonify({
    #         'id': 1,
    #         'title': "The Grumpy Collection",
    #         'ageRating': "PG-13",
    #         'duration': "1h 56m",
    #         'genres': "Comedy, Family",
    #         'cast': "Evan Peters, Chris Hemsworth",
    #         'year': "1993",
    #         'synopsis':
    #         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    #     },
    #     {
    #         'id': 2,
    #         'title': "VKMFLVKSMVMLKMV",
    #         'ageRating': "PG-13",
    #         'duration': "1h 56m",
    #         'genres': "Comedy, Family",
    #         'cast': "Evan Peters, Chris Hemsworth",
    #         'year': "1993",
    #         'synopsis':
    #         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    #     }
    # )

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
    print(json.loads(request.get_data().decode('ascii')))
    code = json.loads(request.get_data().decode('ascii'))["id"]
    key_list = json.loads(request.get_data().decode('ascii'))["array"]
    
    # user_ratings = []
    # movies_rated = []
    # for pair in key_list:
    #     movies_rated.append(pair['id'])
    #     user_ratings.append(pair['value'])
    user_ratings = np.array([2.0, 3.0, 3.0, 3.0, 3.0, 3.0])
    movies_rated = np.array([98, 673, 557, 8844, 254, 58])

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
        common_movies_list = [x for x in movie_and_prediction_dict.keys() if x in others_movie_prediction_dict]
        
        if len(common_movies_list) > 0:
            common_movies_list.sort(reverse=True, key= lambda x: (
                others_movie_prediction_dict[x] + movie_and_prediction_dict[x] -
                abs(others_movie_prediction_dict[x] + movie_and_prediction_dict[x])/2
            ))
        
            dictionary[code][2] = common_movies_list

        else:
            # nothing in common
            pass

    
    else:
        user_dict = dict()
        user_dict[1] = movie_and_prediction_dict
        dictionary[code] = user_dict

    # finish_training(code)
    socketio.emit('finished-training', 'sampleMessage', to=code)
    print('trained')

    return 'trained'


@app.route('/finalMovies')
@cross_origin(origin='*')
def get_final_movies():
    
    # Implement way to get session code
    code =  request.args.get('code')
    final_list = dictionary[code][2]

    return_object = []

    for i in range(5):
        if i > len(final_list):
            break
        
        movie_list = movies.loc[movies['id'] == final_list[i]]
        movie_title = movie_list.iloc[0]['title']
        genres = movie_list.iloc[0]['genres']
        movie_genres = ", ".join([x.name for x in genres])
        movie_poster_path = movie_list.iloc[0]['poster_path']
        movie_vote_average = movie_list.iloc[0]['vote_average']
        movie_description = movie_list.iloc[0]['overview']
        
        return_object.append({
            'id': final_list[i],
            'title': movie_title,
            'genres': movie_genres,
            'synopsis': movie_description,
            'ageRating': movie_vote_average,
            'poster_path': movie_poster_path,

        })



    
    return jsonify(return_object)

        #     'id': 1,
        #     'title': "The Grumpy Collection",
        #     'ageRating': "PG-13",
        #     'duration': "1h 56m",
        #     'genres': "Comedy, Family",
        #     'cast': "Evan Peters, Chris Hemsworth",
        #     'year': "1993",
        #     'synopsis':
        #     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        # },
        # {
        #     'id': 2,
        #     'title': "VKMFLVKSMVMLKMV",
        #     'ageRating': "PG-13",
        #     'duration': "1h 56m",
        #     'genres': "Comedy, Family",
        #     'cast': "Evan Peters, Chris Hemsworth",
        #     'year': "1993",
        #     'synopsis':
        #     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        # }

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=int(os.environ.get('PORT', 3000)))