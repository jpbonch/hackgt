import './App.css';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function App() {
  const [showSessionButtons, setShowSessionButtons] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCreate = event => {
    setShowSessionButtons(false);
    // fetch 4 digit code from backend
    let code = 'VCDX';
    setShowCode(true);
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
          <TextField id="outlined-basic" label="Code" variant="outlined" />
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
