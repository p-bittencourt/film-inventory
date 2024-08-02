const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true },
});

module.exports('Movie', MovieSchema);
