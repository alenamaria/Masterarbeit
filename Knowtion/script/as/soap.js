/************************************************************************
 Copyright: 
 (c) 2016 LINK & LINK Software GmbH & Co KG
 ************************************************************************/

// Soap Interfaces
var spAdminIntf='IideawebAdmin';
var spComIntf='IideawebCom';
var spMCIntf='IideawebMediaCenter';
var spWebDataIntf='IideawebData';
var spWSDL='/ideaweb/wsdl/';
var spServer='/ideaweb/ideaweb';

function SOAPClientParameters()
{
	this._pl = [];
}

SOAPClientParameters.prototype.add = function(name, value) 
	{
		this._pl[name] = value; 
		return this; 
	}
SOAPClientParameters.prototype.toXml = function()
	{
		var xml = new StringBuffer();
		for (var p in this._pl) {
			if (!(this._pl[p] instanceof Function)) {
				xml.append("<");
				xml.append(p);
				xml.append(" xsi:type=\"");
				xml.append(this.getType(p));
				xml.append("\">");
				xml.append(this._serialize(this._pl[p]));
				xml.append("</");
				xml.append(p);
				xml.append(">\r\n");
			}
		}
		return xml.toString();
}

SOAPClientParameters.prototype._serialize = function(o)
{
    var s = "";
    switch(typeof(o))
    {
        case "string":
            //s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); break; //JH 10.03.2009
			//JH 27.08.2009  BEGIN
			o = o.replace(new RegExp('\\]\\]>', "gi"), ']]]]><![CDATA[>');
			o = o.replace(new RegExp('<!\\[CDATA\\[', "gi"), '<]]><![CDATA[![CDATA[');
			o = o.replace(new RegExp('\\]\\]\\]\\]><\\]\\]><!\\[CDATA\\[!\\[CDATA\\[>', "gi"), ']]]]><![CDATA[>');
			//JH 27.08.2009  END
			s += '<![CDATA[' + o + ']]>'; //JH 10.03.2009
			break;
        case "number":
        case "boolean":
            s += o.toString(); break;
        case "object":
            // Date
            if (o.constructor.toString().indexOf("function Date()") > -1) {
			
				var year = o.getFullYear().toString();
				var month = (o.getMonth() + 1).toString();
				month = (month.length == 1) ? "0" + month : month;
				var date = o.getDate().toString();
				date = (date.length == 1) ? "0" + date : date;
				var hours = o.getHours().toString();
				hours = (hours.length == 1) ? "0" + hours : hours;
				var minutes = o.getMinutes().toString();
				minutes = (minutes.length == 1) ? "0" + minutes : minutes;
				var seconds = o.getSeconds().toString();
				seconds = (seconds.length == 1) ? "0" + seconds : seconds;
				var milliseconds = o.getMilliseconds().toString();
				var tzminutes = Math.abs(o.getTimezoneOffset());
				var tzhours = 0;
				while (tzminutes >= 60) {
					tzhours++;
					tzminutes -= 60;
				}
				tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
				tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
				var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
				s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
			}
			// Array
			else 
				if (o.constructor.toString().indexOf("function Array()") > -1) {
					for (var p in o) {
						if (!isNaN(p)) // linear array
						{
							(/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
							var type = RegExp.$1;
							switch (type) {
								case "":
									type = typeof(o[p]);
								case "String":
									type = "string";
									break;
								case "Number":
									type = "int";
									break;
								case "Boolean":
									type = "bool";
									break;
								case "Date":
									type = "DateTime";
									break;
							}
							s += "<" + type + ">" + this._serialize(o[p]) + "</" + type + ">"
						}
						else 
							s += "<" + p + ">" + this._serialize(o[p]) + "</" + p + ">"
					}
				}
				else 
					for (var p in o) {
						s += "<" + p + ">" + this._serialize(o[p]) + "</" + p + ">";
					}
            break;
        default:
            throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
    }
    return s;
}

SOAPClientParameters.prototype.getType = function(o)
{
    var s = "";
    switch(typeof(o))
    {
        case "string":
           s="xsd:string";
		   break;
        case "number":
			s="xsd:int";
			break;
        case "boolean":
           s="xsd:boolean";
		   break;
        case "object":
            break;
		default: break;
    }
    return s;
}

function SOAPClient() {
	
}

SOAPClient.prototype.xmlHttpobject=null;

SOAPClient.prototype.invoke = function(url, wsdlurl, method, parameters, async, tabid, callback,optionalParam)
{
	if (async) {
		this._loadWsdl(url, wsdlurl, method, parameters, async, tabid, callback,optionalParam);
	}
	else {
		return this._loadWsdl(url, wsdlurl, method, parameters, async, tabid, callback,optionalParam);
	}
}

SOAPClient_cacheWsdl = [];

SOAPClient.prototype._loadWsdl = function(url, wsdlurl, method, parameters, async, tabid,callback,optionalParam)
{
	url = url.replace(new RegExp('/http:\/\//', ''), '');
	url = url.replace(new RegExp('/https:\/\//', ''), '');
	url = url.substring(url.indexOf('/'));
	url = location.protocol + '//' + location.hostname + url;
	wsdlurl = wsdlurl.replace(new RegExp('/http:\/\//', ''), '');
	wsdlurl = wsdlurl.replace(new RegExp('/https:\/\//', ''), '');
	wsdlurl = wsdlurl.substring(wsdlurl.indexOf('/'));
	wsdlurl = location.protocol + '//' + location.hostname + wsdlurl;
	var wsdl = SOAPClient_cacheWsdl[url];
	if(wsdl){
		return this._sendSoapRequest(url, method, parameters, async, callback, wsdl, wsdlurl, tabid,optionalParam);
	}  
	var xmlHttp = this._getXmlHttp();
	xmlHttp.open("GET", wsdlurl, async);
	if(async) 
	{
		xmlHttp.onreadystatechange = function() 
		{
			if (xmlHttp.readyState == 4) {
				this._onLoadWsdl(url, method, parameters, async, callback, xmlHttp, wsdlurl, tabid, optionalParam);
			}  
		}
	}
	xmlHttp.send(null);
	if (!async) {
		return this._onLoadWsdl(url, method, parameters, async, callback, xmlHttp, wsdlurl, tabid,optionalParam);
	}  
}
SOAPClient.prototype._onLoadWsdl = function(url, method, parameters, async, callback, req, wsdlurl, tabid,optionalParam)
{
	if (!IS.IE()) {
		req.responseXML.normalize();
	}
	var wsdl=req.responseXML;		
	SOAPClient_cacheWsdl[url] = wsdl;
	return this._sendSoapRequest(url, method, parameters, async, callback, wsdl, wsdlurl, tabid,optionalParam); 
}
SOAPClient.prototype._sendSoapRequest = function(url, method, parameters, async, callback, wsdl, wsdlurl, tabid,optionalParam)  
{
	var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
	//var sr = new StringBuffer();
	var sr = [];
	var localSoapNS=soapNS;
	if (wsdlurl.indexOf("IideawebMediaCenter") != -1)
	   localSoapNS="mediacenterIntf";

	sr.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" ");
	var ipos = wsdlurl.lastIndexOf("/");
	if (ipos != -1) {
		wsdlurl = wsdlurl.substr(ipos + 1, wsdlurl.length - ipos - 1);
	}
   	sr.push("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ");
	sr.push("xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n");
  	sr.push("<SOAP-ENV:Body SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n");
  	sr.push("<NS1:");sr.push(method);sr.push(" xmlns:NS1=\"urn:");
  	sr.push(localSoapNS);
  	sr.push("-");
	sr.push(wsdlurl);
	sr.push("\">\r\n");                                                       
	sr.push(parameters.toXml());
	sr.push("</NS1:" + method + ">\r\n</SOAP-ENV:Body>\r\n</SOAP-ENV:Envelope>\r\n");
	var xmlHttp = this._getXmlHttp();
	xmlHttp.open("POST", url, async);
	var soapaction = "urn:"+localSoapNS+"-" + wsdlurl + "#" + method;
	var temp=sr.join('');
    xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlHttp.setRequestHeader("SOAPAction", soapaction);	
	var t=this;
	if(tabid!=null)
		xmlHttp.setRequestHeader("TabId", tabid);
	try {
		if (async) {
			xmlHttp.onreadystatechange = function(){
				if (xmlHttp.readyState == 4) {
					t._onSendSoapRequest(method, async, callback, wsdl, xmlHttp,optionalParam);
				}
			}
		}
		xmlHttp.send(temp);
		if (!async) {
			return this._onSendSoapRequest(method, async, callback, wsdl, xmlHttp,optionalParam);
		}
	}catch(e){
			
	}
}
// PW 01.04.09 ...end of support different interfaces
SOAPClient.prototype._soapresult2object = function(node, wsdl)
{
    var wsdlTypes = this._getTypesFromWsdl(wsdl);
    return this._node2object(node, wsdlTypes);
}
SOAPClient.prototype._onSendSoapRequest = function(method, async, callback, wsdl, req, optionalParam) 
{
	var o = null;	
	if (!IS.IE()) {
		req.responseXML.normalize();
	}
	var nd = this._getElementsByTagName(req.responseXML, "NS1:"+ method + "Response", method + "Response");
	if(nd.length == 0)
	{
		if(req.responseXML.getElementsByTagName("faultcode").length > 0)
		{
			this.error=req.responseXML.getElementsByTagName("faultcode");
			this.errorstring=req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue;		   		
		}
	}
	else
		o = this._soapresult2object(nd[0], wsdl);
	if (async && callback) {
		var temp= new TSoapResponse();
		temp.internalRes=o;
		
	    callback=callback.split(".");			
	    if(callback.length==2){
	    	pages[callback[0]][callback[1]](temp,optionalParam);
		}else{
			pages[callback[0]][callback[1]][callback[2]](temp, optionalParam);
		}
	}
	if (!async) {
		return o;
	}
}
SOAPClient.prototype._node2object = function(node, wsdlTypes)
{
	if (node == null) {
		return null;
	}
	if (node.nodeType == 3 || node.nodeType == 4) {
		return this._extractValue(node, wsdlTypes);
	}
	if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4)) {
		return this._node2object(node.childNodes[0], wsdlTypes);
	}
	var isarray = this._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
	if(!isarray)
	{
		var obj = null;
		if (node.hasChildNodes()) {
			obj = new Object();
		}
		for(var i = 0,_l= node.childNodes.length; i <_l; i++)
		{
			//var p = this._node2object(node.childNodes[i], wsdlTypes);
			var p = '';
			if( (node.childNodes[i].nodeType == 1) && 
				(node.childNodes[i].childNodes.length > 1) && 
				(node.childNodes[i].childNodes[0].nodeType == 4) ){
				for(var k = 0,_il=node.childNodes[i].childNodes.length; k < _il; k++){
					p = p + node.childNodes[i].childNodes[k].nodeValue;
				}
			}else{
				p = this._node2object(node.childNodes[i], wsdlTypes);
			}
			obj[node.childNodes[i].nodeName] = p;
		}
		return obj;
	}
	else
	{
		var l = [];
		for (var i = 0; i < node.childNodes.length; i++) {
			l[l.length] = this._node2object(node.childNodes[i], wsdlTypes);
		}
		return l;
	}
	return null;
}
SOAPClient.prototype._extractValue = function(node, wsdlTypes)//JH 11.03.2009
{
	var value = node.nodeValue;
	if(node.nodeType == 4){//JH 11.03.2009
		var _type = this._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase();
	}else{//JH 11.03.2009
		var _type = this._getTypeFromWsdl(node.parentNode.parentNode.nodeName, wsdlTypes).toLowerCase();
	}//JH 11.03.2009
	switch(_type)
	{
		default:
		case "s:string":
			return (value != null) ? value + "" : "";
		case "s:boolean":
			return value + "" == "true";
		case "s:int":
		case "s:long":
			return (value != null) ? parseInt(value + "", 10) : 0;
		case "s:double":
			return (value != null) ? parseFloat(value + "") : 0;
		case "s:datetime":
			if (value == null) {
				return null;
			}
			else {
				value = value + "";
				value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
				value = value.replace(/T/gi, " ");
				value = value.replace(/-/gi, "/");
				var d = new Date();
				d.setTime(Date.parse(value));
				return d;
			}
	}
}
SOAPClient.prototype._getTypesFromWsdl = function(wsdl)
{
	var wsdlTypes = [];
	var ell = wsdl.getElementsByTagName("s:element");	
	var useNamedItem = true;
	if(ell.length == 0)
	{
		ell = wsdl.getElementsByTagName("element");	     
		useNamedItem = false;
	}
	for(var i = 0,_l=ell.length; i < _l; i++)
	{
		if(useNamedItem)
		{
			if (ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null) {
				wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
			}
		}	
		else
		{
			if (ell[i].attributes["name"] != null && ell[i].attributes["type"] != null) {
				wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
			}
		}
	}
	return wsdlTypes;
}
SOAPClient.prototype._getTypeFromWsdl = function(elementname, wsdlTypes)
{
    var type = wsdlTypes[elementname] + "";
    return (type == "undefined") ? "" : type;
}

SOAPClient.prototype._getElementsByTagName = function(document, tagName, tagNamewoNS)
{
	if(window.ActiveXObject){
		try
		{		
			return document.selectNodes(".//*[local-name()=\""+ tagName +"\"]");
		}
		catch (ex) {}
	}
	// old XML parser support
	var list=document.getElementsByTagName(tagName);
	return (list.length!=0) ? list : document.getElementsByTagNameNS("*", tagNamewoNS); 	
}

SOAPClient.prototype._getXmlHttp = function() 
{
	if(this.xmlHttpobject!=null && this.xmlHttpobject.readyState==0)
		return this.xmlHttpobject;
	try
	{
		if(window.XMLHttpRequest) 
		{
			var req = new XMLHttpRequest();
			if(req.readyState == null) 
			{
				req.readyState = 1;
				req.addEventListener("load", 
									function() 
									{
										req.readyState = 4;
										if (typeof req.onreadystatechange == "function") {
											req.onreadystatechange();
										}
									},
									false);
			}
			this.xmlHttpobject=req;
		}
		if (window.ActiveXObject) {
			var xmlhttp=null;
			try {
				xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
			} 
			catch (e) {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");				
			}
			this.xmlHttpobject=xmlhttp;
		}						
	}
	catch (ex) {throw new Error("");}	
	return this.xmlHttpobject;
}
SOAPClient.prototype._getXmlHttpProgID = function()
{
	if (SOAPClient._getXmlHttpProgID.progid) {
		return SOAPClient._getXmlHttpProgID.progid;
	}
	var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
	var o;
	for(var i = 0,_l=progids.length; i < _l; i++)
	{
		try
		{
			o = new ActiveXObject(progids[i]);
			return SOAPClient._getXmlHttpProgID.progid = progids[i];
		}
		catch (ex) {};
	}
	throw new Error("");
}


var gSoapIntf=[];

function TSoapIntf(sServerUrl, sWSDLUrl, sTabId) {
    this.SOAPClient = new SOAPClient();
	this.SOAPClient.parent = this;
    this.pl = new SOAPClientParameters();
	this.attr_ServerURL=sServerUrl;
	this.attr_TabId=sTabId;
	this.attr_WSDLURL=sWSDLUrl;
};

var gvSoap=null;

var gvSoapCB = function (p1,p2) {return true};

TSoapIntf.prototype.attr_ServerURL = null;
TSoapIntf.prototype.attr_WSDLURL = null;
TSoapIntf.prototype.pl = null;
TSoapIntf.prototype.internalRes = null;
TSoapIntf.prototype.attr_Error = 0;
TSoapIntf.prototype.attr_ErrorString = "";
TSoapIntf.prototype.SOAPClient = null;
TSoapIntf.prototype.attr_TabId = null;
TSoapIntf.prototype.TabId = function (value) {
	if (!arguments.length) {
		return this.attr_TabId;
	}
	this.attr_TabId = value;
}
TSoapIntf.prototype.ServerURL = function (value) {
	if (!arguments.length) {
		return this.attr_ServerURL;
	}
	this.attr_ServerURL = value;
}
TSoapIntf.prototype.WSDLURL = function (value) {
	if (!arguments.length) {
		return this.attr_WSDLURL;
	}
	this.attr_WSDLURL = value;
}
TSoapIntf.prototype.error = function (value) {
	if (!arguments.length) {
		return this.attr_Error;
	}
	this.attr_Error = value;
}
TSoapIntf.prototype.errorString = function (value) {
	if (!arguments.length) {
		return this.attr_ErrorString;
	}
	this.attr_ErrorString = value;
}

TSoapIntf.prototype.invoke = function (method, async, callback, wsdlurl) {
	var r = null;
	if (isVarUndefined(wsdlurl))
		wsdlurl = "";
	if (wsdlurl=="")
		wsdlurl=this.attr_WSDLURL;
	if (isVarUndefined(async)) {
		async = false;
	} else {
		async = AnyToBool(async);
	}
	//da manche Soapkommandos über die alte Technik (ISoap-Komponente auf der MP-Page) laufen und andere hierüber 
	// setzen wir das globale Flag routed, damit die nachfolgenden GetParam-Aufrufe an der richtigen Stelle auflaufen
	if ((typeof ISoap === 'undefined')==false) {
	  if (isVarUndefined(ISoap) == false)
		ISoap._routed(true);
	}  
	if (async) {
		this.SOAPClient.invoke(this.attr_ServerURL, wsdlurl, method, gvSoap.pl, async, this.attr_TabId, callback);
		return 0;
	} else {
		r = this.SOAPClient.invoke(this.attr_ServerURL, wsdlurl, method, gvSoap.pl, async, this.attr_TabId, callback);
	}  
  if (AnyToBool(isVarUndefined(r))==true){ 
  	this.internalRes = 0;
	  this.attr_Error=0;
	  return 0;
  } 
	this.internalRes = r;
	this.attr_Error=r.return;
	return r.return;
}


TSoapIntf.prototype.addParams = function (bReset, sName, sValue) {
  var i=1; 
  if (isVarUndefined(bReset)==true)
    bReset=true;
  if (bReset==true){
	  this.resetParams();
  }
  while ((i+1)<arguments.length){
    this.pl.add(arguments[i],arguments[i+1]); 
    i=i+2;
  }               
};


TSoapIntf.prototype.resetParams = function () {
	this.SOAPClient.error = 0;
	this.SOAPClient.errorstring = "";
	this.pl = new SOAPClientParameters();
}

TSoapIntf.prototype.getParam = function (name, value) {
	if (this.internalRes == null) {
		return "";
	}
	if (!this.internalRes[name]) {
		return "";
	}
	if (!this.internalRes[name]instanceof Function) {
		return this.internalRes[name]();
	}
	return this.internalRes[name];
}

function TSoapParameter(guiowner) {
	if (arguments.length <= 0) {
		return;
	}
	this.pl = new SOAPClientParameters();
}

TSoapParameter.prototype = new Object;
TSoapParameter.prototype.constructor = TSoapParameter;

TSoapParameter.prototype.pl = null;
TSoapParameter.prototype.addParam = function (name, value) {
	this.pl.add(name, value);
}
TSoapParameter.prototype.resetParams = function () {
	this.pl = new SOAPClientParameters();
}

function TSoapResponse(guiowner) {
	if (arguments.length <= 0) {
		return;
	}
};

TSoapResponse.prototype = new Object;
TSoapResponse.prototype.constructor = TSoapResponse;

TSoapResponse.prototype.internalRes = null;
TSoapResponse.prototype.GetParameter = function (name, value) {
	if (this.internalRes == null) {
		return "";
	}
	if (!this.internalRes[name]) {
		return "";
	}
	if (!this.internalRes[name]instanceof Function) {
		return this.internalRes[name]();
	}
	return this.internalRes[name];
}

