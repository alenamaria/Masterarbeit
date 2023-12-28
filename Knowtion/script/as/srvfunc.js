/* Hilfsfunktionen */
function encodePrjList(sPrjList){
  // ersetzt Kommata und Semikolons in den mit Delimitern geklammerten Daten, so dass der resultierende String mit Split weiterverarbeitet werden kann
  var cCommaPattern=String.fromCharCode(255)+"comma"+String.fromCharCode(255);
  var cSemicolonPattern=String.fromCharCode(255)+"semicolon"+String.fromCharCode(255);
  var cQuotePattern=String.fromCharCode(255)+"quote"+String.fromCharCode(255);

  var cCommaPattern=String.fromCharCode(181)+"comma"+String.fromCharCode(181);
  var cSemicolonPattern=String.fromCharCode(181)+"semicolon"+String.fromCharCode(181);
  var cQuotePattern=String.fromCharCode(181)+"quote"+String.fromCharCode(181);

  var sDlm, sData, sResult;
  var iPos;
  //stopOnThis(this.Name(), "_encodePrjList");
  sResult="";
  sPrjList=sPrjList.trim();
  while (sPrjList.length>0){
    sDlm=sPrjList.substr(0,1);
    sPrjList=sPrjList.substr(1);
    iPos=sPrjList.indexOf(sDlm);
    if (iPos>=0){
      sData=sPrjList.substr(0,iPos);
      sData=sData.replace(/,/g, cCommaPattern);
      sData=sData.replace(/;/g, cSemicolonPattern);
      sData=sData.replace(/;/g, cQuotePattern);
      sResult=sResult+sDlm+sData+sDlm;
      sPrjList=sPrjList.substr(iPos+1);
      // in einer korrekt codierten Projektliste dürfte dieser Fall nicht auftreten - wir beenden die Encodierung
    }else{
      return sResult;
    }
    // wenn es weitere Daten gibt, dann muss das nächste Zeichen ein Trennzeichen sein
    if (sPrjList.length>0){
      sResult=sResult+sPrjList.substr(0,1);
      sPrjList=sPrjList.substr(1);
    }
  }
  return sResult;
}

function decodePrjList(sPrjList){
  // macht die Rückkonvertierung für einen mit decodePrjList kodierten String
  var cCommaPattern=String.fromCharCode(255)+"comma"+String.fromCharCode(255);
  var cSemicolonPattern=String.fromCharCode(255)+"semicolon"+String.fromCharCode(255);
  var cQuotePattern=String.fromCharCode(255)+"quote"+String.fromCharCode(255);

  var cCommaPattern=String.fromCharCode(181)+"comma"+String.fromCharCode(181);
  var cSemicolonPattern=String.fromCharCode(181)+"semicolon"+String.fromCharCode(181);
  var cQuotePattern=String.fromCharCode(181)+"quote"+String.fromCharCode(181);
  //stopOnThis(this.Name(), "_decodePrjList");
  var re = new RegExp(cCommaPattern,"g");
  sPrjList=sPrjList.replace(re, ",");
  var re = new RegExp(cSemicolonPattern,"g");
  sPrjList=sPrjList.replace(re, ";");
  var re = new RegExp(cQuotePattern,"g");
  sPrjList=sPrjList.replace(re, '"');

  return sPrjList;
}

/* Soap Kommandos */
function sfAddCat(catName){
  // Fügt eine weitere Kategorie hinzu
  // returns: true or false
  gvSoap.addParams(true,"CatName",catName);
  gvSoap.invoke("AddCat",false,null,spWSDL+spWebDataIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddGroup(groupData){
// adds the specified group with the specified data
// groupData: Gruppen-Datensatz, Format: Feldname1="Wert1",Feldname2="Wert2",...
// Hinweis: Der Name einer Gruppe muss eindeutig sein!
// returns: true or false
  gvSoap.addParams(true,"GroupData",groupData);
  gvSoap.invoke("AddGroup",false,null,spWSDL+spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddObject(objData){
// fügt das mit objData beschriebene Objekt der Objekt-Datenbank hinzu
// objData: Objekt-Datensatz, Format: Feldname1="Wert1",Feldname2="Wert2",...
// Hinweis: Der Name muss eindeutig sein!
// returns: true or false
  gvSoap.addParams(true,"ObjectData",objData);
  gvSoap.invoke("AddObject",false,null,spWSDL+spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddObjectToGroup(objName, groupName, rightFlags){
// Erteilt einer Gruppe Rechte auf ein Objekt
// returns: true or false
  gvSoap.addParams(true,"ObjectName",objName,"GroupName",groupName,"2RightFlags",rightFlags);
  gvSoap.invoke("AddObjectToGroup",false,null,spWSDL+spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddObjectToUser(obj, user, rights){
// Erteilt einer Gruppe Rechte auf ein Objekt
// obj - Name oder ID des Objekts
// user - Name oder ID des Users
// rights - ODER-Verknüpfung der "rf"-Konstanten
// returns: true or false
  gvSoap.addParams(true,"ObjectName",obj,"UserName",user,"RightFlags",rights);
  gvSoap.invoke("AddObjectToUser",false,null,spWSDL+spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddPrjNode(project, treeType, destNode, destPos, nodeType, nodeName, nodeData) {
// fügt dem angegebenen Tree einen neuen Eintrag hinzu
// project: ID des Zielprojektes
// treeType: Typ des Trees (otPrjTree, otLocalTemplTree, otLocalAssistantTree)
// destNode: NodeName für Zielposition im Tree
// destPos:  Position relativ zu destrNode (ptitAfter,ptitUnder,ptitBefore,ptitOverwrite)
// nodeType: Typ des neuen Eintrags (ptntChapter,ptntPage)
// nodeName: nur bei ptntPage Name des neuen Eintrages
// nodeData: kommaseparierte Liste der Nodedaten (z.Bsp.: Caption="Schöne Seite",ShowInMenu="1")
// returns interner Name des neuen Nodes, Leerstring bei Fehler
  gvSoap.addParams(true, "ProjectHandle", project, "TreeType", treeType, "DestNodeID", destNode, "NewNodePos", destPos, "NewNodeType", nodeType, "NewNodeID", nodeName, "NewNodeData", nodeData);
  gvSoap.invoke("AddPrjNode", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? gvSoap.getParam("NewNodeID") : "");
}

function sfDelPrjNode(project, nodeName, treeType) {
// entfernt einen Eintrag aus dem Projekttrree des geöffneten Projekts
// project: ID des Zielprojektes
// nodeName: internal unique node name
// treeType: otPrjTree, otLocalTemplTree,...
// returns true or false
  gvSoap.addParams(true, "ProjectHandle", project, "TreeType", treeType, "NodeID", nodeName);
  gvSoap.invoke("DelPrjNode", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? true : false);
}

function sfMovePrjNode(project, nodeName, destNode, destPos, treeType){
// verschiebt einen Eintrag aus dem Projekttree an eine andere Stelle
// project: ID des Zielprojektes
// nodeName: internal unique node name
// destNode - relativ zu diesem Node ist die neue Position
// destPos  - ptitAfter, ptitUnder
// treeType: otPrjTree, otLocalTemplTree,...
// returns ID des verschobenen Nodes, 0 bei Fehler
  gvSoap.addParams(true, "ProjectHandle", project, "TreeType", treeType, "SourceNodeID", nodeName, "DestNodeID", destNode, "DestNodePos", destPos);
  gvSoap.invoke("MovePrjNode", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? nodeName : "0");
}

function sfGetPrjNodeData(project, nodeName, attrName, treeType){
// Liefert den Inhalt eines Attribut oder alle Daten des mit NodeID gewählten Nodes des Trees bzw. Leerstring bei Fehler
// project: ID des Projektes
// nodeName: eindeutiger Name des nodes
// attrName: NAme des Attributs, Leer=alle Attribute kommasepariert "Name1=Value1","Name2=... 
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
  gvSoap.addParams(true, "ProjectHandle", project, "TreeType", treeType, "NodeID", nodeName, "AttrName", attrName);
  gvSoap.invoke("GetPrjNodeData", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? gvSoap.getParam("NodeData") : "");
}

function sfSetPassword(user, oldPwd, newPwd){
// Das Passwort eines Users setzen/ändern
// user: Username (leer = CurrentUser = default)
// oldPwd: old Password
// newPwd: new Password
// returns true or false
  if(user=="")
    user=IUser._CurrentUserName(); 
  gvSoap.addParams(true, "Username", user, "OldPassword", oldPwd, "NewPassword",newPwd);
  gvSoap.invoke("SetPassword", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error() == 0 ? true : false);  
 /*   
  ISoap._ClearParam();
  ISoap._AddParam("Username",sParam1);
  ISoap._AddParam("OldPassword",sParam2);
  ISoap._AddParam("NewPassword",sParam3);
  ISoap._cmd("SetPassword","return",spAdminIntf);
  return AnyToStr(ISoap.ok()); 
  */
}

function sfResetPassword(user, newPwd, options){
// Das Passwort eines Users neu setzen, ohne das alte zu kennen
// user: Username (muss bereits existieren)
// newPwd: new Password
// options: CreateSHA1=0 (=default) dsas Passwort wird ohne weitere Konvertierung 1:1 in DB abgelegt und später als Salted
// returns true or false
  gvSoap.addParams(true, "Username", user, "NewPassword",newPwd);
  if (options!="")
    gvSoap.addParams(false, "Options",options);

  gvSoap.invoke("ResetPassword", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error() == 0 ? true : false);
}

function sfSetMyPassword(oldPwd, newPwd){
// Der eingeloggte User kann mit Kentniss seines alten Paswords ein neues setzen.
// oldPwd: old Password
// newPwd: new Password
// returns true or false
  var  user=IUser._CurrentUserName();
  gvSoap.addParams(true, "OldPassword", oldPwd, "NewPassword",newPwd);
  gvSoap.invoke("SetMyPassword", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error() == 0 ? true : false);  
}

function sfUpdateUser(userData, options){
// modifiziert ein oder mehrere Felder im Datensatz des angegebenen Users
// userData - Liste der Felder mit Werten für den User-Datensatz.
// Format: Feldname1="Wert1",Feldname2="Wert2",...
// options - not yet used
// returns true or false
  gvSoap.addParams(true, "UserData",  userData);
  gvSoap.invoke("UpdateUser", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error() == 0 ? true : false);  
}

/*
function _aSetUserDataValue(sParam1, sParam2, sParam3){
// writes the specified user data
// sParam1: name of user data item
// sParam2: value of user data item
// sParam3: optional name allows to add usersettings not assigend to the current logged in user
// returns True or False
  if (isVarUndefined(sParam3)) 
     sParam3=""; 
  ISoap._ClearParam();
  ISoap._AddParam("VarName",sParam1);
  ISoap._AddParam("Value",sParam2);
  if (sParam3!="")
    ISoap._AddParam("Options","UserName="+ sParam3);
  ISoap._cmd("SetUserDataValue","return",spAdminIntf);
  return ISoap.ok();
}
*/

function sfSetPrjNodeData(prjID, nodeName, nodeData, treeType){
// Schreibt Daten eines Eintrags aus dem Projekttree des geöffneten Projekts und liefert true oder false
// prjID: ID des Projektes
// nodeName: eindeutiger Name des nodes
// nodeData: Daten kommasepariert "Name1=Value1","Name2=... 
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
  gvSoap.addParams(true, "ProjectHandle", prjID, "TreeType", treeType, "NodeID", nodeName, "NodeData", nodeData);
  gvSoap.invoke("SetPrjNodeData", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? true : false);  
}

function sfGetLifeCycleOfPage(prjID, pageID, fileType, options){
// ermittelt den LifeCycle einer Seite oder eines Templates.
// prjID: ID des Projektes
// pageID: eindeutiger Name der Seite
// lifeCycle: der Wert des gewünschten Status
// fileType: otPage, otTemplate, otMasterTemplate, otLocalTemplate, otComponents
// options: LangToken=<token> - Der Lifecycle wird aus der Sprachversion LangToken geholt
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType, "Options", options);
  gvSoap.invoke("GetLifeCycleOfPage", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? true : false);
}

function sfSetLifeCycleOfPage(prjID, pageID, fileType, lifeCycle, options){
// setzt den LifeCycle einer Seite oder eines Templates und liefert true oder false
// Die Funktion wird nicht ausgeführt, wenn die Page durch einen anderen User oder
// in einem anderen Tab dieses Users gelockt ist.

// prjID: ID des Projektes
// pageID: eindeutiger Name der Seite
// lifeCycle: der Wert des gewünschten Status
// fileType: otPage, otTemplate, otMasterTemplate, otLocalTemplate, otComponents
// options: LangToken=<token> - Der Lifecycle wird in diese Sprachversion gespeichert
//          Nach Ausführen des Kommandos wird hier der CurrentStamp in folgender Form zurückgeliefert:
//          CurrentStamp=nnnn (siehe auch Kommando CheckLoggedEvents)
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType, "LifeCycle", lifeCycle, "Options", options);
  gvSoap.invoke("SetLifeCycleOfPage", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? true : false);
}

function sfLoadPrjTreeEx(prjID, treeType, sOptions){
// einen der speziell aufbereiteten Tree des Projekts laden

// prjID: Projektidentifier
// treeType: otPrjTree,otPrjTreeEx,otTemplTree,otTemplTreeEx (default = otPrjTreeEx)
// Options:  
//   lngToken: optional LangToken (!!nur bei otPrjTree)
//   liveTransState: LiveTransStatus (optional)
//                   1=Übersetzungsstatus wird neu erzeugt
//                   0=liefert den zuletzt gespeicherten Status
//                   2=Es wird kein Übersetzungsstaus geliefert
//                   !!! neue Implementierung: Es wird das zusätzliche Attribut "TransStatusChecked='0'" eingefügt  !!!
//   mergeMode (optional) - 0=mmAuto = Default - heißt Servermodul entscheidet abhängig vom FileType
//                                   otPrjTree       : MergeMode=1 wenn als TemplateProjekt markiert (pitIsTemplateProject) sonst MergeMode=0
//                                   otLocalTemplTree: MergeMode=0
//                                   otTemplTree     : MergeMode=1
//                          1=mmMerged (es wird aus allen Trees bis zum letzten referenierten Templateprojekt gemerged)
//                          2=mmNotMerged (kein Mergen)  
//   cacheMode: 0=kein Cache, 1=Cache aktualisieren wenn nötig(DEFAULT),2=immer Cache
//   addPool:   0=nein (DEFAULT),1=ja
// PrjTreeEX: enthält nach der Ausaführung den Tree als XML-String gvSoap.getParam("PrjTreeEX")
// LastEvID:  enthält nach der Ausaführung höchste ID in der "Logs"-Tabelle gvSoap.getParam("LastEvID")   
// returns tree or false

  gvSoap.addParams(true, "ProjectHandle", prjID, "TreeType", treeType, "Options", sOptions);
  gvSoap.invoke("LoadPrjTreeEx", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? true : false);
}

function sfAddPrjRole(prjName, userName, roleName, mailSubj, mailBody){
// ein Mitglied zum Projektteam hinzufügen
// prjName: project name
// userName: user name
// roleName: role name
// mailSubj: Mail subject - optional
// mailBody: Mail body - optional
// returns: true or false
  var sResult;
  if(AnyToBool(isVarUndefined(mailSubj)))
    mailSubj="";
  if(AnyToBool(isVarUndefined(mailBody)))
    mailBody="";
  gvSoap.addParams(true, "ProjectName", prjName, "UserName", userName, "RoleName", roleName);
  if((mailSubj!="")&&(mailBody!=""))
    gvSoap.addParams(false, "InfoMailSubject", mailSubj, "InfoMailBody", mailBody);    
  gvSoap.invoke("AddPrjRole", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error()==0 ? true: false);  
}

function sfAddRoleMember(role, project, user){
// adds a user with the specified role to the specified project
// role: id or name of role
// project: id or name of project
// user: id or name of user
// returns true or false
  gvSoap.addParams(true, "RoleIDOrName", role, "ProjectIDOrName", project, "UserIDOrName", user);
  gvSoap.invoke("AddRoleMember", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddUser(userData){
// fügt den angegebenen User hinzu
// userData: User-Datensatz im Format: Feldname1="Wert1",Feldname2="Wert2",
// Hinweis: Name muss eindeutig sein, Passwort muss SetPassword gesetzt werden
// returns true or false
  gvSoap.addParams(true, "UserData",userData);
  gvSoap.invoke("AddUser", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfAddUserToGroup(userName, groupName){
// adds the specified user to the specified group
// returns true or false
  gvSoap.addParams(true, "UserName", userName, "GroupName", groupName);
  gvSoap.invoke("AddUserToGroup", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfGetClientInfo(info){
// liefert Infos über den aktiven Mandaten
// sParam1: Info ("ValidFrom","ValidUntil)
  gvSoap.addParams(true);
  gvSoap.invoke("GetClientInfo",false,null,spWSDL+spAdminIntf);
  return (gvSoap.error() == 0 ? gvSoap.getParam("info") : "");
}

function sfGetConfigValue(varName, scope, defVal){
  // liefert den Configwert bzw. den Default-Wert im Fehlerfall
  // scope=1 ermittelt den Wert aus der globalem Config und ignoriert die lokale config (default=0)
  // defVal wenn nicht angegeben und varName nicht vorhanden, wird ein Leerstring zurückgegeben
  //        und gvSoap.Error() liefert -141 (ConfigVar not defined), andernfalls wird gvSoap.Error() gecleart
  sResult="";
  if ((arguments.length>=3)&&(defVal!=undefined))
    sResult=defVal;
  gvSoap.addParams(true, "VarName", varName);
  if((arguments.length>=2)&&(scope=="1"))
    gvSoap.addParams(false,"Options","Default=1");
  gvSoap.invoke("GetConfigValue", false, null, spWSDL + spAdminIntf);
  if ((gvSoap.error()==cConfigVarNotDefined)&&(arguments.length>=3)&&(defVal!=undefined)){
    sResult=defVal;
    gvSoap.error(0)
  }else{
    sResult=gvSoap.getParam("Value");
  }
  return sResult;
}

function sfGetCurrentUser(){
// liefert UserName, UserID und UserType des eingeloggten Users, die dann mit getParam abgefragt werden können
// Rückgabe: cNoError oder Fehlercode
  gvSoap.addParams(true);
  gvSoap.invoke("GetCurrentUser",false,null,spWSDL+spWebDataIntf);
  return gvSoap.error();
}

function sfListProjects(prjTypes, listmode, dataformat, deleted, catlist, catfilter){
// returns the list of projects available for the logged in user
// prjTypes: rauteseparierte Liste der gewünschten ProjectTypes (ptCourse#ptClient#...), default=ptCourse
// listmode: - 1: Kommasep. Liste der Projektnamen (DEFAULT)
//           - 2: Kommasep. Liste von Projektinfos (ProjectName, ProjectNiceName, Author, CreationTime)
//           - 3: wie ListMode 2 aber mit "DeletionTime".
//           - 4: unabhängig von der Rechtsituation für alle nur die Felder "ProjectName" und "DeletionTime"
// dataformat: - 0 = comma seperated list of multiple values for each found course.
//                   values for one course are seperated by semicolon
//             - 1 = XML format (!!!!! not yet supported !!!!!!!)

// deleted  - "0" = nicht gelöschte (Default)
//          - "1" = gelöschte
// catlist: optionale URL-Encoded catList (kommapsepariert)
// catfilter: 0 (DEFAULT) die Kategorien werden OR verknüpft, bei 1 AND verknüpft

  var sResult,sOptions,sPrjTypes;
  var i,j,iIndex;
  var lstResult=[];
  var lstPrj=[];
  var ptTypes=[];
  if(prjTypes=="")
    prjTypes=ptCourse;

  //stopOnThis("_aListProjects","");
  // Listmode 1 oder 2
  if((listmode!="2")&&(listmode!="3")&&(listmode!="4"))
    listmode="1";
  sOptions="Listmode="+listmode;
  if (deleted=="1")
    sOptions=sOptions+",Deleted=1";
  else
    sOptions=sOptions+",Deleted=0";
  // Kategorien als Filter
  if (isVarUndefined(catlist))
    catlist="";
  if (catlist!="")
    sOptions=sOptions+",CatList="+catlist;
  // Als Work arround für SQL-Bug bei AND-Verknüpfung nur einer Kategorie wird andCAT nur gesetzt, wenn mehr als 1 Kategorie
  //if ((catfilter=="1")&&(decodeURIComponent(catlist).indexOf(",")>0))
  if (catfilter=="1")
    sOptions=sOptions+",andCat=1";

  // ListProjects für jeden gewünschten Projekttyp - damit split funzt sicherstellen, dass sPrjTypes vom Typ String ist
  sPrjTypes=AnyToStr(prjTypes);
  ptTypes=sPrjTypes.split("#");
  for (var i = 0; i < ptTypes.length; i++) {
    lstPrj=[];
    gvSoap.addParams(true, "ProjectType", ptTypes[i], "Options", sOptions);
    gvSoap.invoke("ListProjects",false,null,spWSDL+spWebDataIntf);
    if(gvSoap.error()!=cNoError)
      return "";
    sResult=gvSoap.getParam("ProjectList");
    // um den String mit Split zu behandeln, müssen wir zunächst die Seperatoren kodieren
    sResult=encodePrjList(sResult);
    // Jetzt aus den beiden Listen die gewünschte erzeugen
    if (sResult.trim().length>0)
      lstPrj=sResult.split(",");
    for (j=0; j<lstPrj.length; j++){
      // Bei Listmode 2 und 3 ergänzen wir noch den Projekttype, wenn das Ergebnis im XML Format gefordert wird
      if(((listmode=="2")||(listmode=="3"))&&(dataformat=="1")){
        lstPrj[j]=lstPrj[j]+";#"+ptTypes[i]+"#";
      }
      iIndex=lstResult.indexOf(lstPrj[j]);
      if (iIndex<0)
        lstResult.push(lstPrj[j]);
    }
  }
  sResult=lstResult.join();
  sResult=decodePrjList(sResult);

  // Listen oder XML-Format
  /*
  if(dataformat=="1"){
    s="ProjectName,ProjectNiceName,Author,CreationTime";
    // Falls auch DeletionTime enthalten ist
    if (listmode=="3")
      s=s+",DeletionTime";
    // Bei Listmode 2 und 3 ergänzen wir noch den Projekttype und die Url, wenn das Eregbnis im XML Format gefordert wird
    if((listmode=="2")||(listmode=="3")){
      s=s+",ProjectType";
    }
    //var sTest=page.CLP._convertData2JSON(sResult,"<CourseData/>","Projects",s);
    //sResult=AnyToStr(page.CLP._convertData2XML(sResult,"<CourseData/>","Projects",s));
  }

   */
  return sResult;
}

function sfCreateProject(prjName, ptName, options){
//
// neues Projekt anlegen
//
// prjName: title of new project (maxlength=50) will be converted into unique internal project name
// ptName: name or id of pattern, empty means default pattern from config db
// options: 
//     ProjectSource=0 (default) Pattern
//                  =1 ein eigenes Projekt
//     ProjectType  eine der ptXXX Konstanten
//     TemplateName (default = '') = Names des Projekts, das als Template in
//                                   das neu angelegte Projekt eingetragen wird
//     TemplateIsLocal=0 (default) Template ist ein Projekt aus der Templates-Struktur
//                    =1 Template ist ein Projekt des eigenen Mandanten
//     PatternIsLocal =0 (default) Pattern wird als Systempattern erzeugt.
//                    =1 Pattern wird im Mandantenscope erzeugt
//     SyncMediaUsage: Aktualisierung der MedienDB bzgl. der Mediennutzung in diesem Projekt
//                    = 0 (Default) Ob gesynct wird hängt vom Wert der Config-Variablen
//                        "AutoSyncMediaUsage" ab
//                    = 1 es wird synchronisiert

  var sResult="";
  gvSoap.addParams(true, "NewProjectName", prjName, "PatternName", ptName, "Options", options);
  gvSoap.invoke("CreateProject",false,null,spWSDL+spWebDataIntf);
  if (gvSoap.error()==cNoError)
    sResult=gvSoap.getParam("ProjectName");
  return sResult;
}


function sfLoadRuntimeGlossaryFile(projectID, cacheMode){
// loads the specific glossary file for project preview
// sParam1: Handle of project
// cacheMode: optional cmNever. cmAuto (=default), cmEver
// da es offenbar Probleme im Zusammenhang mit Übersetzungen gibt, wird 
// es temporär nur bei explizitem Einschalten via ConfigVar "  

// returns the xmldata of glossary file or empty string on error
  var sResult="";
  gvSoap.addParams(true, "ProjectHandle", projectID, "Options", "CacheMode="+cacheMode);
  gvSoap.invoke("LoadRuntimeGlossaryFile",false,null,spWSDL+spWebDataIntf);
  if (gvSoap.error()==cNoError)
    sResult=gvSoap.getParam("XMLData");  
  return sResult;
}

function sfLogin(name, pwd, wsid, client, LogoutMySelf){
// login for webData Interface
// name: UserName
// pwd: Password
// wsid: WorkstationID
// client: Name des Mandanten
// logoutMyself: 1 bewirkt, dass der User zunächst explizit ausgeloggt wird
//               also auch gesperrte Seiten frei gegeben werden usw.
// Spezielle Aufrufvarianten:
//    sfLogin("","","")   prüft, ob es eine laufende Session für die AufrufURL gibt
//    sfLogin(" ","","")  loggt sich als Gast ein, um z.Bsp. das standard-Projekt (=AS-Client)
//                         zu öffnen und daraus den eigentlochen LogIn-Dialog zu öffnen
  var sOptions="";
  if ((arguments.length>=4)&&(arguments[3].length>0)&&(client!=undefined))
    sOptions="Clientname="+client;
  if ((arguments.length>=5)&&(LogoutMySelf=="1")){
    if (sOptions.length>0)
      sOptions=sOptions+",";
    sOptions=sOptions+"LogoutMySelf=Yes";
  }
  gvSoap.addParams(true,"Name", name, "Password", pwd, "WSId",wsid);
  if (sOptions.length>0)
    gvSoap.addParams(false,"Options",sOptions);
  gvSoap.invoke("Login",false,null,spWSDL+spWebDataIntf);
  return (gvSoap.error()==cNoError ? true: false);
}

function sfLogout(allTabs, async) {
// allTabs: 0: nur der aktuelle Tab (=default)
//          1: gilt für alle Tabs
// async: true or false
// returns true or false
  var cb=null;
  if (allTabs == "1")
    gvSoap.addParams(true, "Always", "1");
  else
    gvSoap.addParams(true);
  if (isVarUndefined(async))
    async=false;
  if (async==true){
    gvSoap.invoke("Logout", true, "MP.soapCB", spWSDL + spWebDataIntf);
    //gvSoap.invoke("Logout", true, gvSoapCB, spWSDL + spWebDataIntf); 
    return true
  }
  gvSoap.invoke("Logout", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == cNoError ? true : false);
}

function sfOpenClientProject(clientPrj){
// Öffnet das Clientprojekt (Defaultclient=standard)
// Rückgabe: cNoError oder Fehlercode
  sClient="standard";
  if ((arguments.length>=1)&&(clientPrj!=undefined)&&(clientPrj.length>0))
    sClient=clientPrj;
  gvSoap.addParams(true,"ProjectName",sClient,"ProjectType",ptClient);
  gvSoap.invoke("OpenProject",false,null,spWSDL+spWebDataIntf);
  return gvSoap.error();
}

function sfOpenProject(prjName, prjIdent, prjType){  
// opens specified project by its internal name or id
// prjName: interner Projektname
// prjType: Projekttyp - optional, default=ptCourse (= normales IDEATeam Projekt), ptClient, ptGlossary, ptPattern 

// returns the project handle or empty string on error
  //stopOnThis("srvFunc.sfOpenProject(), "");  
  var sResult="";
  if((prjType!=ptClient)&&(prjType!=ptGlossary)&&(prjType!=ptPattern))
    prjType=ptCourse;
  gvSoap.addParams(true,"ProjectName", prjName, "ProjectType", prjType);
  gvSoap.invoke("OpenProject",false,null,spWSDL+spWebDataIntf);

  // Projekt bereits geöffnet, nicht als Fehler handeln 
  if(gvSoap.error()==cProjectAlreadyOpen)
    gvSoap.error(cNoError)
  var sResult=0;
  if (gvSoap.error()==cNoError)
    sResult=gvSoap.getParam("ProjectHandle");
  return sResult;
}

function sfCloseProject(prjHandle){
// schließt das angegebene Projekt
// prjHandle: Handle des Projekts 
// liefert true or false
// die Option "AutoVersion=[0/1]" 1=Default wird hier hart codiert abgeschaltet

  //stopOnThis("srvfunc.js,"sfCloseProject");
  gvSoap.addParams(true,"ProjectHandle", prjHandle);
  gvSoap.invoke("CloseProject",false,null,spWSDL+spWebDataIntf);
  return (gvSoap.error() == cNoError ? true : false);
}

function sfDeleteProject(prjID, delOption, lngToken){
// deletes a project

// prjID: name or id of project
// delOption: 0: project remains physically (default)
//            1: project will be deleted physically too
//            2: ein mit "ToPublic=1" gepublishter Kurs wird gelöscht (derzeit nur bei LSB)
//            3: ein mit "ToPublic=3" (nach IDEALive) gepublishter Kurs  wird gelöscht (PVA)
// lngToken: LanguageToken - nur in Verbindung mit sParam2="2" oder "3"
// returns true or false
  var sOptions, sResult;
  sOptions="";
  //stopOnThis("\as\srcfunc.js", "sfDeleteProject")
  if(AnyToBool(isVarUndefined(lngToken)))
    lngToken="";
  // Kurs aus dem öffentlichen Bereich entfernen 
  if(delOption=="2"){
    sOptions="DeletePublic=1";
    if(lngToken!="")
      sOptions=sOptions+",LangToken="+lngToken;
  }
  // IDEALive Kurs im LMS entfernen 
  if(delOption=="3"){
    sOptions="DeletePublic=3";
    if(lngToken!="")
      sOptions=sOptions+",LangToken="+lngToken;
  }
  // Bearbeitbares Projekt entfernen 
  if (sOptions!="")
    sOptions=sOptions+",";
  if (delOption=="1"){
    sOptions=sOptions+"DeleteFiles=1";
  }else{
    sOptions=sOptions+"DeleteFiles=0";
  }
  gvSoap.addParams(true, "ProjectIDOrName", prjID, "Options", sOptions);
  gvSoap.invoke("DeleteProject",false,null,spWSDL+spWebDataIntf);
  return gvSoap.error();
}

function sfLoadSpecialFile(prjID, fileType, filePath, lockState, langToken, cnvBR){
// loads the special file according to the specified filetype
// prjID   Projecthandle
// fileType: otIniFile,otMediaFile,otMediaXMLFile...
// filePath: relative path of file in case of otMediaTextFile, otMediaXMLFile
// lockState: lsUnLocked, lsLocked
// cnvBR  Optional, bewirkt bei den FileTypes otMediaXMLFile, otMediaTextFile dass Zeilenumbrüche in <br> konvertiert werden, Default = 0 

// returns the xmldata of the specfied file
  var sOptions="";
  var sResult="";

  //if((AnyToBool(isVarUndefined(sParam3))==true)||(sParam3==""))
  //  sParam3=IAL._PrjHandle();
  if(AnyToBool(isVarUndefined(filePath))==true)
    filePath="";
  if(lockState!=lsLocked)
    lockState=lsUnLocked;
  if(AnyToBool(isVarUndefined(langToken))==true)
    langToken="";
  if((AnyToBool(isVarUndefined(cnvBR))==true) ||(cnvBR!="1"))
    cnvBR="0";

  if((fileType==otMediaXMLFile)||(fileType==otMediaTextFile)){
    sOptions="Path="+filePath;
  }
  if(langToken!=""){
    if(sOptions!="")
      sOptions=sOptions+',';
    sOptions=sOptions+'LangToken='+langToken;
  }
  if(cnvBR!=""){
    if(sOptions!="")
      sOptions=sOptions+',';
    sOptions=sOptions+'ConvertCRLF='+cnvBR;
  }
  gvSoap.addParams(true,"ProjectHandle", prjID, "FileType", fileType, "LockIt", lockState, "Options", sOptions);
  gvSoap.invoke("LoadSpecialFile",false,null,spWSDL+spWebDataIntf);
  if (gvSoap.error() == cNoError)
    sResult=gvSoap.getParam("XMLData");
  return sResult;
}

function sfSaveSpecialFile(prjID, fileType, xmlData, filePath, sortGls, syncTrans){
// saves the special file accoring to the specified filetype
// prjID:   Projecthandle
// fileType: otIniFile,otMediaFile,otMediaXMLFile...
// xmlData: XML data to be saved  
// filePath: relative path of file in case of otMediaTextFile, otMediaXMLFile
// sortGls: optional bei otGlossary: 1=wird alphabet. sortiert, 0=Speichern so, wie übergeben (default)
// syncTrans: optional 1= automat. Synchronsierung aller Sprachen
//                     2= keine automat. Synchronsierung
//                     0= automat. synchronisiert, hängt von der Configvariablen "AutoSyncTranslation" ab (=Default)  

// returns true or false
  var sOptions="";
  var sResult="";
  // FilePath
  if(AnyToBool(isVarUndefined(filePath))==true)
    filePath="";
  if((fileType==otMediaXMLFile)||(fileType==otMediaTextFile)){
    sOption=sOption+"Path="+sParam3;
  }  
  // Sortierung Glossar
  if(fileType==otGlossary){
    if(AnyToBool(isVarUndefined(sortGls)))
      sortGls="0";
    if (sOptions!="")
      sOptions=sOptions+",";
    if(sortGls=="1")
     sOptions+="SortGlossary=1";
    if (sOptions!="")
      sOptions=sOptions+",";
    sOptions+="ConvertCRLF=0";
  }
  // AutoSync
  if((fileType==otMetadata)||(fileType==otGlossary)){
    if(AnyToBool(isVarUndefined(syncTrans)))
      syncTrans="0";
    if((syncTrans=="1")||(syncTrans=="2")){
      if (sOptions!="")
        sOptions=sOptions+",";
      sOptions="SyncTranslation="+syncTrans;
    }
  }
  gvSoap.addParams(true,"ProjectHandle", prjID, "FileType", fileType, "XMLData", xmlData);
  if(sOptions!="")
    gvSoap.addParams(false, "Options", sOptions);
  gvSoap.invoke("SaveSpecialFile",false,null,spWSDL+spWebDataIntf);
  if (gvSoap.error() == cNoError)
    return true;
  else
    return false;
}

function sfExecuteMacro(sMacro, sParam1, sParam2, sParam3, sParam4, sParam5, sIgnore){
// executes the specifed Macro from the config table

// sMarco:       Name des Marcos in der Config Tabelle
// sParam1-5:    Diese Parameter  werden an das Makro übergeben
// sReturnParam: Name des Parameters, dessen Inhalt als Rückgabewert dient
// sIgnore:      optional Liste von Error codes, die nicht als Fehler behandelt werden - z:bsp. -141 (=cConfigVarNotDefined)

// liefert true or false je nach Erfolg
  gvSoap.addParams(true,"MacroName", sMacro, "Param1", sParam1, "Param2", sParam2, "Param3", sParam3, "Param4", sParam4, "param5", sParam5);
  gvSoap.invoke("ExecuteMacro",false,null,spWSDL+spAdminIntf);
  //return (gvSoap.error() == cNoError ? true : false);
  //sResult=AnyToStr(ISoap._cmd("ExecuteMacro",sReturnParam,spAdminIntf));
  if (isVarUndefined(sIgnore))
    sIgnore="";
  // Manche Fehler wie ConfigVarNotDefined werden nicht zwangsläufig wie eine Fehler behandelt
  if((gvSoap.error() != cNoError)&&((','+sIgnore+',').indexOf(','+gvSoap.error()+',')>=0)){
    gvSoap.error(cNoError);
  }
  return (gvSoap.error() == cNoError ? true : false);
}

function sfSetDialogLanguage(lFmt, lang) {
// setzt die aktive Dialogsprache
// lFmt: LanguageFormat, 0=Language ID, 1=Language Name (default), 2=Language Token (interne Normierung)
// lang: Language
// returns true or false
  var sResult;
  if ((lFmt != "0") && (lFmt != "2"))
    lFmt = "1";
  gvSoap.addParams(true, "LanguageFormat", lFmt, "Language", lang);
  gvSoap.invoke("SetDialogLanguage", false, null, spWSDL + spAdminIntf);
  return (gvSoap.error()==0 ? true: false);
}

function sfLoadPage(prjID, pageID, fileType, lockState, options){
// loads the specified page as a XML string
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// lockState: lsLocked, lsUnlocked (=default)  
// langToken: LanguageToken (optional)
// options
//     CheckOnly=1 : Nur die Dateiexistenz wird geprüft, Default=0
//     LockSilent=1: Das Locking wird NICHT ins Eventlog eingetragen, Default=1
//     langtoken=<token> (optional)
//     Version=<nn> (optional), diese Version wird aus dem Archiv extrahiert, 0=jüngste Version 
//     CleanPage=1 (optional), die in der Config in "RemoveAttrList" aufgeführten Attribute
//                 werden entfernt sowie alle SriptKommentare, default=0
//     PageMergeMode=1 (optional), Der Mergeprozess läuft nur bis zum ersten Vorkommen einer
//                     anders benannten Page im Projektverzeichnis (exklusive!)
//                     default=0 (es wird bis zum Ende der Referenzkette gemerged)
//     addNameID=1 Bei der Seite und den Komponenten-Nodes wird ein attribut id=name hinzugefügt   
// Spezielle Errorcodes: cPageNotFound, cFileLockedByOther, cFiletypeNotSupported  
  var sResult,sOptions;
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType, "LockIt", lockState);
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("LoadPage", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error() == 0 ? gvSoap.getParam("PageData") : "");
}

function sfSavePage(prjID, pageID, fileType, pageData, restXML, options){
// saves the specified page
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// sPageData: XML data of page
// sRestXML: optionale Basis fürs Entmergen
// options: langToken: LanguageToken (optional), Der oberste Layer ist in der angegebenen Sprache und wird im
//                     Sprachenverzeichnis gespeichert. HINWEIS: Die eigentliche Page wird NICHT gespeichert!
//          syncTrans: optional, wird in der Projektsprache gespeichert, kann hier gesteuert werden, ob
//                     nach dem Speichern "SyncTranslationData" für alle Sprachen aufgerufen wird
//                     1= automat. Synchronsierung aller Sprachen
//                     2= unabhängig von der Config  keine automat. Synchronsierung
//                     0= automat. synchronisiert, hängt von der Configvariablen "AutoSyncTranslation" ab (=Default)
//          syncMediaUsage: Aktualisierung der MedienDB bzgl. der Mediennutzung auf dieser Seite (0=Default)
//                     0= ob gesynct wird hängt vom Wert der Config-Variablen "AutoSyncMediaUsage" ab
//                     1= es wird synchronisiert  
// returns True or False
// spezielle Fehlercodes: cCannotSaveFile, cCannotDeleteFile, cFiletypeNotSupported
 
  var sResult,sOptions;
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType, "PageData", pageData, "RestXML", restXML);
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("SavePage", false, null, spWSDL + spWebDataIntf);
  //return (gvSoap.error() == 0 ? gvSoap.getParam("PageData") : "");
  return (gvSoap.error()==0 ? true: false);  
}

function sfNewPage(prjID, pageID, pageType, templateID, templateType){
// creates a new page. interner Name der neuen seite kann nach ausführung mit gvSoap.getParam("RealPageName") abgerufen werfen
// prjID: Handle des geöffneten Projekts
// pageID: der interne eindeutige Name der neuen seite wird automatisch erzeugt und kann anschließend mit 
//         gvSoap.getParam("RealPageName"); abgerufen werden. Enthält pageID einen String, wir der neue Name 
//         daraus eindeutig abgeleitet
// pageType: otPage (=Default), otLocalTemplate, otAssistant, otLocalAssistant
// templateID: internal name of template, bei Leerstring basiert die Seite auf keinem vorhandenem Template  
// templateType: Typ des angegebenen Templates: otTemplate (=default), otMasterTemplate, otLocalTemplate
// Die Funktion liefert true or false
  //var options;
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", pageType, "TemplateName", templateID, "TemplateType", templateType);
  //if (options!="")
  //  gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("NewPage", false, null, spWSDL + spWebDataIntf);
  //return (gvSoap.error() == 0 ? gvSoap.getParam("PageData") : "");
  return (gvSoap.error()==0 ? true: false);
}

function sfDeletePage(prjID, pageID, fileType){
// deletes the file name of the specified page
// prjID: project handle
// pageID: internal page name
// fileType: otPage  
// returns true or false
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType);
  gvSoap.invoke("DeletePage", false, null, spWSDL + spWebDataIntf);  
  return (gvSoap.error()==0 ? true: false);
}

function sfDuplicatePage(prjID, pageID, pageType, newPageName, options){
// deletes the file name of the specified page
// prjID: project handle
// pageID: internal page name
// pageType: otPage (Default), otLocalTemplate  
// options: SyncMediaUsage=0 (Default): Aktualisierung der MedienDB hängt vom Wert der
//                                      Config-Variablen "AutoSyncMediaUsage" ab
//                        =1: es wird synchronisiert 
// returns true or false
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", pageType);
  if (newPageName!="")
    gvSoap.addParams(false, "NewPageName", newPageName);
  if (AnyToBool(isVarUndefined(options))==true)
    options="";
  if (options!="")
    gvSoap.addParams(false, "Options", options); 
  gvSoap.invoke("DuplicatePage", false, null, spWSDL + spWebDataIntf);  
  return (gvSoap.error()==0 ? true: false);
}


function sfMergePage(prjID, pageName, topLayerXML, fileType, topLayer, options){
// mergt eine Seite des angegebenen Typs und stellt das Ergebnis über diverse getParam()-Abrufe bereit 
// prjID: Handle des geöffneten Projekts
// pageName: Name des oberseten Layers = name of page
// topLayerXML: Wird ein PageXML übergeben, wird dieses XML als Layer 0 genommen und nicht das aus dem Filesystdem
// fileType: otPage, otLocalTemplate, otTemplate, otMasterTemplate
// TopLayer: Dieser Layertyp soll on Top liegen: (ltLanguage, ltPage)
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
  
//            
//            sParam5: optional Name of Return Parameter  (siehe unten)
// sParam6: optional LangToken - wenn angegeben, dann muss für sParam5 zuindest "" übergeben werden
// sParam7: optional: "1" = incl. spezieller Attribute  __LN (LayerNumber) und  __LI (LayerInfo).
//          Wenn angegeben, dann muss für sParam5 und sParam6 zuindest "" übergeben werden

// Folgende Ergebnisse stehen nach Ausführung über ISoap.GetResultData() bereit:
//   LayerList: Liste der Layer (default)
//   PageXML:   gemergte Page
//   RestXML:   gemergte Page OHNE den obersten Layer

// return bei Erfolg je nach sPaream5 (LayerList=default) bzw. Leerstring bei Fehler
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageName, "TopLayerXML", topLayerXML, "FileType", fileType, "TopLayer", topLayer, "Options", options);
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("MergePage", false, null, spWSDL + spWebDataIntf);
  //return (gvSoap.error() == 0 ? gvSoap.getParam("PageData") : "");
  return (gvSoap.error()==0 ? true: false);
}

function sfSetPageTemplate(prjID, pageID, newTemplateID, localTemplate) {
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
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "NewTemplateName", newTemplateID, "TemplateIsLocal", localTemplate);
  gvSoap.invoke("SetPageTemplate", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error()==0 ? true: false);  
}

function sfSetProjectInfo(prjID, infoType, info, options){
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
// options: zusätzliche Angaben je nach pit-Konstante. z.Bsp. bei pitConfigData der Key in der iProject.ini
// Return: TRUE oder FALSE
  gvSoap.addParams(true, "ProjectHandle", prjID, "InfoType", infoType, "Info", info);
  //if (AnyToBool(isVarUndefined(infoParam))==true)
  //  options="";
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("SetProjectInfo", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error()==cNoError ? true: false);
}

function sfGetProjectInfo(prjID, infoType, options){
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
// options: optionaler Parameter je nach pit-Konstante
// infoParam: optionaler Parameter je nach pit-Konstante
//          bei pitCFWContainer eine der TargetPlatForm-Konstanten (tpfxxx, DEFAULT=tpfDesktop)
//              In diesem Fall wird der Name der Containerpage für die entsprechende TargetPlatform zurückgegeben.
//          bei pitConfigData ist infoParam das KeyWord im Abschnitt der iproject.ini  
// Return: TRUE oder FALSE
  gvSoap.addParams(true, "ProjectHandle", prjID, "InfoType", infoType);
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("GetProjectInfo", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error()==cNoError ? true: false);  
}

function sfSetPageMetadata(prjID, pageID, fileType, metaData, options){
// Metadaten einer Seite oder eines Template setzen
// prjID: Projekt-ID
// pageID: interner Page name
// fileType: otPage (=default), otLocalTemplate, otTemplate, otLocalAssistant 
// metaData: z.Bsp. Caption="Tolle Seite"
// options: 
// isChapter:  0=Seite, 1=Kapitel (optional)
// langToken: die Sprache (optional)
// returns TRUE or FALSE
  var sFileType,sOptions;
  gvSoap.addParams(true, "ProjectHandle", prjID, "RealPageName", pageID, "FileType", fileType, "MetaData", metaData);
  if (options!="")
    gvSoap.addParams(false, "Options", options);
  gvSoap.invoke("SetPageMetadata", false, null, spWSDL + spWebDataIntf);
  return (gvSoap.error()==cNoError ? true: false);
/*

  sOptions="";
  
  ISoap._ClearParam();
  ISoap._AddParam("ProjectHandle",IAL._PrjHandle());
  ISoap._AddParam("RealPageName",sParam1);
  ISoap._AddParam("FileType",sFileType);
  ISoap._AddParam("MetaData",metaData);
  if(isChapter=="1")
    sOptions="IsChapter=1";
  if(langToken!=""){
    if(sOptions!="")
      sOptions=sOptions + ",";
    sOptions=sOptions + "LangToken=" + langToken;
  }
  if(sOptions!="")
    ISoap._AddParam("Options",sOptions);
  ISoap._cmd("SetPageMetadata","return",spWebDataIntf);
  return AnyToStr(ISoap.ok());
  */
 
}

function sfStartExportScorm(projectName) {
  // projectName: name of project
  return IAL._aStartPublishProject(projectName,1,IAL._PrjSrcLang(),1,'',1);
}

function sfStartExportHTML(projectName) {
  // projectName: name of project
  return IAL._aStartPublishProject(projectName,0,IAL._PrjSrcLang(),1,'',1);
}

function sfStartExport2URL(projectName) {
  // projectName: name of project
  return IAL._aStartPublishProject(projectName,4,IAL._PrjSrcLang(),1,'',1);
}

function sfStartExport2LMS(projectName) {
  // projectName: name of project
  return IAL._aStartPublishProject(projectName,7,IAL._PrjSrcLang(),1,'',1);
}

function sfGetExportPercent(projectName){
  return IAL._aCheckPublishProject(projectName,"PercentDone");
}

function sfGetDownloadURL(projectName){
  return AnyToStr(IAL._aFinishPublishProject(projectName,""));
}

//ab hier alles löschen
var xxintervalID;
function publishProject4me(projectName){
  sfStartExport2LMS(projectName,);
  xxintervalID = setInterval(function(prjname){
    var perc=AnyToInt(sfGetExportPercent(prjname));
    if(perc==-71)
      clearInterval(xxintervalID);
    if(perc==100){
      clearInterval(xxintervalID);
      alert(sfGetDownloadURL(prjname))
    }
    else{
      console.log(perc);
    }
  }, 100,projectName);
}