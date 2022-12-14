import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter.js';
import urlRouter from './routers/urlRouter.js';
import usersRouter from './routers/usersRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(urlRouter);
app.use(usersRouter);


app.listen(process.env.PORT, () => console.log("Listening on port " + process.env.PORT));