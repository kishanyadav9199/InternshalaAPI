require("dotenv").config({path:"./.env"});
const express = require("express");
const app = express();

//db connextion
require("./models/database").connectDatabase();
// logger
const logger= require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middlewares/error");
app.use(logger("tiny"))
//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}))

//session and cookie 
const session= require("express-session")
const cookieParser = require("cookie-parser");
app.use(
    session({
    resave: true,
    saveUninitialized:true,
    secret:process.env.EXPRESS_SESSION_SECRET
}))

app.use(cookieParser())
//express file-upload
const fileupload = require("express-fileupload")
app.use(fileupload())

//routes
app.use("/user",require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

//error handlers

app.all("*",(req,res,next) => {
    next(new ErrorHandler(`requested url not found ${req.url}`,404));

})

app.use(generatedError);
app.listen(process.env.PORT,console.log(`Server listen on port ${process.env.PORT}`)
)