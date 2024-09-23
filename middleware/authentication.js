const { checkUser } = require("../services/authentication");

function authCheck(cookieName){
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        if(!token){
            return next();
        }

        try {
            const userPayload=checkUser(token);
            req.user=userPayload;
        } catch (error){}

        return next();
    }
}

module.exports={
    authCheck,
}