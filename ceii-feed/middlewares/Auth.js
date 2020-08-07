const {verifyToken} = require("../utils/JWTUtils");
const {verifyID} = require("../utils/MongoUtils");
const UserService = require("../services/User");
const middleware = {};

middleware.verifyAuth= async (req,res,next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.success(403).json({
            error:"Authorization required",
        });
    }

    const[prefix,token] = authorization.split(" ");
    if(prefix !=="Bearer"){
        return res.status(400).json({
            error:"Incorrect Prefix"
        })
    }
    const tokenObject = verifyToken(token);
    if(!tokenObject){
        return res.status(401).json({
            error:"Invalid Token",
        });
    }

    const userID = tokenObject._id;
    if(!verifyID(userID)){
        return res.status(401).json({
            error:"Error in ID"
        });
    }

    next();

}

module.exports = middleware;
