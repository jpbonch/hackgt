import './App.css';
import {io} from 'socket.io-client';
import React from 'react';
import { Button, TextField } from '@mui/material';

const socket = io('http://localhost:3000');

function App() {
  const [text, setText] = React.useState('');
  const [receivedText, setReceivedText] = React.useState('');
  const [room, setRoom] = React.useState('');

  socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`);
  })
  socket.on('receive-from-server', message => {
    console.log(message);
    setReceivedText(message);
  })
  const send = () => {
    socket.emit('ready-event', text, room);
  }
  const joinRoom = () => {
    socket.emit('join-room', room)
  }


  return (
    <div className="App">
      <TextField 
        value={text} 
        onChange={() => {
          setText(document.getElementById('name').value);
        }}
        id='name'
      >
      </TextField>
      <TextField 
        value={room} 
        onChange={() => {
          setRoom(document.getElementById('room').value);
        }}
        id='room'
      >
      </TextField>
      <Button
        onClick={send}
      >Click me to send</Button>
      <Button
        onClick={joinRoom}
      >Join room</Button>
      <TextField value={receivedText}></TextField>
    </div>
  );
}

export default App;
