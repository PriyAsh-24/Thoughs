const express=require('express');
const path=require("path");
const mongoose=require('mongoose');

const userRoute=require('./routes/user');

mongoose.connect('mongodb://localhost:27017/thoughs').then((e) => console.log("MongoDB Connected"));
const app=express();
const PORT=8000;



app.set("view engine",'ejs');
app.set('views',path.resolve('./views'));

app.use('/user',userRoute);


app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(PORT, console.log(`Server Started at ${PORT}`));