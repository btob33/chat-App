const mongoose = require('mongoose');
var User = new mongoose.model('User',{
  userId: {
    type :String,
    required : true,
    minlength : 3,
    trim : true,
    unique : true

  },
  name: {
    type :String,
    required : true,
    minlength : 2,
    trim : true

  },
  age:{
    type : Number,
    required : true,
    min : 18
  },
  gender:{
    type: String,
    trim : true,
    required : true
  },
  blocklist:[],
  pwd:{
    type:String,
    require:true
  }

}

);

module.exports = {User};