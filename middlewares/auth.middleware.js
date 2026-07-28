import jwt from "jsonwebtoken";
import User from "../models/User.js";

import asyncHandler from "./asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Not Authorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();

});

export default protect;