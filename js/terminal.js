/*********************************************************************************************/
// $slideBox v1.1 || CODEDROID12 || Exclusive to CodeCanyon
/*********************************************************************************************/	
;(function($){
var terminal={
		defaults:{
			mode:'fileloader',		// DIR OR FILELOADER
			line_delay:50,			// DELAY BETWEEN LINES
			line_fade:100,			// SPEED LINES FADE IN
			loading_word_delay:200,	// DELAY BETWEEN LOADING LETTERS
			loading_word_fade:50,	// SPEED LETTERS FADE IN
			overlay_speed:500,		// SPEED OVERLAY FADES OUT
			load_char:' .'			// CHARACTER ADDED DURING LOADING
		}, 
	
/***********************************************************************************************/
// INITIALIZE
/***********************************************************************************************/
init:function(options){
	var o=options,
		$this=$(this);
		
	////////////////
	// EACH terminal
	////////////////
	$this.each(function(i){
		
		// MERGE USER OPTIONS WITH DEFAULTS
		var $this=$(this),
			settings=$.extend({}, terminal.defaults, o);

		/////////////////////////
		// DIRECTORY LISTING MODE
		/////////////////////////			
		if(settings.mode.toLowerCase()==='dir') terminal.dirMode($this, settings);
		
		//////////////////
		// FILELOADER MODE
		//////////////////
		if(settings.mode.toLowerCase()==='fileloader') terminal.fileLoad($this.find('li:first'), settings);
	});
},



/***********************************************************************************************/
// DIRECTORY LISTING MODE
/***********************************************************************************************/
dirMode:function($this, settings){
	var $files=$this.find('ul li'),
		numFiles=$files.length;

	// LOOP LIST ELEMENTS (FILES)
	$files.each(function(i){
	    $(this).delay(parseFloat(settings.line_delay)*i).fadeIn(parseFloat(settings.line_fade));

		///////////////////////////////////
		// LAST ITEM - ANIMATE LOADING WORD
		///////////////////////////////////
		if(i===numFiles-1){
			var $loadingWord=$this.find('.loading_word');
			
			// LOADING WORD
			if($loadingWord.length >=0){
				setTimeout(function(){
					var word=$loadingWord.text(),
						letters=word.split('');


					// CLEAR HTML AND REMOVE CURSOR
					$loadingWord.html('').css('opacity',1); 
					$('.terminal_cursor').remove();
				
					// LOOP LETTERS IN LOADING WORD
					$.each(letters, function(index, letter){
						$('<span>'+letter+'</span>').appendTo($loadingWord)
							.delay(parseFloat(settings.loading_word_delay)*index)
							.fadeIn(parseFloat(settings.loading_word_fade),function(){
								// LAUNCH AFTER FADING IN LAST LETTER
								if(index===letters.length-1) terminal.launch(settings);
							});
					});
				},1000);
			};
		};
	});
},





/***********************************************************************************************/
// FILE LOADER MODE
/***********************************************************************************************/
fileLoad:function($line, settings){
	var $ul=$line.parents('ul:first'),
		numLines=$ul.find('li').length,
		letters=$line.text().split(''),
		numLetters=letters.length,
		delay=$line.attr('data-terminal-time') || 1000,
		numPeriods=Math.min(Math.round(parseFloat(delay)/20), 10),
		periods=[],	sentence='', index=0, 
		time=$line.attr('data-terminal-speed') || 25;

	// CREATE PERIODS ARRAY
	for(var i=0; i<numPeriods; i++) periods.push(settings.load_char);
		
	// SHOW LINE
	$ul.find('li').css('display','block');
	$line.css('opacity',1);
		
	// INITIALLY START TIMER
	var letterTimer=setInterval(addLetter, time);
		
	// MAIN FUNCTION
	function addLetter(){
		// STOP TIMER
		clearInterval(letterTimer);
		// UPDATE LETTERS
		sentence+=letters[index];
		$line.text(sentence);
		index++;
			
		// FINISHED WRITING SENTENCE
		if(index==numLetters){
			// NOW ADD PERIODS ARRAY TO LETTERS ARRAY
			if(periods.length>1){
				letters.push.apply(letters, periods);
				// UPDATE THE TIME TO REPRESENT A . . . DELAY				
				time=delay;
				// UPDATE NUMBER OF LETTERS
				numLetters=letters.length;
				// EMPTY ARRAY
				periods=[];
			};
		};

		// START TIMER AGAIN
		if(index < numLetters){
			letterTimer=setInterval(addLetter, time);
		}else{
			// MOVE TO NEXT LINE
			if(periods.length <=0){
				var lineIndex=$line.index();
				if($($ul.find('li')[lineIndex+1]).length){
					terminal.fileLoad($($ul.find('li')[lineIndex+1]), settings);
				// DONE LOADING LAUNCH
				}else{
					terminal.launch(settings);
				};
			};
		}
	};
},





/***********************************************************************************************/
// LAUNCH WEBSITE
/***********************************************************************************************/
launch:function(settings){
	$('#terminal').stop(true,false).animate({opacity:0},{duration:parseFloat(settings.overlay_speed),queue:false,complete:function(){
		$('#terminal').remove();		
	}});
}};



/***********************************************************************************************/
// PLUGIN DEFINITION
/***********************************************************************************************/
$.fn.terminal=function(method,options){
	if(terminal[method]){ return terminal[method].apply(this,Array.prototype.slice.call(arguments,1));
	}else if(typeof method==='object'||!method){ return terminal.init.apply(this,arguments);
	}else{ $.error('Method '+method+' does not exist'); }
}})(jQuery);

// EXTEND NATIVE CLASSES
String.prototype.removeWS=function(){return this.toString().replace(/\s/g, '');};
String.prototype.pF=function(){return parseFloat(this);};
Number.prototype.pF=function(){return parseFloat(this);};