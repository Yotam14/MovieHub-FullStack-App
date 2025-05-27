const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//Verifies that a user is authenticated and has the role of an admin by checking
// the presence and validity of an authorization token in the request headers, 
//then retrieves the user's ID and role from the token payload. If the user's role is not "admin",
// it returns an error response; otherwise, it passes control to the next middleware function.
const requireRole = async (req, res, next) => {
  
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findOne({ _id }).select("role");
        if (req.user.role !== "admin")
            return res.status(401).json({ error: "Request is not authorized" });
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

module.exports = requireRole;
