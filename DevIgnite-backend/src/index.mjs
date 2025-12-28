import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

app.use(express.json());

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