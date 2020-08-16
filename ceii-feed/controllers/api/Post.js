const PostService = require("../../services/Post");
const UserService = require("../../services/User");
const {verifyID} = require ("../../utils/MongoUtils")
const {verifyTypeNumber} = require("../../utils/MiscUtils");
const controller={};
const debug = require("debug")("log");

controller.create= async (req, res)=>{
    const{body}=req;
    const fieldsValidation=PostService.verifyCreateFields(body);

    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }

    try{
        const { user } = req;
        const createPost = await PostService.create(req.body,user._id);
        if(!createPost.success){
            return res.status(409).json(createPost.content);
        }
        return res.status(201).json(createPost.content);
    }catch(error){
        return res.status(500).json({error: "Internal Server Error"});
    }
};

controller.finOneById = async (req, res) =>{
    const {_id} = req.params;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID"
        });
    }
    try{
        const postExists = await PostService.findOneById(_id);
        if(!postExists.succes){
            return res.status(404).json(postExists.content);
        }
        return res.status(200).json(postExists.content);
    }catch (e) {
        return res.status(500).json({error: "Internal Server error"});
    }
};

controller.findAllByUser = async (req, res) => {
    const {id = req.user._id} = req.query;

    if(!verifyID(id)){
        return res.status(400).json({
            error: "Error in ID"
        });
    }

    try{
        const userExists = await UserService.findOneById(id);
        if(!userExists){
            return res.status(404).json(userExists.content);
        }

        const postsByUser = await PostService.findAllByUserID(id);
        return res.status(200).json(postsByUser.content);

    }catch (e) {
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

controller.findAll = async (req,res) => {
    const {page =0, limit=10} = req.query;

    debug("Hola soy un usuario" + req.user);

    if(!verifyTypeNumber(page,limit)){
        return res.status(400).json({
            error: "Te equivocaste en la query pto",
        })
    }

    try {
        const postsResponse = await PostService.findAll(parseInt(page), parseInt(limit));
        res.status(200).json(postsResponse.content);
    } catch(e){
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

};

controller.addLike = async (req, res) =>{
    const {_id} = req.body;

    if(!verifyID(_id)){
        return res.status(400).json(
            {error: "Error in ID"}
        )
    }
    try{
        const postExist = await PostService.findOneById(_id);
        if(!postExist){
            return res.status(404).json(postExist.content);
        }
        const likedAdded = await PostService.addLike(postExist.content);
        if(!likedAdded){
            return res.status(409).json(likedAdded.content);
        }
        return res.status(200).json(likedAdded.content);
    }catch (e) {
        return res.status(500).json({error:"Internal server error"});

    }

};

controller.updatePost = async (req,res) => {
    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID"
        })
    }
    const fieldVerified = PostService.verifyUpdatedFields(req.body);
    debug(fieldVerified);
    if(fieldVerified){
        return res.status(400).json(fieldVerified.content);
    }

    try {
        const postExists = await PostService.findOneById(_id);
        if(!postExists.success){
            return res.status(404).json(postExists.content);
        }

        const {user} = req;
        const myPost = PostService.verifyUserAuthority(postExists.content, user);

        if(!myPost.success){
            return res.status(401).json(myPost.content);
        }

        const postUpdated = await PostService.updateOneById(
            postExists.content,
            fieldVerified.content
        )

        if(!postUpdated.success){
            return res.status(409).json(
                postUpdated.content
            )
        }

        return res.status(200).json(postUpdated.content);

    }catch (e) {
        return res.status(500).json({
           error:"Internal server error"
        });
    }

};

controller.deleteOneByID = async (req,res) =>{
    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID"
        })
    }

    try {
        const postExists = await PostService.findOneById(_id);
        if(!postExists.success){
            return res.status(404).json(postExists.content);
        }

        const {user} = req;
        const myPost = PostService.verifyUserAuthority(postExists.content, user);

        if(!myPost.success){
            return res.status(401).json(myPost.content);
        }

        const deleted = await PostService.deleteOneById(_id);
        if(!deleted.success){
            return res.status(409).json(deleted.content);
        }
        res.status(200).json(deleted.content);
    }catch (e) {
        return res.status(500).json({
            error: "Internal Server Error",
        })
    }

};

module.exports = controller;