var mongoose = require('mongoose'),
 	schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
    secureRandom = require('secure-random');
    SALT_WORK_FACTOR = 10,// Used to generate password hash
    config = require('../config/main');

var userSchema = new schema({
    username: {type:String, required:true, index:{unique:true}},
    phone: {type:String, required: true},
    password: {type:String, required:true},
    image: {type:String},
    verified: {
        type: Boolean,
        default: false,
    },
    verifyCode: [String],
},  {collection: 'users'});

//encrypt the password when saved
userSchema.pre('save', function(next) {
    var user = this;
    console.log("pre save");

    if(!this.isNew) {//update user - not new one
        console.log("update user");
        console.log(user.verifyCode);
        if(user.verifyCode.length == 0){// if code not exist - create it
            user.verifyCode = secureRandom.randomArray(4);
        }
        return next();
    }

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

     user.verifyCode = secureRandom.randomArray(4);
     console.log(user.verifyCode);
});

//Password Verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;

