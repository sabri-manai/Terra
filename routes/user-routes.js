const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Event = require('../models/Event')

const passport = require('passport')
const multer = require("multer")
const { check, validationResult } = require('express-validator/check')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png') 
    }
  })
  
  var upload = multer({ storage: storage })


isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}
//  login user view 
router.get('/login', (req,res)=> {
    res.render('user/login', {
        error: req.flash('error')
    })
})

router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/login',
      failureFlash: true })
      )


router.get('/signup', isAuthenticated ,(req,res)=> {
    if(req.user.isAuthor()){

    res.render('user/signup', {
        error: req.flash('error')
    })
} else{
    res.sendStatus(403) // Forbidden
}
})


router.post('/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/signup',
      failureFlash: true })
      )




    

router.get('/edit',isAuthenticated, (req,res)=> {

    res.render('user/edit', {
        success: req.flash('success')
    })
    })

    router.get('/userInfo',isAuthenticated, (req,res)=> {

        User.find({}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
               res.render('user/userInfo',{users:allUsers});
            }
         });
         var noMatch = null;
         if(req.query.search) {
             const regex = new RegExp(escapeRegex(req.query.search), 'gi');
             // Get all Users from DB
             User.find({firstName: regex}, function(err, allUsers){
                if(err){
                    console.log(err);
                } else {
                   if(allUsers.length < 1) {
                       noMatch = "No users match that query, please try again.";
                   }
                   res.render("user/userInfo",{users:allUsers, noMatch: noMatch});
                }
             });
         } else {
             // Get all Users from DB
             User.find({}, function(err, allUsers){
                if(err){
                    console.log(err);
                } else {
                   res.render("user/userInfo",{users:allUsers, noMatch: noMatch});
                }
             });
         }
     });

 


    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
  





router.post('/uploadAvatar', upload.single('avatar'), (req,res)=> {
    
    let newFields = {
        avatar: req.file.filename
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/profile')
        }

    } )
})

router.post('/edit', (req,res)=> {
    
    let newFields = {
        sport: req.body.sport,
        location: req.body.location,
        mobile: req.body.mobile,
        city: req.body.city,

    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/profile')
        }

    } )
})




router.get('/showUser/:id/:pageNo?', (req,res)=> {   


    User.findOne({_id: req.params.id}, (err, user)=> {
        
let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }
    let totalDocs = 0 

    Event.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Event.find({},{},q, (err,events)=> {
                 let chunk = []
                 let chunkSize = 3
                 for (let i =0 ; i < events.length ; i+=chunkSize) {
                     chunk.push(events.slice( i, chunkSize + i))
                 }
                  res.render('user/showUser', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             })
    })



       if(!err) {
        Event.find() 
        .then ((docs) => {
    
    
     res.render('user/showUser', {
         errors: req.flash('errors'),
         event: docs,
         user: user,
         
         chunk : chunk,
         message: req.flash('info'),
         total: parseInt(totalDocs),
         pageNo: pageNo
    
     });
    }).catch(err => console.log('Error in retriving games list'));
           
        // res.render('user/showUser', {
        //     user: user
        // })

       } else {
           console.log(err)
       }
    })  
})



router.get('/profile/:pageNo?', isAuthenticated, (req,res)=> {  
    


    let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }
    let totalDocs = 0 

    Event.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Event.find({},{},q, (err,events)=> {
                 let chunk = []
                 let chunkSize = 3
                 for (let i =0 ; i < events.length ; i+=chunkSize) {
                     chunk.push(events.slice( i, chunkSize + i))
                 }
                  res.render('user/profile', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             })
    })

  
})







router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/users/login');
})


module.exports = router