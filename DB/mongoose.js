const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://127.0.0.1:27017/chatApp",{ useNewUrlParser: true });

module.exports = {
  mongoose
}
