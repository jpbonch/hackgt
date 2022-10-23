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
            array.push(<MovieListing key={i} listId={i+1} movie={data[i]} />)
        }
        setMovies(array);
    }

    useEffect(() => {
        asyncFunction();
    }, [])

    return (
        <div style={{marginBottom: "100px"}}>
            <Movie movie={numberOneMovie}></Movie>
            {movies}
        </div>
    )
}

export default FinalMoviePage;