/************************************************************************
 projects.js: 
 Interface zum Anlegen, Öffnen, Bearbeiten und Löschen von 
 Projekten im Kontext von knowtion. Es basiert auf den gemeinsamen Projekt-kernel
 in as/projects.js und ergänzt bzw. kapselt spezifische knowtion-Aspekte
 ************************************************************************/

function jaAddUser(userName, eMail, userType, active) {
// fügt den angegebenen User hinzu
// userName muss eindeutig sein    
// userType: utGuest, utCustomer, utStandard, utSystem (default=utStandard=utCustomer)
// active:  setzt das gleichnamige Feld in der Usertabelle auf "0" oder "1" (default=1)
// returns true or false
  var sResult = asAddUser(userName, eMail, userType, active);
  return sResult;
}

function jaAddUserToGroup(userName, groupName){
// adds the specified user to the specified group
// returns true or false
  var sResult = asAddUserToGroup(userName, groupName);
  return sResult;
}

function jaListProjects(listmode, dataformat, deleted) {
// returns the list of projects available for the logged in user
// listmode: - 1: Kommasep. Liste der Projektnamen (DEFAULT)
//           - 2: Kommasep. Liste von Projektinfos (ProjectName, ProjectNiceName, Author, CreationTime)
//           - 3: wie ListMode 2 aber mit "DeletionTime".
//           - 4: unabhängig von der Rechtsituation für alle nur die Felder "ProjectName" und "DeletionTime"
// dataformat: - 0 = comma seperated list of multiple values for each found course.
//                   values for one course are seperated by semicolon
//             - 1 = XML format (!!!!! not yet supported !!!!!!!)
// deleted  - "0" = nicht gelöschte (Default)
//          - "1" = gelöschte
  return asListProjects(ptCourse, listmode, dataformat, deleted, "", 0);
}


function jaOpenProject(prjName){
// öffnet das angegebene Projekt, lädt das Varfile, CSS Files und initialisert einige Projekteigenschaften via Makros
// liefert bei Erfolg die ProjektID, Leerstring bei Fehler
// die Projekt-ID dient als Parameter für andere Funktionen, wie beispielsweise gaCloseProject() und liefert via 
// asGetOpenProject(prjID); ein Object, über dass dann viele weitere Projektdaten abgerufen werden können  
   var prjID=asOpenProject(prjName);
   if (prjID==""){
     return "";  
   } 
   return prjID;
}

function jaCloseProject(prjID){
// schließt das angegebene Projekt
// prjID: Projekt-ID 
// liefert true or false

// Eine weitere Option "AutoVersion=[0/1]" 1=Default erlaubt das standardmäßige 
// automatische Archivieren der Projekttrees (Pages und Templates) beim Schließen
// des Projektes abzuschalten
//  Bislang wird "AutoVersion=0" hier intern hart codiert
  return asCloseProject(prjID);
}

function jaCreateProject(prjName, ptName){
// legt ein neues Projekt an und gibt den eindeutigen internen Projektnamen zurück
//
// prjName: title of new project (maxlength=50) will be converted into unique internal project name
// ptName: name or id of pattern, empty means default pattern from config db
  var prjIntName=sfCreateProject(prjName, ptName, 0, ptCourse, '','','');
  // wenn es geklappt hat, liefert prjIntName den eindeutigen internen Projektnamen
  return prjIntName;
}

function jaDuplicateProject(prjName, prjSource){
// dupliziert ein lokales Projekt des Mandanten und gibt den eindeutigen internen Projektnamen zurück 
//
// prjName: title of new project (maxlength=50) will be converted into unique internal project name
// prjSource: name or id of source project which should be to be duplicated
    
  var prjIntName=sfCreateProject(prjName, prjSource, 1, ptCourse, '','','');
  // wenn es geklappt hat, liefert prjIntName den eindeutigen internen Projektnamen
  return prjIntName;
}


function jaGetOpenProject(prjID){
  return asGetOpenProject(prjID);
}

function jaDeleteProject(prjID, delOption, lngToken){
// deletes a project
// prjID: name or id of project
// delOption: 0: project remains physically (default in ideaTEAM) 
//            1: project will be deleted physically too (!!!!! default nur in knowtion, da dort kein Papirerkorb implementiert !!!! )
//            2: ein mit "ToPublic=1" gepublishter Kurs wird gelöscht (derzeit nur bei LSB)
//            3: ein mit "ToPublic=3" (nach IDEALive) gepublishter Kurs  wird gelöscht (PVA)
// lngToken: LanguageToken - nur in Verbindung mit sParam2="2" oder "3"
// returns true or false
  // !! temporärer workarround: Projekt wird explizit geschlossen, da sonst Löschen scheiter mit ProjectInUse.
  // Close-Project sollte jedoch eigentlich durch den knwotion client erfolgen
  stopOnThis("jaDeleteProject","");
  //var pID=jaOpenProject(prjID);  
   var pID= ITF._openProject(prjID);
  
  if (asGetOpenProject(prjID)==null){
    return false;
    //sfCloseProject(pID);
  }else{  
    jaCloseProject(pID);
  }   
  if (isVarUndefined(delOption)==true)
    delOption="1";
  return asDeleteProject(prjID, delOption, lngToken);
}

function jaSetProjectInfo(prjID, infoType, info, infoParam) {
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
  return asSetProjectInfo(prjID, infoType, info, infoParam);
}

function jaGetProjectInfo(prjID, infoType, infoParam) {
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
  return asGetProjectInfo(prjID, infoType, infoParam);
}  
    
function jaLoadPrjTreeEx(prjID, treeType, lngToken, liveTransState, mergeMode, cacheMode, addPool){
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
  var sResult=asLoadPrjTreeEx(prjID, treeType, lngToken, liveTransState, mergeMode, cacheMode, addPool);
  return sResult;
}

function jaAddPrjNode(prjID, treeType, destNode, destPos, nodeType, nodeName, nodeData) {
// fügt dem angegebenen Tree einen neuen Eintrag hinzu
// prjID: ID des Zielprojektes
// treeType: Typ des Trees (otPrjTree, otLocalTemplTree, otLocalAssistantTree)
// destNode: NodeName für Zielposition im Tree
// destPos:  Position relativ zu destrNode (ptitAfter,ptitUnder,ptitBefore,ptitOverwrite)
// nodeType: Typ des neuen Eintrags (ptntChapter,ptntPage)
// nodeName: nur bei ptntPage Name des neuen Eintrages
// nodeData: kommaseparierte Liste der Nodedaten (z.Bsp.: Caption="Schöne Seite",ShowInMenu="1")
// returns interner Name des neuen Nodes, Leerstring bei Fehler
  var sResult=asAddPrjNode(prjID, treeType, destNode, destPos, nodeType, nodeName, nodeData);
  return sResult;
}

function jaDelPrjNode(prjID, nodeName, treeType) {
// entfernt einen Eintrag aus dem Projekttrree des geöffneten Projekts
// project: ID des Projektes
// nodeName: internal unique node name
// treeType: otPrjTree, otLocalTemplTree,...
// returns true or false
  var sResult = asDelPrjNode(prjID, nodeName, treeType);
  return sResult;
}

function jaMovePrjNode(prjID, nodeName, destNode, destPos, treeType){
// verschiebt einen Eintrag aus dem Projekttree an eine andere Stelle
// verschiebt einen Eintrag aus dem Projekttree an eine andere Stelle
// prjID: ID des Zielprojektes
// nodeName: internal unique node name
// destNode - relativ zu diesem Node ist die neue Position
// destPos  - ptitAfter, ptitUnder
// treeType: otPrjTree, otLocalTemplTree,...
// returns ID des verschobenen Nodes, 0 bei Fehler
  var sResult = asMovePrjNode(prjID, nodeName, destNode, destPos, treeType);
  return sResult;
}

function jaGetPrjNodeData(prjID, nodeName, attrName, treeType){
// Liefert den Inhalt eines Attribut oder alle Daten des mit NodeID gewählten Nodes des Trees bzw. Leerstring bei Fehler
// prjID: ID des Projektes
// nodeName: eindeutiger Name des nodes
// attrName: NAme des Attributs, Leer=alle Attribute kommasepariert "Name1=Value1","Name2=... 
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
  var sResult=asGetPrjNodeData(prjID, nodeName, attrName, treeType);
  return sResult;
}

function jaSetPrjNodeData(prjID, nodeName, nodeData, treeType){
// Schreibt Daten eines Eintrags aus dem Projekttree des geöffneten Projekts und liefert true oder false
// prjID: ID des Projektes
// nodeName: eindeutiger Name des nodes
// nodeData: Daten kommasepariert "Name1=Value1","Name2=... 
//          Beispiel: Caption="Schöne Seite",ShowInMenu="1"
// treeType: otPrjTree, otLocalTemplTree  (Default=otPrjTree)
    var res=asSetPrjNodeData(prjID, nodeName, nodeData, treeType);
    return res;
}

  function jaSetProjectTitle(prjID, title) {
// schreibt die description ins MD file
// prjID: Handle des geöffneten Projekts
// title: nice name 
// Return: TRUE oder FALSE
  var res=asSetProjectTitle(prjID, title);
  return res;
}

function jaSetProjectDescription(prjID, description){
// schreibt die description ins MD file
// prjID: Handle des geöffneten Projekts
// description: Beschreibung 
// Return: TRUE oder FALSE
  var res=asSetProjectDescription(prjID, description);
  return res;
}

function jaGetProjectDescription(prjID){
// liest die description des Projektes aus - 1. Versuch die gecachte Version, 2. Versuch aus dem MD file
// prjID: Handle des geöffneten Projekts
// Return: Description oder null
  var res=asGetProjectDescription(prjID);
  return res;
}