import mongoose from 'mongoose';

const booksSchema = mongoose.Schema({
    IbnNo: Number,
    bookTitle: String,
    // authorName: String,
    // language: String,
    // coverImage: String,
    // description: String,
    // linkToPurchase: [String],
    // yearOfPublication: String,
    // genre: String

});
export default mongoose.model('booksCollection', booksSchema)