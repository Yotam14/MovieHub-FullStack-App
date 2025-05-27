const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

// Description: 

// This function defines the schema for the "User" collection in MongoDB. 
//It specifies the structure of user documents stored in the "User" collection, including fields such as email,
// password, and role, along with their data types and validation rules. 


// Parameters: 

// - None 


// Returns: 

// - A Mongoose schema object representing the structure and validation rules for documents in the "User" collection. 

 
// Notes: 

// - The schema ensures that user documents inserted into the "User" collection adhere to the specified structure and constraints. 

// - Fields such as `email` and `password` are required, while the `role` field defaults to "user". 

// - The `signup` static method is defined to handle user registration. It validates the provided email and password, checks for existing email, hashes the password, and creates a new user document in the collection. 

// - The `login` static method is defined to handle user authentication. It validates the provided email and password, checks if the email exists, and compares the hashed password with the stored password to authenticate the user. 

// - Passwords are hashed using bcrypt for secure storage and comparison. 

// - The schema facilitates user authentication and registration processes in the application.

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email not valid");
    }
    //    if (!validator.isStrongPassword(password)) {
    if (password.length < 6) {
        throw Error("Password not strong enough");
    }
    // }
    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // we can add admin manually by changing the role to "admin" and after adding the user to change it back to "user"
    const user = await this.create({ email, password: hash, role: "user" });
    return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect password");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
