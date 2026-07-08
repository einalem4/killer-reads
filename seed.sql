-- Seed data converted from seeds/*.js (Sequelize) to plain SQL for D1.
-- Run with: wrangler d1 execute killer-reads-db --local --file=./seed.sql
--       or: wrangler d1 execute killer-reads-db --remote --file=./seed.sql
--
-- All seed users share the password "password123" (bcrypt hash below,
-- generated with bcryptjs at cost factor 10). Regenerate with:
--   node -e "require('bcryptjs').hash('password123', 10).then(console.log)"
--
-- NOTE: the original seeds/vote-seeds.js inserted {user_id, genre_id} pairs,
-- but the Vote model (and this schema) requires {user_id, post_id} with
-- post_id NOT NULL -- that seed was broken in the source app. The votes
-- below use post_id instead so the upvote counts actually work.

DELETE FROM vote;
DELETE FROM comment;
DELETE FROM post;
DELETE FROM session;
DELETE FROM image;
DELETE FROM user;
DELETE FROM genre;

INSERT INTO genre (id, name) VALUES
  (1, 'Comedy'),
  (2, 'Dark-Fantasy'),
  (3, 'Gothic'),
  (4, 'Lovecraftian'),
  (5, 'Paranormal'),
  (6, 'Post-Apocalyptic'),
  (7, 'Psychological'),
  (8, 'Sci-Fi'),
  (9, 'Slasher'),
  (10, 'Supernatural'),
  (11, 'Other');

INSERT INTO user (id, username, email, club_id, password) VALUES
  (1, 'John Doe', 'johndoe@email.email', 1, '$2a$10$bQ2MP638zMuiB9bi.ItrBOhYM2VVjC629I0tASYqMu3pUI/NIwaEi'),
  (2, 'Jane Doe', 'janedoe@email.email', 1, '$2a$10$bQ2MP638zMuiB9bi.ItrBOhYM2VVjC629I0tASYqMu3pUI/NIwaEi'),
  (3, 'Bob Smith', 'bobsmith@email.email', 1, '$2a$10$bQ2MP638zMuiB9bi.ItrBOhYM2VVjC629I0tASYqMu3pUI/NIwaEi'),
  (4, 'Barb Smith', 'barbsmith@email.email', 2, '$2a$10$bQ2MP638zMuiB9bi.ItrBOhYM2VVjC629I0tASYqMu3pUI/NIwaEi'),
  (5, 'Super Double Dragon', 'sdd@email.email', 2, '$2a$10$bQ2MP638zMuiB9bi.ItrBOhYM2VVjC629I0tASYqMu3pUI/NIwaEi');

INSERT INTO post (id, title, author, genre_id, post_text, user_id) VALUES
  (1, 'The Excorcist', 'William Peter Blatty', 1, 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 1),
  (2, 'Psycho', 'Robert Bloch', 2, 'Curabitur in libero ut massa volutpat convallis. Curabitur in libero ut massa volutpat convallis. Curabitur in libero ut massa volutpat convallis.', 3),
  (3, 'I Am Legend', 'Richard Matheson', 3, 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.', 4),
  (4, 'Night Flyers', 'George R.R. Martin', 4, 'Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', 2),
  (5, 'Dracula', 'Bram Stoker', 5, 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.', 1);

INSERT INTO comment (id, comment_text, user_id, post_id) VALUES
  (1, 'Nunc rhoncus dui vel sem.', 5, 1),
  (2, 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 5, 3),
  (3, 'Aliquam erat volutpat. In congue.', 3, 2),
  (4, 'Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', 2, 5),
  (5, 'Aliquam erat volutpat. In congue.', 5, 1),
  (6, 'Aliquam erat volutpat. In congue.', 3, 2),
  (7, 'Aliquam erat volutpat. In congue.', 2, 5),
  (8, 'Aliquam erat volutpat. In congue.', 4, 3);

INSERT INTO vote (id, user_id, post_id) VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 1),
  (4, 2, 2),
  (5, 4, 3),
  (6, 1, 4),
  (7, 5, 4),
  (8, 3, 5);
