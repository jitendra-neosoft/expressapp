'use strict';

require('dotenv').config();

module.exports = {
	SECRET : process.env.SECRET,
	PORT : process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	NODE_ENV: process.env.NODE_ENV
}