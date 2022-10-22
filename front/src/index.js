import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Movie from './Movie';
import MovieListing from './MovieListing';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Movie></Movie>
    <MovieListing></MovieListing> */}
  </React.StrictMode>
);