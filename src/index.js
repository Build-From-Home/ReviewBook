import dotenv from "dotenv";
import express from "express";
import exhbs from "express-handlebars";
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload'
import { authController } from "./controllers/authController.js";
import { pageRendering } from "./controllers/pageRendering.js";
import { frontendApi } from "./controllers/frontendApi.js";


const STATIC_PATH = "assets";
const app = express();
dotenv.config()
app.engine(
    "handlebars",
    exhbs.create({
        partialsDir: 'views/partials',
    }).engine);
app.set("view engine", "handlebars");

app.use(express.json())
app.use(fileUpload())

app.use(`/${STATIC_PATH}`, express.static('assets'));

//da replace myname with your name in url (thushar)

const connectionUrl = 'mongodb://thushar:reviewbooks123@cluster0-shard-00-00.vsqjt.mongodb.net:27017,cluster0-shard-00-01.vsqjt.mongodb.net:27017,cluster0-shard-00-02.vsqjt.mongodb.net:27017/ReviewBooksDB?ssl=true&replicaSet=atlas-171udk-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("Connection Sucessfull")
})
    .catch((err) => {
        console.log(err)
    })
export const home = app.get("/", async (req, res) => {  
    return res.render('guest')
});


app.use('/auth', authController);
app.use('/pages', pageRendering);
app.use('/api',frontendApi);

app.listen(process.env.PORT, () => {
    console.log(`Listening to Port Number:${process.env.PORT}` + " " + `http://localhost:${process.env.PORT}`)
})


