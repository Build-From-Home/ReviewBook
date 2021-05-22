import express from 'express';
import { authenticationMiddleware } from './authController.js';
import booksCollection from '../models/booksCollection.js';
import reviewModal from '../models/reviewSchema.js';
import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false);
const router = express.Router();

export const landingPage = router.get('/landing', authenticationMiddleware, (req, res) => {
  console.log("returned to landing page")
  const { user_id, name, email, jwtToken } = req.query
  res.locals.JWTTOKEN = jwtToken
  return res.render('authpages/landing', { user_id: user_id, name: name, email: email })
})
export const bookpage = router.get('/book', async (req, res) => {
  console.log("at book endpoint")
  const { bookid } = req.query
  console.log(bookid)
  var booksData = {}
  await reviewModal.find({ bookid: bookid }, (err, reviews) => {
    if (reviews) {
      booksData.reviews = reviews
      //booksData.reviews = reviews.map(review => review.toJSON())
      const starReviews = reviews.filter(review => review.starRating)
      console.log(starReviews)
      var sumOfRatings = 0
      if (starReviews) {
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
                console.log("going to render book page")
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
        booksCollection.findById({ _id: mongoose.Types.ObjectId(bookid) }, (err, book) => {
          if (book) {
            book.averageRating = 0;
            booksCollection.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(bookid) }, book, (err, book) => {
              if (book) {
                booksData.book = book
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
      console.log(err)
      booksData.reviews = []
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
export const bookForm = router.get('/bookform', (req, res, next) => {
  res.render('authpages/bookform');
});
export const addBook = router.post('/addbook', async (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image)
  let image = req.files.Image
  // console.log(image);
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
    coverImage: `http://localhost:8080/assets/uploads/${req.files.Image.name}`,
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
      return res.render('authpages/landing')
    }
  })
})




export const pageRendering = router