export const movieSchema = [
  { id: 'title', label: 'Title', type: 'text', required: true },
  { id: 'tagLine', label: 'Tagline', type: 'text', required: true },
  { id: 'overview', label: 'Overview', type: 'text', required: true },
  { id: 'year', label: 'Year', type: 'number', required: true, min: 1888, max: 3000 },
  {
    id: 'certification',
    label: 'Certification',
    type: 'radio',
    options: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'],
    required: true
  },
  { id: 'releaseDate', label: 'Release Date', type: 'date', required: true },
  { id: 'genres', label: 'Genres', type: 'text', required: true, placeholder: 'Action, Comedy, etc.' },
  { id: 'runtime', label: 'Runtime', type: 'text', required: true, placeholder: '1h 55m' },
  { id: 'imdbScore', label: 'IMDB Score', type: 'number', min: 1.0, max: 10.0, step: 0.1 },
  { id: 'rottenTomatoes', label: 'Rotten Tomatoes (%)', type: 'text' },
  { id: 'fandangoAudienceScore', label: 'Fandango Audience Score (%)', type: 'text' },
  { id: 'poster', label: 'Poster URL', type: 'url', required: true },
  { id: 'trailer', label: 'Trailer URL', type: 'url', required: true }
];
