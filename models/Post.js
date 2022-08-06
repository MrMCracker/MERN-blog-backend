import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        text: {
            type: String,
            require: true
        },
        tags: {
            type: Array,
            default: []
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        comments: {
            type: Array,
            ref: 'Comment'
        },
        imageUrl: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Post", PostSchema);