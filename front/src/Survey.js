import "./Survey.css";
import { Slider, Button } from "@mui/material";
import {useState} from 'react';


function Survey(props) {  
    const [sliderValue, setSliderValue] = useState(1);
  return (
    <div className="Survey">
      <div className="movieInfo">
        <img
          className="poster"
          src={
            "https://image.tmdb.org/t/p/original/nLvUdqgPgm3F85NMCii9gVFUcet.jpg"
          }
          alt="Poster"
        ></img>
        <div>
          <h2 className="movieTitle" style={{ "margin-bottom": "10px" }}>
            {props.movie["title"].toUpperCase()}
          </h2>
          <div>
            <span>{props.movie["year"]}</span>&emsp;
            <span className="ageRating"> {props.movie["ageRating"]} </span>&emsp;
            <span>{props.movie["duration"]}</span>
          </div>
          <br></br>
          <p className="infoLine">
            <strong>Genres:</strong> {props.movie["genres"]}
          </p>
          <p className="infoLine">
            <strong>Cast:</strong> {props.movie["cast"]}
          </p>
          <p>{props.movie["synopsis"]}</p>
        </div>
      </div>
      <div className="sliderContainer">
        <Slider marks min={1} max={10} step={1} valueLabelDisplay="on" onChange={(e)=>{setSliderValue(e.target.value)}}/>
        <Button sx={{ m: 2 }} variant="contained" className="nextButton" onClick={()=>props.incrementIndex(props.movie["id"], sliderValue)}>
          →
        </Button>
      </div>
    </div>
  );
}

export default Survey;
