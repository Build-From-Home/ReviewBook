import dotenv from "dotenv";
import express from "express";
import exhbs from "express-handlebars";
import { admin } from "./controllers/admin.js";
import mongoose from 'mongoose';
import booksCollection from "./models/booksCollection.js";


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

app.use(`/${STATIC_PATH}`, express.static('assets'));

//da replace myname with your name in url (thushar)

const connectionUrl = 'mongodb://akash:reviewbooks123@cluster0-shard-00-00.vsqjt.mongodb.net:27017,cluster0-shard-00-01.vsqjt.mongodb.net:27017,cluster0-shard-00-02.vsqjt.mongodb.net:27017/ReviewBooksDB?ssl=true&replicaSet=atlas-171udk-shard-0&authSource=admin&retryWrites=true&w=majority'
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
booksCollection.find((err, data) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log(data)
    }
})
export const home = app.get("/", async (req, res) => {
    return res.render('home')
});

app.use('/admin', admin);


app.listen(process.env.PORT, () => {
    console.log(`Listening to Port Number:${process.env.PORT}` + " " + `http://localhost:${process.env.PORT}`)
})
