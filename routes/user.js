const {Router}=require('express');
const User =require('../models/user');

const router=Router();

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/login",(req,res)=>{
    return res.render("login");
})

router.post('/signup', async (req,res)=>{
    const { fullName,email,password } =req.body;
    await User.create({
        fullName,email,password,
    })

    return res.redirect("/");

});

router.post('/login' ,async (req,res)=>{
    const { email,password } =req.body;
    try {
        const token= await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render('login',{
            error : "Incorrect Email or Password",
        })
    }
})

router.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect("/");
})

module.exports=router;