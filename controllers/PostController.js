import PostModel from "../models/Post.js";
import {validationResult} from "express-validator";
import post from "../models/Post.js";
import CommentModel from "../models/Comment.js";
import comment from "../models/Comment.js";


export const updateComments = async (req, res) => {
    console.log(req.body)
    const doc = new CommentModel({
        text: req.body.comment.text,
        user: req.userId
    })
    doc.save()
    let data = await PostModel.findOne({_id: req.params.id})
    data.comments.push(doc._id)

    await PostModel.updateOne(
        {
            _id: req.params.id
        },
        {"$set": {comments: data.comments}}
    )
    const newData = await PostModel.findOne({_id: req.params.id}).populate({
        path: 'comments',
        model: 'Comment',
        populate: "user"
    }).populate("user");
    res.json(newData)
}
export const update = async (req, res) => {
    try {
        await PostModel.updateOne(
            {
                _id: req.params.id
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(","),
                user: req.userId,
            }
        )
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить статью"
        });
    }
}

export const remove = (req, res) => {
    try {
        PostModel.findOneAndRemove(
            {
                _id: req.params.id
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: "Не удалось удалить статью"
                    });
                }
                if (!doc) {
                    return res.status(500).json({
                        message: "Не удалось найти статью"
                    });
                }
                res.json({
                    success: true
                })
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не удалось удалить статью"
        });
    }
}

export const getOne = (req, res) => {
    try {

        PostModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: "after"
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось найти статью"
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    });
                }
                res.json(doc);
            }
        ).populate({path: 'comments', model: 'Comment', populate: "user"}).populate("user");
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось найти статью"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const last = posts.length - 1
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить тэги"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").populate({path: 'comments', model: 'Comment', populate: {path: "user"}}).exec();
        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId,
        });
        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}