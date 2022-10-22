import './MovieListing.css'

function MovieListing() {
    return (
        <div className="movieListing">
            <h1 className='movieNumber'>2</h1>
            <img
          src={
            "https://image.tmdb.org/t/p/original/nLvUdqgPgm3F85NMCii9gVFUcet.jpg"
          }
          alt="kys"
          className="tinyPoster"
        ></img>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.</p>
        <h1 className='moviePercentage'>80%</h1>
        </div>
    );
}

export default MovieListing;