const mongoose = require('mongoose');
const collection = require('../collections/collectios');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const admin_Schema = new mongoose.Schema({
  userName: String,
  password: String,
});
const admin_data = mongoose.model(collection.ADMIN_COLLECTION, admin_Schema);

const student_Schema = new mongoose.Schema({
  name: String,
  course: String,
  email: String,
  mobile: String,
  imageName: String,
});
const student_data = mongoose.model(
  collection.STUDENTS_COLLECTION,
  student_Schema
);

const books_Schema = new mongoose.Schema({
  name: String,
  bookNo: String,
  author: String,
  edition: String,
  publisher: String,
  issue: Boolean,
  sutdent: ObjectId,
  sutdent: { type: ObjectId, ref: 'students' },
  issuedDate: String,
  returnDate: String,
});
const books_data = mongoose.model(collection.BOOKS_COLLECTION, books_Schema);

module.exports = { admin_data, student_data, books_data };
