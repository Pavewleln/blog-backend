import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { registerValidator, loginValidator, postCreatValidator } from './validations.js'
import isAuth from './utils/isAuth.js'
import { register, login, getMe } from './controllers/user_controller.js'
import {create, getAll, getOne, remove, update, getLastTags} from './controllers/post_controller.js'
import multer from 'multer'
import handleErrors from './utils/handleErrors.js'
const app = express()
mongoose
    .connect(`mongodb+srv://pavel:werbi_223@cluster0.sv0uaql.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => { console.log("DB ok") })
    .catch((err) => { console.log("DB error", err) })


app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage})

app.get('/auth/me', isAuth, getMe)
app.post('/auth/login', loginValidator, handleErrors, login)
app.post('/auth/register', registerValidator, handleErrors, register)
app.post('/upload', isAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.post('/posts', isAuth, postCreatValidator, handleErrors, create)
app.get('/tags', getLastTags)
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.patch('/posts/:id', isAuth, postCreatValidator, handleErrors, update)
app.delete('/posts/:id', isAuth, remove)
app.listen(3000, (err) => {
    if (err) console.log(err)
    console.log("Server ok")
})