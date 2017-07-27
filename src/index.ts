import * as Koa from 'koa';
import * as koaBody from 'koa-body';

import {router} from './routes';

const app = new Koa();
app.use(koaBody({ multipart: true }));
app.use(router.routes());
app.listen(30001, ()=> {
    console.log('>>| Listen on 30001');
});