const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);


const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUserInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}
const MOVIE_FILE_PATH = 'movies.json';

async function loadMovies() {
  try {
    const data = await readFileAsync(MOVIE_FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading movie', error);
    return [];
  }
}

async function save(movies) {
  try {
    await writeFileAsync(MOVIE_FILE_PATH, JSON.stringify(movies, null, 2));
    console.log('updated successfully.');
  } catch (error) {
    console.error('Error saving movie:', error);
  }
}

async function display() {
  const movies = await loadMovies();
  console.log('=== Movie Catalog ===');
  movies.forEach((movie) => {
    console.log(`Title: ${movie.title}`);
    console.log(`Director: ${movie.director}`);
    console.log(`Release Year: ${movie.releaseYear}`);
    console.log(`Genre: ${movie.genre}`);
    console.log('------------------------');
  });
}
async function deletem() {
  const movies = await loadMovies();
  const movieTitle = await promptUserInput('Enter the title of the movie to delete: ');

  const updatedMovies = movies.filter((movie) => movie.title !== movieTitle);
  if (movies.length === updatedMovies.length) {
    console.log('Movie not found.');
    return;
  }

  await save(updatedMovies);
}
async function add() {
  const title = await promptUserInput('Enter title: ');
  const director = await promptUserInput('Enter director: ');
  const releaseYear = await promptUserInput('Enter year: ');
  const genre = await promptUserInput('Enter genre: ');

  const movie = {
    title,
    director,
    releaseYear,
    genre,
  };

  const movies = await loadMovies();
  movies.push(movie);

  await save(movies);
}

async function update() {
  const movies = await loadMovies();
  const movieTitle = await promptUserInput('Enter title: ');

  const movieIndex = movies.findIndex((movie) => movie.title === movieTitle);
  if (movieIndex === -1) {
    console.log('Movie not found.');
    return;
  }

  const updatedTitle = await promptUserInput('Enter updated title: ');
  const updatedDirector = await promptUserInput('Enter updated director: ');
  const updatedReleaseYear = await promptUserInput('Enter updated release year: ');
  const updatedGenre = await promptUserInput('Enter updated genre: ');

  movies[movieIndex].title = updatedTitle;
  movies[movieIndex].director = updatedDirector;
  movies[movieIndex].releaseYear = updatedReleaseYear;
  movies[movieIndex].genre = updatedGenre;

  await save(movies);
}


async function filter() {
  const movies = await loadMovies();
  const filterBy = await promptUserInput('Enter filter term (genre or release year): ');
  const filterValue = await promptUserInput(`Enter ${filterBy} to filter by: `);

  const filteredMovies = movies.filter((movie) => {
    if (filterBy === 'genre') {
      return movie.genre.toLowerCase() === filterValue.toLowerCase();
    } else if (filterBy === 'release year') {
      return movie.releaseYear === filterValue;
    }
  });

  if (filteredMovies.length > 0) {
    console.log('=== Filtered Results ===');
    filteredMovies.forEach((movie) => {
      console.log(`Title: ${movie.title}`);
      console.log(`Director: ${movie.director}`);
      console.log(`Release Year: ${movie.releaseYear}`);
      console.log(`Genre: ${movie.genre}`);
      console.log('------------------------');
    });
  } else {
    console.log('No movies found matching the filter criteria.');
  }
}
async function search() {
  const movies = await loadMovies();
  const searchTerm = await promptUserInput('Enter search term: ');

  const filteredMovies = movies.filter((movie) => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const lowercaseTitle = movie.title.toLowerCase();
    const lowercaseDirector = movie.director.toLowerCase();
    const lowercaseGenre = movie.genre.toLowerCase();

    return (
      lowercaseTitle.includes(lowercaseSearchTerm) ||
      lowercaseDirector.includes(lowercaseSearchTerm) ||
      lowercaseGenre.includes(lowercaseSearchTerm)
    );
  });

  if (filteredMovies.length > 0) {
    console.log('=== Search Results ===');
    filteredMovies.forEach((movie) => {
      console.log(`Title: ${movie.title}`);
      console.log(`Director: ${movie.director}`);
      console.log(`Release Year: ${movie.releaseYear}`);
      console.log(`Genre: ${movie.genre}`);
      console.log('------------------------');
    });
  } else {
    console.log('No movies found matching the search term.');
  }
}



module.exports = {
  display,
  add,
  update,
  deletem,
  search,
  filter,
};
