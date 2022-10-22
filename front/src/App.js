import './App.css';
import {io} from 'socket.io-client';
import React, { useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import {useState} from 'react';
import { useSearchParams, useParams } from "react-router-dom";
import Survey from './Survey';

const socket = io('http://localhost:3000');


function App() {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const { id } = useParams();
  const [survey, setSurvey] = React.useState(false);
  const [userHasJoined, setUserHasJoined] = React.useState(false);
  const [code, setCode] = React.useState('');

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
    socket.emit('join-room', code);
  }

  const handleCreate = event => {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let code = '1234';
    setCode('1234');
    setShowCode(true);
    joinRoom(code);
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

  return (
    <div className="App">
      <h1 className='title'>Movie Match</h1>
      {survey && (
        <Survey socket={socket} />
      )}
      {showSessionButtons && (
        <div>
      <Button sx={{m:2}} variant="contained" onClick={handleCreate}>Create a Session</Button>
      <Button sx={{m:2}} variant="outlined" onClick={handleJoin}>Join a Session</Button>
      </div>
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
          <span className='code'>{1234}</span>
          <p>or</p>
          <p>Share link:</p>
          <TextField
          id="outlined-read-only-input"
          label=""
          fullWidth
          defaultValue="https://www.movie.com/1234"
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
