function findLLAPI(win){
  var findAPITries=0;
  
   while ((win.LULAPI == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
  
      if (findAPITries > 7) 
      {
//         alert("Error finding API -- too deeply nested.");
         return null;
      }
      
      win = win.parent;

   }
   return win.LULAPI;
}

function getLLAPI(){
 try {
 var theAPI = findLLAPI(window);
 if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
  theAPI = findLLAPI(window.opener);
 }
 if (theAPI == null) {
  //      alert("Unable to find an API adapter");
 }
 return theAPI
 }catch(e){return null;}
}



function DI_IT2L (){
	 this.LULAPI = getLLAPI();
	 this.IT2LActive=this.LULAPI!=null;
}

DI_IT2L.prototype.isIT2L = function(){
	return this.IT2LActive
}

DI_IT2L.prototype.startCommunication = function(){
	var res=0;
	return res;
}

DI_IT2L.prototype.endCommunication = function(){
	var res=0;
	return res;
}

DI_IT2L.prototype.cbfunc=function(cbdata){
	if(cbdata.func=="Page"&&cbdata.method=="set"){
	    var metadata=this.spd_metadata;
	    metadata.result=cbdata.result;
	    if(this.spd_callback)
	    	this.spd_callback(cbdata.sid, metadata.pageType, metadata);
	}
	if(cbdata.func=="Page"&&cbdata.method=="get"){
	    var metadata=this.gpd_metadata;
	    metadata.result=cbdata.result;
	    for (var prop in cbdata.data)
	    	metadata.data[prop]=cbdata.data[prop]
	    if(this.gpd_callback)
	    	this.gpd_callback(cbdata.sid, metadata.pageType, metadata);
	}
	if(cbdata.func=="Session"&&cbdata.method=="set"){
	    var metadata=this.ssd_metadata;
	    metadata.result=cbdata.result;
	    if(this.ssd_callback)
	    	this.ssd_callback(metadata);
	}
	if(cbdata.func=="Session"&&cbdata.method=="get"){
	    var metadata=this.gsd_metadata;
	    metadata.result=cbdata.result;
	    for (var prop in cbdata.data)
	    	metadata.data[prop]=cbdata.data[prop]
	    if(JSON.stringify(metadata.data.pageList)=='[]')
	    	metadata.data.pageList={};
	    if(this.gsd_callback)
	    	this.gsd_callback(metadata);
	}
}

DI_IT2L.prototype.setPageData = function(pageName, pagetype, metadata,callback){
	var _this=this;
	var _callback=function(data){
		_this.cbfunc(data);
	}
	this.spd_callback=callback;
	metadata.data.pageType=pagetype;
	this.spd_metadata=metadata;
	var dataObj={}
	dataObj.mid=getCourseID();
	dataObj.sid=pageName;
	dataObj.method="set";
	dataObj.func="Page";
	dataObj.data=metadata.data;
	this.LULAPI("Page",dataObj,2,_callback);
	return 0;
}

DI_IT2L.prototype.getPageData = function(pageName, pagetype, metadata,callback){
	var _this=this;
	var _callback=function(data){
		_this.cbfunc(data);
	}
	this.gpd_callback=callback;
	metadata.data.pageType=pagetype;
	this.gpd_metadata=metadata;
	var dataObj={}
	dataObj.mid=getCourseID();
	dataObj.sid=pageName;
	dataObj.method="get";
	dataObj.func="Page";
	dataObj.data=metadata.data;
	dataObj.options=metadata.options;
	this.LULAPI("Page",dataObj,2,_callback);
	return 0;
}


DI_IT2L.prototype.setSessionData = function(metadata,callback){
	var _this=this;
	var _callback=function(data){
		_this.cbfunc(data);
	}
	this.ssd_callback=callback;
	this.ssd_metadata=metadata;
	var dataObj={}
	dataObj.mid=getCourseID();
	dataObj.method="set";
	dataObj.func="Session";
	dataObj.data=metadata.data;
	this.LULAPI("Session",dataObj,2,_callback);
	return 0;
}

DI_IT2L.prototype.getSessionData = function(metadata,callback){
	var _this=this;
	var _callback=function(data){
		_this.cbfunc(data);
	}
	this.gsd_callback=callback;
	this.gsd_metadata=metadata;
	var dataObj={}
	dataObj.mid=getCourseID();
	dataObj.method="get";
	dataObj.func="Session";
	dataObj.data=metadata.data;
	dataObj.options=metadata.options;
	this.LULAPI("Session",dataObj,2,_callback);
	return 0; 
}

