const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// Description: 

// This function is a middleware used to ensure that incoming requests are made by

// authenticated users. It verifies the presence and validity of a JWT (JSON Web Token) in the request headers.

// If the token is valid, it extracts the user's ID from it and attaches it to the request object (req.user) for further processing by downstream middleware or route handlers. 

// Parameters: 

// req: Express request object. 

// res: Express response object. 

// next: Express next function to pass control to the next middleware/route handler
const requireAuth = async (req, res, next) => {
    
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findOne({ _id }).select("_id");
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

module.exports = requireAuth;
