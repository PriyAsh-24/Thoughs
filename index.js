require("dotenv").config();

const express=require('express');
const path=require("path");
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');

const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const { authCheck } = require('./middleware/authentication');
const Blog=require('./models/blogs');

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected"));
const app=express();
const PORT=process.env.PORT;

app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(authCheck("token"));
app.use(express.static(path.resolve("./public")));

app.set("view engine",'ejs');
app.set('views',path.resolve('./views'));

app.use('/user',userRoute);
app.use('/blog',blogRoute);


app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({});
    res.render('home',{
        user : req.user,
        blogs : allBlogs,
    });
})

app.listen(PORT, console.log(`Server Started at ${PORT}`));