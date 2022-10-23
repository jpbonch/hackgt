import React, { useEffect } from "react";
import Movie from "./Movie";
import MovieListing from "./MovieListing";


function FinalMoviePage(props) {
    const [numberOneMovie, setNumberOneMovie] = React.useState([]);
    const [movies, setMovies] = React.useState([]);

    const asyncFunction = async (props) => {
        const data = props.data;

        //add functino to catch error or smt
        setNumberOneMovie(data[0]);
        const array = []
        for (let i = 1; i < data.length; i++) {
            array.push(<MovieListing movie={data[i]} />)
        }
        setMovies(array);
    }

    useEffect(() => {
        asyncFunction();
    }, [])

    return (
        <div>
            <Movie movie={numberOneMovie}></Movie>
            <MovieListing movies={movies.slice(1)}></MovieListing>
        </div>
    )
}

export default FinalMoviePage;