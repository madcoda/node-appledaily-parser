"use strict";

var path = require('path');
var URL = require('url');
// console.log(path);

var AppleDaily = require('./lib')();

// var url = "http://hk.apple.nextmedia.com/entertainment/art/20160602/19637188?_ga=1.266591689.693364185.1446959455";
// var url = "http://hkm.appledaily.com/detail.php?guid=55178837&category_guid=6996647&category=instant&issue=20160603";

// var urlParts = URL.parse(url, true);
// console.log(URL);
// console.log(urlParts);
// return;
// console.log(urlParts.protocol + '//' + urlParts.hostname + urlParts.pathname);
// console.log(AppleDaily.getArticlePermalink(url));

// AppleDaily.parseArticleAsync(url)
// .then(function(article){
// 	console.log(article);
// });


AppleDaily.listCategories()
.then(function(menu){
	console.log(menu);
});

// AppleDaily.listArticles("http://hkm.appledaily.com/list.php?category_guid=462&category=daily")
// .then(function(result){
// 	console.log(result);
// });