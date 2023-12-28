/*
 * LRS Wrapper für Lernprogramme die mit IdeaLIVE LMS zusammen arbeiten sollen
 */

var LLapiHandle = null;
	
function getLLAPIHandle()
{
   if (LLapiHandle == null)
   {
      LLapiHandle = getLLAPI();
   }

   return LLapiHandle;
}

function findLLAPI(win){
  var findAPITries=0;
  
   while ((win.LULAPI == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
  
      if (findAPITries > 7) 
      {
         console.log("Error finding API -- too deeply nested.");
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
	  //console.log("Unable to find an API adapter");
	 }
	 return theAPI
	 }catch(e){return null;}
	}


function findCourseID(win){
	  var findAPITries=0;
	   while ((win.courseID == null) && (win.parent != null) && (win.parent != win))
	   {
	      findAPITries++;
	      
	      if (findAPITries > 7) 
	      {
//	         alert("Error finding API -- too deeply nested.");
	         return null;
	      }
	      
	      win = win.parent;

	   }
	   return win.courseID;
	}


function getCourseID(){
	 try {
	 var courseID = findCourseID(window);
	 if ((courseID == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
	  courseID = findCourseID(window.opener);
	 }
	 if (courseID == null) {
	  console.log("Unable to find an API adapter");
	 }
	 return courseID
	 }catch(e){return null;}
	}

function getUserInfo(){
	var lulapi=getLLAPIHandle();
	var result=lulapi("getUserInfo",[]);
	return result;
}


function getLRSInfo(){
  var result=null;
	var lulapi=getLLAPIHandle();  
  if (lulapi!=null) 
	  result=lulapi("getLRSInfo",[]);
	return result;
}