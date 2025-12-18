const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', async function(next){ 
    const count = await Book.countDocuments({author: this.getQuery()._id})
    if(count>0){
        const err = new Error('Cannot delete author: author has books left')
        return next(err)
    }
    next()
})

module.exports = mongoose.model('Author', authorSchema)