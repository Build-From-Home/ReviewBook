import express from 'express';
const router = express.Router();
import booksCollection from '../models/booksCollection.js';
import reviewModal from '../models/reviewSchema.js';
import { authenticationMiddleware } from './authController.js';


export const bookApi = router.get('/booksapi', authenticationMiddleware, async (req, res) => {
    console.log("reached booksapi")
    if (req.query.search) {
        console.log('search worked')
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        booksCollection.find({ bookTitle: regex }, (err, data) => {

            console.log(data);

            if (err) {
                console.log(err)
            }
            else {
                return res.json({ booksData: data })

            }
        })
    } else if (req.query.searchLeft) {
        const regex = new RegExp(escapeRegex(req.query.searchLeft), 'gi');
        booksCollection.find({ $or: [{ genre: regex }, { authorName: regex }, { language: regex }] }, (err, data) => {
            console.log(data);

            if (err) {
                console.log(err)
            }
            else {
                return res.json({ booksData: data })

            }
        })

    }

    else {
        booksCollection.find((err, data) => {
            //  console.log(data);
            if (err) {
                console.log(err)
            }
            else {
                return res.json({ booksData: data })

            }
        })
    }


})
export const bookRating = router.post('/rating', authenticationMiddleware, async (req, res) => {
    console.log("reached bookrating endpoint")
    console.log(req.body)
    reviewModal.findOne({ email: req.body.email }, (err, data) => {
        if (data) {
            data.starRating = req.body.rating,
                data.save()
        }
        else {
            console.log(err)
            const review = new reviewModal({
                bookid: req.body.id,
                user: req.body.name,
                email: req.body.email,
                starRating: req.body.rating
            })
            review.save()
        }
    })
})
export const bookComment = router.post('/comment', authenticationMiddleware, async (req, res) => {
    console.log("reached book comment api")
    console.log(req.body)
    reviewModal.findOne({ email: req.body.email }, (err, data) => {
        if (data) {
            data.comment = req.body.comment,
                data.save()
        }
        else {
            console.log(err)
            const review = new reviewModal({
                bookid: req.body.id,
                user: req.body.name,
                email: req.body.email,
                comment: req.body.comment
            })
            review.save()
        }
    })
})

export const noAuthBooks = router.get('/noauthbooks', authenticationMiddleware, async (req, res) => {
    console.log(req.query.search)
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    booksCollection.find({ $or: [{ bookTitle: regex }, { genre: regex }, { authorName: regex }, { language: regex }] }, (err, data) => {

        console.log(data);

        if (err) {
            console.log(err)
        }
        else {
            return res.json({ booksData: data })

        }
    })
})

function escapeRegex(text) {
    return text.replace('/[-[\]{}()*+?.,\\^$|#\s]/g', "\\$&");
};

export const frontendApi = router