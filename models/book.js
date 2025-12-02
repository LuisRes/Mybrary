const mongoose = require('mongoose')
const path = require('path')

const coverImagePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    pageCount: {
        type: Number,
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    description:{
        type:String
    },
    coverImageName:{
        type: String,
        required:true
    }
})

bookSchema.virtual('coverImagePathIndex').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImagePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImagePath = coverImagePath