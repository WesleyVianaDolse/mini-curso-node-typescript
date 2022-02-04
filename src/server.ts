import express from 'express';
import path from 'path';
import routes from './routes';

const app = express();

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(777, () => {
    console.log('Server online na porta 777!🚀');
});
