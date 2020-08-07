const UserService = require("../../services/User")
const {createToken} = require("../../utils/JWTUtils");
const controller = {};
const debug = require("debug")("log");

controller.register = async (req,res)=>{
    const fieldsValidation = UserService.verifyRegisterFields(req.body);
    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }

    try {
        const {username,email} = req.body;
        const userExists = await UserService.findOneUsernameEmail(username,email);
        if(userExists){
            return res.status(409).json({
                error:"User already exists"
            })
        }

        const userCreated = await UserService.register(req.body);
        if(!userCreated.success){
            return res.status(400).json(userCreated.content);
        }
        return res.status(201).json(userCreated.content);

    }catch (e) {
        debug(e);
        return res.status(500).json({
            error:"Internal server error"
        })
    }
}

controller.login = async (req,res) => {
    const fieldValidation = UserService.verifyLoginFields(req.body);
    //debug(fieldValidation.success);
    if(!fieldValidation.success){
        return res.status(400).json(fieldValidation.content);
    }

    try {
        const {identifier, password} = req.body;
        const userExists = await UserService.findOneUsernameEmail(identifier,identifier);
        if(!userExists.success){
            return res.status(404).json(userExists.content);
        }
        const user = userExists.content;

        if(!user.comparePassword(password)){
            return res.status(403).json({
                error:"Incorrect Password"
            })
        }
        return res.status(200).json({
            token: createToken(user._id)
        });

    }catch (e) {
        debug(e);
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

}

module.exports = controller;