const router = require("express").Router();

const Book = require("../models/Book.model.js"); // <== add this line before your routes
//Create
router.get("/books/create", (req, res) => res.render("books/book-create.hbs"));

router.post("/books/create", (req, res, next) => {
  //console.log(req.body);
  const { title, author, description, rating } = req.body;
  Book.create({ title, author, description, rating })
    .then((bookFromDB) =>
      //console.log(`New book created: ${bookFromDB.title}.`
      res.redirect("/books")
    )
    .catch((error) => next(error));
});

//Read GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
  Book.find()
    .then((allTheBooksFromDB) => {
      // -> allTheBooksFromDB is a placeholder, it can be any word
      console.log("Retrieved books from DB:", allTheBooksFromDB);

      // we call the render method after we obtain the books data from the database -> allTheBooksFromDB
      res.render("books/books-list.hbs", { books: allTheBooksFromDB }); // pass `allTheBooksFromDB` to the view (as a variable books to be used in the HBS)
    })
    .catch((error) => {
      console.log("Error while getting the books from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

router.get("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  console.log("The ID from the URL is: ", bookId);
  Book.findById(bookId).then((theBook) =>
    res.render("books/books-details.hbs", { book: theBook })
  );
});

//update
router.get("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .then((bookToEdit) => {
      // console.log(bookToEdit);
      res.render("books/books-edit.hbs", { book: bookToEdit }); // <-- add this line
    })
    .catch((error) => next(error));
});

router.post("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { title, description, author, rating },
    { new: true }
  )
    .then((updatedBook) => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
    .catch((error) => next(error));
});

router.post("/books/:bookId/delete", (req, res, next) => {
  const { bookId } = req.params;

  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect("/books"))
    .catch((error) => next(error));
});

module.exports = router;
