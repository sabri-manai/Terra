const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
let db = mongoose.connect('mongodb+srv://Terra:Terra1231234!@cluster0.9ccju.mongodb.net/test',{ useNewUrlParser: true, useFindAndModify: false } , (err)=> {

    if (err) {
        console.log(err)
    } else {
        console.log('connected to db')
    }
})
