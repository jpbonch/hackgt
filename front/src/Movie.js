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
          <h2 className="movieTitle">THE GRUMPY COLLECTION</h2>
          <div>
            <span>1993</span>&emsp;
            <span className="ageRating"> {"PG-13"} </span>&emsp;
            <span>{"1h 56m"}</span>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p><br></br>
          <h2 className="percentageMatch">% MATCH</h2>
          <Slider sx={{ m: 0 }} disabled defaultValue={80} aria-label="Disabled slider" valueLabelDisplay="on" />
        </div>
        
      </div>
    </div>
  );
}

export default Movie;
