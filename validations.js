import { body } from "express-validator";


export const loginValidation = [
    body("email", "Не верная форма почты!").isEmail(),
    body("password", "Пароль должен содержать минимум 5 символов!").isLength({ min: 5 }),
];
export const registerValidation = [
    body("email", "Не верная форма почты!").isEmail(),
    body("password", "Пароль должен содержать минимум 5 символов!").isLength({ min: 5 }),
    body("fullName", "Укажите имя!").isLength({ min: 3 }),
    body("avatarUrl", "Не верный URL").optional().isURL(),
];
export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
    body("tags", "Не верный формат тегов").optional().isString(),
    body("imageUrl", "Не верный URL").optional().isString(),
    body("comment", "Не верный комментарий").optional().isLength({min: 1}).isObject(),
];