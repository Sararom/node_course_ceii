const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image: String,
    likes:{
        type: Number,
        default:0
    },
    history: {
      type:[{
          title:String,
          description: String,
          image: String,
          modifiedAt: Date
      }],
        default:[]
    },
    user: {
        type:String,
        required: true
    }
}, {
    timestamps:true
});

module.exports = mongoose.model("Post", PostSchema);