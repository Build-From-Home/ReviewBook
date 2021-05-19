import express from 'express';
// import { authenticationMiddleware } from './authController.js';
import booksCollection from '../models/booksCollection.js'

const router = express.Router();

export const landingPage = router.get('/landing',  (req, res) => {

    const { user_id, name, email, jwtToken } = req.query
    res.locals.JWTTOKEN = jwtToken

    return res.render('authpages/landing')
    // booksCollection.find((err, data) => {
    //     // console.log(data);
    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         return res.render('authpages/landing')
    //     }
    //   }).lean()
  
})
export const guestPage = router.get('/guest', (req, res) => {
    return res.render('guest')
})
export const bookForm = router.get('/bookform',  (req, res, next) => {
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
              authorName:req.body.Autor,    
              language:req.body.Language,
              coverImage:`http://localhost:8080/assets/uploads/${req.files.Image.name}`,
              description:req.body.Description,
              linkToFlipkart:req.body.LinkFlipkart,
              linkToAmazon:req.body.LinkAmazon,
              yearOfPublication:req.body.Year,
              genre:req.body.Genre });

    newbooksCollection.save((err)=>{
      if(err){
        console.log(err);
      }else{
        console.log('data has been saved to database');
        return res.render('authpages/landing')
      }
    })
  
//   booksCollection.find((err, data) => {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(data)
//     }
//   })

  

  })




export const pageRendering = router