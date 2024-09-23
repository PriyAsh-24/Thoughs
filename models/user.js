const { Schema, models, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createUserTokenForAuthentication } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "../public/images/7077313.png"
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: "User",
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next(); 
    }

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken',async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found !');

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedPassword=createHmac('sha256', salt).update(password).digest("hex");

    if(hashedPassword!== userProvidedPassword) throw new Error("Incorrect Password");

    const token=createUserTokenForAuthentication(user);
    return token;
});

const User = model("User", userSchema);

module.exports = User;
