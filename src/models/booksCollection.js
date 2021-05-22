import mongoose from 'mongoose';
import reviewCollection from './reviewSchema.js';


const booksSchema = mongoose.Schema({
    IbnNo: Number,
    bookTitle: String,
    authorName: String,
    averageRating: Number,
    language: String,
    coverImage: String,
    description: String,
    linkToFlipkart: String,
    linkToAmazon: String,
    yearOfPublication: String,
    genre: String,
});
export default mongoose.model('booksCollection', booksSchema)