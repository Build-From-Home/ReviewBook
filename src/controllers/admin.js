import express from 'express';
import booksCollection from '../models/booksCollection.js'



// This is how you should add documents to collection

// booksCollection.create({ IbnNo: 4, bookTitle: "hello" }, (data, err) => {
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
  console.log(req.files.Image)
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

})

export const admin = router