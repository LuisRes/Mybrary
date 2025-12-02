const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImagePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//GET all books
router.get('/', async (req, res) => {
    let query = Book.find({})
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.mte('publishDate', publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            search: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//New Book
router.get('/new', async (req, res) => {
    renderPage(res, new Book())
})

//Create Book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        author: req.body.author,
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    })
    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('/books')
    }catch{
        if(filename != null) removeCover(fileName)
        renderPage(res, book, true)
    }
})

async function renderPage(res, book, error = false){
    try{
        const authors = await Author.find({})
        const params = {            
            authors: authors,
            book: book
        }
        if (error) params.errorMessage = 'Error Creating Books'
        res.render('books/new', params)
    }catch{
        res.redirect('/books')
    }
}

async function removeCover(imageName){
    fs.unlink(path.join(uploadPath, imageName), err =>{
        if(err) console.error(err)
    })
}

module.exports = router