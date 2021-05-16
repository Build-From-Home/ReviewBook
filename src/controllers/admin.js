import express from 'express';




const router = express.Router();



export const adminPage = router.get('/', async (req, res, next) => {
  res.render('admin/adminPage');
});
export const addProuduct = router.post('/add-product', (req, res) => {
  console.log(req.body);
})

export const admin = router