function DI_Scorm (){
	 var api = getAPIHandle();
	 this.scormActive=api!=null;
}

DI_Scorm.prototype.isScorm = function(){
	return this.scormActive
}

DI_Scorm.prototype.startCommunication = function(){
	var res=0;
	if(this.scormActive)
		res=doLMSInitialize();
	return res;
}

DI_Scorm.prototype.endCommunication = function(){
	var res=0;
	if(this.scormActive){
		 if (doLMSCommit() == "true"){ 
				if (doLMSFinish() == "true") 
					res=0;
				else 
					res=-1;
		 }
	}
	return res;
}

DI_Scorm.prototype.setPageData = function(pageName, pagetype, metadata,callback){
	if(callback)
		callback(pageName, pagetype, metadata);
}

DI_Scorm.prototype.getPageData = function(pageName, pagetype, MetaData,callback){
	if(callback)
	 callback(pageName, pagetype, MetaData);
}


DI_Scorm.prototype.setSessionData = function(metadata,callback){
	var res=0;
	if(!this.scormActive)
		return res;
	var metaData=metadata.data;
	
	//Seitenliste zusammenbauen
	var sd=[];
	var pc=PageCountABS();
	var pageName;
	for(var i=0;i<pc;i++){
		pageName=GetPageByIndexFromPageLibABS(i);
		if(typeof(metaData.pageList[pageName])!="undefined")
			sd.push(1);
		else
			sd.push(0);
	}
	var suspend_data;
	if(sd.length>0)
		suspend_data=sd.toString();
	//Lastpage anhängen
	suspend_data+=';'+metaData.lastPage;
	var ires;
	//suspend_data schreiben
	ires=doLMSSetValue('cmi.suspend_data', suspend_data);
	//SessionTime schreiben
	ires=doLMSSetValue('cmi.core.session_time',metaData.session_time)
	
	//Score schreiben
	if(metaData.score)
		ires=doLMSSetValue('cmi.core.score.raw',metaData.score);
	metaData.scorm_state=variablen.Global.AICCResult();
	var status = Number(metaData.scorm_state);
	var str;
    switch (status) {
        case -1:
        case 0:
            str = "passed";
            break;
        case 1:
            str = "completed";
            break;
        case 2:
            str = "failed";
            break;
        case 3:
            str = "incomplete";
            break;
        case 4:
            str = "browsed";
            break;
        case 5:
            str = "not attempted";
            break;
        default:
            str = "passed";
    }
    //Scorm Result schreiben
    ires=doLMSSetValue('cmi.core.lesson_status',str);
    if(!ires)
    	res=-1;
    if(callback)
    callback(res);
}

DI_Scorm.prototype.getSessionData = function(metadata,callback){
	//Status auslesen
	var status=doLMSGetValue('cmi.core.lesson_status');
	var istatus;
	 switch (status) {
     case "passed":
     
    	 istatus = 0;
         break;
     case "completed":
    	 istatus = 1;
         break;
     case "failed":
    	 istatus = 2;
         break;
     case "incomplete":
    	 istatus = 3;
         break;
     case "browsed":
    	 istatus = 4;
         break;
     case "not attempted":
    	 istatus = 5;
         break;
     default:
    	 istatus = 3;
	 }
	//Suspend Data auslesen 
	metadata.data.scorm_state=istatus;
	variablen.Global.AICCResult(metadata.data.scorm_state)
	var suspend_data=doLMSGetValue('cmi.suspend_data');
	//aufsplitten in Pagelist und LastPage
	var sd_array=suspend_data.split(';');
	var plist=sd_array[0];
	//Pagelist ermitteln
	var lp="";
	if(sd_array.length>1)
		lp=sd_array[1];
	metadata.data.lastPage=lp;
	
	//Seitenliste erzeugen
	plist=plist.split(',');
	pagelist={};
	for(var i=0;i<plist.length;i++){
		pageName=GetPageByIndexFromPageLibABS(i);
		if(plist[i]!=0)
			pagelist[pageName]='1';
	}
	metadata.data.pageList=pagelist;
	metadata.data.score=doLMSGetValue('cmi.core.score.raw');
	metadata.data.student_name=doLMSGetValue('cmi.core.student_name');
	if(callback)
		callback(metadata); 
	
}

