var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
  body: {
    message: String
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;