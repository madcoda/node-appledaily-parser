
import request from 'request-promise'
import cheerio from 'cheerio'
import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path'
import URL from 'url'
import moment from 'moment'

const knowledge = {
	mobile: {
		indexUrl: "http://hkm.appledaily.com/"
	},
	// TODO Desktop not supported yet
	// desktop: {
	// 	indexUrl: "http://hk.apple.nextmedia.com/",
	// }
}

export default class AppleDaily{

	constructor(params){
		this.config = knowledge[params.site];
	}

	sections(){
		let $this = this;
		let url = this.config.indexUrl;

		return request(url)
		.then(function(content){
			var $ = cheerio.load(content);
			var urlParts = URL.parse(url);

			var menuTags = $("ul.menu li:not([class])");
			var menu = _.map(menuTags, function(item){
				var label = $("a", item).text();
				var link = $("a", item).attr("href");
				var fullUrl = urlParts.protocol + "//" + urlParts.hostname + "/" +link;

				return {
					label: label,
					url: fullUrl,
					articles: $this.articles.bind($this, fullUrl)
				}
			});

			return Promise.resolve(menu);

		});
	}

	articles(url){
		let $this = this;

		return request(url)
		.then(function(content){
			var $ = cheerio.load(content);
			var urlParts = URL.parse(url);

			var articlesTags = $(".content-list ul.list li:not([style])");
			var articles = _.map(articlesTags, function(item){

				var title = $("a > p", item).text().trim();
				var link = $("a", item).attr("href");
				var fullUrl = urlParts.protocol + "//" + urlParts.hostname + "/" +link;
				var image = $("img", item).attr("src");
				var relativeTime = $("label", item).text();//only present if in instant news

				return {
					title: title,
					url: fullUrl,
					image: image,
					relativeTime: relativeTime,
					getArticle: $this.getArticle.bind($this, fullUrl)
				}
			});

			return Promise.resolve(articles);

		});
	}

	getArticle(url){
		var urlParts = URL.parse(url);
		if(urlParts.hostname.startsWith('hkm')){
			return _parseMobileVersion(url);
		}else{
			return _parseDesktopVersion(url);
		}
	}

	getArticlePermalink(url){
		return _getArticlePermalink(url);
	}


}







function _parseDesktopVersion(url){
	return request(url)
	.then(function(content){
		var $ = cheerio.load(content);

		var title = $("meta[property=\"og:title\"]").attr("content");

		var realTitle = $(".LinkTable h1").text().trim();

		var imagesTags = $("meta[property=\"og:image\"]");
		var images = _.map(imagesTags, function(item){
			return $(item).attr("content");
		});

		var paragraphs =  _.map($("div.ArticleContent_Outer"), function(item){
			return $("p", item).text().trim();
		});

		var views = $(".view").text().trim();

		var article = {
			id: getArticleId(url),
			date: getArticleDate(url),
			views: views,
			title: title,
			realTitle: realTitle,
			images: images,
			content: paragraphs.join(''),
			permalink: _getArticlePermalink(url)
		};
		// console.log(article);
		return Promise.resolve(article);
		
	});
}

function _parseMobileVersion(url){
	return request(url)
	.then(function(content){
		var $ = cheerio.load(content);

		var title = $("meta[property=\"og:title\"]").attr("content");
		var realTitle = $(".content-article h1").text().trim();

		var imagesTags = $("meta[property=\"og:image\"]");
		var images = _.map(imagesTags, function(item){
			return $(item).attr("content");
		});

		var paragraphs =  _.map($(".content-article p:not([class='next'])"), function(item){
			return $(item).text().trim();
		});

		// var views = $(".view").text().trim();
		var lastUpdate = $(".lastupdate").text().trim();
		if(lastUpdate){
			lastUpdate = moment(lastUpdate).toDate();
		}

		var article = {
			id: getArticleId(url),
			date: getArticleDate(url),
			lastUpdate: lastUpdate,
			// views: views,
			title: title,
			realTitle: realTitle,
			images: images,
			content: paragraphs.join(''),
			permalink: _getArticlePermalink(url)
		};
		// console.log(article);
		return Promise.resolve(article);
		
	});
}



/*
	Utility methods
 */


function getArticleId(url){
	var urlParts = URL.parse(url);
	var pathParts = path.parse(urlParts.pathname);
	return pathParts.name;
}

function getArticleDate(url){
	var urlParts = URL.parse(url, true);
	if(urlParts.hostname.startsWith('hkm')){
		return moment(urlParts.query.issue, "YYYYMMDD").toDate();
	}else{
		var pathParts = path.parse(urlParts.pathname);
		var dirParts = path.parse(pathParts.dir);
		return moment(dirParts.name, "YYYYMMDD").toDate();
	}
}

function getArticleLastUpdateTime(url, $){
	var urlParts = URL.parse(url, true);
	if(urlParts.hostname.startsWith('hkm')){
		return $("text lastupdate").text().trim();
	}else{

	}
	
}

function _getArticlePermalink(url){
	var permalink;

	var urlParts = URL.parse(url);
	if(urlParts.hostname.startsWith('hkm')){
		permalink = url;
	}else{
		permalink = urlParts.protocol + '//' + urlParts.hostname + urlParts.pathname;
	}
	return permalink;
}