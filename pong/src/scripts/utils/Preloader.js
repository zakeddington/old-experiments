
/**
 * Generic preloader.  Pass in a manifest and a callback
 *
 * @dependencies: PreloadJS
 */

/**
 * @type {Class}
 */
var Preloader = {

	/**
	 * The loader queue to preload
	 * @type {LoadQueue}
	 */
	_loadQueue: null,

	/**
	 * The file manifest to load
	 * @type {Array}
	 */
	_fileManifest: null,

	/**
	 * Callback for successful loads
	 * @type {Function}
	 */
	_completeCallback: null,

	/**
	 * Callback for error loads
	 * @type {Function}
	 */
	_errorCallback: null,

	/**
	 * Initializes the preloader
	 * @param  {Object} options An options hash consisting of
	 *   - fileManifest	: {Array}
	 *   - success		: {Function}
	 *   - error		: {Function}
	 *   
	 * @return {void}         
	 */
	initialize: function( options ) {
		_.bindAll( this ); 

		this._fileManifest = options.fileManifest || new Error( 'Preloader Error: A file manifest must be defined' );
		this._completeCallback = options.onComplete || function() {};
		this._errorCallback    = options.onError || function() {};
		this._progressCallback = options.onProgress || function() {};
		this._onFileLoadCallback = options.onFileLoad || function() {};

		this._loadQueue = new createjs.LoadQueue(false);

		this._addEventListeners();
		this.start();
	},

	/**
	 * Starts the preload process
	 * @return {[type]} [description]
	 */
	start: function() {
		this._loadQueue.loadManifest( this._fileManifest );
	},

	/**
	 * Destroys the preloader
	 * @return {void} 
	 */
	destroy: function() {
		this._removeEventListeners();
	},


	//--------------------------------------
    //+ EVENT HANDLERS
    //--------------------------------------

    /**
     * Handler for PreloadJS Load Complete events
     * @param  {Event} event 
     * @return {void}       
     */
	_onLoadComplete: function( event ) {
		this._removeEventListeners();

		_.delay( this._completeCallback, 0 );
	},

	/**
     * Handler for PreloadJS Load Complete events
     * @param  {Event} event 
     * @return {void}       
     */
	_onLoadError: function( event ) {
		console.log( event);
		//this._errorCallback()
	},

	/**
     * Handler for PreloadJS Load Complete events
     * @param  {Event} event 
     * @return {void}       
     */
	_onLoadProgress: function( event ) {
		this._progressCallback( event );
	},

	/**
     * Handler for PreloadJS Load Complete events
     * @param  {Event} event 
     * @return {void}       
     */
	_onFileLoad: function( event ) {
		this._onFileLoadCallback( event );
	},

	/**
     * Handler for PreloadJS Load Complete events
     * @param  {Event} event 
     * @return {void}       
     */
	_onFileProgress: function( event ) {
		console.log('progress: ' + event);
	},

	//--------------------------------------
    //+ PRIVATE METHODS
    //--------------------------------------

	/**
	 * Adds loader event listeners
	 * @return {void} 
	 */
	_addEventListeners: function() {
		this._loadQueue.addEventListener( "complete", this._onLoadComplete );
		this._loadQueue.addEventListener( "error", this._onLoadError );
		this._loadQueue.addEventListener( "fileload", this._onFileLoad );
		this._loadQueue.addEventListener( "progress", this._onLoadProgress );
		this._loadQueue.addEventListener( "fileprogress", this._onFileProgess );
	},

	/**
	 * Removes loader event listeners
	 * @return {void} 
	 */
	_removeEventListeners: function() {
		this._loadQueue.removeEventListener( "complete", this._onLoadComplete );
		this._loadQueue.removeEventListener( "error", this._onLoadError );
		this._loadQueue.removeEventListener( "fileload", this._onFileLoad );
		this._loadQueue.removeEventListener( "progress", this._onLoadProgress );
		this._loadQueue.removeEventListener( "fileprogress", this._onFileProgess );
	}
}; 

module.exports = Preloader;