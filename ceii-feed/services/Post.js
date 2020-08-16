const PostModel = require('../models/Post')
const service = {};

service.verifyCreateFields = ({
    title,
    description,
    image,
    user
})=>{
    let serviceResponse = {
        success: true,
        content: {
            message:"Post Created Bitch!"
        }
    }
    if(!title){
        serviceResponse={
            success:false,
            content: {
                error: "Title is required"
            }
        }
        return serviceResponse;
    }
    return serviceResponse;
}

service.verifyUpdatedFields = ({title,description,image}) => {
    let serviceResponse = {
        success:true,
        content: {},
    }
    if(!title && !description && !image){
        serviceResponse = {
            success: false,
            content: {
                error: "All fields must be filled"
            }
        }
        return serviceResponse;
    }
    if(title){
        serviceResponse.content.title = title;
    }
    if(description){
        serviceResponse.content.description = description;
    }
    if(image){
        serviceResponse.content.image = image;
    }

    return serviceResponse;
}

service.verifyUserAuthority = (post, user) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"User Authority Verified"
        }
    }

    if(!post.user._id.equals(user._id)){
        serviceResponse={
            success: false,
            content: {
                error: "This post does not belong to you"
            }
        }
    }
    return serviceResponse;
}

service.create = async ({title,description,image}, userID) => {
    let serviceResponse = {
        success: true,
        content: {
            message:"Post Created Bitch!"
        }
    }
    try{
        const post = new PostModel({
            title,
            description,
            image,
            user: userID
        });
        const postSaved = await post.save();

        if(!postSaved){
            serviceResponse={
                success:false,
                content: {
                    error: "Post not created! you dumbAss"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.findOneById = async (_id) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Post Found"
        }
    }

    try{
        const post = await PostModel.findById(_id).populate("user", "username._id").exec();
        if(!post){
            serviceResponse={
                success: false,
                content: {
                    error: "Post not found",
                }
            }
        }else {
            serviceResponse.content = post;
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }
}

service.findAllByUserID = async (userID) => {
    let serviceResponse={
        success: true,
        content:{}
    }

    try {
        const posts = await PostModel.find({user: userID}).populate("user", "username._id").exec();
        serviceResponse.content = posts;
        return serviceResponse;
    }catch (e) {
        throw e
    }
}

service.findAll = async (page, limit) => {
        let serviceResponse = {
        success:true,
        content: {
            message: "putos"
        }
    }

    try{
            const posts = await PostModel.find({},undefined,{
                skip: page * limit,
                limit:limit,
                sort: [{
                    createdAt:-1
                }]
            }).populate("user", "username._id").exec();
            serviceResponse.content = {
                posts,
                count: posts.length,
                page,
                limit
            }

            return serviceResponse;
    }catch (e) {
        console.log(e);
        throw e;
    }
}

service.addLike = async (post) =>{
    let serviceResponse = {
        success: true,
        content:{
            message:"Post Liked",
        }
    };
    try{
        post.likes +=1;
        const postUpdated = await post.save();
        if(!postUpdated){
            serviceResponse={
                success: false,
                content: {
                    message: "Post not Liked!!"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        console.log(e);
        throw e;
    }
}

service.updateOneById = async (post, contentToUpdate) => {
    let serviceResponse = {
        success:true,
        content:{
            message: "Post Updated!"
        }
    }
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(post._id,{
            ...contentToUpdate,
            $push: {
                history: {
                    title:post.title,
                    description:post.description,
                    image:post.image,
                    modifiedAt: new Date()
                }
            }
        });

        if(!updatedPost){
            serviceResponse={
                success: false,
                content: {
                    error: "Post not updated! ):"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        console.log(e.message);
        throw e;
    }
}

service.deleteOneById = async (_id) =>{
    let serviceResponse = {
        success:true,
        content:{
            message:"Post Deleted!!"
        }
    }

    try {
        const postDeleted = await PostModel.findByIdAndDelete(_id).exec();
        if(!postDeleted){
            serviceResponse={
                success: false,
                content: {
                    message: "Post not deleted"
                }
            }
        }
        return serviceResponse;
    }catch (e) {
        throw e;
    }

}

module.exports = service;