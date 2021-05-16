var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/add-products');
});
router.post('/add-product', (req,res)=>{
  console.log(req.body);
})
module.exports = router;
