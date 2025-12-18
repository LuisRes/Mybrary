const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//GET ALL authors
router.get('/', async (req, res) => {
    let search = {}
    if(req.query.name !== null && req.query.name !== ''){
        search.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(search)
        res.render('authors/index', {
            authors: authors,
            search: req.query
        })
    }catch{
        //404
        res.redirect('/')
    }
})

//GET NEW Author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//GET SINGLE Author
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        if(!author){
            return res.redirect('/')
        }
        const books = await Book.find({ author: req.params.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksBy: books
        })
    }catch(err){
        res.redirect('/')
    }
})

//GET EDIT Author
router.get('/:id/edit', async(req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    }catch{
        res.redirect('/authors')
    }
})

//POST Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    }catch(err){
        console.log(err)
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
})

//PUT Author
router.put('/:id', async (req, res) => {
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch{
        if(author == null){
            //404
            res.redirect('/')
        }else{
            res.render(`authors/edit`, {
                author: author,
                errorMessage: 'Error Updating Author'
            })
        }
    }
})

//DELETE Author
router.delete('/:id', async (req, res) => {
    let author
    try{
        author = await Author.findById(req.params.id)
        await Author.deleteOne({ _id: author.id})
        res.redirect(`/authors`)
    }catch(err){
        if(author == null){
            //404
            res.redirect('/')
        }else{
            res.render('authors/show',{
                author: author,
                booksBy: await Book.find({ author: author.id }).limit(6).exec(),
                errorMessage: err.message
            })
        }
    }
})

module.exports = router