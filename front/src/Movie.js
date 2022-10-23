import "./Movie.css";
import Slider from "@mui/material/Slider";

function Movie(props) {
  console.log(props);
  return (
    <div className="container">
      <h1 className="topPick">YOUR TOP PICK</h1>
      <div className="Movie">
        <img
          src={
            "https://image.tmdb.org/t/p/original/nLvUdqgPgm3F85NMCii9gVFUcet.jpg"
          }
          alt="kys"
          className="poster"
        ></img>
        <div className="movieBox">
          <h2 className="movieTitle">{props.movie.title}</h2>
          <div>
            <span>{props.movie.year}</span>&emsp;
            <span className="ageRating"> {props.movie.ageRating} </span>&emsp;
            <span>{props.movie.duration}</span>
          </div>
          <p>
            {props.movie.synopsis}
          </p><br></br>
          <h2 className="percentageMatch">% MATCH</h2>
          <Slider sx={{ m: 0 }} disabled defaultValue={80} aria-label="Disabled slider" valueLabelDisplay="on" />
        </div>
        
      </div>
    </div>
  );
}

export default Movie;
