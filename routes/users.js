const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");

/* POST login. */
router.post('/login', function (req, res, next) {
  console.log (req.body);
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) {
      return res.status(400).json({
          message: 'Something is not right',
          error: err,
          user : user
      });
    }
    if (!user) {
        return res.status(400).json({
          message: 'No user found',
          user : user
      });
    }

    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }

    // generate a signed son web token with the contents of user object and return it in the response

    const token = jwt.sign({'user': user}, 'your_jwt_secret');
      // return res.json({user, token});
      return res.json({'user': user, 'token': token});
    });
    })(req, res);
});

module.exports = router;