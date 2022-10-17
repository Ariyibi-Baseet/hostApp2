import express from "express";
import session from 'express-session';
import flash from 'connect-flash';
import hbs from "hbs";
import * as path from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from 'express-validator';
import bodyParser from 'body-parser';


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SET APPS
app.set('view engine', 'hbs');
app.set('views','views');

// USE APPS
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret : 'hostapp',
    cookie : { maxAge : 6000},
    resave : false,
    saveUninitialized : false
}));
app.use(flash())

// SET ROUTERS
app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/article', (req, res)=>{
    res.render('read_more');
})

app.get('/registration', (req, res)=>{
  req.flash('message');
    // res.render('registration', { message: req.flash('message') });
    // res.render('registration', req.flash());
    res.render('registration');
})

app.get('/login', (req, res)=>{
    res.render('login')
})


// SERVER-SIDE FORM VALIDATION
app.post('/registration', 
  body('fullname', 'First Name cannot be empty').notEmpty(),
  body('email', 'Email cannot be empty').notEmpty(),
  body('email', 'Input a valid email Address').isEmail(),
  body('phone', 'Phone cannot be empty').notEmpty(),
  body('phone', 'Numbers only').isInt(),
  body('company_name', 'Company Name cannot be empty').notEmpty(),
  body('street_address_1', 'Street Address cannot be empty').notEmpty(),
  body('city', 'City cannot be empty').notEmpty(),
  body('postcode', 'Postcode cannot be empty').notEmpty(),
  body('country', 'Street Address cannot be empty').notEmpty(),
  body('tax_id', 'Tax Id cannot be empty').notEmpty(),
  body('password', 'Password cannot be empty').notEmpty(),
  body('password', 'Password must be between 6 and 12 characters plus number').isLength({min:6,max:12}),
  body('confirm_password', 'Confirm Password cannot be empty').notEmpty(),

  
  (req,res) => {
    const validation_result = validationResult(req);
    if(validation_result.isEmpty())
    {
      res.send('You are good to go')
    }else{
        // console.log(validation_result.array({ onlyFirstError : true }))
        let sendError = '';
        // const validationErrorMessage = sendError;
        validation_result.array({ onlyFirstError : true }).forEach((error) => {
        sendError += ' <br>' + error.msg;
      });
    //   let errorMessages = {
    //     error1 : sendError[0]
    //   }
      req.flash('message', sendError);
      // req.flash("messages", { "error" : "Invalid username or password" });
      res.send(sendError);
    }
  }
)

// RUN APP ON PORT 3000
app.listen(3000, console.log('App now running on the view port...'));