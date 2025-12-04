const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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
router.post('/', async (req, res) => {
    const book = new Book({
        author: req.body.author,
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('/books')
    }catch{
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

function saveCover(book, coverEncoded){
    console.log('?')
    if (coverEncoded == null || coverEncoded == '') return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router