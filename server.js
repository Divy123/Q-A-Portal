//Including all the dependencies
var mongoose = require('mongoose'),
User=require('./userModel'),
express=require('express'),
ejs=require('ejs'),
session = require('client-sessions'),
bodyParser=require('body-parser'),
email='',password='',
nodemailer = require('nodemailer'),
smtpTransport = require('nodemailer-smtp-transport');
//setting app and middlewares
mongoose.connect('mongodb://localhost:27017/user-credentials');
var app=express();
app.set('view engines','ejs');
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 24* 60 * 60 * 1000,
    activeDuration: 10 * 60 * 1000,
  }));
  //handling requests
app.get('/signup',(req,res)=>
{
    if (req.session && req.session.user) 
    { 
        User.findOne({ email: req.session.user.email }, function (err, user) {
            if (!user) {
                req.session.reset();
                res.redirect('/signup');
              } else {
                User.findByIdAndUpdate(  user._id,               
                    {isVerified:true},
                    (err, todo) => {
                        if (err) return res.status(500).send(err);
                        console.log('Updated user');
                    }
                );
                  console.log(user);
              res.render('login.ejs');
              }
        })
    }
    else{
        res.render('signup.ejs');
    }
});



var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/land', urlencodedParser, function (req, res) {
if (!req.body) return res.sendStatus(400);


email = req.body.email,
password = req.body.password;
 var isVerified=false,username=req.body.username;

var userData = {
    email,
    password, 
    isVerified,
    username
  }



  //use schema.create to insert data into the db
  User.create(userData, function (err, user) {
    if (err) {
        res.send('User registered with same mail id');
    } 
    req.session.user = user;
    console.log(req.session.user);
  });
  
var transporter = nodemailer.createTransport('smtps://divykhare97%40gmail.com:1111188888@smtp.gmail.com');
var mailOptions = {
    to:email, // list of receivers
    subject: 'Signup Confirmation', // Subject line
    text:'Copy this link to your browser to complete your registration\n\n localhost:3000/signup' // plaintext body
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
       res.render('land.ejs');
    };
});
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server up on port '+app.get('port'));
});

