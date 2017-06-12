const mongoose = require('mongoose');

const mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
mongoURLLabel = "";

mongoose.connect(mongoURL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected to db");
});

var Schema  = mongoose.Schema;

var userSchema = new Schema({
    name : {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true
	},
    pwd:  {
		type: String,
		required: true
	},
    role:  {
		type: String,
		required: true
	},
    created:  {
		type: Date,
		required: true
	},
    updated:  {
		type: Date,
		required: false
	},
    active:  {
		type: Boolean,
		required: true
	},
});

var Users = mongoose.model('user', userSchema);
module.exports = Users;

//db.users.insert({ name: "UserName1", pwd: "pass12345", role: "user", created: Date.now(), updated:"", active: true })
