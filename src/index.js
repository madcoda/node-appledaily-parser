import AppleDaily from './appledaily'


const defaultConfig = {
	site: "mobile"
};

module.exports = function(param){
	if(!param){
		param = defaultConfig;
	}
	
	return new AppleDaily(param);
}