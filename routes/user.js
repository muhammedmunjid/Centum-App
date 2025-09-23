var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
const { response } = require('../app');
const verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user)
  res.render('user/home', { admin: false, user });
});

router.get('/signup', async (req, res) => {
  let classes = await userHelpers.getClass();
  res.render('user/signup', { classes });
});

router.post('/signup', (req, res) => {
  console.log(req.body.Class); // Should show selected class like "E1"
  console.log(req.body);

  userHelpers.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn = true;
      req.session.user = response;

      if (req.files && req.files.image) {
        let image = req.files.image;
        image.mv('./public/profile-images/' + response._id + '.jpg', (err) => {
          if (err) {
            console.log('Image upload error:', err);
          }
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }

    } else {
      console.log(response.message);
      res.redirect('/signup'); // or render error page
    }
  }).catch((err) => {
    console.error('Signup failed:', err);
    res.status(500).send('Internal server error');
  });
});

router.get('/login', (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect('/');
  } else {
    let loginErr = req.session.loginErr;
    res.render('user/login', { loginErr });
    req.session.loginErr = false;
  }
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    } else {
      res.render('user/login', { loginErr: true });
      console.log('Login failed. Set loginErr = true');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
