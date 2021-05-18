import express from 'express';
import { authenticationMiddleware } from './authController.js';
const router = express.Router();

export const landingPage = router.get('/landing', authenticationMiddleware, (req, res) => {
    const { user_id, name, email, jwtToken } = req.query
    res.locals.JWTTOKEN = jwtToken
    return res.render('authpages/landing', { user_id, name, email })
})
export const guestPage = router.get('/guest', (req, res) => {
    return res.render('guest')
})
export const bookForm = router.get('/bookform', authenticationMiddleware, (req, res, next) => {
    res.render('authpages/bookform');
});
export const addBook = router.post('/addbook', async (req, res) => {
    // console.log(req.body);
    console.log(req.files.Image)
    let image = req.files.Image
    let imageName = image.name

    image.mv('./assets/uploads/' + imageName, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            return;
        }
    })
    res.render('authpages/landingpage')

})

export const pageRendering = router