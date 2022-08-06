import express from "express";
import fs from "fs"
import multer from "multer"
import cors from "cors"
import mongoose from "mongoose";
import {loginValidation, registerValidation, postCreateValidation} from "./validations.js"
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {UserController, PostController} from "./controllers/index.js";
import {getLastTags, updateComments} from "./controllers/PostController.js";
import CommentModel from "./models/Comment.js";
import PostModel from "./models/Post.js";


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads"))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Подключение к БД прошло успешно!")
    })
    .catch((err) => {
        console.log("Ошибка подколючения БД", err)
    });


app.get("/", (req, res) => {
    res.send("hello world!")
});
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/comments", async (req, res) => {
    res.json(await PostModel.find().populate({path: 'comments', model: 'Comment'}));
})
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.patch("/comments/:id", checkAuth, PostController.updateComments)

app.listen(process.env.PORT || 4444, () => {
    console.log("Server started!");
});
