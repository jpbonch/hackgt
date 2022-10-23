import './MovieListing.css'

function MovieListing(props) {
  console.log(props);
    return (<div>
        <hr></hr>
        <div className="movieListing">
            <h1 className='movieNumber'>{props.key}</h1>
            <img
          src={
            "https://image.tmdb.org/t/p/original/nLvUdqgPgm3F85NMCii9gVFUcet.jpg"
          }
          alt="kys"
          className="tinyPoster"
        ></img>
        <div>
        <h2 className='movieTitle'>{props.movie.title.toUpperCase()}</h2>
        <p className="infoLine">
            <strong>Genres:</strong> {props.movie.genres}
          </p>
          <p className="infoLine">
            <strong>Cast:</strong> {props.movie.cast}
          </p>
        </div>
        <div>
        <h1 className='moviePercentage'>80%</h1>
        <span>MATCH</span>
        </div>
        </div>
        </div>
    );
}

export default MovieListing;