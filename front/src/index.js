import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Movie from './Movie';
import MovieListing from './MovieListing';
import { HashRouter, Routes, Route } from "react-router-dom";
import FinalMoviePage from './FinalMoviePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:id" element={<App />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movieListing" element={<MovieListing />} />
        <Route path="/finalMovies" element={<FinalMoviePage />} />
      </Routes>
    </HashRouter>
    {/* <App /> */}
    {/* <Movie></Movie>
    <MovieListing></MovieListing> */}
  </React.StrictMode>
);