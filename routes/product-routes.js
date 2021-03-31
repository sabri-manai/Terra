const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const User = require('../models/User')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
      moment().format();
const multer = require("multer")




      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/images')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + '.png') 
        }
      })
      
      var upload = multer({ storage: storage })

// Get products
router.get('/addProduct',isAuthenticated, (req,res)=> {

    res.render('product/addProduct', {
        success: req.flash('success')
    })
    })

// Add product 
router.post('/createProduct', [
    check('productName').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('productDescription').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('productId').isLength({min: 1}).withMessage('Please enter the product Id'),

] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/products/addProduct')
    } else {
        
        let newProduct = new Product({
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            productId: req.body.productId,

            created_at: Date.now()
        })

        newProduct.save( (err)=> {
            if(!err) {
                console.log('product added successfully')
                req.flash('info', ' The product was created successfuly')
                res.redirect('/products/ViewProduct')
            } else {
                console.log(err)
            } 
        })
    } 
})
//add product pic
router.post('/uploadProductPic', upload.single('productPic'), (req,res)=> {
    
    let newFields = {
        productPic: req.file.filename
    }
    let query = {_id: req.body.id}

    Product.updateOne(query, newfeilds, (err)=> {
        if(!err) {
            req.flash('info', " Product added successfuly"),
            res.redirect('/products/ViewProduct/' + req.body.id)
        } else {
            console.log(err)
        }
    })
})
// Get Edit product picture

// router.get('/productPic/:id',isAuthenticated, (req,res)=> {
//     Product.findOne({_id: req.params.id}, (err,product)=> {
        
//         if(!err) {
//     res.render('product/productPic', {
//         success: req.flash('success')
//     })
// } else {
//     console.log(err)
// }
// })
// })



// View product

router.get('/viewProduct', (req,res)=> {

    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            return   res.render('product/viewProduct',{products:allProducts});
        }
     });

 });

 //show product

router.get('/showProduct/:id', (req,res)=> {
    Product.findOne({_id: req.params.id}, (err,product)=> {
        
       if(!err) {
           
        res.render('product/showProduct', {
            product: product
                                    })
                }
        else {
           console.log(err)
             }   
                                                            }) 
})

// Get edit product page

router.get('/editProduct/:id', isAuthenticated,(req,res)=> {

    Product.findOne({_id: req.params.id}, (err,product)=> {
        
        if(!err) {
       
         res.render('product/editProduct', {
             product: product,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

//post edit product

router.post('/updateProduct',[
    check('productName').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('productDescription').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('productId').isLength({min: 1}).withMessage('Please enter the product Id'),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/articles/edit/' + req.body.id)
    } else {
       // update obj
       let newfeilds = {
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        price: req.body.price,
        productId: req.body.productId,
        created_at: Date.now()
       }
       let query = {_id: req.body.id}

       Product.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The product was updated successfuly"),
               res.redirect('/products/editProduct/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})


// Delete article



router.get('/delete/:id', isAuthenticated, (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/products/ViewProduct');
        }
        else { console.log('Error in product delete :' + err); }
    });
});


    module.exports = router