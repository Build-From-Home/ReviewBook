import express from 'express';
import { authenticationMiddleware } from './authController.js';
import booksCollection from '../models/booksCollection.js';
import reviewModal from '../models/reviewSchema.js';
import mongoose from 'mongoose';
import { basePath } from '../utils/config.js';

mongoose.set('useFindAndModify', false);
const router = express.Router();

export const landingPage = router.get('/landing', authenticationMiddleware, (req, res) => {
  console.log("returned to landing page")
  const { user_id, name, email, jwtToken } = req.query
  res.locals.JWTTOKEN = jwtToken
  return res.render('authpages/landing', { user_id: user_id, name: name, email: email })
})
export const bookpage = router.get('/book', authenticationMiddleware, async (req, res) => {
  console.log("at book endpoint")
  const { bookid } = req.query
  console.log(bookid)
  var booksData = {}
  await reviewModal.find({ bookid: bookid }, (err, reviews) => {
    if (!reviews.length === 0) {
      console.log("reached here because of review collection")
      booksData.reviews = reviews
      //booksData.reviews = reviews.map(review => review.toJSON())
      const starReviews = reviews.filter(review => review.starRating)
      console.log(starReviews)
      var sumOfRatings = 0
      if (!starReviews.length === 0) {
        console.log("reached here because of starreviews in reviews collections")
        starReviews.forEach((starReview) => {
          sumOfRatings = sumOfRatings + starReview.starRating
        })
        console.log(sumOfRatings)
        booksCollection.findById({ _id: mongoose.Types.ObjectId(bookid) }, (err, book) => {
          if (book) {
            book.averageRating = sumOfRatings / starReviews.length
            booksCollection.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(bookid) }, book, (err, book) => {
              if (book) {
                booksData.book = book
                console.log("this is going to happen if ")
                console.log(booksData)
                return res.render('authpages/book', { book: booksData.book, reviews: booksData.reviews })
              }
              else {
                console.log(err)
              }
            }).lean()
          }
          else {
            console.log(err)
          }
        }).lean()
      }
      else {
        console.log("reached here beacause of no star ratings in review collection")
        booksCollection.findById({ _id: mongoose.Types.ObjectId(bookid) }, (err, book) => {
          if (book) {
            book.averageRating = 0;
            booksCollection.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(bookid) }, book, (err, book) => {
              if (book) {
                booksData.book = book
                console.log(booksData)
                return res.render('authpages/book', { book: booksData.book, reviews: booksData.reviews })
              }
              else {
                console.log(err)
              }
            }).lean()
          }
          else {
            console.log(err)
          }
        }).lean()
      }
    }
    else {
      console.log("reached this part because of no rating or comments")
      console.log(err)
      booksData.reviews = []
      booksCollection.findById({ _id: mongoose.Types.ObjectId(bookid) }, (err, book) => {
        if (book) {
          booksData.book = book
          console.log()
          return res.render('authpages/book', { book: booksData.book, reviews: booksData.reviews })
        }
        else {
          console.log(err);
          return res.status(404).send('Internal server error')
        }
      }).lean()
    }
  }).lean()
})
export const guestPage = router.get('/guest', (req, res) => {
  res.locals.JWTTOKEN = ""
  return res.render('guest')
})
export const noAuthPage = router.get('/guestlanding', (req, res) => {
  const search = req.query.search
  return res.render('guestLanding', { search })
})
export const bookForm = router.get('/bookform', authenticationMiddleware, (req, res, next) => {
  const { name, email, jwtToken } = req.query
  res.locals.JWTTOKEN = jwtToken
  return res.render('authpages/bookform', { name: name, email: email });
});
export const addBook = router.post('/addbook', authenticationMiddleware, async (req, res) => {
  const { name, email, jwtToken } = req.query
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
  const newbooksCollection = new booksCollection({
    IbnNo: req.body.IBN,
    bookTitle: req.body.Title,
    authorName: req.body.Autor,
    language: req.body.Language,
    coverImage: `${basePath}/assets/uploads/${req.files.Image.name}`,
    description: req.body.Description,
    linkToFlipkart: req.body.LinkFlipkart,
    linkToAmazon: req.body.LinkAmazon,
    yearOfPublication: req.body.Year,
    genre: req.body.Genre
  });

  newbooksCollection.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('data has been saved to database');
    }
    return res.render('authpages/landing', { name: name, email: email })
  })
})




export const pageRendering = router