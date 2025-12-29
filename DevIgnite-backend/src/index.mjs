import dotenv from 'dotenv';
dotenv.config();


import { User } from './models/User.mjs';
import notificationRoutes from './routes/notifications.mjs';

import cors from 'cors';

import express from 'express';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoute from './routes/auth.mjs';
app.use(authRoute);

import postRoute from './routes/posts.mjs';
app.use(postRoute);

import usersRoute from './routes/users.mjs';
app.use(usersRoute);


import connectDB from './config/db.mjs';
connectDB();

app.get("/", (req,res)=>{
    res.send("Hello world");
})

app.listen(process.env.PORT);

app.use('/api/notifications', notificationRoutes);
