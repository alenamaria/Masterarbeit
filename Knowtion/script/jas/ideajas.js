/************************************************************************
/************************************************************************
 Copyright:
 (c) 2016 LINK & LINK Software GmbH & Co KG
 ************************************************************************/


function jaUpdateUser(userName, userMail, userType, userActive, newName){
// modifiziert ein oder mehrere Felder im Datensatz des angegebenen Users
// userName: aktueller Name des Users
// userMail: Mailadresse des Users
// userType: utGuest, utStandard (=default), utSystem
// userActive:  (de)activates the user account (default=1)
// newName:  optional neuer Username
// returns true or false
  var userData,userID;
  userID=IUser._Name2ID(userName);
  userData="ID=" + scDQ + userID + scDQ;
  // email
  if(userMail!="") 
    userData=userData + ",EMail=" + scDQ + userMail + scDQ;
  // usertype
  if((userType="")&&(userType!=utGuest)&&(userType!=utSystem))
    userType=utStandard;
  if(userType!="")
    userData=userData + ",Usertype=" + scDQ + userType + scDQ;
  // Active
  if((userActive!="")&&(userActive!="0"))
    userActive="1";
  if((userActive=="1")||(userActive=="0"))
    userData=sUserData + ",Active=" + scDQ + userActive + scDQ;
  // Neuer Benutzername
  if((newName!="")&&(newName!=userName))
    userData=userData + ",Name=" + scDQ + newName + scDQ; 
  var sResult=sfUpdateUser(userData, "");
  return sResult;
}

function jaSetPassword(user, oldPwd, newPwd){
// Das Passwort eines Users setzen/ändern
// user: Username (leer = CurrentUser = default)
// oldPwd: old Password
// newPwd: new Password
// returns true or false
  if(user=="")
    user=IUser._CurrentUserName(); 
  var sResult=sfSetPassword(user, oldPwd, newPwd);
  return sResult;
}

function jaSetMyPassword(oldPwd, newPwd){
// Das Passwort eines Users setzen/ändern
// user: Username (leer = CurrentUser = default)
// oldPwd: old Password
// newPwd: new Password
// returns true or false
  var sResult=sfSetMyPassword(oldPwd, newPwd);
  return sResult;
}

