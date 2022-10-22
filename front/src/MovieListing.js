import './MovieListing.css'

function MovieListing() {
    return (<div>
        <hr></hr>
        <div className="movieListing">
            <h1 className='movieNumber'>2</h1>
            <img
          src={
            "https://image.tmdb.org/t/p/original/nLvUdqgPgm3F85NMCii9gVFUcet.jpg"
          }
          alt="kys"
          className="tinyPoster"
        ></img>
        <div>
        <h2 className='movieTitle'>THE GRUMPY COLLECTION</h2>
        <p className="infoLine">
            <strong>Genres:</strong> {"Comedy, Family"}
          </p>
          <p className="infoLine">
            <strong>Cast:</strong> {"Even Peters, Tony Stark"}
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