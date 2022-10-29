const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
let db = mongoose.connect('#mongolink', { useNewUrlParser: true, useFindAndModify: false } , (err)=> {

    if (err) {
        console.log(err)
    } else {
        console.log('connected to db')
    }
})
