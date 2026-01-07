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
    renderPage(res, new Book(), 'new')
})

//GET SINGLE Book
router.get('/:id', async (req, res) => {
    try{
        const book = await Book.findOne({ _id: req.params.id }).populate('author').exec()
        if(!book){
            return res.redirect('/')
        }
        if(!book.author){
            await Book.deleteOne({ _id: book.id })
            res.redirect('/books')
        }
        res.render('books/show', { book: book })
    }catch{
        res.redirect('/')
    }
})

//Edit Book
router.get('/:id/edit', async(req, res) => {
    try{
        const book = await Book.findById(req.params.id)
        renderPage(res, book, 'edit')
    }catch{
        res.redirect('/')
    }
})

//POST Book
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
        res.redirect(`books/${newBook.id}`)
    }catch{
        renderPage(res, book, 'new', true)
    }
})

//PUT Book
router.put('/:id', async (req, res) => {
    let book
    try{
        book = await Book.findById(req.params.id)
        book.author = req.body.author
        book.title = req.body.title
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch{
        if(book != null){
            renderPage(res, book, 'edit', true)
        }else{
            res.redirect('/')
        }
    }
})

//DELETE Book
router.delete('/:id', async (req, res) => {
    let book
    try{
        book = await Book.findByIdAndDelete(req.params.id)
        res.redirect('/books')
    }catch(err){
        if(book == null){
            res.redirect('/')
        }else{
            res.render('books/show', {
                book: book,
                errorMessage: 'Error removing book'
            })
        }
    }
})

async function renderPage(res, book, form, error = false){
    try{
        const authors = await Author.find({})
        const params = {            
            authors: authors,
            book: book
        }
        if(error){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating Book'
            }else if(form === 'new'){
                params.errorMessage = 'Error Creating Book'
            }else{
                params.errorMessage = 'Error Routing Book'
            }
        } 
        res.render(`books/${form}`, params)
    }catch{
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded){
    if (coverEncoded == null || coverEncoded == '') return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router