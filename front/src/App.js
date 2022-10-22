import './App.css';
import {io} from 'socket.io-client';
import React, { useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import {useState} from 'react';
import { useSearchParams, useParams } from "react-router-dom";
import Survey from './Survey';
import { Navigate } from "react-router-dom";
import Movie from './Movie';


const socket = io('http://localhost:3000');

async function getCode() {
  let url = 'http://localhost:3000/getCode';
  try {
      return fetch(url).then((res) => res.text())
      .then((text) => {  
        console.log(text);
        return text;
        // console.log(JSON.parse(text)['id']);
        // return JSON.parse(text)['id'];
      })
  } catch (error) {
      console.log(error);
  }
}

function App(props) {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const { id } = useParams();
  const [survey, setSurvey] = React.useState(false);
  const [userHasJoined, setUserHasJoined] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [ratings, setRatings] = useState([]);

  socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`);
  })

  //This is for the person who's on the join side - this message is broadcasted when
  //the create side user is ready
  socket.on('receive-from-server', obj => {
    if (obj["bool"]) {
      setShowCodeInput(false);
      setShowCode(false);
      setSurvey(true);
      console.log(obj["message"]);
    }
  })

  socket.on('userHasJoined', () => {
    setUserHasJoined(true);
  })

  const joinRoom = (code) => {
    console.log(code);
    socket.emit('join-room', code);
  }

  async function handleCreate (e) {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let codeFromBack = await getCode();
    console.log(codeFromBack);
    setCode(codeFromBack);
    setShowCode(true);
    joinRoom(codeFromBack);
  }

  const handleJoin = event => {
    setShowSessionButtons(false);
    setShowCodeInput(true);
  }

  //Function run when user who created room is ready
  const handleReady = () => {
    if (userHasJoined) {
      setShowCodeInput(false);
      setShowCode(false);
      setSurvey(true);
      console.log(code);
      socket.emit('ready-event', 'sampleMessageWeMayNotUse', code);
    } else {
      //show message "User hasnt joined"
    }
  }

  useEffect(() => {
    //Redirects user directly to join page if there's an id in his url
    if (id !== undefined) {
      setShowSessionButtons(false);
      setShowCodeInput(true);
      setCode(id);
    }
  }, []);
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
      
      
      {survey && (
        <Survey movie={movies[surveyIndex]} incrementIndex={incrementIndex}></Survey>
      )}
      {showCodeInput && (
        <div>
          <TextField id="code-text-box" label='Code' value={code} variant="outlined" onChange={() => {
            setCode(document.getElementById('code-text-box').value)
          }}/>
          <Button sx={{m:2}} variant="outlined" onClick={() => joinRoom(code)}>Join</Button>
        </div>
      )}

      {showCode && (
        <div>
          <p>Share Code:</p>
          <span className='code'>{code}</span>
          <p>or</p>
          <p>Share link:</p>
          <TextField
          id="outlined-read-only-input"
          label=""
          fullWidth
          defaultValue={`http://localhost:3001/${code}`}
          InputProps={{
            readOnly: true,
          }}
        />
        {userHasJoined && <TextField
          label=""
          fullWidth
          defaultValue="User has joined"
          InputProps={{
            readOnly: true,
          }}
        />}
        <Button sx={{m:2}} variant="outlined" onClick={handleReady}>Ready</Button>
        </div>
      )}
    </div>
  );
}

export default App;
