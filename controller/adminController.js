const schema = require('../models/adminSchema');
const multer = require('multer');
const path = require('path');

var businessDays = 7,
  counter = 0; // set to 1 to count from next business day
while (businessDays > 0) {
  var tmp = new Date();
  var startDate = new Date();
  tmp.setDate(startDate.getDate() + counter++);
  switch (tmp.getDay()) {
    case 0:
    case 6:
      break; // sunday & saturday
    default:
      businessDays--;
  }
}
var shipDate = tmp.toUTCString().slice(0, 16);

const login = async (req, res) => {
  try {
    let user = await schema.admin_data.findOne({
      $and: [{ userName: req.body.userName }, { password: req.body.password }],
    });
    if (user) {
      res.status(200).json({ userLogin: true }); // login success
    } else {
      res.status(200).json({ userLogin: false }); // invalid  userName or password
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true }); //invalid password
  }
};

const addStudent = async (req, res) => {
  const data = {};
  data.name = req.query.name;
  data.course = req.query.course;
  data.email = req.query.email;
  data.mobile = req.query.mobile;
  try {
    let emailExi = await schema.student_data.findOne({
      email: data.email,
    });
    if (emailExi) {
      res.status(200).json({ emailExi: true });
    } else {
      let mobileExi = await schema.student_data.findOne({
        mobile: data.mobile,
      });
      if (mobileExi) {
        res.status(200).json({ mobileExi: true });
      } else {
        const storage = multer.diskStorage({
          destination: path.join(__dirname, '../public/', 'images'),
          filename: (req, file, cb) => {
            data.imageName = file.originalname + '-' + Date.now();
            cb(null, data.imageName + '.png');
          },
        });

        const upload = multer({ storage: storage }).single('file');

        upload(req, res, (err) => {
          if (!req.file) {
            console.log('no file');
            res.status(200).json({ noFile: true });
          } else {
            schema
              .student_data(data)
              .save()
              .then((result) => {
                res.status(200).json({ posted: true });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getStudents = async (req, res) => {
  try {
    let students = await schema.student_data.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSudent = async (req, res) => {
  console.log(req.query);
  try {
    let students = await schema.student_data.remove({
      _id: req.query.studentId,
    });
    res.status(200).json({ deleted: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addNewBooks = async (req, res) => {
  try {
    const bookExist = await schema.books_data.findOne({
      name: req.body.name,
    });

    if (bookExist) {
      res.status(200).json({ bookExi: true });
    } else {
      req.body.issue = false;
      const books = await schema.books_data(req.body).save();
      res.status(200).json({ posted: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getBooks = async (req, res) => {
  try {
    let books = await schema.books_data.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletebook = async (req, res) => {
  console.log(req.query);
  try {
    let students = await schema.books_data.remove({
      _id: req.query.bookId,
    });
    res.status(200).json({ deleted: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getNotIssuedBooks = async (req, res) => {
  try {
    let books = await schema.books_data.find({
      issue: false,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
};

const issueBook = async (req, res) => {
  console.log(req.body);
  let date = Date.now();

  try {
    const issued = await schema.books_data.updateOne(
      {
        _id: req.body.selectedBook,
      },
      {
        $set: {
          issue: true,
          sutdent: req.body.selectedStudent,
          issuedDate: new Date().toDateString(date),
          returnDate: shipDate,
        },
      }
    );
    res.status(200).json({ issued: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getIssuedBooks = async (req, res) => {
  try {
    let books = await schema.books_data
      .find({
        issue: true,
      })
      .populate({ path: 'sutdent' });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getStudentInfo = async (req, res) => {
  try {
    const student = await schema.student_data.findOne({
      _id: req.query.studentId,
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getBookInfo = async (req, res) => {
  try {
    const book = await schema.books_data.findOne({
      _id: req.query.bookId,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error);
  }
};

const editBookInfo = async (req, res) => {
  try {
    const book = await schema.books_data.updateOne(
      {
        _id: req.body.bookId,
      },
      {
        $set: {
          bookNo: req.body.bookNo,
          name: req.body.name,
          author: req.body.author,
          edition: req.body.edition,
          publisher: req.body.publisher,
        },
      }
    );
    res.status(200).json({ update: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const editStudentInfo = async (req, res) => {
  try {
    const book = await schema.student_data.updateOne(
      {
        _id: req.body.studentId,
      },
      {
        $set: {
          name: req.body.name,
          course: req.body.course,
          email: req.body.email,
          mobile: req.body.mobile,
          imageName: req.body.image,
        },
      }
    );
    res.status(200).json({ update: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const editStudentInfoWithImage = (req, res) => {
  const data = {};
  data.name = req.query.name;
  data.course = req.query.course;
  data.email = req.query.email;
  data.mobile = req.query.mobile;

  const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/', 'images'),
    filename: (req, file, cb) => {
      data.imageName = file.originalname + '-' + Date.now();
      cb(null, data.imageName + '.png');
    },
  });

  const upload = multer({ storage: storage }).single('file');

  upload(req, res, (err) => {
    if (!req.file) {
      console.log('no file');
      res.status(200).json({ noFile: true });
    } else {
      schema.student_data
        .updateOne(
          {
            _id: req.query.studentId,
          },
          {
            $set: {
              name: data.name,
              course: data.course,
              email: data.email,
              mobile: data.mobile,
              imageName: data.imageName,
            },
          }
        )
        .then((result) => {
          res.status(200).json({ update: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
};

module.exports = {
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
};
