'use strict';

const express = require('express');
const router = express.Router();
const User = require('../user/usermodel').User;

router.post('/auth/google',function(req, res){
    return res.status(200).send({msg:'Work in process'});
});

module.exports = router;