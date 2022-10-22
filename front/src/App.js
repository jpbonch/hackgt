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
        return text;
      })
  } catch (error) {
      console.log(error);
  }
}

async function getMovies() {
  let url = 'http://localhost:3000/movies';
  try {
      return fetch(url).then((res) => res.text())
      .then((text) => {
        return JSON.parse(text);
      })
  } catch (error) {
      console.log(error);
  }
}

function App() {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const { id } = useParams();
  const [survey, setSurvey] = React.useState(false);
  const [userHasJoined, setUserHasJoined] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [movies, setMovies] = useState([]);

  socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`);
  })

  //Just created this to add async functionality to socket
  async function surveySetter() {
    setMovies(await getMovies());
    setSurvey(true)
  }

  //This is for the person who's on the join side - this message is broadcasted when
  //the create side user is ready
  socket.on('receive-from-server', obj => {
    if (obj["bool"]) {
      setShowCodeInput(false);
      setShowCode(false);
      surveySetter()
      console.log(obj["message"]);
    }
  })

  socket.on('userHasJoined', () => {
    console.log('User joined');
    setUserHasJoined(true);
  })

  const joinRoom = (code) => {
    socket.emit('join-room', code);
  }

  async function handleCreate (e) {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let codeFromBack = await getCode();
    setCode(codeFromBack);
    setShowCode(true);
    joinRoom(codeFromBack);
  }

  const handleJoin = event => {
    setShowSessionButtons(false);
    setShowCodeInput(true);
  }

  //Function run when user who created room is ready
  async function handleReady() {
    if (userHasJoined) {
      setShowCodeInput(false);
      setShowCode(false);
      surveySetter();
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
    if (surveyIndex === movies.length-1){
      window.location.href = "/movie"
      const newArray = [{id: id, value: val}].concat(ratings);
      setRatings(newArray);
      console.log(newArray)
      fetch('http://localhost:3000/userRatings', {
        method: 'POST', 
        body: JSON.stringify(newArray)
      })
    }
    setRatings([...ratings, {id: id, value: val}])
    setSurveyIndex(value => Math.min(value+1, movies.length-1)); // To avoid going out of bounds
  }


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
