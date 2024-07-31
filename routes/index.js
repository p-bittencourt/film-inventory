const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

// ACTOR ROUTES

const testActors = [
  {
    name: 'Leonardo DiCaprio',
    age: 46,
    nationality: 'American',
    picture: 'https://example.com/leonardo.jpg',
    movies: ['Inception', 'Titanic', 'The Revenant'],
  },
  {
    name: 'Natalie Portman',
    age: 40,
    nationality: 'Israeli-American',
    picture: 'https://example.com/natalie.jpg',
    movies: ['Black Swan', 'V for Vendetta', 'Thor'],
  },
  {
    name: 'Denzel Washington',
    age: 66,
    nationality: 'American',
    picture: 'https://example.com/denzel.jpg',
    movies: ['Training Day', 'Fences', 'The Equalizer'],
  },
];

router.get('/actors', (req, res, next) => {
  res.render('./actor/actor_list', { actors: testActors });
});

// DIRECTOR ROUTES

const testDirectors = [
  {
    name: 'Christopher Nolan',
    age: 51,
    nationality: 'British',
    picture: 'https://example.com/nolan.jpg',
    movies: ['Inception', 'The Dark Knight', 'Interstellar'],
  },
  {
    name: 'Quentin Tarantino',
    age: 58,
    nationality: 'American',
    picture: 'https://example.com/tarantino.jpg',
    movies: ['Pulp Fiction', 'Kill Bill', 'Django Unchained'],
  },
  {
    name: 'Martin Scorsese',
    age: 79,
    nationality: 'American',
    picture: 'https://example.com/scorsese.jpg',
    movies: ['Goodfellas', 'The Departed', 'Taxi Driver'],
  },
];

router.get('/directors', (req, res, next) => {
  res.render('./director/director_list', { directors: testDirectors });
});

// MOVIE ROUTES

const testMovies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    summary:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    cast: ['Tim Robbins', 'Morgan Freeman'],
    poster: 'https://example.com/shawshank.jpg',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    summary:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    cast: ['Marlon Brando', 'Al Pacino'],
    poster: 'https://example.com/godfather.jpg',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    summary:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    cast: ['John Travolta', 'Samuel L. Jackson'],
    poster: 'https://example.com/pulpfiction.jpg',
  },
];

router.get('/movies', (req, res, next) => {
  res.render('./movie/movie_list', { movies: testMovies });
});

// SHOW ROUTES

const testShows = [
  {
    title: 'Breaking Bad',
    director: 'Vince Gilligan',
    summary:
      'A high school chemistry teacher turned methamphetamine producer partners with a former student to create and sell the purest methamphetamine.',
    cast: ['Bryan Cranston', 'Aaron Paul'],
    poster: 'https://example.com/breakingbad.jpg',
  },
  {
    title: 'Game of Thrones',
    director: 'David Benioff',
    summary:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    cast: ['Emilia Clarke', 'Kit Harington'],
    poster: 'https://example.com/gameofthrones.jpg',
  },
  {
    title: 'Stranger Things',
    director: 'The Duffer Brothers',
    summary:
      'In a small town where everyone knows everyone, a group of kids uncover a series of supernatural mysteries and government conspiracies.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard'],
    poster: 'https://example.com/strangerthings.jpg',
  },
];

router.get('/shows', (req, res, next) => {
  res.render('./show/show_list', { shows: testShows });
});

// GENRE ROUTES
const testGenres = [
  { name: 'Fantasy' },
  { name: 'Action' },
  { name: 'Romance' },
];

router.get('/genres', (req, res, next) => {
  res.render('./genre/genre_list', { genres: testGenres });
});

module.exports = router;
