const JWT=require('jsonwebtoken');
const secret="$uperM@N24";

function createUserTokenForAuthentication(user){
    const payload={
        _id : user.id,
        fullName : user.fullName,
        email : user.email,
        profileImageUrl : user.profileImageUrl,
        role : user.role,
    };

    const token=JWT.sign(payload,secret);
    return token;
}

function checkUser(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports ={
    createUserTokenForAuthentication,
    checkUser
}