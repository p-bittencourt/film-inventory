const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
  nationality: { type: String },
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
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

// Virtual for actor's full name
ActorSchema.virtual('name').get(function () {
  // to avoid errors in cases where an actor does not have either a family name or first name
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`;
  } else if (this.first_name && !this.family_name) {
    fullname = this.first_name;
  } else if (!this.first_name && this.family_name) {
    fullname = this.family_name;
  }
  return fullname;
});

// Virtual for actor's URL
ActorSchema.virtual('url').get(function () {
  return `/actors/${this._id}`;
});

// Virtual for actor's age
ActorSchema.virtual('age').get(function () {
  let age = '';
  if (!this.date_of_birth) {
    return age;
  }
  const birthDate = new Date(this.date_of_birth);
  let endDate = new Date();
  if (this.date_of_death) {
    endDate = new Date(this.date_of_death);
  }
  const ageInMilliseconds = endDate - birthDate;
  const ageInYears = Math.floor(
    ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
  );
  if (this.date_of_death) {
    age = `Passed at the age of ${ageInYears}`;
  } else {
    age = ageInYears;
  }

  return age;
});

// Export the model
module.exports = mongoose.model('Actor', ActorSchema);
