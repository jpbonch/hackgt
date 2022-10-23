import './App.css';
import {io} from 'socket.io-client';
import React, { useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import {useState} from 'react';
import { useSearchParams, useParams } from "react-router-dom";
import Survey from './Survey';
import { Navigate } from "react-router-dom";
import Movie from './Movie';
import MovieListing from './MovieListing';
import Clipboard from './clipboard.png'
import FinalMoviePage from './FinalMoviePage';
import HomeIcon from '@mui/icons-material/Home';
import Anim from './Anim';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#ffffff",
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});




const socket = io("https://" + document.domain + ":" + window.location.port);
// const socket = io("http://localhost:3000");

async function getCode() {
  let url = 'https://matchflixgt.herokuapp.com/getCode';
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
  let url = 'https://matchflixgt.herokuapp.com/movies';
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
  const [finishedSurvey, setFinishedSurvey] = useState(false);
  const [waiting, setShowWaiting] = useState(false);
  const [otherUserFinished, setOtherUserFinished] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [trainingWaiting, setShowTrainingWaiting] = useState(false);

  socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`);
  })

  async function getFinalMovies() {
    let url = `https://matchflixgt.herokuapp.com/finalMovies?code=${code}`;
    try {
        return fetch(url).then((res) => res.text())
        .then((text) => {
            return JSON.parse(text);
        })
    } catch (error) {
        console.log(error);
    }
  }

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
      setShowWaiting(false);
      setShowCode(false);
      surveySetter()
      console.log(obj["message"]);
    }
  })

  socket.on('userHasJoined', () => {
    console.log('User joined');
    setUserHasJoined(true);
  })

  socket.on('otherUserFinished', () => {
    console.log("Other finished!")
    setOtherUserFinished(true);
    setShowWaiting(false);
  })

  socket.on('finished-training', () => {
    setShowTrainingWaiting(false);
  })

  const joinRoom = (code) => {
    socket.emit('join-room', code);
    setShowCodeInput(false);
    setShowWaiting(true);
  }

  async function handleCreate (e) {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let codeFromBack = await getCode();
    setCode(codeFromBack);
    setShowCode(true);
    socket.emit('join-room', codeFromBack);
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
      setUserHasJoined(false);
      surveySetter();
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
      setFinishedSurvey(true);
      console.log(code);
      socket.emit('userFinished', 'message', code);
      if (!otherUserFinished) {
        setShowWaiting(true);
      }
      setSurvey(false);
      const newArray = [{id: id, value: val}].concat(ratings);
      setRatings(newArray);
      console.log(newArray)
      fetch('https://matchflixgt.herokuapp.com/userRatings', {
        method: 'POST', 
        body: {array: JSON.stringify(newArray), id: code}
      })
    }
    setRatings([...ratings, {id: id, value: val}])
    setSurveyIndex(value => Math.min(value+1, movies.length-1)); // To avoid going out of bounds
  }

  const handleBack = () => {
    setShowSessionButtons(true);
    setShowCodeInput(false);
    setShowCode(false);
    setSurvey(false);
    setUserHasJoined(false);
    setCode('');
    setSurveyIndex(0);
    setRatings([]);
    setMovies([]);
    setFinishedSurvey(false);
    setShowWaiting(false);
    setOtherUserFinished(false);

    // Leave websocket room @vini
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <div className='header'>
        {/* <button variant="contained" onClick={handleBack} class="backButton"><HomeIcon></HomeIcon></button> */}
        <h1 className='title'>MATCHFLIX</h1>
      </div>
      {showSessionButtons && (
        <div>
          <Anim></Anim>
      <Button sx={{m:2}} variant="contained" onClick={handleCreate} className="sessionButton" color="primary">
        <span class="sessionText">Create a Session</span></Button>
      <Button sx={{m:2}} variant="outlined" onClick={handleJoin} className="sessionButton">
        <span class="sessionText">Join a Session</span></Button>
      </div>
      )}
      
      
      {survey && (
        <Survey movie={movies[surveyIndex]} incrementIndex={incrementIndex}></Survey>
      )}
      {showCodeInput && (
        <div className="joinButtonContainer">
          <TextField id="code-text-box" label='Code' value={code} variant="outlined" onChange={() => {
            setCode(document.getElementById('code-text-box').value)
          }}/>
          <Button sx={{m:2}} className="joinButton" variant="contained" onClick={() => {
            if((!isNaN(parseFloat(code)) && isFinite(code)) && code >= 10000 && code <= 99999){
              joinRoom(code);
            } else {
              setInvalidCode(true);
            }
            }}><span class="joinText">Join</span></Button>
        </div>
      )}
      {showCodeInput && invalidCode && (
        <p>Invalid code</p>
      )}

      {waiting && (
        <div>
          
          <div class="loader-wrapper">
          <div class="loader"></div>
        </div>
        Waiting for other user...
        </div>
      )}

      {trainingWaiting && (
        <div>
          
          <div class="loader-wrapper">
          <div class="loader"></div>
        </div>
        Waiting for AI...
        </div>
      )}

      {showCode && !(userHasJoined) && (
        <div>
          <p><i>SHARE CODE:</i></p>
          <span className='code'><b>{code}</b></span>
          <p>-- or --</p>
          <p><i>SHARE LINK:</i></p>
          <div class="linkContainer">
          <TextField
          id="outlined-read-only-input"
          label=""
          fullWidth
          className="linkfield"
          defaultValue={`https://matchflixgt.herokuapp.com/#/${code}`}
          InputProps={{
            readOnly: true,
            endAdornment: <Button className="copyButton" onClick={() => navigator.clipboard.writeText(`https://matchflixgt.herokuapp.com/#/${code}`)}><img src={Clipboard} alt="copy" className='clipboard'></img></Button>
          }}
          sx={{ input: { color: 'white' } }}
        ></TextField></div>
       </div>)}
        {userHasJoined && (
        <div>
          <p>User has joined!</p>
        <Button sx={{m:2}} variant="outlined" onClick={handleReady}>Ready</Button>
        </div>)
        }
        

      {(finishedSurvey && otherUserFinished && !trainingWaiting) && (
        <div>
          <FinalMoviePage data={async () => {return await getFinalMovies()}}/>
        </div>
      )}
      </ThemeProvider>
    </div>
  );
}

export default App;
