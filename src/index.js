import AppleDaily from './AppleDaily'


const defaultConfig = {
	START_URL: "http://hkm.appledaily.com/index.php",
};

module.exports = function(param){
	if(!param){
		param = defaultConfig;
	}
	
	return new AppleDaily(param);
}