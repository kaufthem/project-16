var express = require('express');
var router = express.Router();
const Book = require("../models").Book;

//Redirect to books
router.get('/', function(req, res, next) {
  res.redirect('books');
});

//Books page
router.get('/books', (req,res) => {   
  Book.findAll().then(function(books) {  
    res.render('index', {title: "Books", books: books});
  });
});

//New book page
router.get('/books/new', (req,res) => {
  res.render('new-book', {book: Book.build(), title: "New Book"});
});

//Update book page
router.get('/books/:id', (req,res) => {
  Book.findByPk(req.params.id).then(function(book){
    res.render('update-book', {title: "Update Book", book: book});
  });
});

//Handles new book
router.post('/books/new', function(req,res) {
  Book.create(req.body).then(function(){     
    res.redirect("/");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render('new-book', {
        book: Book.build(req.body),
        title: "New Book", 
        error: err.errors
      });
    } else {
      throw err;
    }
  });
});

//Handles book update
router.post('/books/:id', (req,res) => {
  Book.findByPk(req.params.id).then(function(book){
    return book.update(req.body);
  }).then(function(){
    res.redirect("/");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      let book = Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {
        book: book,
        title: "Update Book", 
        error: err.errors
      });
    } else {
      throw err;
    }
  });
});

//Handles book delete
router.post('/books/:id/delete', (req,res) => {
  Book.findByPk(req.params.id).then(function(book){
    if (book) return book.destroy();
  }).then(function() {
    res.redirect('/');
  });
});

module.exports = router;