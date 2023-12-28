var diScorm=null;
var	diXAPI=null;
var	diIT2L=null;

var dc_scorm=1;
var dc_xApi=2;
var dc_IT2l=4;

var activeDrivers=7;

var pt_standard=0;
var pt_exercise=1;
var pt_test=2;
var pt_teststart=3;
var pt_testend=4;
var pt_other=5;


function msToTime(duration) {
    var seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function dataInterface (drivers){
	if(!drivers)
		drivers=activeDrivers;
	this.scorm=false;
	//Variablen.System.AICCMode(0);
	if(AnyToInt(drivers&dc_scorm)==dc_scorm){
		diScorm=new DI_Scorm();
		if(diScorm.isScorm()){
			Variablen.System.AICCMode(1);
		    window["AICCMODEINIT"]=true;
			this.scorm=true;
		}
	}
	this.xapi=false;
	this.it2l=false;
	if(AnyToInt(drivers&dc_IT2l)==dc_IT2l){
		diIT2L=new DI_IT2L();
		if(diIT2L.isIT2L()){
			this.it2l=true;
		}
	}
	this.StartDate=Date.now();
	this.pageList={};
	this.lastPage="";
}

dataInterface.prototype.startCommunication = function(){
	var res=0;
	if(this.scorm&&diScorm!=null)
		res=diScorm.startCommunication();
	if(this.xapi&&diXAPI!=null)
		res=diXAPI.startCommunication();
	if(this.it2l&&diIT2L!=null)
		res=diIT2L.startCommunication();
	return res;
}

dataInterface.prototype.endCommunication = function(){
	var res=0;
	if(this.scorm&&diScorm!=null)
		res=diScorm.endCommunication();
	if(this.xapi&&diXAPI!=null)
		res=diXAPI.endCommunication();
	if(this.it2l&&diIT2L!=null)
		res=diIT2L.endCommunication();
	return res;
}

//Result von setPageData (spd)
/*
dataInterface.prototype.spd_ScormResult = function(pageName, pagetype, metadata){
	var _this=this;
	var _callback=function(p1,p2,p3){
		_this.spd_xAPIResult(p1,p2,p3);
	}
	if(metadata.result==0&&this.xapi&&diXAPI!=null)
		res=diXAPI.setPageData(pageName, pagetype, iMetaData,_callback);
	else
		this.spd_xAPIResult(pageName, pagetype, metadata);
}

dataInterface.prototype.spd_xAPIResult = function(pageName, pagetype, metadata){
	var _this=this;
	var _callback=function(p1,p2,p3){
		_this.setPageDataResult(p1,p2,p3);
	}
	if(metadata.result==0&&this.it2l&&diIT2L!=null)
		res=diIT2L.setPageData(pageName, pagetype, metadata,_callback);
	else
		this.setPageDataResult(pageName, pagetype, metadata);
	
}

dataInterface.prototype.setPageDataResult = function(pageName, pagetype, metadata){
	if(this.sdp_callback!=null&&typeof(this.sdp_callback)!="undefined"&&this.sdp_callback!="")
		this.sdp_callback(metadata.result);
}
*/
//Set PageData
dataInterface.prototype.setPageData = function(pageName, pagetype, metadata,callback, pageState,notLastPage){
	this.sdp_callback=callback;
	if(typeof(pageState)=="undefined")
		pageState='';
	if(typeof(notLastPage)=="undefined")
		notLastPage=false;
	else
		notLastPage=AnyToBool(notLastPage);
	if(pageState==''){
		this.pageList[pageName]=1;
		if(pagetype==pt_exercise&&metadata.result)
			this.pageList[pageName]=2;
	}
	else
	{
		this.pageList[pageName]=pageState;
	}
	
	if(pagetype!=pt_test&&pagetype!=pt_testend&&!notLastPage)
		this.lastPage=pageName;	
	
	var iMetaData={};
	iMetaData.data=metadata;
	iMetaData.result=0;
	iMetaData.options={};
	if (pagetype==pt_standard)
		iMetaData.options.hasData=false;
	else
		iMetaData.options.hasData=true;
	if(this.scorm&&diScorm!=null)
		diScorm.setPageData(pageName, pagetype, iMetaData);
	if(this.xapi&&diXAPI!=null)
		diXAPI.setPageData(pageName, pagetype, iMetaData);
	if(this.it2l&&diIT2L!=null)
		diIT2L.setPageData(pageName, pagetype, iMetaData);	
	return 0;
}

dataInterface.prototype.gpd_ScormResult = function(pageName, pagetype,metadata){
	var _this=this;
	var _callback=function(p1,p2,p3){
		_this.gpd_xAPIResult(p1,p2,p3);
	}
	if(this.xapi&&diXAPI!=null)
		diXAPI.getPageData(pageName, pagetype, metadata,_callback);
	else
		this.gpd_xAPIResult(pageName, pagetype,metadata);
		
}

dataInterface.prototype.gpd_xAPIResult = function(pageName, pagetype,metadata){
	var _this=this;
	var _callback=function(p1,p2,p3){
		_this.getPageDataResult(p1,p2,p3);
	}
	if(this.it2l&&diIT2L!=null)
		diIT2L.getPageData(pageName, pagetype, metadata, _callback);
	else
		this.getPageDataResult(pageName, pagetype,metadata);

}

dataInterface.prototype.getPageDataResult = function(pageName, pagetype,metadata){
	if(this.gdp_callback!=null&&typeof(this.gdp_callback)!="undefined"&&this.gdp_callback!="")
		this.gdp_callback(metadata);
}

dataInterface.prototype.getPageData = function(pageName, pagetype,callback,options){
	if(typeof(options)=="undefined")
		options={};
	this.gdp_callback=callback;
	var iMetaData={};
	iMetaData.data={};
	iMetaData.result=0;
	iMetaData.options=options;
	var _this=this;
	var _callback=function(p1,p2,p3){
		_this.gpd_ScormResult(p1,p2,p3);
	}
	if (pagetype==pt_standard)
		iMetaData.options.hasData=false;
	else
		iMetaData.options.hasData=true;
	if(this.scorm&&diScorm!=null)
		diScorm.getPageData(pageName, pagetype, iMetaData,_callback);
	else
		this.gpd_ScormResult(pageName, pagetype,iMetaData);
}


//Result von setSessionData (ssd)
/*
dataInterface.prototype.ssd_ScormResult = function(metadata){
	var _this=this;
	var _callback=function(p){
		_this.ssd_xAPIResult(p);
	}
	if(metadata.result==0&&this.xapi&&diXAPI!=null)
		res=diXAPI.setPageData(metadata,_callback);
	else
		this.ssd_xAPIResult(metadata);
}

dataInterface.prototype.ssd_xAPIResult = function(metadata){
	var _this=this;
	var _callback=function(p){
		_this.setSessionDataResult(p);
	}
	if(metadata.result==0&&this.it2l&&diIT2L!=null)
		res=diIT2L.setSessionData(metadata,_callback);
	else
		this.setSessionDataResult(metadata);
	
}

dataInterface.prototype.setSessionDataResult = function(metadata){
	if(this.ssd_callback!=null&&typeof(this.ssd_callback)!="undefined"&&this.ssd_callback!="")
		this.ssd_callback(metadata.result);
}
*/
//SetSessionData
dataInterface.prototype.setSessionData = function(metadata,callback){
	this.ssd_callback=callback;
	var iMetaData={};
	iMetaData.data=metadata;
	iMetaData.result=0;
	iMetaData.options={}
	iMetaData.options.hasData=true;
	iMetaData.data.pageList=this.pageList;
	if(typeof(iMetaData.data.lastPage)=="undefined")
		iMetaData.data.lastPage="";
	if(this.lastPage!="")
		iMetaData.data.lastPage=this.lastPage;
	var sessiontime=(Date.now()-this.StartDate);
	iMetaData.data.session_time=msToTime(sessiontime);
	var res=0;
	var metadata=iMetaData;
	if(this.scorm&&diScorm!=null)
		diScorm.setSessionData(metadata);
	if(this.xapi&&diXAPI!=null)
		diXAPI.setPageData(metadata,_callback);	
	if(this.it2l&&diIT2L!=null)
		diIT2L.setSessionData(metadata);	
		
	return res;
}

//Result von getSessionData (gsd)
dataInterface.prototype.gsd_ScormResult = function(metadata){
	var _this=this;
	var _callback=function(p){
		_this.gsd_xAPIResult(p);
	}
	if(this.xapi&&diXAPI!=null)
		diXAPI.getSessionData(metadata,_callback);
	else
		this.gsd_xAPIResult(metadata);
}

dataInterface.prototype.gsd_xAPIResult = function(metadata){
	var _this=this;
	var _callback=function(p){
		_this.getSessionDataResult(p);
	}
	if(this.it2l&&diIT2L!=null){
		   
		diIT2L.getSessionData(metadata,_callback);
	}
	else
		this.getSessionDataResult(metadata);

}

dataInterface.prototype.getSessionDataResult = function(metadata){
	if(typeof(metadata.data.pageList)!="undefined")
		this.pageList=metadata.data.pageList
	if(typeof(metadata.data.lastPage)!="undefined")
		this.lastPage=metadata.data.lastPage;
	if(this.gsd_callback!=null&&typeof(this.gsd_callback)!="undefined"&&this.gsd_callback!="")
		this.gsd_callback(metadata);
}


//GetSessionData
dataInterface.prototype.getSessionData = function(callback,options){
	if(typeof(options)=="undefined")
		options={};
	this.gsd_callback=callback;
	var iMetaData={};
	iMetaData.data={};
	iMetaData.result=0;
	iMetaData.options=options;
	var _this=this;
	var _callback=function(p){
		_this.gsd_ScormResult(p);
	}
	iMetaData.options.hasData=true;
	var res=0;
	if(this.scorm&&diScorm!=null)
		diScorm.getSessionData(iMetaData,_callback);
	else
		this.gsd_ScormResult(iMetaData);
	return res;
}

//Setter und Getter für LastPage und PageList

dataInterface.prototype.setPageList = function(pageList){
	this.pageList=pageList;
}


dataInterface.prototype.getPageList = function(){
	return this.pageList;
}

dataInterface.prototype.setLastPage = function(lastpage){
	this.lastPage=lastpage;
}


dataInterface.prototype.getLastPage = function(){
	return this.lastPage;
}


//Hilfsfunktionen

function createPageMetadata(){
	var iMetadata={};
	iMetaData.data={};
	iMetaData.result=0;
	iMetaData.options={}
	iMetaData.options.hasData=false;
}


function findCourseID(win) {
	var findAPITries = 0;
	while ((win.courseID == null) && (win.parent != null)
			&& (win.parent != win)) {
		findAPITries++;
		if (findAPITries > 7) {
			return null;
		}

		win = win.parent;
	}
	return win.courseID;
}

function getCourseID() {
	try {
		var courseID = findCourseID(window);
		if ((courseID == null) && (window.opener != null)
				&& (typeof (window.opener) != "undefined")) {
			courseID = findCourseID(window.opener);
		}
		if (courseID == null) {
		}
		return courseID
	} catch (e) {
		return null;
	}
}
