const { Club } = require('../models');

const clubdata = [
  {
    name: 'A Nightmare'
  },
  {
    name: 'Elm Street'
  }
];

const seedClubs = () => Club.bulkCreate(clubdata);

module.exports = seedClubs;
