const { Vote } = require('../models');

const votedata = [
  {
    user_id: 1,
    genre_id: 1
  },
  {
    user_id: 2,
    genre_id: 2
  },
  {
    user_id: 3,
    genre_id: 3
  },
  {
    user_id: 4,
    genre_id: 4
  },
  {
    user_id: 5,
    genre_id: 5
  },
];

const seedVotes = () => Vote.bulkCreate(votedata);

module.exports = seedVotes;
