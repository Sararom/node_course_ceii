const jwt = require("jsonwebtoken");
const secret = process.env.JWTSECRET || "Secret";

const tools = {};

tools.createToken = (_id) => {
    const payload = {
        _id
    }

    return jwt.sign(payload,secret,{
        expiresIn: process.env.JWTEXPTIME||"1m"
    });
}

tools.verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    }catch (e) {
        return false;
    }
}

module.exports = tools;