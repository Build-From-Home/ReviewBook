import express from 'express';
const router = express.Router();

export const bookApi = router.get('/booksapi', async (req,res)=>{
    booksCollection.find((err, data) => {
        // console.log(data);
        if (err) {
            console.log(err)
        }
        else {
            return res.data = data
        }
      })
})

export const frontendApi = router