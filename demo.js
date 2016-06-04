"use strict";

var path = require('path');
var URL = require('url');
// console.log(path);

var AppleDaily = require('./lib')();

AppleDaily.sections()
.then(function(sections){

	sections.forEach(function(section){

		console.log(section);

		section.articles().then(function(arts){

			console.log(arts);

		});
		
	})

});