import './App.css';
import {io} from 'socket.io-client';
import React from 'react';
import { Button, TextField } from '@mui/material';
import {useState} from 'react';
import { useSearchParams, useParams } from "react-router-dom";
import Survey from './Survey';
import { Navigate } from "react-router-dom";
import Movie from './Movie';


const socket = io('http://localhost:3000');


function App(props) {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [room, setRoom] = React.useState('');
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [ratings, setRatings] = useState([]);

  socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`);
  })

  socket.on('receive-from-server', partnerHasJoined => {
    if (partnerHasJoined) {
      //send user to survey
      console.log(partnerHasJoined);
    }
  })

  //This function will be used by the other user who'll be accessing the link
  // const send = () => {
  //   socket.emit('ready-event', text, room);
  // }

  const joinRoom = (code) => {
    socket.emit('join-room', code)
  }

  const handleCreate = event => {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let code = 'VCDX';
    setShowCode(true);
    joinRoom(code);
  }

  const handleJoin = event => {
    setShowSessionButtons(false);
    setShowCodeInput(true);
  }

  const incrementIndex = (id, val) => {
    setSurveyIndex(value => Math.min(value+1, movies.length-1)); // To avoid going out of bounds
    if (surveyIndex === movies.length-1){
      window.location.href = "/movie"
      fetch('endpoint/', {
        method: 'POST', 
        body: JSON.stringify(ratings)
    })
    }
    setRatings([...ratings, {id: id, value: val}]);
    console.log([...ratings, {id: id, value: val}]);
  }

  var movies = [{
    id: 1,
    title: "The Grumpy Collection",
    ageRating: "PG-13",
    duration: "1h 56m",
    genres: "Comedy, Family",
    cast: "Evan Peters, Chris Hemsworth",
    year: "1993",
    synopsis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 2,
    title: "VKMFLVKSMVMLKMV",
    ageRating: "PG-13",
    duration: "1h 56m",
    genres: "Comedy, Family",
    cast: "Evan Peters, Chris Hemsworth",
    year: "1993",
    synopsis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }];

  return (
    <div className="App">
      <h1 className='title'>Movie Match</h1>
      {showSessionButtons && (
        <div>
      <Button sx={{m:2}} variant="contained" onClick={handleCreate}>Create a Session</Button>
      <Button sx={{m:2}} variant="outlined" onClick={handleJoin}>Join a Session</Button>
      </div>
      )}
      
      

      {showCodeInput && (
        <div>
          <TextField id="outlined-basic" label='Code' value={id} variant="outlined" />
          <Survey movie={movies[surveyIndex]} incrementIndex={incrementIndex}></Survey>
        </div>
      )}

      {showCode && (
        <div>
          <p>Share Code:</p>
          <span className='code'>VCDX</span>
          <p>or</p>
          <p>Share link:</p>
          <TextField
          id="outlined-read-only-input"
          label=""
          fullWidth
          defaultValue="https://www.movie.com/VCDX"
          InputProps={{
            readOnly: true,
          }}
        />
        </div>    
      )}
    </div>
  );
}

export default App;
