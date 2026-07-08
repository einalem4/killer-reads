import { Hono } from 'hono';
import { usersApiRoutes } from './users.js';
import { postsApiRoutes } from './posts.js';
import { commentsApiRoutes } from './comments.js';
import { genresApiRoutes } from './genres.js';
import { imagesApiRoutes } from './images.js';

export const apiRoutes = new Hono();

apiRoutes.route('/users', usersApiRoutes);
apiRoutes.route('/posts', postsApiRoutes);
apiRoutes.route('/comments', commentsApiRoutes);
apiRoutes.route('/genres', genresApiRoutes);
apiRoutes.route('/images', imagesApiRoutes);
