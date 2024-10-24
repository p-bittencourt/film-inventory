const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  release_date: { type: String },
  summary: { type: String, maxLength: 250 },
  picture: {
    type: String,
    validate: {
      validator: function (v) {
        // Allow empty strings
        if (v === '') return true;
        // Valide URL pattenr
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  director: [{ type: Schema.Types.ObjectId, ref: 'Director' }],
});

MovieSchema.virtual('url').get(function () {
  return `/movies/${this._id}`;
});

// Pre-remove middleware to handle cascading deletes
MovieSchema.pre('remove', async function (next) {
  const movieId = this._id;
  await mongoose
    .model('Actor')
    .updateMany({ movies: movieId }, { $pull: { movies: movieId } })
    .exec();
  next();
});

// Pre-remove middleware to handle cascading deletes
MovieSchema.pre('remove', async function (next) {
  const movieId = this._id;
  await mongoose
    .model('Director')
    .updateMany({ movies: movieId }, { $pull: { movies: movieId } })
    .exec();
  next();
});

// Virtual for release year
MovieSchema.virtual('release_year').get(function () {
  if (!this.release_date) return ''; // If no release date, return empty string
  return new Date(this.release_date).getFullYear();
});

module.exports = mongoose.model('Movie', MovieSchema);
