const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, required: true, maxLength: 75 },
});

GenreSchema.virtual('url').get(function () {
  return `/genres/${this._id}`;
});

// Pre-remove middleware to handle cascading deletes
GenreSchema.pre('remove', async function (next) {
  const genreId = this._id;
  await mongoose
    .model('Movie')
    .updateMany({ genre: genreId }, { $pull: { genre: genreId } })
    .exec();
  next();
});

module.exports = mongoose.model('Genre', GenreSchema);
