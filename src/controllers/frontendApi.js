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
      }else{
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const frontendApi = router