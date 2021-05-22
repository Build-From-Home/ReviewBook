import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    bookid: String,
    user: String,
    email: String,
    comment: String,
    starRating: Number,
});
export default mongoose.model('reviewCollection', reviewSchema);




