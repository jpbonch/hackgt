import './App.css';
import {io} from 'socket.io-client';
import React from 'react';
import { Button, TextField } from '@mui/material';
import {useState} from 'react';
import { useSearchParams, useParams } from "react-router-dom";

const socket = io('http://localhost:3000');


function App() {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [room, setRoom] = React.useState('');
  const [searchParams] = useSearchParams();
  const { id } = useParams();

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
