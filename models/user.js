const { Schema, models, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

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
        required: true,
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
}, { timestamps: true }); // Changed timeseries to timestamps for tracking createdAt and updatedAt

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();  // Ensure next() is called even if password is not modified
    }

    const salt = randomBytes(16).toString('hex'); // Specify 'hex' encoding for consistent output
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

const User = model("User", userSchema);  // Capitalize the model name to follow convention

module.exports = User;
