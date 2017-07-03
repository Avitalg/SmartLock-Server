var mongoose = require('mongoose'),
 	schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var userSchema = new schema({
    username: {type:String, required:true, index:{unique:true}},
    phone: {type:String, required: true},
    password: {type:String, required:true},
    image: {type:String}
},  {collection: 'users'});

//encrypt the password when saved
userSchema.pre('save', function(next) {
    var user = this;
    console.log("pre save");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//Password Verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Send a verification token to this user
userSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    if (!self.authyId) {
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, self.countryCode,
            function(err, response) {
            if (err || !response.user) return cb.call(self, err);
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
};

// Test a 2FA token
userSchema.methods.verifyAuthyToken = function(otp, cb) {
    const self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};

userSchema.methods.sendMessage =
  function(message, successCallback, errorCallback) {
      const self = this;
      const toNumber = `+972${self.phone}`;
      console.log("sms sent to "+toNumber);
      twilioClient.messages.create({
          to: toNumber,
          from: config.twilioNumber,
          body: message,
      }).then(function() {
        successCallback();
      }).catch(function(err) {
        errorCallback(err);
      });
  };



var User = mongoose.model('User', userSchema);

module.exports = User;

