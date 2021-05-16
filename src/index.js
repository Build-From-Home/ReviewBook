import dotenv from "dotenv";
import express from "express";
import exhbs from "express-handlebars";
import { admin } from "./controllers/admin.js";

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



export const home = app.get("/", async (req, res) => {
    return res.render('home')
});

app.use('/admin', admin);


app.listen(process.env.PORT, () => {
    console.log(`Listening to Port Number:${process.env.PORT}` + " " + `http://localhost:${process.env.PORT}`)
})
