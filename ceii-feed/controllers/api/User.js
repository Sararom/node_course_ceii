const UserService = require("../../services/User");
const PostService = require("../../services/Post");
const {verifyID} = require("../../utils/MongoUtils")
const controller = {}

controller.getUser = (req,res)=>{
    const {user} = req;
    if(!user) {
        return res.status(404).json({
            error:"User not found"
        })
    }
    return res.status(200).json(user);
}

controller.updateById = async (req, res) =>{
    const {user} = req;

    const verifyField = UserService.verifyUpdatedFields(req.body);
    if(!verifyField.success){
        return res.status(400).json(verifyField.content);
    }
    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }

    try {
        const userUpdated = await UserService.updateById(user,verifyField.content);
        if(!userUpdated.success){
            return res.status(409).json(userUpdated.content);
        }
        return res.status(200).json(userUpdated);
    }catch (e) {
        return res
    }

}

controller.savePost = async (req, res) =>{
    const {postID} = req.body;
     const {user} =req;

     if(!verifyID(postID)){
         return res.status(400).json({
             error:"Error in ID"
         });
     }

     try{
         const postExists = await PostService.findOneById(postID);
         if(!postExists){
             return res.status(400).json(postExists.content);
         }

         const userUpdated = await UserService.registeredSavedPost(user,postID);
         if(!userUpdated.success){
             return res.status(409).json(userUpdated.content);
         }
         return res.status(200).json(userUpdated);

     }catch (e) {
         return res.status(500).json({
             error:"Internal Server Error"
         })
     }
}

controller.getProfile = async (req,res) =>{
    const {_id} = req.params;

    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }

    try {
        const userExists = await UserService.findOneById(_id);
        if(!userExists.success){
            return res.status(404).json(userExists.content);
        }

        const user = userExists.content;
        const posts = await PostService.findAllByUserID(user._id);

        return res.status(200).json({
            ...user._doc,
            savedPosts : undefined,
            validTokens : undefined,
            createdAt: undefined,
            updatedAt:undefined,
            posts: posts.content
        })

    }catch (e) {
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }

}

module.exports = controller;