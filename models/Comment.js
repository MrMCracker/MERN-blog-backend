import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        text: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Comment", CommentSchema);