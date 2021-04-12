const { Genre } = require('../models');

const genredata = [
  {
    name: 'Comedy'
  },
  {
    name: 'Dark-Fantasy'
  },
  {
    name: 'Gothic'
  },
  {
    name: 'Lovecraftian'
  },
  {
    name: 'Paranormal'
  },
  {
    name: 'Post-Apocalyptic'
  },
  {
    name: 'Psychological'
  },
  {
    name: 'Sci-Fi'
  },
  {
    name: 'Slasher'
  },
  {
    name: 'Supernatural'
  },
  {
    name: 'Other'
  }
];

const seedGenres = () => Genre.bulkCreate(genredata);

module.exports = seedGenres;