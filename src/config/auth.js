const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuario
const User = require("../db/models/user.js")


module.exports = (passport) => {
	passport.use(new localStrategy({usernameField: 'email'},
	  function(email, password, done) {
	    User.findOne({ email: email }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect email.' });
	      }

	      bcrypt.compare(password, user.password, (err, batem) => {
	      	if(batem){
	      		return done(null, user);
	      	}else{
	      		return done(null, false, { message: 'Incorrect password.' });
	      	}
	      })
	      
	    });
	  }
	));

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
		    done(err, user);
		  });
	})


}