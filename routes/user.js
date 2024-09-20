const {Router}=require('express');
const user =require('../models/user');

const router=Router();

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/login",(req,res)=>{
    return res.render("login");
})

router.post('/signup', async (req,res)=>{
    const {fullName,email,password} =req.body;
    await user.create({
        fullName,email,password,
    })

    return res.redirect("/");

});

module.exports=router;