var Assets		= require('../config/Assets');
var AppConfig	= require('../config/AppConfig');
var Utils		= require('../utils/Utils');

var Sound = {

	_globalAudio: null, 
	_globalAudioLevel: 0.4, 

	loadSounds: function(){
		createjs.Sound.addEventListener("fileload", $.proxy(this.soundLoaded, this)); // add an event listener for when load is completed
		createjs.Sound.registerManifest(Assets.audio, AppConfig.audioAssetPath);
	},

	soundLoaded: function(event) {
		if(event.id === 'backgroundMusic'){
			if(!Utils.isiOS()) this.playBackgroundAudio();	
		}else if(event.id === 'alphabytes-title') {
			if(!Utils.isiOS()) this.playAudio('alphabytes-title');
		}
	}, 

	playBackgroundAudio:function() {
		if(!Utils.isiOS()){
			this._globalAudio = createjs.Sound.play('backgroundMusic', createjs.Sound.INTERRUPT_ANY, 0, 0, -1, this._globalAudioLevel);
			if (this._globalAudio === null || this._globalAudio.playState === createjs.Sound.PLAY_FAILED) { return; }
		}
	}, 

	muteBackgroundAudio: function() {
		this._globalAudio.setVolume(0);
	}, 

	unmuteBackgroundAudio: function() {
		this._globalAudio.setVolume(this._globalAudioLevel);
	}, 

	playAudio: function(audioID) {
		var instance = createjs.Sound.play(audioID, createjs.Sound.INTERRUPT_ANY, 0, 0, false, 1);
        if (instance === null || instance.playState === createjs.Sound.PLAY_FAILED) { return; }
	}
};
module.exports = Sound;