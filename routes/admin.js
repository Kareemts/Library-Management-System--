var express = require('express');
const {
  login,
  addStudent,
  getStudents,
  deleteSudent,
  addNewBooks,
  getBooks,
  deletebook,
  getNotIssuedBooks,
  issueBook,
  getIssuedBooks,
  getStudentInfo,
  getBookInfo,
  editBookInfo,
  editStudentInfo,
  editStudentInfoWithImage,
} = require('../controller/adminController');
var router = express.Router();

/* router for admin login. */
router.post('/login', login);

/* router for adding new student  */
router.post('/addStudent', addStudent);

/* router for getting  students. */
router.get('/getStudents', getStudents);

/* router for deleting students. */
router.delete('/deleteSudent', deleteSudent);

/* router for adding new books  */
router.post('/addNewBooks', addNewBooks);

/* router for getting  books. */
router.get('/getBooks', getBooks);

/* router for deleting book. */
router.delete('/deletebook', deletebook);

/* router for getting  not issued books. */
router.get('/getNotIssuedBooks', getNotIssuedBooks);

/* router for issuing  new books  */
router.post('/issueBook', issueBook);

/* router for getting   issued books. */
router.get('/getIssuedBooks', getIssuedBooks);

/* router for getting student info. */
router.get('/getStudentInfo', getStudentInfo);

/* router for getting book info */
router.get('/getBookInfo', getBookInfo);

/* router for updating book info */
router.put('/editBookInfo', editBookInfo);

/* router for updating student  info */
router.put('/editStudentInfo', editStudentInfo);

router.put('/editStudentInfoWithImage', editStudentInfoWithImage);

module.exports = router;
