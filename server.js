   var mongoose = require('mongoose'),
       nev = require('email-verification')(mongoose),
       user=require('./model'),
       express=require('express'),
       hbs=require('hbs'),
       bodyParser=require('body-parser'),email='',password='';
    
   mongoose.connect('mongodb://localhost:27017/user-credentials');
   var app=express();
   app.set('view engines','hbs');
   app.use('/',express.static(__dirname+'assets'));
   //app.use(express.static(__dirname+'assets/styles.css'));
   var TempUser = nev.generateTempUserModel(User);

var options={
    verificationURL: 'http://example.com/email-verification/${URL}',
    URLLength: 48,
 
    // mongo-stuff
    persistentUserModel: user,
    tempUserModel: TempUser,
    tempUserCollection: 'temporary_users',
    emailFieldName: 'email',
    passwordFieldName: 'password',
    URLFieldName: 'GENERATED_VERIFYING_URL',
    expirationTime: 86400,
 
    // emailing options
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'user@gmail.com',
            pass: 'password'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Confirm your account',
        html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
                'paste the following link into your browser:</p><p>${URL}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    shouldSendConfirmation: true,
    confirmMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Successfully verified!',
        html: '<p>Your account has been successfully verified.</p>',
        text: 'Your account has been successfully verified.'
    }
};




nev.configure(options, function(error, options){
    if(error)
    return console.log('Unable to Sign Up');
});
app.get('/signup',(req,res)=>
{
    res.render('login.hbs');
});
var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  res.send('Welcome'+email);
  
  email = req.body.email,
    password = req.body.password;
});
var newUser = user({
    email: email,
    password: password
});
nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
    // some sort of error
    if (err)
        console.log('Unable to add user');
 
    // user already exists in persistent collection...
    if (existingPersistentUser)
        // handle user's existence... violently.
        console.log('User exists with same id');
    // a new user
    if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(email, URL, function(err, info) {
            if (err)
                console.log("Network failure");
 
            // flash message of success
        });
 
    // user already exists in temporary collection...
    } else {
        // flash message of failure...
    }
});

var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
  };
   
  // async version of hashing function
  myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        return insertTempUser(hash, tempUserData, callback);
      });
    });
  };
  var url = '...';
nev.confirmTempUser(url, function(err, user) {
    if (err)
        // handle error...
 
    // user was found!
    if (user) {
        // optional
        nev.sendConfirmationEmail(user['email_field_name'], function(err, info) {
            // redirect to their profile...
        });
    }
 
    // user's data probably expired...
    else
        // redirect to sign-up
});

 app.listen(3000);