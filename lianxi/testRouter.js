const express = require('express');
const router = require('./route');
const studentRouter = require('./route/studentRouter.js');

var app = express();

//处理路由:当我请求localhost:3000/login
app.use('/login',router);
app.use('/student',studentRouter);

app.listen(3000);