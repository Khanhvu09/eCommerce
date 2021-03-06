var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../database')
const bcrypt = require('bcrypt-nodejs');
const randToken = require('rand-token');

router.get('/auth/github',passport.authenticate('github'));

router.get('/auth/github/callback',passport.authenticate('github'),(req, res)=>{
  const selectQuery = `SELECT * FROM users`;
  const pgPromise = db.query(selectQuery);
  // console.log(pgPromise);
  pgPromise.then((data)=>{
    console.log(data);
    res.json(data);
  })
  // res.json(req.user);
})

router.post('/register',(req,res)=>{
  // bcrypt
  // check if username exist
  const checkUsernameQuery = `SELECT * FROM users WHERE username = $1`;
  db.query(checkUsernameQuery,[req.body.username]).then((results)=>{
    // console.log(results);
    if(results.length === 0){
      // user does not exist!!! let's add them
      const insertUserQuery = `INSERT INTO users (username,password,token) VALUES ($1,$2,$3)`;
      const token = randToken.uid(50);
      // use bcrypt.hashSync to make their password something evil
      const hash = bcrypt.hashSync(req.body.password);
      db.query(insertUserQuery,[req.body.username,hash,token]).then(()=>{
        res.json({msg: "userAdded"});
      })
    }else{
      // user exists!
      res.json({msg: "userExists"})
    }
  }).catch((error)=>{
    if(error){throw error;}
  });

  // if not, insert -- username, hashed password
    // -- create a token
  // if so, let react know
  // res.json(req.body);
})

router.post('/login',(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  // 1. Get the row with this username from PG
  const selectUserQuery = `SELECT * FROM users WHERE username = $1`;
  db.query(selectUserQuery,[username]).then((results)=>{
    if (results.length === 0){
      // these arent the droids we're looking for. Goodbye
      res.json({
        msg:'badUser'
      })
    } else {
      // user exists
      // now check password
      const checkHash = bcrypt.compareSync(password, results[0].password)
      // checkHash is a boolean
      if (checkHash){
        // match! Create a new token
        const token = randToken.uid(50);
        // update the DB with the new Token
        const updateTokenQuery = `UPDATE users SET token = $1
          WHERE username = $2`;
        db.query(updateTokenQuery,[token,username]).catch((error)=>{
          if(error){throw error}
        })
        res.json({
          msg:'loginSuccess',
          token: token,
          username: username
        })
      } else {
        // bogos password. GOodbye
        // you don't want to sell me deathsticks
        // you want to go home and rething your life
        res.json({
          msg: 'badPassword'
        })
      }
    }
  }).catch((error)=>{
    if (error){throw error}
  })
})


module.exports = router;