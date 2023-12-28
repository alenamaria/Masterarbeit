/*
 contants - soap communiuaction server modul
*/
                               
// Listmode Konstanten
var lmNames=2
var lmIDs=1

// Reference Type constants
var rtNotReferenced=0;
var rtReferenced=1;
var rtRefLocalized=3;

// Selection Type constants
var stNone=0;
var stSingleComp=1;
var stPage=2;
var stMultipleComp=17;

var otUnknown=0;
var otTable=1;
var otProject=2;
var otLibrary=3;
var otClient=4;
var otMedia=5;
var otPage=6;
var otTemplate=7;
var otMasterTemplate=8;
var otPrjTree=9;
var otVarFile=10;
var otMetadata=11;
var otPattern=12;
var otTemplTree=13;
var otSystemComps=14; // PageEditorComponentPalette (system)
var otSmartTempl=15; // Komponenten Vorlagen(SmartTemplates)
var otMediaTextFile=16; // Media-TEXT-File mit Pfadangabe
var otMediaXMLFile=17;  // Media-XML-File mit Pfadangabe
var otPreviewVARFile=18;  // for Preview usage
var otAssistant=19;
var otPublicProject=20;
var otLocalTemplate=21;
var otPrjTreeEx=22;  // der gemergte PrjTree (mit Nicename, CommentState, Lockstatus etc)
var otComponents=23;  // Per Reference nutzbare Komponentenvorlage
var otLanguage=24;  // Sammeltype für alle Files einer Übersetzung
var otLanguageLayer=25;  // Sprachenlayer für die Projekt-Zielsprache
var otLanguageDefinition=26;  // SprachdefinitionsDatei
var otGlossary=27; 
//var otTemplatePage=28;  // Page aus dem Templateverzeichnis, zB zum Laden der CFW Dateien
var otLocalTemplTree=29;  
var otTempProject=30;  // temporäres Projekt (enspricht ptTempCourse)
var otIniFile=31;  // Projekt INI, gemergt mit der Template INI, in XML konvertiert
var otClientData=32;  // speichert ein FILE in der root des clientverzeichnisses
var otGlossaryEX=33;  // Gemergte Glossardatei, in der angegebenen Sprache
var otXTD=34;  // für Mergeprozess, XTD-File
var otAssistantTree=35;  // Assistant Tree im Template
var otLocalAssistantTree=36;  // Assistant Tree im Projekt
var otLocalAssistant=37;  // Assistant im Projekt 
var otGlossaryProject=38;

var otAllOfType=64;
var otAllObjects=255;

// Target Plattform Konstanten
var tpfDesktop=0;
var tpfPhone=1;
var tpfTablet=2;
var tpfPhoneOrTablet=3;
var toVertical=0;
var toHorizontal=1;


// Error codes 
var cNoError=0;
var cNotImplemented=-1;
var cInternalError=-2;
var cInvalidParameterList=-3;
var cSessionKilled=-5;
var cWSIdMissing=-6;
var cOtherLoggedInHere=-7; // anderer User mit gleicher SessionID bereits eingeloggt
var cAlreadyLoggedInHere=-8; // User ist hier bereits eingeloggt
var cAlreadyLoggedIn=-9; // User ist woanders bereits eingeloggt
var cLoginError=-10;
var cNotLoggedIn=-11;
var cNoAccessRights=-12;
var cClientNotActive=-13; // Active =0 im Client-Datensatz
var cClientNotValidNow=-14;
var cCannotChangePwd=-15;
var cPwdOrNameWrong=-16; // SetPassword sagt: OldPassword ist falsch
var cNotAllowedForGuest=-17;
var cIPAddrChanged=-18;
var cClientNotFound=-19;

// fatal Database Errors
var cDBError=-20;
var cUserDBNotOpen=-21;
var cRecordNotFound=-22;
var cRecordNotUnique=-23;
var cRecordExists=-24;
var cCannotAddRecord=-25;
var cCannotUpdateRecord=-26;
var cCannotDeleteRecord=-27;
var cIDFieldNotSpecified=-28;
var cKeyFieldNotSpecified=-29;

var cUserNotFound=-30;
var cGroupNotFound=-31;
var cObjectNotFound=-32;
var cProjectNotFound=-33;
var cFileNotFound=-34;
var cFileAlreadyExisting=-35;
var cTemplateNotFound=-36;
var cPageNotFound=-37;
var cRoleNotFound=-38;
var cCFWNotFound=-39;

var cProjectAlreadyOpen= -40;
var cFileLockedByOther= -41;
var cCannotSaveFile= -42;
var cCannotDeleteFile=-43;
var cCannotLoadfile=-44;
var cCannotCopyFiles=-45;
var cCannotGetNextPageID=-46; // von NewPage oder DuplicatePage
var cFiletypeNotSupported=-47;
var cTreeTypeNotSupported=cFiletypeNotSupported;

var cMailNotExisting=-50;
var cNotYourMail=-51;
var cMailReceiverNotFound=-52;
//  cTaskNotExisting=-55;
//  cNoChatMsgFound=-56;
//  cUserNotInRoom=-57;
//  cChatRoomExists=-58;

var cCircularReference=-60;
var cTemplPrjNotFound=-61; 
var cStatFileLoadError=-62;
var cCannotStartPublish=-70;
var cPublishNotRunning=-71;
var cPublishNotFinished=-72;
var cPublishError=-73;
var cProjectIsJustBeeingPublished=-74; 
var cWrongProject=-75;// falsche ProjectID bei ImportTranslationTexts
var cPublishTerminated=-76;// Publish Thread wurde terminiert

var cProjectNameExists=-80;
var cPatternNotDefined=-81;
var cPatternNotFound=-82;
var cBaseProjectNotFound=-83;
var cBaseProjectNotRegistered=-84;

var cProjectInUse=-85;
var cUserOnline=-86;
var cTemplateProjectInUse=-87;
var cBaseProjectNotMatching=-88;
var cUserDataVarNotDefined=-90;
var cInfoTypeUnknown=-91;
var cLanguageNotDefined=-92;
var cNoLanguageSpecified=-93;
var cLangTokenNotSupported=-94;

var cSQLRequestNotFound=-100;
var cSQLFormatError=-101;
var cDataFormatError=-102;

var cUserExists=-110;
var cEMailAddressExists=-111;
var cCannotSendEMail=-112;
var cKeyNotValid=-113;
var cNotYourReview=-114;
var cInvalidRating=-115;
var cNoMailAddrSpecified=-116;
var cNoEmptyPwdAllowed=-117;
var cPageNameConflictFound=-120;
var cMacroError=-130; // Fehler bei ExecuteMacro, in ErrorCodeEX liefert dann "MAKRO-ErrorCodes" (siehe unten)

var cConfigVarNotDefined=-141;
var cCannotSaveConfigVar=-142;

var cPRJNodeNotFound=-150;
var cCannotAddPRJNode=-151;
var cCannotMovePRJNode=-152;
var cCannotSetPRJData=-153;
var cCannotDelPRJNode=-154;
var cCannotListPrjPages=-155;
var cSrcNodeNotFound=-156;
var cDstNodeNotFound=-157;
var cSrcNodeExistsInDst=-158; // Warnung
var cDstNodeHasWrongType=-159;
var cDifferentTemplates=-160; // Warnung

var cNoClientPatternInfo=-165;
var cClientPatternNotFound=-166;
var cClientExisting=-167;        
var cClientDirExisting=-168;
var cClientPatternInvalid=-169;

var cTooManyRegisteredUsers=-190;
var cTooManyConcurrentUsers=-191;

var cVersioningNotInstalled=-200;
var cVersioningNotConfigured=-201;
var cVerRepositoryNotFound=-202;
var cVerArchiveNotFound=-203;
var cVerNoAutoRestoreVersion=-204;
var cVerArchiveTypeUnknown=-205;
var cUnknownVersioningError=-206;
var cVerCannotDeleteVersion=-210;
var cNoNewReleaseNeeded=-211;
var cProjectReleaseNotFound=-212;
var cProjectReleaseExists=-213;

var cArchiveNotExisting=-214;
var cVersionAlreadyExisting=-215;
var cVersionNotExisting=-216;
var cFileInVersionExisting=-217;
var cNoNewVersionNeeded=-218;
var cRepositoryNotOpened=-219;

// Job bezogene Errorcodes
var cUnknownJobType=-250;
var cInvalidJobID=-251;
var cInvalidJobStatus=-252;
var cCommunicationError=-253;
var cSetJobRunningFailed=-254;
var cCannotUnzipFile=-255;
var cCancelledByUser=-256;
var cFTPError=-257;
var cCannotZipFile=-258;

// Mediacenter bezogene Errorcodes
var cMediaCenterNotInstalled=-300;
var cMediaCenterNotConfigured=-301;

var cJSonParseError=-302;
var cJSonFormatError=-303;

var cUnknownEIFormat= -310; // Unknown Export/Import Format
var cSoapError1=-1000;// Fehler in der SOAP Kommunikation

// zusätzliche Fehlercodes des Clients 
var cProjectNotOpen=-2001; // Das angegebene Projekt muss zuvor geöffnet werden
var cPageNotOpen=-2002; // Die angegebene Seite muss zuvor geöffnet werden

//  MAKRO-Errorcodes
var cMacroNotFound=-1;    

// CheckPublishProject Error Codes
var cpteNoError=0;
var cpteCannotCreateTargetDir=-1;
var cpteCannotCopyRuntime=-2;
var cpteCannotPatchStartfiles=-3;
var cpteCannotCopyProjectFiles=-4;
var cpteCannotCopyExtMedia=-5;
var cpteCannotPublishPage=-6;
var cpteCannotCopyPublishedfile=-7;
var cpteCannotCopyScormFiles=-8;
var cpteCannotSendToFTP=-9;
var cpteCannotSendToIDEAContent=-10;     

//Spezielle LOGIN Errocodes mit ActiveDirectory 
var cade_NoDomain           = -1001;
var cade_CannotConnect      = -1002; // Verbindung mit dem AD nicht möglich
var cade_CannotGetUserData  = -1003;
var cade_UnknownError       = -1004;
var cade_Authentication     = -1005; // kommt bei falschem Passwort oder deaktiviertem Konto
var cade_UnknownUser        = -1006; // der Loginuser ist im AD nicht bekannt
var cade_NoRolesAssigned    = -1007; //


// Fehler bei der Ausführung eines SOAP Kommandos
var invkErrInterfaceNotFound=-10; 
var invkErrUnknownError=-11;
var invkErrMethodNotFound=-12; 
var invkErrCanNotConvertParams=-13;
var invkErrNotIntegerResult=-14;
var invkErrFuncInvokeError=-15;
var invkErrCanNotConvertResult=-16;

  // SyntaxFehler
var cInvalidMarcoResult=-20;
var cUnknownCmd=-21;
var cSyntaxError=-22;
var cLabelNotFound=-23;
var cInvalidExpression=-24;
var cInvalidOperator=-25;
var cEndifNotFound=-26;
var cNoIntegerValue=-27;
var cInvalidSAOPName=-28;
var cNoAssignChar=-29;  // Kein '=' gefunden
var cVariableSyntaxWrong=-30;
var cIndexIsNotAnInteger=-31;
var cIndexOutOfRange=-32;

// Warnungen
var cFirstMacroWarning=-50;
var cEndifWithoutIf=-50;
var cVariableNotFound=-51;

// LockModes
var lmNotLocked=0;
var lmTemporarilyLocked=1;
var lmPermanentLocked=2;

// LockStates
var lsUnLocked=0;
var lsLocked=1; 
var lsLockedTemp=1;
var lsLockedPerm=2;
var lsLockedTempAndPerm=3;

// Cache Modes
var cmNever=0;
var cmAuto=1;
var cmEver=2;

// RightFlags
var rfNoRights=0;
var rfView=1;
var rfEdit=2;
var rfDelete=4;
var rfCreate=8;
var rfPublish=16;
var rfGrant=32;
var rfAllRights=255;

//  ListFilter
var lfNoFilter=0;
var lfActive=1;
var lfNotActive=2;
var lfDeleted=4;
var lfNotDeleted=8;

//ListFlags aus der OBJECTS-Tabelle
var lflagProject=1;
var lflagGlossary=2;
var lflagTemplate=4;
var lflagPattern=8;

// LayerTypes
var ltLanguage=1;
var ltDialog=2;
var ltPage=3;
var ltComponent=4;

// SandwichTypes
var swtUnknown=0;
var swtPage=10;
var swtXTD=20;
var swtLocalTemplate=20;
var swtTemplateXTD=30;
var swtTemplateTPL=40;
var swtMasterTemplateXTD=50;
var swtMasterTemplateTPL=60;
var swtAssistant=70;

//  UserTypes
var utGuest=0;
var utCustomer=1;
var utStandard=utCustomer;
var utSystem=2;     

// sonstige User-Konstanten
var cAllUsers="3";

//ProjectTypes
var ptNoProject=0;
var ptCourse=1;    
var ptLibrary=2;
var ptClient=3;
var ptPattern=4;
var ptPublicCourse=5;
var ptTempCourse=6;
var ptGlossary=7;

// MergeModes für den LoadPrjTreeEx
var mmAuto=0;
var mmMerged=1;
var mmNotMerged=2;

 //EventTypes
var etSystem=0;
var etLogin=1;
var etLogout=2;
var etProjectOpened=4;
var etProjectClosed=8;
var etProjectCreated=16;
var etProjectDeleted=32;
var etProjectPublished=64;

var etPageMetadataChanged=256;
var etPageLockChanged=512;
var etPageDataChanged=1024;
var etPageCreated=2048;
var etPageDeleted=4096;
var etLocalPrjFileDataChanged=8192;   // Bedeutung geändert - LocalTemplateTreeData changed
var etLocalTemplTreeDataChanged=etLocalPrjFileDataChanged;
var etPrjFileDataChanged=16384;
var etAssiPrjFileDataChanged=32768;

var etVarFileDataChanged=65536;
var etMetadataLockChanged=131072;
var etMetadataDataChanged=262144;
var etCommentStateChanged=524288;

var etTemplLockChanged=1048576;
var etLocalTemplLockChanged=2097152;

var etTemplFileDataChanged=0;

var etSendMail=1048576;
var etGaveTask=2097152;  

// AS Events               
var asePageSizeChanged=1;
var aseDeviceModeChanged=2;
var asePageLoadInEditor=3;
var asePageUnLoadInEditor=4;

//  ProjectInfoType Konstanten
var pitMediaUrl=1;
var pitPagesUrl=2;
var pitAssiPagesUrl=3;
var pitPrjOwnerID=4;
var pitPrjOwnerName=5;
var pitIsCFWActive=8;
var pitCFWContainer=9;
var pitUID=10;
var pitPrjNiceName=11;
var pitDescription=12;
var pitCreationTime=13;
var pitPrjStartImg=14;
var pitPrjStartDelay=15;
var pitPrjBaseLanguage=16;
var pitPrjListFlags=17;
var pitPrjGlossaryRefs=18;
var pitBaseTemplate=19; // Eintrag "References/Templates" aus der iproject.ini
var pitPrjChain=20; // Liste der referenzierten Projekte und Templates
var pitBaseProject=21; // Eintrag "References/BaseProject" aus der iproject.ini
var pitCourseFlashMode=22;
var pitStageDimensions=23; // Kommasep. Liste der Stage Maße: X,Y,Breite,Hoehe
var pitLocalTemplChain=24; // Liste der refenzierten lokalen! Templates
var pitObjectType=25;
var pitConfigData=26; // Zugriff auf das Chapter [ConfigData] der IPROJECT.INI.
var pitIsTemplateProject=27; // PST-Files der Referenzkette werden gemergt

// ServerInfoType Konstanten
var sitActiveDirectory=1;

// PrjTree InsertType
var ptitAfter=0;
var ptitUnder=1;
var ptitBefore=2;
var ptitOverwrite=3;

// PrjTree NodeType
var ptntChapter=0;
var ptntPage=1;

// Translation Status (z.Bsp. für Seiten) 
var tsNotNeeded=-1;
var tsNotStarted=0;
var tsNotFinished=1;
var tsFinished=2;
//tsApproved             = 3;  // freigegeben

// Translation Status Konstanten (tst) für Einzel-Infos (z.B. für Attribute)
var tstNotTranslated='0';
var tstAutoTranslated='1';
var tstManuallyTranslated='2';
var tstManuallyTranslatedOrgChanged='3';
var tstAutoTranslatedOrgChanged='4';
var tstLocked='5';  // not yet used
var tstExternalTranslated='6';
var tstExternalTranslatedOrgChanged='7';

//Export-/Import Formate für übersetzungsrelevante Texte
var eifDefaultFormat=0; // Format via CONFIG-Tabelle
var eifStandardFormat=1;
var eifKaeserVariante=2;
var eifPureText=3; // export only
var eifPureTextWithLabels=4; // export only

// JobTypes
var jtUnknown=0;
var jtImportPPT=1;
var jtImportWBTL=2; // Import WBTLayouter Projekt
var jtExecuteSQLFile=3
var jtImportProf=4; // IDEAProf Kurs 
var jtImportProject=5; // Import von Projekten, die mit jtExportProject exportiert wurden
var jtExportProject=6; // bearbeitbare Projekte exportieren

// JobStati
var jstUnknown=0;
var jstInitialized=1;
var jstStarted=2;
var jstRunning=3;
var jstCancelled=4;
var jstFinished=5;

//ArchiveTypes
var atUnknown=0;
var atProjectConfig=1;
var atProjectVars=2;
var atProjectMD=3;
var atProjectMDLang=4;
var atPageMD=5;
var atPageMDLang=6;
var atProjectTree=7;
var atPage=8;
var atPageLang=9;
var atGlossary=10;
var atGlossaryLang=11;

// Versionierungs-Stati
var vsAutoSaved=0;
var vsSavedByRelease=1;
var vsFinallySaved=2;

// Action-Parameter
var apEnabled=0
var apVisible=1
var apImage=2
var apImageDis=3
var apCaption=4;
var apParam1=5
var apParam2=6

// Live-TranslationStatus
ltsNew=1;
ltsLast=0;
ltsNone=2;

// ExtendedProjectInfoType Konstanten (epit)
var epitPages=0x001;
var epitAssistantsNotUsed=0x002;
var epitAssistantsNotFound=0x004;
var epitMediaNotUsed=0x008;
var epitMediaNotFound=0x010;
var epitTemplatesNotUsed=0x020;
var epitReferenceNotFound=0x040;
var epitTeam=0x080;
var epitLanguages=0x100;


// Broadcast Message Type Konstanten (bmt)
var bmtNoMessagePending=0;
var bmtInfoText=1;
var bmtServerWillShutdown=2;