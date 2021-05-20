import express from 'express';
const router = express.Router();
import booksCollection from '../models/booksCollection.js'

export const bookApi = router.get('/booksapi', async (req,res)=>{
    
    if(req.query.search){
        console.log('search worked')
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        booksCollection.find({bookTitle:regex}, (err, data) => {

              console.log(data);

              if (err) {
                  console.log(err)
              }
              else {
                return res.json({booksData:data})
                
              }
            })
      }else if(req.query.searchLeft){
        const regex = new RegExp(escapeRegex(req.query.searchLeft), 'gi');
        booksCollection.find({$or:[{genre:regex},{authorName: regex},{language: regex}]}, (err, data) => {

              console.log(data);

              if (err) {
                  console.log(err)
              }
              else {
                return res.json({booksData:data})
                
              }
            })

      }
      
      else{
        booksCollection.find((err, data) => {
            //  console.log(data);
            if (err) {
                console.log(err)
            }
            else {
                return res.json({booksData:data})
              
            }
          })
      }

    
})

export const noAuthBooks = router.get('/noauthbooks', async (req, res) => {
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
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const frontendApi = router