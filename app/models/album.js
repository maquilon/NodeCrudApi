var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var albumSchema = new Schema({
    labelName: String,
    year: Number
});

module.exports = mongoose.model('album', albumSchema);