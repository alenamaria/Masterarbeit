/************************************************************************
 pages.js: 
 Interface zum Anlegen, Öffnen, Bearbeiten und Löschen von Seiten 
 Die hier realisierten Teile werden sowohl in IdeaTEAM wie auch in knowtion 
 benötigt und basieren auf der alten IdeaTEAM Servermodul Versiono
 ************************************************************************/

 var gvPages=[];

 const aPages = {};

 /*
 aProject.setDescription = function (sDescription) {
    this.description=sDescription;
 };
  */
 
/*
 function gaOpenProject(prjName){
     var aProject = new Object();
     aProject.intName="";
     aProject.title="";
     aProject.id="0";
     gvProjects.push(aProject.id, aProject);
     return aProject.id;
 }
 */
 function asPage(prjID, pageID){
   this.pageID=pageID;
   this.prjID=prjID;
   this.title="";
   this.tplType=0;
   this.fileType;
   this.tplName="";
   this.xml="";
   this.mergedXML="";
   this.modified=false;   
 }


function asGetOpenPage(prjID,pageID){
    for (var i = 0; i < gvPages.length; i++) {
        if ((gvPages[i].prjID == prjID)&&(gvPages[i].pageID == pageID))
            return gvPages[i];
    }
    return null;
}

/*
function asLoadPage(prjID, pageName, fileType, lockState, version, cleanPage){
// loads the relevant data of the specified (XML string, Nice name, Template type,...)
// empty string in case of error

// prjID: Projekt ID
// pageName: internal page name
// fileType: otPage, otTemplate, otAssistant, otLocalAssistant,... (default = otPage)
// lockState: Lockstate (0 oder 1 - default = unlocked)
// lngToken: Language token (optional)
// sParam5: Version (optional)
// cleanPage: 1 oder 0, optional removing comments, line breaks,... - default = 0 
  var s="";
  var sError="0";
  var sResult="";
  var pageObj=sfLoadPage(prjID, pageName);
  if (pageObj==null){
    gvSoap.error(cProjectNotOpen);
    //== cNoError)
    return false;  
  }
  // prüfen, ob Projekt bereits geöffnet - in dem Fall liefert sfOpenProject keinen Fehler, sondern die ID des bereits geöffneten Projektes
  var prj=asGetOpenProject(prjID);
  if(prj!=null) {
    return prjID;
  }
  prj=new asProject(prjName, prjID);
  prj.sysLib="";
  // Varfile laden -  _PrjLangToken noch nicht initialisert ??!!
  s=sfLoadSpecialFile(prjID, otVarFile, "", lsUnLocked, prj.langToken,"0");
  if(s=="")
    return sResult;
  LoadVarFile(s,"Variablen");
 

 gvProjects.push(prj);
 return prjID;
}
*/

function asLoadPage(prjID, pageID, fileType, lockState, langToken, version, cleanPage, addNameID){
// loads the specified page as a XML string
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// lockState: lsLocked, lsUnlocked (=default)  
// langToken: LanguageToken (optional)
// version: Version (optional), 0=youngest version
// cleanPage: 1, 0 (=default), optional remove of comments, line breaks and more  
// addNameID: 1, 0 (=default), optional adds to the page root and to component nodes an attribut id=name  
// returns the xmldata of the specfied page
  var sOptions;
  if (AnyToBool(isVarUndefined(fileType)||(fileType=="")))
    fileType=otPage;
  if (lockState!=lsLocked)
    lockState=lsUnLocked;
  if (AnyToBool(isVarUndefined(langToken)))
    langToken="";
  if (AnyToBool(isVarUndefined(version)))
    version="";
  if (AnyToBool(isVarUndefined(cleanPage)))
    cleanPage="0";
  if (cleanPage!="1")
    cleanPage="0";
  if (AnyToBool(isVarUndefined(addNameID)))
    addNameID="0";
  if (addNameID!="1")
    addNameID="0";

  sOptions="";
  if(langToken!="")
    sOptions="LangToken=" + langToken;
  if(version!="")
    sOptions!="" ? sOptions=sOptions+",Version="+version : sOptions="Version="+version;
  if(cleanPage=="1")
    sOptions!="" ? sOptions=sOptions+",CleanPage=1" : sOptions="CleanPage=1";
  if(addNameID=="1")
    sOptions!="" ? sOptions=sOptions+",AddNameID=1" : sOptions="AddNameID=1";
  sfLoadPage(prjID, pageID, fileType, lockState, sOptions);
  if (gvSoap.error() == cNoError)
    return gvSoap.getParam("PageData");
  else
    return "";
}

function asSavePage(prjID, pageID, fileType, pageData, restXML, langToken, syncTrans, syncMediaUsage){
// saves the specified page
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// sPageData: XML data of page
// sRestXML: optionale Basis fürs Entmergen
// langToken: LanguageToken (optional), Der oberste Layer ist in der angegebenen Sprache und wird im
//            Sprachenverzeichnis gespeichert. HINWEIS: Die eigentliche Page wird NICHT gespeichert!
// syncTrans: optional, wird in der Projektsprache gespeichert, kann hier gesteuert werden, ob
//             nach dem Speichern "SyncTranslationData" für alle Sprachen aufgerufen wird
//             1= automat. Synchronsierung aller Sprachen
//             2= unabhängig von der Config  keine automat. Synchronsierung
//             0= automat. synchronisiert, hängt von der Configvariablen "AutoSyncTranslation" ab (=Default)
// syncMediaUsage: Aktualisierung der MedienDB bzgl. der Mediennutzung auf dieser Seite (0=Default)
//                 0= ob gesynct wird hängt vom Wert der Config-Variablen "AutoSyncMediaUsage" ab
//                 1= es wird synchronisiert  
// returns True or False
// spezielle Fehlercodes: cCannotSaveFile, cCannotDeleteFile, cFiletypeNotSupported
  var sOptions, result;
  // Abwärtskompatibilität
  if(fileType=="0")
    fileType=otPage;
  if(fileType=="1")
    fileType=otTemplate;
  if(AnyToBool(isVarUndefined(langToken)))
    langToken="";
  if(AnyToBool(isVarUndefined(syncTrans)))
    syncTrans="0"; //IAL._AutoSyncTranslation();
  if(AnyToBool(isVarUndefined(syncMediaUsage)))
    syncMediaUsage="0"; //IAL._AutoSyncTranslation();
  sOptions="";
  if(langToken!="")
    sOptions="LangToken=" + langToken;
  if ((syncTrans=="1")||(syncTrans=="2"))
    sOptions!="" ? sOptions=sOptions+",SyncTranslation="+syncTrans : sOptions="SyncTranslation="+syncTrans;
  if (syncMediaUsage=="1")
    sOptions!="" ? sOptions=sOptions+",SyncMediaUsage=1" : sOptions="SyncMediaUsage=1";
  result=sfSavePage(prjID, pageID, fileType, pageData, restXML, sOptions);
  //!! das Servermodul vom 23.11. liefert -37, wenn die Seiten physikalisch nicht vorhanden sind (CFW , Mastertemplate, TestseitenMaster)
  if ((gvSoap.error()==cPageNotFound)&&((pageID.toLowerCase().indexOf("cfw_s")>=0)||(pageID.toLowerCase().indexOf("testseitenmaster")>=0)||(pageID.toLowerCase().indexOf("mastertemplate")>=0))){
    gvSoap.error(cNoError);
    result=true;
  }
 return result;
}

function asNewPage(prjID, pageID, pageType, templateID, templateType){
// erzeugt eine neue Seite und liefert den internen eindeutigen Namen der neuen Seite oder Leerstring bei Fehler
// prjID: Handle des geöffneten Projekts
// pageID: der interne eindeutige Name der neuen seite wird automatisch erzeugt. Enthält pageID einen String, 
// wird der neue Name daraus eindeutig abgeleitet
// pageType: otPage (=Default), otLocalTemplate, otLocalAssistant
// templateID: internal name of template, bei Leerstring basiert die Seite auf keinem vorhandenem Template  
// templateType: Typ des angegebenen Templates: otTemplate (=default), otMasterTemplate, otLocalTemplate,
//               otLocalAssistant, otAssistant
  var sResult="";
  if ((pageType!=otLocalTemplate)&&(pageType!=otLocalAssistant))
    pageType=otPage;
  if((templateType!=otLocalTemplate)&&(templateType!=otMasterTemplate)&&(templateType!=otLocalAssistant)&&(templateType!=otAssistant))
    templateType=otTemplate;
  sfNewPage(prjID, pageID, pageType, templateID, templateType);
  if (gvSoap.error() == cNoError)
    sResult=gvSoap.getParam("RealPageName");
  return sResult;
}

function asDeletePage(prjID, pageID, fileType){
// deletes the file name of the specified page
// prjID: Handle des geöffneten Projekts  
// pageID: internal page name
// fileType: otPage,otLocalTemplate,otLocalAssistant
// returns true or false
  if((AnyToBool(isVarUndefined(fileType))==true)||((fileType!=otLocalTemplate)&&(fileType!=otLocalAssistant)))
    fileType=otPage;
  return sfDeletePage(prjID, pageID, fileType);
}

function asDuplicatePage(prjID, pageID, pageType, newPageName){
// duplicates the specified page
// prjID: Handle des geöffneten Projekts
// pageID: source page
// pageType: otPage(=default), otLocalTemplate,...
// newPageName: NewPageName (optional)
//          Wird ein Name vorgegeben, so wird dieser ggf. eindeutig
//          gemacht und verwendet. Bei Leerstring wird ein neuer Name
//          auf Basis des alten Namens generiert und zurückgegeben

// Return value ist der neue Name oder Leerstring bei Fehler
  var sResult;
  //stopOnThis("/ideawas/pages.js", "waDuplicatePage");
  sResult=sfDuplicatePage(prjID, pageID, pageType, newPageName, ""); 
  if (gvSoap.error() == cNoError)
    sResult= gvSoap.getParam("NewPageName");
  else
    sResult="";
  return sResult; 
}


function asSetPageTemplate(prjID, pageID, newTemplateID, localTemplate) {
// Ändert das von der Seite referenzierte Template
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// newTemplateID: internal name of new template 
// localTemplate: true falls e ein lokales Template ist, sonst false3 (=default) 
// liefert true or false
  if (isVarUndefined(localTemplate))
    localTemplate = false;
  if (localTemplate != true)
    localTemplate = false;
  return sfSetPageTemplate(prjID, pageID, newTemplateID, localTemplate);
}

function asMergePage(prjID, pageName, topLayerXML, fileType, topLayerType, options){
// mergt eine Seite des angegebenen Typs und stellt das Ergebnis über diverse getParam()-Abrufe bereit 
// prjID: Handle des geöffneten Projekts
// pageName: Name des oberseten Layers = name of page
// topLayerXML: Wird ein PageXML übergeben, wird dieses XML als Layer 0 genommen und nicht das aus dem Filesystdem
// fileType: otPage, otLocalTemplate, otTemplate, otMasterTemplate
// topLayerType: Dieser Layertyp soll on Top liegen: (ltLanguage, ltPage)
// options:
//         LangToken=<token>: Die Page wird in der angegebenen Sprache geliefert
//         ASA=1: Wenn ASA (AddSpecialAttributes) angeschaltet ist, dann werden die Attribute __LN (LayerNumber) und __LI (LayerInfo) hinzugefügt (siehe oben).
//         CleanPage=1: Die Attribute, die in der Config Tabelle im Attribut "RemoveAttrList" gelistet sind, werden aus PageXML und RestXML entfernt. Außerdem
//                      werden alle ScriptKommentare entfernt. default=0 (es wird nichts entfernt)
//         PageMergeMode=1: Der Mergeprozess läuft nur bis zum ersten Vorkommen einer anders benannten Page im Projektverzeichnis (exklusive!) 
//                          default=0 (es wird bis zum Ende  der Referenzkette gemerged)

// Folgende Infos können nach der Ausführung via gvSoap.getParam() abgerufen werden 
// LayerList: Hier wird die Liste der Layer zurückgegeben. Im Index 0 der oberste, etc
//            Format je Eintrag: Scope=RealName
// PageXML: Die fertig gemergte Page
// RestXML: Die gemergte Page OHNE den obersten Layer
  return sfMergePage(prjID, pageName, topLayerXML, fileType, topLayerType, options);
}

function asOpenPage(prjID, pageID, fileType, lockState, Langtoken){
// liefert ein page object oder null
// lädt die XML-Daten der Seite
// prjID: Handle des geöffneten Projekts. Das heißt, das Projekt muss zuvor geöffnet werden
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// lockState: lsLocked, lsUnlocked (=default)
  stopOnThis("as\pages.js","asOpenPage");
  var s="";
  var sError="0";
  var sResult="";
  // prüfen, ob Projekt bereits geöffnet - in dem Fall liefert sfOpenProject keinen Fehler, sondern die ID des bereits geöffneten Projektes
  var prj=asGetOpenProject(prjID);
  if(prj==null) {
    gvSoap.error(cProjectNotOpen);
    return null;
  } 
  // Wenn Projekt geöffnet, dann jetzt prüfen, ob die seite bereits geöffnet
  var objPage= asGetOpenPage(prjID, pageID);
  if (objPage!=null){
    return objPage;
  }
  objPage=new asPage(prjID, pageID);
  // Wenn hier angekommen, wird jetzt die Seite geöffnet, indem das XML geladen wird
  // und das PageObjekt erzeugt und der Liste geöffneter Seiten hinzugefügt wird
  //sfLoadPage(prjID, pageID, fileType, lockState);
  objPage.xml=asLoadPage(prjID, pageID, fileType, lockState, Langtoken, "", "0");
  objPage.fileType=fileType;

  gvPages.push(objPage);
  return objPage;
  
  /*
  if (pageObj==null){
    gvSoap.error(cProjectNotOpen);
    //== cNoError)
    return false;
  }
  // prüfen, ob Projekt bereits geöffnet - in dem Fall liefert sfOpenProject keinen Fehler, sondern die ID des bereits geöffneten Projektes
  var prj=asGetOpenProject(prjID);
  if(prj!=null) {
    return prjID;
  }
// langToken: Langtoken (optional)
  //stopOnThis("as\projects.js","asCloseProject");
  */    
}

function asClosePage(prjID, pageID){
// Gibt das gecashte Page-Objekt wieder frei
// prjID: Handle des geöffneten Projekts, zu dem die Page gehört.
// pageID: internal Name of page
// liefert true or false
  var i;
  //stopOnThis("as\pages.js","asClosePage");
  var objPage=asGetOpenPage(prjID, pageID);
  if(objPage==null)
    return false;
 
  // aus der Liste der gecashten Seiten entfernen  
  for (var i = 0; i < gvPages.length; i++) {
    if ((gvPages[i].prjID == prjID)&&(gvPages[i].pageID == pageID)){
      gvPages.splice(i,1);
      return true;
      break;
    }
  } 
  return false;
}

function asLoadTemplate(prjID, templateID){
// loads the specified template as a XML string
// prjID: Handle des geöffneten Projekts. Das heißt, das Projekt muss zuvor geöffnet werden
// templateID: internal Name of template
 return asLoadPage(sParam1,otTemplate,lsUnLocked,"","","0");
}

function asSetPageMetadata(prjID, pageID, fileType, metaData, isChapter, langToken) {
// Metadaten einer Seite oder eines Template setzen
// prjID: Projekt-ID
// pageID: interner Page name
// fileType: otPage (=default), otLocalTemplate, otTemplate, otLocalAssistant 
// metaData: z.Bsp. Caption="Tolle Seite"
// isChapter:  0=Seite, 1=Kapitel (optional)
// langToken: die Sprache (optional)
// returns TRUE or FALSE
  if ((AnyToBool(isVarUndefined(fileType))) || (fileType == ""))
    fileType = otPage;
  // to be compatible with old IsTemplate parameter
  if (fileType == "0")
    fileType = otPage;
  if (fileType == "1")
    fileType = otTemplate;

  if (AnyToBool(isVarUndefined(isChapter)))
    isChapter = "";
  var sOptions = "";

  if (isChapter == "1")
    sOptions = "IsChapter=1";
  if (langToken != "") {
    if (sOptions != "")
      sOptions = sOptions + ",";
    sOptions = sOptions + "LangToken=" + langToken;
  }
  sfSetPageMetadata(prjID, pageID, fileType, metaData, sOptions);
  return (gvSoap.error() == cNoError ? true : false);
}