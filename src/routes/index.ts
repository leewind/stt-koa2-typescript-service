import * as Router from 'koa-router';
import * as handler from '../handler'
const router = new Router();
router.get('/recognize', handler.recognize);
export {router}