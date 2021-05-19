import express from 'express';
const router = express.Router();
import booksCollection from '../models/booksCollection.js'

export const bookApi = router.get('/booksapi', async (req,res)=>{
    booksCollection.find((err, data) => {
        // console.log(data);
        if (err) {
            console.log(err)
        }
        else {
            return res.json({booksData:data})
        }
      })
})

export const frontendApi = router