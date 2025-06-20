const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ashish:ANSOBHAI94@cluster0.hjsjb.mongodb.net/paytmUsers"
);

// letss define the schema

const userTable = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 6,
  },
  firstName : {
    type : String ,
    required : true ,
    trim : true ,
    maxLength : 50
  },
  lastName : {
    type : String , 
    required : true ,
    trim : true ,
    maxLength : 50
  }
});

//  define the modal
const users = mongoose.model("users", userTable);

module.exports =  {
  users: users,
};
