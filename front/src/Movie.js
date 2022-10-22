import "./Movie.css";
import Slider from "@mui/material/Slider";

function Movie() {
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
        <div>
          <h2 className="movieTitle">THE GRUMPY COLLECTION</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p><br></br>
          <h2 className="percentageMatch">% MATCH</h2>
          <Slider sx={{ m: 0 }} disabled defaultValue={80} aria-label="Disabled slider" valueLabelDisplay="on" />
        </div>
        
      </div>
    </div>
  );
}

export default Movie;
