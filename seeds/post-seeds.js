const { Post } = require('../models');

const postdata = [
  {
    title: 'The Excorcist',
    post_text: 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.',
    author: 'William Peter Blatty',
    user_id: 1,
    genre_id: 1
  },
  {
    title: 'Psycho',
    author: 'Robert Bloch',
    post_text: 'Curabitur in libero ut massa volutpat convallis. Curabitur in libero ut massa volutpat convallis. Curabitur in libero ut massa volutpat convallis.',
    user_id: 3,
    genre_id: 2
  },
  {
    title: 'I Am Legend',
    author: 'Richard Matheson',
    post_text: 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.',
    user_id: 4,
    genre_id: 3
  },
  {
    title: "Night Flyers",
    author: 'George R.R. Martin',
    post_text: 'Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.',
    user_id: 2,
    genre_id: 4
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    post_text: 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.',
    user_id: 1,
    genre_id: 5
  }
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;
