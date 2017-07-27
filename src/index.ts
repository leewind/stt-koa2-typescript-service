import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import {router} from './routes';

const app = new Koa();
app.use(router.routes());
app.use(bodyParser());
app.listen(30001, ()=> {
    console.log('>>| Listen on 30001');
});