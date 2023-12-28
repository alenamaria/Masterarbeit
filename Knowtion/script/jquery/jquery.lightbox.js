function getLightBoxMaxHeight(){
	return jQuery(window).height()-50;
}

function getLightBoxMaxWidth(){
	return jQuery(window).width()-50;
}

function showElementInLightBox(el, _type){
	var lb = null;
	
	jQuery(el).addClass('ui-lightbox-element');
	
	var lbg = jQuery('<div class="ui-lightbox-bg"></div>');
	jQuery('body').append(lbg);
	
	lb = jQuery( '<div class="ui-lightbox-fg" style="top:0px;left:0px;width:' + jQuery(window).width() + 'px;height:' + jQuery(window).height() + 'px;">'+
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;text-align:center;vertical-align:middle;">'+
							'<tr>'+
								'<td class="ui-lightbox-container">'+
								//image/video
								'</td>'+
							'</tr>'+
						'</table>'+
					'</div>' );
	jQuery('body').append(lb);
	jQuery(lb).bind('click.LightBox', function(event){
			if(_type=='video'){
				if(jQuery(event.target).prop("tagName").toLowerCase()=='video'){
					return true;
				}
				jQuery( 'video', this )[0].pause();
				try{
					//jQuery(el).pause();
				}catch(e){};
				//jQuery(el).remove();
				jQuery( 'video', this ).remove();
			}//*/
			jQuery(el).unbind('.LightBox');
			jQuery(lb).unbind('.LightBox');
			jQuery(lb).animate({opacity:0}, 500, function(){
				jQuery(lb).remove();
				jQuery(lbg).animate({opacity:0}, 500, function(){
					jQuery(lbg).remove();
				});
			});
		});
	/*if(_type=='video'){
		jQuery(el).bind('click.LightBox', function(){return false;});
	}*/
	var cls_btn = jQuery('<span class="ui-lightbox-action-icon ui-lightbox-delete-action-icon"></span>');
	
	var _imageLoaded = false;
	var _imageShowed = false;
	var _lbShowed = false;
	
	var _showIMG = function(){
		if(_imageLoaded && !_imageShowed){
			_imageShowed = true;
			jQuery(lb).animate({opacity:1}, 500, function(){
				_setClsBtn();
				jQuery(cls_btn).animate({opacity:1}, 500, function(){
					
				});
			});
		}
	}
	
	var _showLB = function(){
		_lbShowed = true;
		jQuery(lbg).animate({opacity:0.3}, 500, function(){
			_showIMG();
		});
	}
	
	var _setClsBtn = function(){
		try{
			var imgoffset = jQuery(el).position(),
				clsLeft = (imgoffset.left + (jQuery(el).width()-23)),
				clsTop = (imgoffset.top + 5);
			if(_type=='video'){
				clsLeft = ( imgoffset.left + jQuery(el).width() );
				clsTop = ( imgoffset.top - 18 );
			}
			jQuery(cls_btn).css({top: clsTop + 'px', left: clsLeft + 'px'});
		}catch(e){}//*/
	}
	
	var _onload_f = function(){
		jQuery(el).css({visibility:''});
		jQuery(el).unbind('load.LightBox');
		jQuery('.ui-lightbox-container', lb).append(cls_btn);
		_setClsBtn();
		_imageLoaded = true;
		if(_lbShowed){
			_showIMG();
		}else{
			_showLB();
		}
	}
	
	jQuery(el).css({maxWidth: getLightBoxMaxWidth() + 'px', maxHeight: getLightBoxMaxHeight() + 'px'});
	if(_type=='img'/* || _type=='video'*/){
		jQuery(el).bind('load.LightBox', function(){
				_onload_f();
			});
		if(_type=='video'){
			_onload_f();
		}
	}else{
		_onload_f();
	}
	
	jQuery('.ui-lightbox-container', lb).append(el);
	//jQuery(el).load();
	
	if(!_lbShowed){
		_showLB();
	}
}

function showImageInLightBox(url){
	var _type = '';
	var img = null;
	if ((/\.(gif|jpg|jpeg|png)$/).test(url.toLowerCase())) {
		img = jQuery('<img style="visibility:hidden;" src="'+url+'">');
		_type = 'img';
	}else{
		if( (/\.mp4$/).test(url) || (/\.webm$/).test(url) ){
			_type = 'video';
			img = document.createElement('video');
			var _src = document.createElement("source");
			_src.src = url;
			if( (/\.mp4$/).test(url) ){
				//var vWidth = getLightBoxMaxWidth();
				//var vWidth = 0;
				//var vHeight = getLightBoxMaxHeight();
				//var vHeight = 0;
				//img = _getFlashPlayerWithVideo( document.URL.substr(0,document.URL.lastIndexOf("/")+1) + url, vWidth, vHeight );
				/*img = '<object '+
							'width="833" height="641" type="application/x-shockwave-flash" id="strobemediaplayback" data="components/com_planningtool/media/StrobeMediaPlayback.swf" style="visibility: visible;">'+
						'<param name="allowFullScreen" value="true">'+
						'<param name="wmode" value="direct">'+
						'<param name="flashvars" '+
							'value="favorFlashOverHtml5Video=true'+
							'&amp;swf=components/com_planningtool/media/StrobeMediaPlayback.swf'+
							'&amp;minimumFlashPlayerVersion=10.0.0'+
							'&amp;autoPlay=true'+
							'&amp;loop=false&amp;controlBarMode=docked&amp;poster=&amp;src='+
							document.URL.substr(0,document.URL.lastIndexOf("/")+1) + url + '"></object>';*/
				//img = jQuery('<video controls="controls" autoplay="autoplay"><source src="'+url+'" type="video/mp4"></video>');
				//img = '<video controls="controls" autoplay="autoplay"><source src="'+url+'" type="video/mp4"></video>';
				_src.type = 'video/mp4';
				
			}else if( (/\.webm$/).test(url) ){
				//img = jQuery('<video controls="controls" autoplay="autoplay"><source src="'+url+'" type="video/ogg"></video>');
				//img = '<video controls="controls" autoplay="autoplay"><source src="'+url+'" type="video/webm" codecs="vp8, vorbis"/></video>';//*/
				//_src.type = 'video/webm; codecs="vp8, vorbis"';
				_src.type = 'video/webm';
			}
			img.setAttribute('autoplay',"autoplay");
			img.setAttribute('controls', "controls");
			img.appendChild(_src);
		}
	}
	showElementInLightBox(jQuery(img), _type);
	//showElementInLightBox(img, _type);
	img=null;
}