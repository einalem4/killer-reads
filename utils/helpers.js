const crypto = require('crypto')

module.exports = {
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`;
  },
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },
  randomString: (num = 32) => {
    return crypto.randomBytes(num).toString('hex');
  },

  genreDropdown: (genre) => {
    return `<a href="/discussions/${genre.id}>${genre.name}</a>`;
  }
};

