/************************************************************************
 projects.js: 
 Interface zum Anlegen, Öffnen, Bearbeiten und Löschen von Projekten 
 Die hier realisierten Teile werden sowohl in IdeaTEAM wie auch in knowtion 
 benötigt und basieren auf der alten IdeaTEAM Servermodul Version
 ************************************************************************/

 var gvProjects=[];

 const aProject = {};

 aProject.setDescription = function (sDescription) {
     this.description=sDescription;
 };
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
 function asProject(prjName, prjID){
   this.intName=prjName;
   this.id=prjID;
   this.title="";
   this.description=null;
   this.cssFiles="";
   this.cssTextFiles="";
   this.cssLocalFiles="";
   this.type=ptCourse;
   this.assiUrl="";
   this.ownerName="";
   this.ownerID=0;
   this.tpf="";
   this.srcLang="";
   this.langToken="";
   this.cfwActive="0";
   this.cfwContainer="";
   this.sysLib="";
   //this.tree="";
   this.autoSyncTranslation=2;
   //  sPageAutoCfg="0";
 }

function asResetPassword(user, newPwd, createSHA1){
// Das Passwort eines Users neu setzen, ohne das alte zu kennen
// user: Username (muss bereits existieren)
// newPwd: new Password
// createSHA1: CreateSHA1=0 (=default) dsas Passwort wird ohne weitere Konvertierung 1:1 in DB abgelegt
//                       =1 das Passwort wird vor dem Schreiben geccrypted
// returns true or false
    var options="";
    if (createSHA1=="1")
      options="CreateSHA1=1";
    sfResetPassword(user, newPwd, options);
    /*
    gvSoap.addParams(true, "Username", user, "NewPassword",newPwd);
    if (createSHA!=="1")
        gvSoap.addParams(false, "Options","CreateSHA1=1");
    gvSoap.invoke("ResetPassword", false, null, spWSDL + spAdminIntf);
    return (gvSoap.error() == 0 ? true : false);

    */
}


function asAddUser(userName, eMail, userType, active){
// fügt den angegebenen User hinzu
// userType: utGuest, utCustomer, utStandard, utSystem (default=utStandard=utCustomer)
// active:  setzt das gleichnamige Feld in der Usertabelle auf "0" oder "1" (default=1)
// Hinweis: Passwort muss SetPassword gesetzt werden
// returns true or false
  var sUserData="Name="+scDQ+userName+scDQ;
  // eMail
  if(eMail!="")
    sUserData=sUserData+",EMail="+scDQ+eMail+scDQ;
  // Usertype
  if((userType!=utGuest)&&(userType!=utSystem))
    userType=utStandard;
  sUserData=sUserData+",Usertype="+scDQ+userType+scDQ;
  // Aktiv
  if(active!="0")
    active="1";
  sUserData=sUserData+",Active="+scDQ+active+scDQ;
  // Deleted
  sUserData=sUserData+",Deleted="+scDQ+"0"+scDQ;
  return sfAddUser(sUserData);
}

function asAddUserToGroup(userName, groupName){
// adds the specified user to the specified group
// returns true or false
  gvSoap.addParams(true, "UserName", userName, "GroupName", groupName);
  gvSoap.invoke("AddUserToGroup", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}


function asGetOpenProject(prjID){
    for (var i = 0; i < gvProjects.length; i++) {
        if ((gvProjects[i].id == prjID)||(gvProjects[i].intName == prjID))
            return gvProjects[i];
    }
    return null;
}

function asListProjects(prjTypes, listmode, dataformat, deleted, catlist, catfilter) {
// returns the list of projects available for the logged in user
// prjTypes: rauteseparierte Liste der gewünschten ProjectTypes (ptCourse#ptClient#...), default=ptCourse
// listmode: - 1: Kommasep. Liste der Projektnamen (DEFAULT)
//           - 2: Kommasep. Liste von Projektinfos (ProjectName, ProjectNiceName, Author, CreationTime)
//           - 3: wie ListMode 2 aber mit "DeletionTime".
//           - 4: unabhängig von der Rechtsituation für alle nur die Felder "ProjectName" und "DeletionTime"
// dataformat: - 0 = comma seperated lescrist of multiple values for each found course.
//                   values for one course are seperated by semicolon
//             - 1 = XML format (!!!!! not yet supported !!!!!!!)

// deleted  - "0" = nicht gelöschte (Default)
//          - "1" = gelöschte
// catlist: optionale URL-Encoded catList (kommapsepariert)
// catfilter: 0 (DEFAULT) die Kategorien werden OR verknüpft, bei 1 AND verknüpft
  return sfListProjects(prjTypes, listmode, dataformat, deleted, catlist, catfilter);
}

function asOpenProject(prjName){
  // öffnet das angegebene Projekt, lädt das Varfile, CSS Files und initialisert einige Projekteigenschaften via Makros
  // liefert bei Erfolg die ProjektID, Leerstring bei Fehler
  var cssFiles=[];
  var cssLocalFiles=[];
  var cssTextFiles=[];
  var s="";
  var sError="0";
  var sResult="";
  var prjID=sfOpenProject(prjName);
  if (prjID==0){
    return sResult;  
  }
  // prüfen, ob Projekt bereits geöffnet - in dem Fall liefert sfOpenProject keinen Fehler, sondern die ID des bereits geöffneten Projektes
  var prj=asGetOpenProject(prjID);
  if(prj!=null)
    return prjID;

  prj=new asProject(prjName, prjID);
  prj.sysLib="";
  // Varfile laden -  _PrjLangToken noch nicht initialisert ??!!
  s=sfLoadSpecialFile(prjID, otVarFile, "", lsUnLocked, prj.langToken,"0");
  if(s=="")
    return sResult;
  LoadVarFile(s,"Variablen");
 
  // Targetplatform - !! nach dem Laden des Varfiles !!
  prj.tpf=GetVariableEx("Projectsettings","TargetPlatform",tpfDesktop,"Variablen");
  if ((prj.tpf!=tpfPhone)&&(prj.tpf!=tpfTablet))
     prj.tpf=tpfDesktop;    
  s="TPF=" + prj.tpf;
  //IAL._aExecuteMacro("MACRO_GetProjectInfo",IAL._PrjHandle(),"TPF="+IAL._PrjTpf(),"KeyName=AutoSyncTranslation","","","",cConfigVarNotDefined);
  sfExecuteMacro("MACRO_GetProjectInfo", prj.id, "TPF=" + prj.tpf, "KeyName=AutoSyncTranslation", "", "", cConfigVarNotDefined);
  //sError=AnyToStr(ISoap.GetResultData("ErrorCodeEX"));
  sError = gvSoap.getParam("ErrorCodeEX");
  if ((gvSoap.error()==cNoError)&&(sError="0")){ 
    prj.assiUrl=gvSoap.getParam("Param1");
    prj.ownerName=gvSoap.getParam("Param2");
    //prj.niceName=gvSoap.getParam("Param3");
    prj.title=gvSoap.getParam("Param3");
  
    var sParamX=gvSoap.getParam("Param4");
    var a=[];
    if (sParamX.length>0)
      a=sParamX.split(",");
    if (a.length>0)
      prj.cfwActive=a[0];
    if (a.length>1)
      prj.ownerID=a[1];
    if (a.length>2)
      prj.srcLang=a[2];
    if (prj.srcLang=="")
      prj.srcLang="de";
    if ((AnyToBool(prj.cfwActive)==true)&&(a.length>3))
      prj.cfwContainer=a[3];
    //if (a.length>4)
    //  prj.autoSyncTranslation=a[4];
  }
  // CSS-Files des Templateprojektes
  prj.cssFiles=GetVariableEx("Projectsettings","CSSFile","","Variablen");
  // lokale CSS-Files des Projektes 
  prj.cssLocalFiles=GetVariableEx("Projectsettings","ProjectCSSFile","","Variablen");
  /*
  if(IAL._PrjCSSFile()!="") 
    IAL._PrjCSSFile(expandmetavarEx(IAL._PrjCSSFile(),"Variablen"));
  */
  prj.cssTextFiles=GetVariableEx("Projectsettings","TextCSSFile","","Variablen");
  /*
  if(IAL._PrjTextCSSFile()!="") 
    IAL._PrjTextCSSFile(expandmetavarEx(IAL._PrjTextCSSFile(),"Variablen"));
  */
  prj.langToken=prj.srcLang;
  if(prj.cssFiles.trim().length>0){
      cssFiles=prj.cssFiles.split(",");
  }
  if(prj.cssLocalFiles.trim().length>0){
    cssLocalFiles=prj.cssLocalFiles.split(",");
    cssFiles=cssFiles.concat(cssLocalFiles);
  }
  if(prj.cssTextFiles.trim().length>0){
    cssTextFiles=prj.cssTextFiles.split(",");
    cssFiles=cssFiles.concat(cssTextFiles);
  }
  for (i=0; i<cssFiles.length; i++){
    LoadCSSfile(expandmetavarEx(cssFiles[i],"Variablen"));
  }

  // Aus dem Varfile die aktuelle Einstellung für die automat. Konfiguration von Seiten auslesen 
  //sPageAutoCfg=GetVariableEx("Projectsettings","PageAutoConfig",sPageAutoCfg,"Variablen")
  //ActionList.setActionParam("30060",apParam1,sPageAutoCfg);
  //MP_Menu.SetCheckboxChecked("30060",sPageAutoCfg);

  // Rechtekontext neu initialisieren
  //IRF._InitPrjRight(IAL._PrjHandle(),"","");
  
   // sResult=AnyToStr(IAL._PrjHandle());
    // !! Workarround für Timingproblem beim Laden der CSS) !!

 gvProjects.push(prj);
 return prjID;
}

function asCloseProject(prjID){
// entlädt die registrierten CSS-Files und schließt das angegebene Projekt
// prjHandle: Handle des Projekts 
// liefert true or false

  var cssFiles=[];
  var cssFiles2=[];
  var i;
  //stopOnThis("as\projects.js","asCloseProject");
  if((prjID=="")||(prjID=="0"))
    return true;
  //var prj=null;
  var prj=asGetOpenProject(prjID);
  if(prj==null)
    return false;
  // CSS-Files entladen
  // ...des Templateprojekts - allgemein  
  if(prj.cssFiles.trim().length>0){
    cssFiles=prj.cssFiles.split(",");
  }
  // ...des Templateprojekts - Tiny
  if (prj.cssTextFiles.trim().length>0){
    cssFiles2=prj.cssTextFiles.split(",");
    cssFiles=cssFiles.concat(cssFiles2);
  }
  // ...lokale des Projekts
  if (prj.cssLocalFiles.trim().length>0){
    cssFiles2=prj.cssLocalFiles.split(",");
    cssFiles=cssFiles.concat(cssFiles2);
  }
  // ... jetzt alle entladen
  for (i=0; i<cssFiles.length; i++){
    removejscssfile(expandmetavarEx(cssFiles[i],"Variablen"),"css");
  }
  prj.cssFiles="";
  prj.cssTextFiles="";
  prj.csslocalFiles="";
  if (sfCloseProject(prjID)==true) {
    // aus der Liste der offenen Projekte entfernen  
    for (var i = 0; i < gvProjects.length; i++) {
      if (gvProjects[i].id == prjID){
        gvProjects.splice(i,1);
        break;
      }
    }      
    return true;
  }else {
    return false;      
  }    
}

function asCreateProject(prjName,ptName,ptSource,prjType,tplName,tplLocal,ptLocal){
//
// neues Projekt anlegen
//
// prjName: title of new project (maxlength=50) will be converted into unique internal project name
// ptName: name or id of pattern, empty means default pattern from config db
// ptSource: 0=Pattern (= default)
//           1=lokales Projekt
// prjType: Typ des anzulegenden Projektes - Default=ptCourse
// tplName: Name des Templateprojekts das in der iproject.ini eingetragen wird (default = '')
// tplLocal: 0=tplName ist ein System-Templateprojekt (default)
//           1=tplName ist ein lokales Projekt des Mandanten
// ptLocal   0=prjName wird als Systempattern erzeugt (default) - nur relevant beim Erzeugen von Patternprojekten, also prjType=ptPattern
//           1=prjName wird im Mandantenscope erzeugt
//

  var sResult="";
  var sOptions="";
  // Als Startpunkt die Kopie eines Patternprojektes oder eines lokalen Standard-Projektes
  if(ptSource=="1")
    sOptions="ProjectSource=1";
  else
    sOptions="ProjectSource=0";
  // Project type - Normales Projekt oder Pattern Projekt
  if(AnyToBool(isVarUndefined(prjType)))
    prjType="";
  if(prjType!="")
    sOptions=sOptions + ",ProjectType=" + prjType;
  // Template Name
  if(AnyToBool(isVarUndefined(tplName)))
    tplName="";
  if(tplName!=""){
    sOptions=sOptions + ",TemplateName=" + tplName;
    // TemplateIsLocal
    if(AnyToBool(isVarUndefined(tplLocal)))
      tplLocal="";
    if(tplLocal!="")
      sOptions=sOptions + ",TemplateIsLocal=" + tplLocal;
  }
  if(AnyToBool(isVarUndefined(ptLocal)))
    ptLocal="";
  if (ptLocal=="1")
    sOptions=sOptions + ",PatternIsLocal=1";
  var sResult=sfCreateProject(prjName, ptName, sOptions);
  return sResult;

/*  gvSoap.addParams(true, "NewProjectName", prjName, "PatternName", ptName, "Options", sOptions);
  gvSoap.invoke("CreateProject",false,null,spWSDL+spWebDataIntf);
  if (gvSoap.error()==cNoError)
    sResult=gvSoap.getParam("ProjectName");
  return sResult;

--------------------
  var prjIntName=sfCreateProject(prjName, ptName, ptSource, prjType, '','','');
  --------------------------
  // wenn es geklappt hat, liefert prjIntName den eindeutigen internen Projektnamen
  if (gvSoap.error()!=cNoError) {
    ISoap.ok(false);
    ISoap.Error(gvSoap.error());
  }else{
    ISoap.ok(true);
    ISoap.Error(cNoError);
  }
  return prjIntName;
  */
}



function asDeleteProject(prjID, delOption, lngToken){
// deletes a project

// prjID: name or id of project
// delOption: 0: project remains physically (default)
//            1: project will be deleted physically too
//            2: ein mit "ToPublic=1" gepublishter Kurs wird gelöscht (derzeit nur bei LSB)
//            3: ein mit "ToPublic=3" (nach IDEALive) gepublishter Kurs  wird gelöscht (PVA)
// lngToken: LanguageToken - nur in Verbindung mit sParam2="2" oder "3"
// returns true or false
  return sfDeleteProject(prjID, delOption, lngToken);
}

function asLoadPrjTreeEx(prjID, treeType, lngToken, liveTransState, mergeMode, cacheMode, addPool){
// liefert einen der speziell aufbereiteten Tree des Projekts als XML-string oder Leerstring bei Fehlern laden
// prjID: name or id of project  
// treeType: otPrjTree,otPrjTreeEx,otTemplTree,otTemplTreeEx (default = otPrjTreeEx)
// lngToken: optional LangToken
// liveTransState: LiveTransStatus (optional)
//          1=Übersetzungsstatus wird neu erzeugt
//          0=liefert den zuletzt gespeicherten Status
//          2=Es wird kein Übersetzungsstaus geliefert
//          !!! neue Implementierung: Es wird das zusätzliche Attribut "TransStatusChecked='0'" eingefügt  !!!
// mergeMode (optional) - 0=mmAuto = Default - heißt Servermodul entscheidet abhängig vom FileType
//                                   otPrjTree       : MergeMode=1 wenn als TemplateProjekt markiert (pitIsTemplateProject) sonst MergeMode=0
//                                   otLocalTemplTree: MergeMode=0
//                                   otTemplTree     : MergeMode=1
//                        1=mmMerged (es wird aus allen Trees bis zum letzten referenierten Templateprojekt gemerged)
//                        2=mmNotMerged (kein Mergen)  
// cacheMode: 0=kein Cache, 1=Cache aktualisieren wenn nötig(DEFAULT),2=immer Cache
// addPool:   0=nein (DEFAULT),1=ja
  var sResult="";
  var sOptions="";
  //stopOnThis(asLoadPrjTreeEx(),1);
  if((treeType=="")||(treeType==otPrjTreeEx))
    treeType=otPrjTree;
  // Seit der TemplateTree per Defintion nur Dialogsprachen-relevant ist,
  // regelt das ServerModul das mergen der richtigen Sprachlayer
  //if ((sParam1==otTemplTree)&&(sParam2==""))
  //  sParam2=IMP._DlgLangToken();
  if (treeType==otTemplTree)
    lngToken="";
  if(lngToken!="")
    sOptions=StrConcat("LangToken=",lngToken);

  // LiveTransStatus 
  if(liveTransState=="1"){
    if(sOptions!="")
      sOptions=StrConcat(sOptions,",LiveTransStatus=1");
    else
      sOptions="LiveTransStatus=1";
  }
  if(liveTransState=="2"){
    if(sOptions!="")
      sOptions=StrConcat(sOptions,",NoTransStatus=1");
    else
      sOptions="NoTransStatus=1";
  }
  // MergeMode
  if ((AnyToBool(isVarUndefined(mergeMode))==true)||((mergeMode!=mmMerged)&&(mergeMode!=mmNotMerged)))
    mergeMode=mmAuto;
  if (sOptions!="")
    sOptions=sOptions+",";
  //sParam4="1";
  sOptions=sOptions+"MergeMode="+mergeMode;

  // CacheMode
  if ((AnyToBool(isVarUndefined(cacheMode))==true)||((cacheMode!="0")&&(cacheMode!="2")))
    cacheMode="1";
  sOptions=sOptions+",CacheMode="+cacheMode;

  // Pool 
  // !!! Projekttree wird jettzt immer mit Pool angefordert - der Client löscht ihn dann, wenn er nicht angezeigt werden soll
  // !!! so muss immer nur ein Cachfile (iproject.tc1) ggf. neu erzeugt werden 
  if (treeType==otPrjTree)
    addPool="1";
  if ((AnyToBool(isVarUndefined(addPool))==true)||(addPool!="0"))
    addPool="1";
  sOptions=sOptions+",CreatePool="+addPool;
  sfLoadPrjTreeEx(prjID, treeType, sOptions);
  // Wenn eines der beteiligten PST-Files defekt, wird dennoch ein Tree geliefert und das System lebt weiter  
  if (gvSoap.error()==cStatFileLoadError)
    gvSoap.error(cNoError);
  if (gvSoap.error() == cNoError)  
    return gvSoap.getParam("PrjTreeEX");
  else
    return "";
}

function asAddPrjNode(prjID, treeType, destNode, destPos, nodeType, nodeName, nodeData) {
// fügt dem angegebenen Tree einen neuen Eintrag hinzu
// prjID: ID des Zielprojektes
// treeType: Typ des Trees (otPrjTree, otLocalTemplTree, otLocalAssistantTree)
// destNode: NodeName für Zielposition im Tree
// destPos:  Position relativ zu destrNode (ptitAfter,ptitUnder,ptitBefore,ptitOverwrite)
// nodeType: Typ des neuen Eintrags (ptntChapter,ptntPage)
// nodeName: nur bei ptntPage Name des neuen Eintrages
// nodeData: kommaseparierte Liste der Nodedaten (z.Bsp.: Caption="Schöne Seite",ShowInMenu="1")
// returns interner Name des neuen Nodes, Leerstring bei Fehler
  if ((destPos != ptitUnder) && (destPos != ptitBefore) && (destPos != ptitOverwrite))
    destPos = ptitAfter;
  if (nodeType != ptntChapter)
    nodeType = ptntPage;
  if ((treeType != otLocalTemplTree) && (treeType != otLocalAssistantTree))
    treeType = otPrjTree;
  return sfAddPrjNode(prjID, treeType, destNode, destPos, nodeType, nodeName, nodeData);
}

function asDelPrjNode(prjID, nodeName, treeType) {
// entfernt einen Eintrag aus dem Projekttrree des geöffneten Projekts
// prjID: ID des Zielprojektes
// nodeName: internal unique node name
// treeType: otPrjTree, otLocalTemplTree,...
// returns true or false
  if((treeType!=otLocalTemplTree)&&(treeType!=otLocalAssistantTree))
    treeType=otPrjTree;
  return sfDelPrjNode(prjID, nodeName, treeType);
}

function asMovePrjNode(prjID, nodeName, destNode, destPos, treeType){
// verschiebt einen Eintrag aus dem Projekttree an eine andere Stelle
// verschiebt einen Eintrag aus dem Projekttree an eine andere Stelle
// prjID: ID des Zielprojektes
// nodeName: internal unique node name
// destNode - relativ zu diesem Node ist die neue Position
// destPos  - ptitAfter, ptitUnder
// treeType: otPrjTree, otLocalTemplTree,...
// returns ID des verschobenen Nodes, 0 bei Fehler
  return sfMovePrjNode(prjID, nodeName, destNode, destPos, treeType);
}

function asGetPrjNodeData(prjID, nodeName, attrName, treeType){
// Liefert den Inhalt eines Attribut oder alle Daten des mit NodeID gewählten Nodes des Trees
// prjID: ID des Projektes
// nodeName: eindeutiger Name des nodes
// attrName: NAme des Attributs, Leer=alle Attribute kommasepariert "Name1=Value1","Name2=... 
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
  if((treeType!=otLocalTemplTree)&&(treeType!=otLocalAssistantTree))
    treeType=otPrjTree;
  return sfGetPrjNodeData(prjID, nodeName, attrName, treeType);
}

function asSetPrjNodeData(prjID, nodeName, nodeData, treeType){
// Schreibt Daten eines Eintrags aus dem Projekttree des geöffneten Projekts und liefert true oder false
// prjID: ID des Projektes
// nodeName: eindeutiger Name des nodes
// nodeData: kommaseparierte Liste der Daten
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"    
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
  if((treeType!=otLocalTemplTree)&&(treeType!=otLocalAssistantTree))
    treeType=otPrjTree;
  return sfSetPrjNodeData(prjID, nodeName, nodeData, treeType);
}

function asGetLifeCycleOfPage(prjID, pageID, fileType) {
// ermittelt den LifeCycle einer Seite oder eines Templates bzw. Leerstring brei Fehler
// prjID: ID des Projektes
// pageID: eindeutiger Name der Seite
// lifeCycle: der Wert des gewünschten Status
// fileType: otPage, otTemplate, otMasterTemplate, otLocalTemplate, otComponents
  sfGetLifeCycleOfPage(prjID, pageID, fileType, "");
  if (gvSoap.error() == cNoError)
    return gvSoap.getParam("LifeCycle");
  else
    return "";
}

function asSetLifeCycleOfPage(prjID, pageID, fileType, lifeCycle) {
// setzt den LifeCycle einer Seite oder eines Templates und liefert true oder false
// Die Funktion wird nicht ausgeführt, wenn die Page durch einen anderen User oder
// in einem anderen Tab dieses Users gelockt ist.
// prjID: ID des Projektes
// pageID: eindeutiger Name der Seite
// fileType: otPage, otTemplate, otMasterTemplate, otLocalTemplate, otComponents
  return sfSetLifeCycleOfPage(prjID, pageID, fileType, lifeCycle, "");
}


function asSetProjectInfo(prjID, infoType, info, infoParam){
// schreibt die angegebene Projektinfo
// prjID: Handle des geöffneten Projekts
// infoType: eine der pitxxx-Konstanten 
//           pitUID
//           pitObjectTyp
//           pitPrjNiceName
//           pitDescription
//           pitPrjStartImg  : Projekt-Startbild
//           pitPrjStartDelay: ProjectStartbild-Anzeigedauer
//           pitPrjBaseLanguage: Basis-Sprachtoken des Projekts
//           pitPrjGlossaryRefs: gobale Glossare
//           pitUseAsTemplateProject
//           pitBaseTemplate : Eintrag "References/Templates" in der iproject.ini wird gesetzt.
//                             Ist sofort aktiv, Liste der referenzierten Templates wird sofort aktualisiert. 
//                             Wird das TemplProj nicht gefunden, wird Fehlercode cProjectNotFound zurückgegeben
//           pitCourseFlashMode: Verhalten des Publish-Prozesses bzgl der Flash-Anforderung des publ. Kurses
//           pitStageDimensions: Stage Maße: X,Y,Breite,Hoehe
//           pitUseAsTemplateProject: Project wie Templateprojekt handhaben
//           pitPrjOwnerID: !!! not yet supported !!!!  evtl spater:    
// info: zu schreibender Wert je nach pit-Konstante
// infoParam: zusätzliche Angaben je nach pit-Konstante. z.Bsp. bei pitConfigData der Key in der iProject.ini
// Return: TRUE oder FALSE
  var options="";
  if ((infoType==pitConfigData)&&(AnyToBool(isVarUndefined(infoParam))==false))
    options="KeyName="+infoParam;
  sfSetProjectInfo(prjID, infoType, info, options);
  return (gvSoap.error()==cNoError ? true: false);
}

function asSetProjectTitle(prjID, title) {
// schreibt die description ins MD file
// prjID: Handle des geöffneten Projekts
// title: nice name 
// Return: TRUE oder FALSE
  var res = false;
  if (AnyToBool(isVarUndefined(MainPage)) == true)
    return res;
  var anyPrj = asGetOpenProject(prjID);
  if (anyPrj == null)
    return res;

  asSetProjectInfo(prjID, pitPrjNiceName, title, "");
  res = AnyToBool(MainPage._SetPrjMetaData(anyPrj.intName, title, null));
  anyPrj.title = title;
  return res;
}

function asSetProjectDescription(prjID, description){
// schreibt die description ins MD file
// prjID: Handle des geöffneten Projekts
// description: Beschreibung 
// Return: TRUE oder FALSE
  var res=false;
  if (AnyToBool(isVarUndefined(MainPage))==true)
    return res;
  var anyPrj=asGetOpenProject(prjID);
  if (anyPrj==null)
    return res;
  
  res= AnyToBool(MainPage._SetPrjMetaData(anyPrj.intName,null,description));
  anyPrj.description=description;
  return res;
 /* sfGetProjectInfo(prjID, infoType, info, options);
  if (gvSoap.error() == cNoError)
    return gvSoap.getParam("Info");
  else
    return "";
  */
}

function asGetProjectDescription(prjID){
// liest die description des Projektes aus - 1. Versuch die gecachte Version, 2. Versuch aus dem MD file
// prjID: Handle des geöffneten Projekts
// Return: Description oder null
  var res=null;
  if (AnyToBool(isVarUndefined(MainPage))==true)
    return res;
  var anyPrj=asGetOpenProject(prjID);
  if (anyPrj==null)
    return res;
  if (anyPrj.description==null) {
    res = MainPage._GetPrjMetaData(anyPrj.intName);
    anyPrj.description = res;
  }else{
    res=anyPrj.description;
  }  
  return res;
}

function asGetProjectInfo(prjID, infoType, infoParam){
// liefert Infos zum Projekt je nach angegebener pit-Konstante
// prjID: Handle des geöffneten Projekts
// infoType: pit - einer der pitxxx-Konstanten
//                 pitMediaUrl: relative URL zum Medienpfad
//                 pitPagesUrl: relative URL zum Pagesverzeichnis
//                 pitAssiPagesUrl: relative URL zum Verzeichnis der Assistentenpages
//                 pitPrjOwnerID: ID des Projectowners
//                 pitPrjOwnerName: Name des ProjectOwners
//                 pitIsCFWActive: ist ein CFW aktiv? (1=yes, 0=false)
//                 pitCFWContainer: die visuelle CFWPage, die den Pagecontainer enthält
//                 pitUID: Project UID
//                 pitObjectType: der ObjectType eben
//                 pitPrjNiceName: Der Nicename des Projects
//                 pitDescription: Die Beschreibung
//                 pitCreationTime: Projekt-Erzeugungszeit
//                 pitPrjStartImg: Projekt-Startbild
//                 pitPrjStartDelay: ProjectStartbild-Anzeigedauer
//                 pitPrjBaseLanguage: Basis-Sprachtoken des Projekts
//                 pitPrjGlossaryRefs: globale Glossare
//                 pitBaseTemplate: Eintrag "References/Templates" aus der iproject.ini
//                 pitPrjChain: Liste der referenzierten Projekte und Templates
//                 pitBaseProject: Eintrag "References/BaseProject" aus der iproject.ini
//                 pitStageDimensions: Stage Maße: X,Y,Breite,Hoehe
//                 pitUseAsTemplateProject: Project wie Templateprojekt handhaben
// infoParam: optionaler Parameter je nach pit-Konstante
//          bei pitCFWContainer eine der TargetPlatForm-Konstanten (tpfxxx, DEFAULT=tpfDesktop
//              In diesem Fall wird der Name der Containerpage für die entsprechende TargetPlatform zurückgegeben.
//          bei pitConfigData ist infoParam das KeyWord im Abschnitt der iproject.ini  
// Return: Info oder Leerstring bei Fehler
  var options="";
  // Targetplatform für CFW-Container
  if(infoType==pitCFWContainer){
    if((infoType!=tpfPhone)&&(infoType!=tpfTablet))
      infoType==tpfDesktop;
    options="TPF=" + infoParam;
    //gvSoap.addParams(false, "Options","TPF=" + infoParam);
  }
  // Keyword für [ConfigData] der IPROJECT.INI
  if(infoType==pitConfigData){
    options="KeyName=" + infoParam;
    //gvSoap.addParams(false, "Options","KeyName=" + infoParam);
  }
  sfGetProjectInfo(prjID, infoType, options);
  if (gvSoap.error() == cNoError)
    return gvSoap.getParam("Info");
  else
    return "";
}
  