const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//GET all authors
router.get('/', async (req, res) => {
    let search = {}
    if(req.query.name !== null && req.query.name !== ' '){
        search.name = new RegExp(req.query.name, 'i')
    }
    try{
        const allAuthors = await Author.find(search)
        res.render('authors/index', {
            authors: allAuthors,
            search: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//New Author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    console.log(author.name)
    try{
        const newAuthor = await author.save()
        res.redirect('authors')
        //res.redirect(`authors/${newAuthor.id}`)
    }catch(err){
        console.log(err)
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }

})

module.exports = router