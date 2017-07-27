import * as Router from 'koa-router';
import * as handler from '../handler';

const router = new Router();
router.post('/recognize', handler.recognize);
router.get('/example', handler.example)
export { router }