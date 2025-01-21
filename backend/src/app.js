import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

//Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({
    limit: '16kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static('public'));
app.use(cookieParser());


//Routes import
import userRouter from './routes/user.routes.js';
import organizationalEntitiesRouter from './routes/organizationalEntities.routes.js';


//Routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/organizational-entities', organizationalEntitiesRouter);

export { app };