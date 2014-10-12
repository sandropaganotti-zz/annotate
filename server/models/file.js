var mongoose = require('mongoose');

module.exports = mongoose.model('File', new mongoose.Schema({
  name: 'string'
}));
