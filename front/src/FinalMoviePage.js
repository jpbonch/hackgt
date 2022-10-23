import React, { useEffect } from "react";
import Movie from "./Movie";
import MovieListing from "./MovieListing";


async function getFinalMovies() {
    let url = 'https://moviematchgt.herokuapp.com/finalMovies';
    try {
        return fetch(url).then((res) => res.text())
        .then((text) => {
            return JSON.parse(text);
        })
    } catch (error) {
        console.log(error);
    }
}

function FinalMoviePage() {
    const [numberOneMovie, setNumberOneMovie] = React.useState([]);
    const [movies, setMovies] = React.useState([]);

    const asyncFunction = async () => {
        const data = await getFinalMovies();

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