appledaily-parser
==========

Parse content on the Apple Daily HK website in Node.js

## Usage
  In your project
  
    npm install appledaily-parser --save
    
  In your main js file
  
    var AppleDaily = require('appledaily-parser')();
    AppleDaily.sections().then(function(sections){

    	console.log(sections);

    	// display in the menu, 
    	// or use to loop through articles in each section

    	var cat1 = sections[0];
    	cat1.articles().then(function(articles){

    		console.log(articles);

    		// todo: do whatever to the list of articles

    		var article1 = articles[0];

    		// call getArticle to fetch the full detail
    		article1.getArticle().then(function(article){

    			// todo

    		})

    	});

    });


## Format

Section

    {
		label: string,
		url: string,
		articles: [func]
	}

Article (List)
    
    {
		title: string,
		url: string,
		image: string,
		relativeTime: string, // only present for realtime news
		getArticle: [func]
	}

Article (Detail)

    {
    	id: string,
		date: date,
		views: string,
		title: string,  //title when shared to facebook
		realTitle: string,  //title shown on the webpage
		images: array,
		content: string,
		permalink: string
    }