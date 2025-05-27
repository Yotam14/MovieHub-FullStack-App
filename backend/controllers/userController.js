const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Watchlist = require("../models/watchlistModel");

// - **Description:** Creates a JWT token with the given user ID and a specified expiration time. 

// - **Parameters:** 

//   - `_id`: User ID for whom the token is being created. 

// - **Returns:** A JWT token. 
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// - **Description:** Logs in a user by validating the provided email and password, then generates a JWT token for authentication. 

// - **Method:** HTTP POST 

// - **Route:** `/login` 

// - **Request Body:** 

//   - `email`: User's email. 

//   - `password`: User's password. 

// - **Response:** Returns the user's email, JWT token, and role upon successful login. 

// - **Status Codes:** 

//   - 201: Created, user logged in successfully. 

//   - 400: Bad Request, if login credentials are incorrect.
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        role = user.role;
        // create token
        const token = createToken(user._id);

        res.status(201).json({ email, token, role });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Description:** Registers a new user with the provided email and password, then generates a JWT token for authentication. 

//    - **Method:** HTTP POST 

//    - **Route:** `/signup` 

//    - **Request Body:** 

//      - `email`: User's email. 

//      - `password`: User's password. 

//    - **Response:** Returns the user's email and JWT token upon successful registration. 

//    - **Status Codes:** 

//      - 201: Created, user registered successfully. 

//      - 400: Bad Request, if registration fails due to invalid input or existing email. 

const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);

        res.status(201).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Description:** Changes the role of a user identified by their ID. 

//    - **Method:** HTTP PATCH 

//    - **Route:** `/users/:id` 

//    - **Parameters:** 

//      - `id`: The ID of the user whose role is being changed. 

//    - **Request Body:** 

//      - `role`: New role to assign to the user (either "admin" or "user"). 

//    - **Response:** Returns the updated user object with the new role. 

//    - **Status Codes:** 

//      - 200: Success, user role updated. 

//      - 400: Bad Request, if the provided ID is invalid or the role is not recognized. 

const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "no such user" });
    }
    if (role != "admin" && role != "user") {
        return res.status(400).json({ error: "no such role" });
    }
    const user = await User.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
};

// **Description:** Deletes a user identified by their ID from the database, along with their associated watchlist. 

//    - **Method:** HTTP DELETE 

//    - **Route:** `/users/:id` 

//    - **Parameters:** 

//      - `id`: The ID of the user to delete. 

//    - **Response:** Returns the deleted user object. 

//    - **Status Codes:** 

//      - 200: Success, user deleted along with associated watchlist. 

//      - 400: Bad Request, if the provided ID is invalid
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "no such user" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(400).json({ error: "User not found" });
    // delete the user watchlist
    await Watchlist.deleteMany({ user: id });
    res.status(200).json(user);
};
// **Description:** Retrieves all users from the database. 

//    - **Method:** HTTP GET 

//    - **Route:** `/users` 

//    - **Response:** Returns an array of user objects sorted by their creation date in descending order. 

//    - **Status Codes:** 

//      - 200: Success, returns the list of users. 

const getUsers = async (req, res) => {
    const users = await User.find({}).sort({ ceratedAt: -1 });
    res.status(200).json(users);
};

module.exports = {
    signupUser,
    loginUser,
    getUsers,
    changeUserRole,
    deleteUser,
};
