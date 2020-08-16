const UserModel = require("../models/User");
const debug = require("debug")("log");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})");
const emailRegex = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

const service = {};

service.verifyRegisterFields = ({username, email, password, name, photo}) => {
    let serviceResponse = {
        success:true,
        content:{}
    }
    if(!username || !email || !password || !name){
        serviceResponse = {
            success: false,
            content: {
                error: "Required fields empty"
            }
        }
        return serviceResponse;
    }


    if(!emailRegex.test(email)){
        serviceResponse = {
            success: false,
            content: {
                error:"Field format incorrect"
            }
        }
        return serviceResponse;
    }

    if(!passwordRegex.test(password)){
        serviceResponse = {
            success: false,
            content: {
                error:"Password must be 8-12 and strong"
            }
        }
        return serviceResponse;
    }

    return serviceResponse;
}

service.verifyLoginFields = ({identifier, password}) =>{
    let serviceResponse = {
        success:true,
        content:{}
    }

    if(!identifier || !password){
        serviceResponse={
            success: false,
            content: {
                error:"Required fields empty"
            }
        }
        return serviceResponse;
    }
    //debug("Service " + serviceResponse);
    return serviceResponse;
}

service.verifyUpdatedFields = ({username, email, password, name, photo})=>{
    let serviceResponse={
        success:true,
        content: {}
    }

    if(!username && !email && !password && !name && !photo){
        serviceResponse={
            success: false,
            content: {
                error:"All fields are empty"
            }
        }
        return serviceResponse;
    }
    if(username) serviceResponse.content.username = username;
    if(name) serviceResponse.content.name = name;
    if(photo) serviceResponse.content.photo = photo;

    if(password){

        if(!passwordRegex.test(password)){
            serviceResponse = {
                success: false,
                content: {
                    error:"Password must be 8-12 and strong"
                }
            }
            return serviceResponse;
        }
        serviceResponse.content.password = password;
    }

    if(email){
        if(!emailRegex.test(email)){
            serviceResponse = {
                success: false,
                content: {
                    error:"Field format incorrect"
                }
            }
            return serviceResponse;
        }
        serviceResponse.content.email = email;
    }
    return serviceResponse;
}


service.findOneById = async (_id) => {
    let serviceResponse={
        success: true,
        content:{}
    }

    try{
        const user = await UserModel.findById(_id)
            .select("-hashedPassword")
            .exec();

        if(!user){
            serviceResponse={
                success: false,
                content: {
                    error: "User not found"
                }
            }
        }else{
            serviceResponse.content=user;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }

}

service.findOneUsernameEmail= async (username, email) => {
    let serviceResponse ={
        success:true,
        content:{}
    }

    try {
        const user = await UserModel.findOne({
            $or:[{username:username}, {email:email}]
        }).exec();

        if(!user){
            serviceResponse={
                success: false,
                content: {
                    error:"User not found"
                }
            }
        }else {
            serviceResponse.content = user;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.register = async ({username,email,password, name, photo}) => {
    let serviceResponse={
        success:true,
        content:{
            message:"User Registered"
        }
    }

    try {
        const user = new UserModel({username,email,password,name,photo});
        const userSaved = await user.save();
        if(!userSaved){
            serviceResponse={
                success: false,
                content: {
                    error: "User not registered"
                }
            }
        }
        return serviceResponse
    }catch (e) {
        throw e;
    }

}

service.updateById = async (user, contentToUpdate) =>{
    let serviceResponse ={
        success:true,
        content:{
            message: "User Updated wiiii"
        }
    }

    try {
        Object.keys(contentToUpdate).forEach(
            key =>{
                user[key] =contentToUpdate[key];
            }
        );
        const userUpdated = await user.save();
        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    error:"User not updated"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }


}

service.registeredSavedPost = async (user, postID) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Post registered"
        }
    }

    try {
        const alreadyExists=user.savedPosts.some(post =>{
            post.equals(postID)
        });
        if(alreadyExists){
            serviceResponse={
                success: true,
                content: {
                    message: "Post already saved ^^"
                }
            }
            return serviceResponse;
        }

        user.savedPosts.push(postID);
        const userUpdated = await user.save();

        if(!userUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Cannot save post"
                }
            }
        }
        return serviceResponse;

    }catch (e) {
        throw e;
    }
}

module.exports = service;