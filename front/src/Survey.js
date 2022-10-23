import "./Survey.css";
import { Slider, Button } from "@mui/material";
import {useState} from 'react';
import { Rating } from 'react-simple-star-rating';  


function Survey(props) {  
    const [rating, setRating] = useState(0);
    const handleRating = (rate) => {
      setRating(rate)
    }
  return (
    <div className="Survey">
      <div className="movieInfo">
        <img
          className="poster"
          src={
            `https://image.tmdb.org/t/p/original/${props.movie["posterpath"]}`
          }
          alt="Poster"
        ></img>
        <div className="movieBox">
          <h2 className="movieTitle" style={{ "margin-bottom": "10px" }}>
            {props.movie["title"].toUpperCase()}
          </h2>
          <div>
            <span className="ageRating"> {props.movie["ageRating"]} </span>&emsp;
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
        <Rating
            onClick={handleRating}
            size='75px'
            style={{ margin:'auto' }}
          />
        <Button sx={{ m: 2 }} variant="contained" className="nextButton" onClick={()=>props.incrementIndex(props.movie["id"], rating)}>
          →
        </Button>
      </div>
    </div>
  );
}

export default Survey;
