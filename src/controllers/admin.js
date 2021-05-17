import express from 'express';
import booksCollection from '../models/booksCollection.js'



// This is how you should add documents to collection

// booksCollection.create({ IbnNo: '1', bookTitle: "hello" }, (data, err) => {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(data)
//     }
// })

// This i how you should get doucuments from collection

// booksCollection.find((err, data) => {
//   if (err) {
//       console.log(err)
//   }
//   else {
//       console.log(data)
//   }
// })


const router = express.Router();



export const adminPage = router.get('/', (req, res, next) => {
  res.render('admin/adminPage');
});
export const addProuduct = router.post('/add-product', async (req, res) => {
  // console.log(req.body);
  // console.log(req.body)
  let image = req.files.Image
  let imageName = image.name

  image.mv('./assets/uploads/'+imageName, (err)=>{
    if(err){
      console.log(err);
    }else{
      res.render('admin/adminPage')
      console.log('Image upload successfully');
    }
  })

//   booksCollection.create({ IbnNo: req.body.IBN,
//      bookTitle: req.body.Title,
//       authorName:req.body.Autor,
//       language:req.body.Language,
//       description:req.body.Description,
//       linkToFlipkart:req.body.LinkFlipkart,
//       linkToAmazon:req.body.LinkAmazon,
//       yearOfPublication:req.body.Year,
//       genre:req.body.Genre }, (data, err) => {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(data)
//     }
// })

  const newbooksCollection = new booksCollection(req.body);
  newbooksCollection.save((err)=>{
    if(err){
      console.log(err);
    }else{
      console.log('data has been saved to database');
    }
  })

booksCollection.find((err, data) => {
  if (err) {
      console.log(err)
  }
  else {
      console.log(data)
  }
})
})

//get product details and passing this to frontend

// booksCollection.find({},(err,data)=>{
//   if (err){
//     console.log(err);
//   }else{
//     console.log(data);
//   }
// })






export const admin = router