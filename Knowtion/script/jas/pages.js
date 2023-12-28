/************************************************************************
 pages.js: 
 Interface zum Anlegen, Öffnen, Bearbeiten und Löschen von Seiten 
 Die hier realisierten Teile werden nur in knowtion benötigt 
 Die enthaltenen Funktionen rufen i.d.r gleichnamige Funktionen 
 aus der gleichnamigen Datei im Ordner ../as/ auf 
 ************************************************************************/
 

function jaIsProtected(attrProt, typeProt){
// attrProt: Der Inhalt des Attributs __PT einer Komponente
// typeProt: Eine der Protrection-Types
//  ptNone=0; // keine Protection
//  ptMaxProtection=1;
//  ptDelete=2;
//  ptResize=4;
//  ptChangePos=8;
//  ptChangeContent=16;
//  ptScripEditor=32;
//  ptActionEditor=64;
//  ptUseByAction=128;
//  ptCopy=256;
//  ptAttrPanel=512;
//  ptAssistant=1024;
//  ptDoNotList=2048;
//  liefert true or false
 var val1=AnyToInt(attrProt);
 var val2=AnyToInt(typeProt);
 if ((val1 & val2) != 0)
   return true;
 else
   return false;
} 

function jaLoadPage(prjID, pageID, fileType, lockState, langToken, version, cleanPage, addNameID){
// loads the specified page as a XML string
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// fileType: otPage (=default), otTemplate, otLocalTemplate, otMasterTemplate, otAssistant,...
// lockState: lsLocked, lsUnlocked (=default)  
// langToken: LanguageToken (optional)
// version: Version (optional), 0=youngest version
// cleanPage: 1, 0 (=default), optional remove of comments, line breaks and more 
// MergeMode: (siehe sfLoadPage)     
// returns the xmldata of the specfied page
// Spezielle Errorcodes: cPageNotFound, cFileLockedByOther, cFiletypeNotSupported
  var pg=asLoadPage(prjID, pageID, fileType, lockState, langToken, version, cleanPage, addNameID);
  //if ((AnyToBool(isVarUndefined(addID))==false)&&(addID==true)){
  //  pg=IMP.CLP._addID2XML(pg);
  //}
  return pg;
}

function jaSavePage(prjID, pageID, fileType, pageData){
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
  return asSavePage(prjID, pageID, fileType, pageData, "", "", "0", "0");
}

function jaNewPage(prjID, pageID, pageType, templateID, templateType){
// creates a new page und liefert den internen eindeutigen Namen der neuen Seite oder Leerstring bei Fehler
// prjID: Handle des geöffneten Projekts
// pageID: der interne eindeutige Name der neuen seite wird automatisch erzeugt. Enthält pageID einen String, 
// wird der neue Name daraus eindeutig abgeleitet
// pageType: otPage (=Default), otLocalTemplate, otLocalAssistant
// templateID: internal name of template, bei Leerstring basiert die Seite auf keinem vorhandenem Template  
// templateType: Typ des angegebenen Templates: otTemplate (=default), otMasterTemplate, otLocalTemplate,
//               otLocalAssistant, otAssistant
  return asNewPage(prjID, pageID, pageType, templateID, templateType);
}

function jaMergePage(prjID, pageName, topLayerXML, fileType, topLayerType, langToken, addSpecialAttr){
// mergt eine Seite des angegebenen Typs und stellt das Ergebnis über diverse getParam()-Abrufe bereit 
// prjID: Handle des geöffneten Projekts
// pageName: Name des oberseten Layers = name of page
// topLayerXML: Wird ein PageXML übergeben, wird dieses XML als Layer 0 genommen und nicht das aus dem Filesystdem
// fileType: otPage, otLocalTemplate, otTemplate, otMasterTemplate
// lopLayerType: Dieser Layertyp soll on Top liegen: (ltLanguage, ltPage)
// LangToken: <token>: Die Page wird in der angegebenen Sprache geliefert 
// addSpecialAttr: (0=default) 1= die Attribute __LN (LayerNumber) und __LI (LayerInfo) werden hinzugefügt  
// liefert true oder false
// die folgenden Return-Parameter können nach erfogreicher Ausführung via gvSoap.getParam() abgerufen werden
//          "LayerList": Hier wird die Liste der Layer zurückgegeben. Im Index 0 der oberste, etc, Format je Eintrag: Scope=RealName
//          "PageXML": Die fertig gemergte Page
//          "RestXML": Die gemergte Page OHNE den obersten Layer
  var sResult, sOptions;
  if(AnyToBool(isVarUndefined(langToken)))
    langToken="";
  if(addSpecialAttr!="1")
    addSpecialAttr="0";
  sOptions="";
  if(langToken!="")
    sOptions="LangToken=" + langToken;
  if(addSpecialAttr=="1")
    sOptions!="" ? sOptions=sOptions+",ASA=1" : sOptions="ASA=1";
  asMergePage(prjID, pageName, topLayerXML, fileType, topLayerType, sOptions);
  if (gvSoap.error()==cNoError)
    return true;
  else
    return false;
}

function jaSetPageTemplate(prjID, pageID, newTemplateID, localTemplate) {
// Ändert das von der Seite referenzierte Template
// prjID: Handle des geöffneten Projekts
// pageID: internal Name of page
// newTemplateID: internal name of new template 
// localTemplate: true falls e ein lokales Template ist, sonst false3 (=default) 
// liefert true or false
  return asSetPageTemplate(prjID, pageID, newTemplateID, localTemplate);
}

function jaSetPageMetadata(prjID, pageID, fileType, metaData, isChapter, langToken) {
// Metadaten einer Seite oder eines Template setzen
// prjID: Projekt-ID
// pageID: interner Page name
// fileType: otPage (=default), otLocalTemplate, otTemplate, otLocalAssistant 
// metaData: z.Bsp. Caption="Tolle Seite"
// isChapter:  0=Seite, 1=Kapitel (optional)
// langToken: die Sprache (optional)
// returns TRUE or FALSE
  var sResult=asSetPageMetadata(prjID, pageID, fileType, metaData, isChapter, langToken);
  ISoap.Error(gvSoap.error());
  ISoap.ok(AnyToBool(gvSoap.error() == cNoError));
  return sResult;
}