# Q-A-Portal

This is a portal for answering questions for IIIT Allahabad students.It will serve as a medium for discussion among students as well as for answering their doubts by the faculty members.

Install dependencies :
npm install

//Setting up auth part<br />
->Setting up the mogo server<br />
Navigate to bin folder inside mongo folder:cd mongo/bin(for linux users)<br />
Then run the following command for running mongo server <br />
./mongod --dbpath ~/(directory of repo)/user-credentials(server will be up on port 27017)<br />
Navigate into the directory of repo then :<br />
Inside the text editor->replace email and password with your email:<br />
var transporter = nodemailer.createTransport('smtps://email%40gmail.com:password@smtp.gmail.com');<br />
Run node server.js(Good to use nodemon)<br />
The server will be up on port:3000<br />

Usage:<br />
Inside any web Browser type:<br />
localhost:3000/signup<br />
Then enter the credentials to register your account.<br />
You will recieve an email and a landing page will be displayed that shows an email has been sent.<br />
From the email a link is to be copied(For now it is localhost:3000/signup).<br />
The link will soon redirect when it will be hosted.<br />
On going to localhost:3000/signup it will be redirect to login page that now shows Email verified successfully.<br />
This page in future should be the page where user lands to his own Q-A page.<br />

Also in future the land page will be applied css and get a better interface.<br />

Note:<br />
Signup form requires @gmail.com type mails as of now.<br />
Password should be min 8 digits and must contain a small letter,a capital letter,a number and password and confirm password must match to signup.<br />
