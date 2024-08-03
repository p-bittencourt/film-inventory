const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  release_date: { type: String },
  summary: { type: String, maxLength: 250 },
  poster: { type: String },
  // cast: [{ type: Schema.Types.ObjectId, ref: 'Actor' }], maybe cast isn't a property, but rather a search on the actors to find the movies they're in, and all actors associated to the movie get pulled this way
  // genre: associate to genre id
  // director: associate to director id
});

MovieSchema.virtual('url').get(function () {
  return `/movies/${this._id}`;
});

module.exports = mongoose.model('Movie', MovieSchema);
