/************************************************************************
/************************************************************************
 Copyright:
 (c) 2016 LINK & LINK Software GmbH & Co KG
 ************************************************************************/

var dmMove=0;
var dmCopy=1;

function ExtNode(id, pid, name, info, rel, icon, iconOpen, open){
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.rel = rel;
	this.info = info;
	this.icon = icon;
	this.iconOpen = iconOpen;
	this._io = open || false; // isOpen
	this._is = false; // isSelected
	this._ls = false; // isLastSibling
	this._hc = false; // hasChildren
	this._ai = 0; // afterIt
	this._p; // parent
	this.childs = 0;
	this.depth = 0;
	this.type = "";
}


function _moveDrag(ev,data){
 //console.log(jQuery(element));
  var res;
	//WriteToConsole("_stopDrag");
  res=false;
	var tree= data.data.origin.intideaobj;
  if ((isVarUndefined(tree)==false)&&(tree.OnMoveDrag)){
		var res=AnyToBool(tree.OnMoveDrag(ev,data));
  }
  if (res==true)
	  data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
  else
    data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
  return res;

  
  
	WriteToConsole("_moveDrag");
	var t = jQuery(data.event.target);
//	if(!t.closest('.jstree').length) {
	if(!t.closest('.jstree').length) {
//		if(t.closest('PageEditor_KContainer2').length) {
		if((t.closest('.IdeaComponent').length)&&(t.closest(".IdeaComponent")[0].id=="PageEditor_KContainer2")){ 
		//if(t.closest('.right-pane').length) {
			data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
      return true;
		}else{
			data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
      return false;
		}
	}
	if ((isVarUndefined(tree)==false)&&(tree.OnMoveDrag)){
		var res=tree.OnMoveDrag(ev,data);
		return res;
		//return AnyToInt(res)==1?true:false;
	}
	return false; 
}

function _stopDrag(ev,data){
 //WriteToConsole("_stopDrag");
 var tree= data.data.origin.intideaobj;
 if ((isVarUndefined(tree)==false)&&(tree.OnStopDrag)){
    var res=tree.OnStopDrag(ev,data);
    return res;
		//return AnyToInt(res)==1?true:false;
	}
	return false; 
}

function _startDrag(ev,data){
  //WriteToConsole("_startDrag");
  var tree= data.data.origin.intideaobj;
 	var res=false;
	//node=tree.intideaobj.getAbsIndexOfNode(node);
	if (isVarUndefined(tree))
    return false;  
  if (tree.OnStartDrag) {
    var tmp=tree.OnStartDrag(ev,data);
    return true;
		//return AnyToInt(temp)==1?true:false;
	}
	return false;
}

_treeonchapteropentoggle = function(node){
  var tree = jQuery.jstree.reference(node);
  if(typeof tree.get_buffer().node[0] != 'undefined' ){
    var buffer = tree.get_buffer().node[0];
    var allowCopy = tree.intideaobj.CheckOpenState(buffer.id, tree);
    tree.intideaobj.OnCancelClipBrd(allowCopy);
  }
}

_treeonbeforemove = function(node, ref_node, type, tree,desttree){
  var res=false;  
   /* switch (type) {   
      case "last":
          type=4;
          break;
      case "first":
          type=3;
          break;
        case "before":
            type=2;
            break;
        case "after":
            type=1;
            break;
        case "inside":
            type=0;
            break;
    }*/
    var desttree_t="";
  var copy=0;
    if(desttree.intideaobj!=tree.intideaobj){
      desttree_t=desttree.intideaobj;
    node=desttree.intideaobj.getAbsIndexOfNode(node);
  }
  else{
    node=tree.intideaobj.getAbsIndexOfNode(node);
  }
  ref_node=tree.intideaobj.getAbsIndexOfNode(ref_node);
    
  if (tree.intideaobj.OnBeforeMove) {
     var temp=tree.intideaobj.OnBeforeMove(node, ref_node, type,copy,desttree_t);
     return AnyToInt(temp)==1?true:false;
  }
  return res;
}


_treeonmoved = function(e,data){

  var tree = data.instance;
  // die vorherige Implentierung ohne SetTimeOut knallt in jquery.jstree.js, da this.element = null  
  setTimeout(function() {tree.open_node(jQuery('#' + data.parent));},10);
  //tree.open_node(jQuery('#' + data.parent));
  //var node = tree.intideaobj.moveindex;  
  var node = jQuery('#' + data.node.id);
  node = tree.intideaobj.getAbsIndexOfNode(node);
  tree.intideaobj.moveindex = -1;
  tree.intideaobj.movenode = '';
  var copy = dmMove;
  if(typeof data.original != 'undefined'){
    copy = dmCopy;
  }
  var ref_node = '';
  var type = 1;
  
  if(data.position == 0 && typeof jQuery('#' + data.parent).children()[2] == 'undefined'){
    type = 0;
    ref_node = jQuery('#' + data.parent);
  }
  if(data.position == 0 && typeof jQuery('#' + data.parent).children()[2] != 'undefined'){
    type = 2;
    //ref_node = jQuery('#' + data.parent);
    if(jQuery('#' + data.parent).children()[2].children.length == 1){
      type = 0;
      ref_node = jQuery(jQuery('#' + data.parent));
    } else {
      ref_node = jQuery('#' + data.parent).children()[2].children[1];
    }

    
  }
  if(data.position > 0){
    ref_node = jQuery('#' + data.parent).children()[2].children[data.position-1];
  }
  ref_node = tree.intideaobj.getAbsIndexOfNode(jQuery(ref_node));
  
  var ot = "";
  if(data.old_instance.intideaobj!= tree.intideaobj){
    ot = data.old_instance.intideaobj;
  }
  if (tree.intideaobj.OnMoved) {
    //in "ot" ist der alte Baum hinterlegt, wird aber in Seitenscript ignoriert
    tree.intideaobj.OnMoved(node, ref_node, type, copy,ot);
  }
}
_treeonbeforedelete = function(node,tree){
	var res=false;
	node=tree.intideaobj.getAbsIndexOfNode(node);
	if (tree.intideaobj.OnBeforeDelete ) {
		var temp=(tree.intideaobj.OnBeforeDelete(node)==1?true:false);
		return AnyToInt(temp);
	}
	return res;
}

_treeonbeforerename = function(node, tree){
	var res=false;
	node=tree.intideaobj.getAbsIndexOfNode(node);
	if (tree.intideaobj.OnBeforeRename) {
		var temp=tree.intideaobj.OnBeforeRename(node);
		return AnyToInt(temp)==1?true:false;
	}
	return res;
}

_treeonafterrename = function(node, tree,name){
	var res=false;
	node=tree.intideaobj.getAbsIndexOfNode(node);
	if (tree.intideaobj.OnAfterRename) {
		var temp=tree.intideaobj.OnAfterRename(node,name);
		return AnyToInt(temp)==1?true:false;
	}
	return res;
}

_treeondelete = function(e,data){
	var res=true;
	var tree=data.instance;
	var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));
	if (tree.intideaobj.OnDeleted) {
		tree.intideaobj.OnDeleted(node);
	}
}

_treeonrename = function(e,data){
	var res=true;
	var tree=data.instance;
	var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));
	var name=data.text;
	//tree.intideaobj.TEJSTSetXMLAttribute(node,"Caption",name);
	if (tree.intideaobj.OnRename) {
		tree.intideaobj.OnRename(node,name);
	}
}

_treeonselect=function(e,data){
	var res=true;
	var tree=data.instance;
	var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));
	if (tree.intideaobj.OnClick) {
		tree.intideaobj.OnClick(node);
	}
	if (tree.intideaobj.OnSelect) {
		tree.intideaobj.OnSelect(node);
	}
	return res;
}

_treeonopennode=function(e,data){
	var res=true;
	var tree=jQuery.jstree.reference(this);
	if(!tree.intideaobj)
		return;
	var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));  
	if (tree.intideaobj.OnExpand) {
		tree.intideaobj.OnExpand(node);
	}

	_treeonchapteropentoggle('#' + data.node.id);
	return res;
}

_treeonclosenode=function(e,data){
	var res=true;
	var tree=jQuery.jstree.reference(this);
	if(!tree.intideaobj)
		return;
	var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));
	if (tree.intideaobj.OnCollapse) {
		tree.intideaobj.OnCollapse(node);
	}
	_treeonchapteropentoggle('#' + data.node.id);
	return res;
}

_treeonredraw = function(e,data){ 
	var res=true;
	var tree=data.instance;
	//var node=tree.intideaobj.getAbsIndexOfNode(jQuery('#' + data.node.id));
	if (tree.intideaobj.OnRedraw) {
		tree.intideaobj.OnRedraw();
	}
	return res;
	//tree.intideaobj._UpdateIcons();
}

_treeoncopy = function(node, ref_node, type, tree){
	var res=true;
	var tree=data.instance;  //TODO: Woher kommt data???
	/*  switch (type) {   
	case "last":
        type=4;
        break;
    case "first":
        type=3;
        break;
      case "before":
            type=2;
          break;
      case "after":
            type=1;
          break;
      case "inside":
            type=0;
          break;
  }*/
	node=tree.intideaobj.getAbsIndexOfNode(node);
	ref_node=tree.intideaobj.getAbsIndexOfNode(ref_node);
	if (tree.intideaobj.OnCopied) {
		tree.intideaobj.OnCopied(node, ref_node, type);
	}
}

_treeonready = function(){
	var tree = jQuery.jstree.reference(this);
	var tobj = jQuery.extend(true, {}, tree.settings);
	tree.settings = tobj;
	if(tree.intideaobj.JSTDragable() == 0){
		tree.settings.dnd.is_draggable = false;
		/*if(typeof tree.settings.dnd !== 'undefined'){
			delete tree.settings.dnd;
		}*/
		/*var ind = tree.settings.plugins.indexOf('dnd');
		if(ind > -1){
			tree.settings.plugins.splice(ind, 1);
		}*/
	}
}

/*
$('#tree').jstree({
    'core' : {
        'check_callback' : function (operation, node, node_parent, node_position, more) {
            // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
            // in case of 'rename_node' node_position is filled with the new node name
            return operation === 'rename_node' ? true : false;
        }
    }
});*/

var idea_treeconfig = {
	core : {
		'animation' : 50,
		'check_callback' : function(operation, node, node_parent, node_position, more){
			var res = true;
			var jqNode = jQuery('#' + node.id);
			if(operation === 'move_node' || operation == 'copy_node'){
				if(this.intideaobj.moveindex == -1 || typeof this.intideaobj.moveindex == 'undefined'){
					this.intideaobj.moveindex = this.intideaobj.getAbsIndexOfNode(jqNode);
					this.intideaobj.movenode = jqNode;
				}

				var type = 1;
				var ref_node = '';
				if((node_position == 0)&& ((isVarUndefined(node_parent.li_attr)) ||((node_parent.li_attr.rel!="0")&&(node_parent.li_attr.rel!="1")))){
					return false;
				}
				if(node_position == 0 && typeof jQuery('#' + node_parent.id).children()[2] == 'undefined'){
					type = 0;
					ref_node = jQuery('#' + node_parent.id);
				}
				if(node_position == 0 && typeof jQuery('#' + node_parent.id).children()[2] != 'undefined'){
					type = 2;
					ref_node = jQuery('#' + node_parent.id).children()[2].children[0];
				}
				if(node_position > 0){
					ref_node = jQuery('#' + node_parent.id).children()[2].children[node_position-1];
				}
				//ref_node = this.intideaobj.getAbsIndexOfNode(jQuery(ref_node));
				res = _treeonbeforemove(this.intideaobj.movenode,ref_node,type,this,jQuery.jstree.reference(node.id));
				var rval = res && checkinternal_move(this.intideaobj);
				return rval;
			} else if(operation == 'rename_node') {
				res = _treeonafterrename(node, this, node_position);
			} else if(operation == 'delete_node'){
				res = _treeonbeforedelete(node, this);
			} else {
				if(!res){
					e.stopImmediatePropagation();  //TODO: Woher kommt e?
					return false;
				}
				return true;
			}
		},
		themes : {
			name: 'default',
			url: false
		},
		'multiple' : false
	},
	search : {
		'case_sensitive' : false
	},
	"plugins" : ["dnd", "types", "search"],
	"dnd" : {
		'copy': true
	},
	"types" : {
		"types" : {
			"TIdeaPage":{
				"valid_children" : ["none"],
				"max_children" : 0,
				"max_depth" :0
			},
		"TStdOrganization":{
			"valid_children" : [cTIdeaPage,cTStdOrganization]
			}
		}
	}
}


function checkinternal_move(t){
	if(parseInt(t.JSTReadOnly())==1)
		return false;
	else
		return true;
}

function onbeforehandler(e,data){
	var tree=data.instance;
	var opname=data.func;
	if(opname.match(/rename_node|rename|prepare_move|delete_node/g)==null)
		return;
	var node=tree.get_node(e.currentTarget, true);
	//OLD: var ref_node=tree.get_node(data.args[1], true);  
	var ref_node=tree.get_node(data.node, true);  
	var pos=data.position;
	var res=true;
	if(opname=="rename"){
		res=_treeonbeforerename(node,tree);
	}
	if(opname=="prepare_move"){
		res=_treeonbeforemove(node,ref_node,pos,tree,jQuery.jstree.reference(node));
	}
	if(opname=="rename_node"){
		res=_treeonafterrename(node,tree,data.text);
	}
  if(opname=="delete_node" && !tree.intideaobj.internal_clear){
		res=_treeonbeforedelete(node,tree);
	}
	if(!res){
		e.stopImmediatePropagation();
		return false;
	}
}

function ExtJSTreeView(guiowner){
	if (arguments.length <= 0) 
		return;
	TStdVisibleComponent.call(this, guiowner);
	this.obj.style.overflow = "auto";
	this.inttreename ="#"+this.obj.id + "int";
	this.root = new ExtNode(-1, -2);
	this.obj.style.MozBoxSizing = "content-box";
	this.obj.style.boxSizing = "content-box";
	this.obj.style.msBoxSizing = "content-box";
	this.internal_clear=false;
}

ExtJSTreeView.prototype = new TStdVisibleComponent();
ExtJSTreeView.prototype.constructor = ExtJSTreeView;

ExtJSTreeView.prototype.attr_AutoFullExpand = 0;
ExtJSTreeView.prototype.attr_AutoExpand = 1;
ExtJSTreeView.prototype.attr_Borderstyle = 1;
ExtJSTreeView.prototype.attr_Filename = "";
ExtJSTreeView.prototype.attr_XMLFilename = "";
ExtJSTreeView.prototype.attr_XMLFileName = "";
ExtJSTreeView.prototype.attr_GlyphNormal = "";
ExtJSTreeView.prototype.attr_GlyphExpanded = "";
ExtJSTreeView.prototype.attr_GlyphCollapsed = "";
ExtJSTreeView.prototype.attr_ShowLines = 0;
ExtJSTreeView.prototype.attr_Index = 0;
ExtJSTreeView.prototype.attr_IconHorAlignment = 0;
ExtJSTreeView.prototype.attr_AutoLineBreak = 0;
ExtJSTreeView.prototype.attr_Picture = "";
ExtJSTreeView.prototype.attr_NumGlyphs = 0;
ExtJSTreeView.prototype.attr_PageCount = 0;
ExtJSTreeView.prototype.attr_ImgByCSS = 0;
ExtJSTreeView.prototype.attr_JSTDragable=1;
ExtJSTreeView.prototype.attr_JSTExtDragable=0;
ExtJSTreeView.prototype.attr_JSTReadOnly=0;
ExtJSTreeView.prototype.attr_JSTCaptionAsName=1; // PW 11.10.11
ExtJSTreeView.prototype.root = null;
ExtJSTreeView.prototype.isPageReady = false;
ExtJSTreeView.prototype.tree = null;
ExtJSTreeView.prototype.isTreeInit = false;
ExtJSTreeView.prototype.internal_clear = false;
ExtJSTreeView.prototype.internal_xml = null;
ExtJSTreeView.prototype.rootElement = "";
ExtJSTreeView.prototype.endElement = "</TProject>";
ExtJSTreeView.prototype.posConst = ["inside","after","before", "first", "last"];


// Broadcast Message Type Konstanten (bmt)
var tpInside=0;
var tpAfter=1;
var tpBefore=2;
var tpFirst=3;
var tpLast=4;

ExtJSTreeView.prototype.JSTDragable = function(value){
	if (arguments.length) {
		this.attr_JSTDragable = AnyToInt(value);
	}else{
		return this.attr_JSTDragable;
	}
}
ExtJSTreeView.prototype.JSTExtDragable = function(value){
	if (arguments.length) {
		
		if ((AnyToBool(value)==true)&&(AnyToBool(this.attr_JSTExtDragable)==false)){
			jQuery(document).on('dnd_move.vakata',_moveDrag);
			jQuery(document).on('dnd_stop.vakata',_stopDrag);
			jQuery(document).on('dnd_start.vakata',_startDrag);
			this.tree.settings.dnd.is_draggable=true;
		}
		if ((AnyToBool(value)==false)&&(AnyToBool(this.attr_JSTExtDragable)==true)){
			jQuery(document).off('dnd_move.vakata',_moveDrag);
			jQuery(document).off('dnd_stop.vakata',_stopDrag);
			jQuery(document).off('dnd_stop.vakata',_startDrag);
			this.tree.settings.dnd.is_draggable=false;
		}
		this.attr_JSTExtDragable = AnyToInt(value);
	}else{
		return this.attr_JSTExtDragable;
	} 
}
ExtJSTreeView.prototype.JSTReadOnly = function(value){
	if (arguments.length) {
		this.attr_JSTReadOnly = AnyToInt(value);
	}else{
		return this.attr_JSTReadOnly;
	}
}
// PW 11.10.11
ExtJSTreeView.prototype.JSTCaptionAsName = function(value){
	if (arguments.length){
		this.attr_JSTCaptionAsName = AnyToInt(value);
	}else{
		return this.attr_JSTCaptionAsName;
	}
}

ExtJSTreeView.prototype.IconHorAlignment = function(value){
	if (arguments.length) {
		this.attr_IconHorAlignment = AnyToInt(value);
	}else{
		return this.attr_IconHorAlignment;
	}
}
ExtJSTreeView.prototype.AutoLineBreak = function(value){
	if (arguments.length) {
		this.attr_AutoLineBreak = AnyToInt(value);
	}else{
		return this.attr_AutoLineBreak;
	}
}
ExtJSTreeView.prototype.AutoFullExpand = function(value){
	if (arguments.length) {
		value = Number(value);
		this.attr_AutoFullExpand = value;
	}else{
		return this.attr_AutoFullExpand;
	}
}
ExtJSTreeView.prototype.AutoExpand = function(value){
	if (arguments.length) {
		value = Number(value);
		this.attr_AutoExpand = value;
	}else{
		return this.attr_AutoFullExpand;
	}
}
ExtJSTreeView.prototype.Borderstyle = function(value){
	if (arguments.length) {
		var value = AnyToInt(value);
		this.attr_Borderstyle = value;
		this.obj.style.borderStyle = (value == 1 ? "groove" : "none");
	}else{
		return this.attr_Borderstyle;
	}
}
ExtJSTreeView.prototype.Filename = function(value){
	if (arguments.length) {
		this.attr_Filename = value;
		/*if (this.isTreeInit) {
			this.content = ReadTextFile(value, true, pages[this.pageName]);
			this.clear();
			this.fillNodes(this.root, this.content);
		}*/
	}else{
		return this.attr_Filename;
	}
}
ExtJSTreeView.prototype.loadFromString = function(value){
	if (arguments.length && this.isTreeInit) {
		this.content = value;
		this.clear();
		this.fillNodes(this.tree.root, this.content);
		//TODO: Gibts Root wirklich?
	}
}
ExtJSTreeView.prototype.XMLFileName = function(value){
	if (arguments.length) {
		this.XMLFilename(value);
	}else{
		return this.XMLFilename();
	}
}                            
ExtJSTreeView.prototype.XMLFilename = function(value){
	if (arguments.length) {
		if (value.length > 0 && value != "") {
		this.attr_XMLFilename = value;
			if (this.isTreeInit) {
				this.content = ReadTextFile(value, true,pages[this.pageName]);
				if (this.content.startsWith("<?xml"))
					this.content = this.content.substring(this.content.lastIndexOf('?>') + 2, this.content.length);
				var vartemp = GetXMLDocFromString(this.content);  
				var content=vartemp.cloneNode(false);
				this.rootElement= (content.xml?content.xml:serializeNode(content)).replace(/\/>/g,">");;
				jQuery(this.inttreename).unbind("move_node.jstree", _treeonmoved);
				jQuery(this.inttreename).unbind("copy_node.jstree", _treeonmoved);
				//jQuery(this.inttreename).unbind("move_ node.jstree", _treeonmoved);
				jQuery(this.inttreename).unbind("rename_node.jstree", _treeonrename);
				jQuery(this.inttreename).unbind("delete_node.jstree", _treeondelete);
				jQuery(this.inttreename).unbind("select_node.jstree", _treeonselect);
				jQuery(this.inttreename).unbind("before.jstree",onbeforehandler);
				jQuery(this.inttreename).unbind("redraw.jstree", _treeonredraw);
				jQuery(this.inttreename).unbind("open_node.jstree", _treeonopennode);
				jQuery(this.inttreename).unbind("close_node.jstree", _treeonclosenode);
				jQuery(this.inttreename).unbind("ready.jstree", _treeonready);
				this.tree.intideaobj=null;
				this.tree.destroy(false);
				this.attr_PageCount=0;
				jQuery(this.inttreename).empty();
				this.internal_xml=vartemp;
				var tempt=$(this.obj.id + "int").appendChild(document.createElement("ul"));
				this.fillNodesfromXML(-1,vartemp, 0, 0,tempt);
				jQuery(this.inttreename).jstree(idea_treeconfig);
				this.tree = jQuery.jstree.reference(this.inttreename);
				this.tree.open_all(); 
				this.tree.intideaobj=this;
				jQuery(this.inttreename).bind("move_node.jstree", _treeonmoved);
				jQuery(this.inttreename).bind("copy_node.jstree", _treeonmoved);
				jQuery(this.inttreename).bind("rename_node.jstree", _treeonrename);
				jQuery(this.inttreename).bind("delete_node.jstree", _treeondelete);
				jQuery(this.inttreename).bind("select_node.jstree", _treeonselect);
				jQuery(this.inttreename).bind("open_node.jstree", _treeonopennode);
				jQuery(this.inttreename).bind("close_node.jstree", _treeonclosenode);
				jQuery(this.inttreename).bind("before.jstree",onbeforehandler);
				jQuery(this.inttreename).bind("redraw.jstree", _treeonredraw);
				jQuery(this.inttreename).bind("ready.jstree", _treeonready);
				this.isTreeInit=true;
			}
		}
	}else{
		return this.attr_XMLFilename;
	}
}

ExtJSTreeView.prototype.GlyphNormal = function(value){
	if (arguments.length) {
		this.attr_GlyphNormal = value;
		if (this.isTreeInit) {
			value = expandmetavar(value, this.pageName);
			this.tree.icon.node = value;
		}
	}else{
		return this.attr_GlyphNormal;
	}
}

ExtJSTreeView.prototype.GlyphExpanded = function(value){
	if (arguments.length) {
		this.attr_Expanded = value;
		if (this.isTreeInit) {
			value = expandmetavar(value, this.pageName);
			this.tree.icon.folderOpen = value;
		}
	}else{
		return this.attr_GlyphExpanded;
	}
}

ExtJSTreeView.prototype.GlyphCollapsed = function(value){
	if (arguments.length) {
		this.attr_Expanded = value;
		if (this.isTreeInit) {
			value = expandmetavar(value, this.pageName);
			this.tree.icon.folder = value;
		}
	}else{
		return this.attr_GlyphCollapsed;
	}
}

ExtJSTreeView.prototype.ShowLines = function(value){
	if (arguments.length) {
		value = Number(value);
		this.attr_ShowLines = value;
	}else{
		return this.attr_ShowLines;
	}
}

ExtJSTreeView.prototype.int_onMouseDown = function(e,node){
    var params = convertMouseParams(e);
  if (extractEventTarget(e) != this.obj) {
        params = getRelCoordOnParent(extractEventTarget(e), this.obj, params);
  }
  if(this.OnItemDown){
    this.OnItemDown(this.getAbsIndexOfNode(node));
  }
}

ExtJSTreeView.prototype.TreeViewSetAttribute = function(index,attrname,value){
    var xpath="//*";
    var ret=this.selectXMLNodes(xpath);
    if(ret!==null)
    {
      ret[index].setAttribute(attrname,value);
    }
}
ExtJSTreeView.prototype.TreeViewGetAttribute = function(index,attrname){
    var xpath="//*";
    var ret=this.selectXMLNodes(xpath);
    if(ret!==null)
    {
      return ret[index].getAttribute(attrname);
    }
    return "";
}
ExtJSTreeView.prototype.TreeViewFullExpand = function(value){
    this.tree.open_all();
}
ExtJSTreeView.prototype.TreeViewFullCollapse = function(value){
    this.tree.close_all();
}
ExtJSTreeView.prototype.TreeViewItemCount = function(){
  return AnyToInt(jQuery(this.inttreename).find('li').size());
}
ExtJSTreeView.prototype.LoadTreeView = function(value){
    this.Filename(value);
}
ExtJSTreeView.prototype.LoadXMLTreeView = function(value){
    this.XMLFilename(value);
}
ExtJSTreeView.prototype.SetXMLTreeView = function(value){
	this.internal_xml=null;
	this.content = value;
	if (this.content.startsWith("<?xml")) 
		this.content = this.content.substring(this.content.lastIndexOf('?>') + 2, this.content.length);
	var vartemp = GetXMLDocFromString(this.content);
	var content=vartemp.cloneNode(false);
	this.rootElement= (content.xml?content.xml:serializeNode(content)).replace(/\/>/g,">");
	jQuery(this.inttreename).unbind("move_node.jstree", _treeonmoved);
	jQuery(this.inttreename).unbind("copy_node.jstree", _treeonmoved);
	jQuery(this.inttreename).unbind("rename_node.jstree", _treeonrename);
	jQuery(this.inttreename).unbind("delete_node.jstree", _treeondelete);
	jQuery(this.inttreename).unbind("select_node.jstree", _treeonselect);
	jQuery(this.inttreename).unbind("open_node.jstree", _treeonopennode);
	jQuery(this.inttreename).unbind("close_node.jstree", _treeonclosenode);
	jQuery(this.inttreename).unbind("before.jstree",onbeforehandler);
	jQuery(this.inttreename).unbind("redraw.jstree",_treeonredraw);
	jQuery(this.inttreename).unbind("ready.jstree", _treeonready);
	this.tree.intideaobj=null;
	this.tree.destroy();
	jQuery(this.inttreename).empty();
	this.attr_PageCount=0;
	this.internal_xml=vartemp;
	var tempt=$(this.obj.id + "int").appendChild(document.createElement("ul"));
	this.fillNodesfromXML(-1,vartemp, 0, 0,tempt);
  
	//eventuell idea_treeconfig so Ändern, dass DND always_copy true ist?
	jQuery(this.inttreename).jstree(idea_treeconfig);
	this.tree = jQuery.jstree.reference(this.inttreename);
	this.tree.open_all(); 
	this.tree.intideaobj=this;
	jQuery(this.inttreename).bind("move_node.jstree", _treeonmoved);
	jQuery(this.inttreename).bind("copy_node.jstree", _treeonmoved);
	jQuery(this.inttreename).bind("rename_node.jstree", _treeonrename);
	jQuery(this.inttreename).bind("delete_node.jstree", _treeondelete);
	jQuery(this.inttreename).bind("select_node.jstree", _treeonselect);
	jQuery(this.inttreename).bind("before.jstree",onbeforehandler);
	jQuery(this.inttreename).bind("redraw.jstree",_treeonredraw);
	jQuery(this.inttreename).bind("open_node.jstree", _treeonopennode);
	jQuery(this.inttreename).bind("close_node.jstree", _treeonclosenode);
	jQuery(this.inttreename).bind("ready.jstree", _treeonready);
	this.isTreeInit=true;
}

ExtJSTreeView.prototype.CheckOpenState = function(nodeid, tree){
  var parentnode = tree.get_parent(nodeid);
  if(tree.is_open(parentnode)){
    if(parentnode != '#'){
      return tree.intideaobj.CheckOpenState(parentnode, tree);
    } else {
      //am Root angekommen und alles ist offen
      return true;
    }
  } else {
    if(parentnode != '#'){
      return false;
    } else {
      return true;
    }
  }
}

ExtJSTreeView.prototype.GetTreeViewInfo = function(value){
    value = Number(value);
  var temp = jQuery(this.inttreename).find('li');
    if (value < temp.size()) {
        var obj=this.tree.get_node(temp[value], true);
    if(!obj) return "";
    temp=obj.attr("nodeinfo");
    return temp.replace(/regexwa/g,"/>");
    }
}
ExtJSTreeView.prototype.SetTreeViewInfo = function(value, content){
     value = Number(value);
  var temp = jQuery(this.inttreename).find('li');
    if (value < temp.size()) {
        var obj=this.tree.get_node(temp[value], true);
      if(!obj) return;     
     obj.attr("nodeinfo", content.replace(/\/>/g,"regexwa"));
     this.tree._model.data[temp[value].id].li_attr.nodeinfo = content.replace(/\/>/g,"regexwa");
    }
}
ExtJSTreeView.prototype.SetTreeViewText = function(value, content){
    value = Number(value);
    var temp = jQuery(this.inttreename).find('li');
    if (value < temp.size()) {
        this.tree.rename_node(temp[value],content);
    }
}
ExtJSTreeView.prototype.GetTreeViewText = function(value, content){
    value = Number(value);
    var temp = jQuery(this.inttreename).find('li');
    if (value < temp.size()) {
        return  this.tree.get_text(temp[value],content);
    } 
}
ExtJSTreeView.prototype.Index = function(value){
    if (arguments.length) {
        value = AnyToInt(value);
        this.attr_Index = value;
        if (this.isTreeInit) {
            var temp = jQuery(this.inttreename).find('li');
            if (value > -1 && value < temp.size()) {
        this.tree.deselect_all();
                this.tree.select_node(temp[value],true);
            }
        }
    }
    else {
    if(this.isTreeInit)
          return this.getAbsIndexOfNode(jQuery('#' + this.tree.get_selected()[0]));
    else
      return this.attr_Index;
    }
}
ExtJSTreeView.prototype.Picture = function(value){
    if (!arguments.length) {
        return this.attr_Picture;
    }
    this.attr_Picture = value;
    if (value != "") {
        value = (this.attr_NumGlyphs == 0 ? value : this["attr_Picture0"]);
        if (value == null) {
            value = this.attr_Picture;
            value = expandmetavar(value, this.pageName);
        }
        else 
            value = expandmetavar(value, this.pageName);
    }
}
ExtJSTreeView.prototype.NumGlyphs = function(value){
    if (!arguments.length) {
        return this.attr_NumGlyphs;
    }
    value = AnyToInt(value);
    this.attr_NumGlyphs = value;
    this.Picture(this.Picture());
}
ExtJSTreeView.prototype.ImgByCSS = function(value){
	if (!arguments.length) {
		return this.attr_ImgByCSS;
	}
	this.attr_ImgByCSS = value;
}
ExtJSTreeView.prototype.PageCount = function(value){
	if (!arguments.length) {
		return this.attr_PageCount;
	}
	this.attr_PageCount = value;
}

ExtJSTreeView.prototype.TreeViewChildCount = function(index){
    var ret = 0;
    index = AnyToInt(index);
    var temp = jQuery(this.inttreename).find('li');
    if (index < temp.size()) 
        ret = jQuery(temp[index]).find('li').size();
    return ret;
    
}
ExtJSTreeView.prototype.TreeViewGetChildAbsoluteIndex = function(index, childNr){
    index = AnyToInt(index);
    childNr = AnyToInt(childNr);
    var ret = childNr;
    var temp = jQuery(this.inttreename).find('li');
    if (index < temp.size() && childNr <= jQuery(temp[index]).children().size()) 
        ret = index + childNr;
    return ret;
}
ExtJSTreeView.prototype.TreeViewGetNodeLevel = function(index){
    var ret = 0;
    var temp = jQuery(this.inttreename).find('li');
    if (index < temp.size()) {
        var node = this.tree.get_node(temp[index], true);
        var i = 0;
        while ((node = this.tree.get_parent(node)) != false) {
            i++;
        }
        ret = i;
    }
    return ret;
}
ExtJSTreeView.prototype.TreeViewHasNodeChildren = function(index){
    var ret = 0;
    index = AnyToInt(index);
    var temp = jQuery(this.inttreename).find('li');
    if (index < temp.size()) 
        ret = jQuery(temp[index]).find('li').size();
    return ret == 0 ? 0 : 1;
}
ExtJSTreeView.prototype.TreeViewIsNodeExpanded = function(index){
    var ret = 0;
    var temp = jQuery(this.inttreename).find('li');
    if (index < temp.size()) 
        ret = jQuery(temp[index]).is(".jstree-open") ? 1 : 0;
    return ret;
}
ExtJSTreeView.prototype.TreeViewSetImageIndex = function(index, imageIndex){
	index = AnyToInt(index);
	imageIndex = AnyToInt(imageIndex);
	var temp = jQuery(this.inttreename).find('li');
	// wenn die Tree-Icons via CSS gesetzt werden...
	if (AnyToBool(this.attr_ImgByCSS)==true){
		temp[index].setAttribute('rel',imageIndex);
	}else if (index < temp.size()){
		if ((this.attr_Picture != "") && (index < temp.size()) && (imageIndex < this.attr_NumGlyphs)) {
			var value = expandmetavar(this["attr_Picture" + imageIndex], this.pageName);
			var s = {}; 
			if(typeof jQuery(temp[index]).find('a:first').find('i:first')[0] != 'undefined'){
				s=jQuery(temp[index]).find('a:first').find('i:first')[0].style;
			}else{
				s=jQuery(temp[index]).find('span:first').find('i:first')[0].style;
			}
			// damit das Icon nicht durch CSS überschrieben wird müssen wir das rel-Attribut setzen
      var sRel=temp[index].getAttribute('rel','');
      if (sRel!=""){
        var sNodeInfo=temp[index].getAttribute('nodeInfo');
        sNodeInfo=StrReplace(sNodeInfo,'rel='+scDQ+sRel+scDQ, 'rel='+scDQ+AnyToStr(imageIndex)+scDQ);
        temp[index].setAttribute('nodeInfo',sNodeInfo);
      }      
			temp[index].setAttribute('rel','custom');
      //temp[index].setAttribute('rel',AnyToStr(imageIndex));
			s.backgroundImage = "url(" + value + ")";
			//s.backgroundPosition=0+px;
			s.backgroundPosition='50%';
			this.tree._model.data[temp[index].id].icon = value;
		}
	}
}

ExtJSTreeView.prototype.TreeViewSetImageFile = function(index, sImageFile){
	index = AnyToInt(index);
	//imageIndex = AnyToInt(imageIndex);
	var temp = jQuery(this.inttreename).find('li');
  if (index < temp.size()){
	  var value = expandmetavar(sImageFile, this.pageName);
		var s = {}; 
		if(typeof jQuery(temp[index]).find('a:first').find('i:first')[0] != 'undefined'){
			s=jQuery(temp[index]).find('a:first').find('i:first')[0].style;
		}else{
			s=jQuery(temp[index]).find('span:first').find('i:first')[0].style;
		}
		// damit das Icon nicht durch CSS überschrieben wird müssen wir das rel-Attribut setzen
		temp[index].setAttribute('rel','custom');
		s.backgroundImage = "url(" + value + ")";
		//s.backgroundPosition=0+px;
		s.backgroundPosition='50%';
		this.tree._model.data[temp[index].id].icon = value;
	}
}
ExtJSTreeView.prototype.getParentIndex = function(index){
	var temp = jQuery(this.inttreename).find('li');
	var res=-1;
	if (index < temp.size()) {
		var node = this.tree.get_node(temp[index], true);
		var pNode=this.tree.get_parent(node);
		// Wenn kein Parent, dann liefert get_parent() # 
		if (pNode!="#")
			res= this.getAbsIndexOfNode(jQuery('#' + pNode));
	}
	return res;
} 

ExtJSTreeView.prototype.onpgready = function(){    
  jQuery(this.inttreename).jstree(idea_treeconfig);   
  jQuery(this.inttreename).bind("move_node.jstree",  _treeonmoved);
  jQuery(this.inttreename).bind("copy_node.jstree",  _treeonmoved);
  jQuery(this.inttreename).bind("rename_node.jstree", _treeonrename);
  jQuery(this.inttreename).bind("delete_node.jstree", _treeondelete);
  jQuery(this.inttreename).bind("select_node.jstree", _treeonselect);
  jQuery(this.inttreename).bind("redraw.jstree", _treeonredraw);
  jQuery(this.inttreename).bind("before.jstree",onbeforehandler);
  jQuery(this.inttreename).bind("open_node.jstree", _treeonopennode);
  jQuery(this.inttreename).bind("close_node.jstree", _treeonclosenode);
  jQuery(this.inttreename).bind("ready.jstree", _treeonready);
  this.tree = jQuery.jstree.reference(this.inttreename);
  this.tree.intideaobj=this;
  this.isTreeInit=true;
  this.Filename(this.Filename());
  this.XMLFilename(this.XMLFilename());
  this.Index(this.attr_Index);
  TStdVisibleComponent.prototype.onpgready.call(this);
}

ExtJSTreeView.prototype.Visible = function(value){
        if (!arguments.length) {
      return this.attr_Visible;
    }
        TStdVisibleComponent.prototype.Visible.call(this,value);  
}

ExtJSTreeView.prototype.getAbsIndexOfNode = function(node){

    if(node==null)
     return -1;
    var ret = jQuery(this.inttreename).find('li').index(node[0]);

    return ret;
}
ExtJSTreeView.prototype.fillNodes = function(parentNode, content){
    var stack = [];
    var lines = content.split("\n");
    var i = 0;
    var currNode = null;
    var depth = 0;
    var _l = lines.length;
    for (i; i < _l; i++) {
        lines[i] = replace(lines[i], "\r", "");
        if (lines[i] == "") 
            continue;
        currNode = this.readNodeInfo(lines[i], i);
        currNode.id = i;
        currNode.pid = parentNode.id;
        currNode.depth = depth;
        parentNode.childs++;
        this.addNodeInternal(currNode, parentNode.id);
        if (i + 1 < lines.length) {
            // Count the tree depth of the next node element.
            depth = 0;
            while (lines[i + 1].charAt(depth) == "\t") {
                depth++; // Tab symbol define level of depth of the node.
            }
            if (depth > stack.length) {
                // Current node will be parent of next read node
                stack.push(parentNode); // Put parentNode to the stack
                parentNode = currNode; // Set currentNode as next parent node.
            }
            else {
                if (depth < stack.length) {
                    // The depth of next node is less then current's node depth.
                    // It means the parent of next node to read is in the stack.
                    // Note it not necessarily have to be on top of the stack
                    // but could be deepper.
                    do {
                        parentNode = stack.pop();
                    }
                    while (depth < stack.length);
                }
            }
        }
    }
}
ExtJSTreeView.prototype.readNodeInfo = function(line, index){
    line = replace(line, "\t", "");
    var content = [];
    var offset = 0, idex = 0;
    while (offset < line.length) {
        if (line.charAt(offset) == '"') {
            var end = line.indexOf('"', offset + 1);
            if (end >= offset) {
            
                content[idex] = (line.substring(offset + 1, end));
                offset = end + 2;
            }
            else {
                end = line.indexOf(',', offset + 1);
                if (end >= 0) {
                    content[idex] = (line.substring(offset, end));
                    offset = end + 1;
                }
                else 
                    return
            }
        }
        else {
            var end = line.indexOf(',', offset);
            if (end >= 0) {
                content[idex] = (line.substring(offset, end));
                offset = end + 1;
            }
            else {
                content[idex] = (line.substring(offset));
                offset = line.length;
            }
        }
        idex++;
    }
    return new ExtNode(index, 0, replace(content[0], "\"", ""), (content[1] ? content[1] : " "));
}
ExtJSTreeView.prototype.fillNodesfromXML = function(parentNode, content, lastindex, depth, lastDOMObj){
	var currNode, node, attr, rel, name, line, tmpnd, tempobj, tempul = null;
	var _l = content.childNodes.length;
	for (var i = 0; i < _l; i++) {
		node = content.childNodes[i];
		// PW 11.10.11 start...
		attr = null;
		if (this.attr_JSTCaptionAsName=="1") {
			attr = node.attributes.getNamedItem("Caption");
			if (attr == null)
				attr = node.attributes.getNamedItem("caption");
		}
	// PW 11.10.11 ...end
	if (attr == null) 
		attr = node.attributes.getNamedItem("Name");
	if (attr == null) 
		attr = node.attributes.getNamedItem("name");
	name = attr.value;

	if (AnyToBool(this.attr_ImgByCSS)==true){
		rel="0"; 
		attr = node.attributes.getNamedItem("rel");
		if ((attr!=null)&&(attr!="undefined")){
			rel=attr.value;
		}
	}
	attr = node.attributes;
	line = "";
	tmpnd=node.cloneNode(false);
	if (tmpnd.xml) {
		line = tmpnd.xml
	}else{
		line = serializeNode(tmpnd);
	}
	//currNode = new ExtNode(lastindex, 0, name, line);
	currNode = new ExtNode(lastindex, 0, name, line,rel);
	currNode.id = lastindex;
	currNode.pid = parentNode==-1?-1:parentNode.id;
	currNode.depth = depth; 
  
	if(node.nodeName==cTIdeaPage){
		currNode.type=cTIdeaPage;
    this.attr_PageCount++;
	}else{
		if(node.nodeName==cTStdOrganization){
				currNode.type=cTStdOrganization; 
		}
	}
	tempobj=this.addHTMLNodeInternal(currNode,lastDOMObj);
	lastindex++;
	if (node.hasChildNodes()) {
		tempul=document.createElement("ul");
		tempobj.appendChild(tempul);
		lastindex = this.fillNodesfromXML(currNode, node, lastindex, depth + 1,tempul);
		}
	}
	return lastindex;
}
ExtJSTreeView.prototype.addHTMLNodeInternal = function(node,parent){
	var rel;
	if(node.info===null && node.type!==null)
		node.info="<"+node.type+"/>";
	node.info=node.info.replace(/\/>/g,"regexwa");
	var temp=document.createElement("li");
  rel=null;
  // falls das Image Über CSS via rel-Attribut gesetzt wird
  if (AnyToBool(this.attr_ImgByCSS)==true){
    rel=node.rel;
    //rel=temp.getAttribute("rel");
  }
	if ((rel==null)||(rel=="undefined")){
		var x=document.createAttribute("rel");
		if(node.type == cTStdOrganization) {
			x.value = "1";
			//temp.setAttribute("rel","1");
		}else{ 
			x.value = "2";
		}
		temp.attributes.setNamedItem(x);
	}else{
		//WriteToConsole(".addHTMLNodeInternal() - node.name="+node.name + ", nodeinfo=" + node.info);
		temp.setAttribute("rel",node.rel);
	}
	temp.setAttribute("nodeinfo",node.info);
	var tempa=document.createElement("a");
	var temptext=document.createTextNode(node.name);
	tempa.appendChild(temptext);
	temp.appendChild(tempa);
	tempa.href="#";
	parent.appendChild(temp);
	return temp;
}
ExtJSTreeView.prototype.TEJSTaddNode = function(nodename, nodeinfo, parentid, pos, type){
	var node = new ExtNode(1, parentid, nodename, nodeinfo);
	node.type=((typeof type != "undefined" && type!="")?type:null);
	// Seitentzähler aktualisieren
	/* wird ertsmal durch den Client synchronisert 
	if (node.Type!="TStdOrganization")
		this.attr_PageCount++;
	*/  
	return this.addNodeInternal(node, parentid, pos, true);
}
ExtJSTreeView.prototype.addNodeInternal = function(node, parentid, pos, addingxml){
	if(addingxml){
		if((node.info===null || node.info==="") && node.type!==null)
			node.info="<"+node.type+"/>";
	} 
	node.info=node.info.replace(/\/>/g,"regexwa");
	if(typeof pos === "undefined" || pos===""){
		pos=null;
	}else{
		pos=this.posConst[AnyToInt(pos)];
	}
	var ret_pos=-1;
	var temp=new Object();
	temp.li_attr=new Object();
	temp.li_attr.nodeinfo=node.info;
	if(node.type == cTStdOrganization){
		temp.li_attr.rel="0";
	}else{
    // prüfen, ob rel bereits im NodeInfo gesetzt ist
    var iPos1=node.info.indexOf('rel="');
    if (iPos1>=0){
      var iPos2=node.info.indexOf(node.info[iPos1+4],iPos1+5);
      if (iPos2>=0){
        temp.li_attr.rel=node.info.substr(iPos1+5,iPos2-(iPos1+5));
      }else{  
        temp.li_attr.rel="2";
      }  
    }else{
  		temp.li_attr.rel="2";
    }  
	}
	temp.text=node.name;  
	if(parentid!==""){
		parentid = AnyToInt(parentid);
	}else{
		parentid = this.Index();
		var temp2 = jQuery(this.inttreename).find('li');
		pos=(pos===null?"after":pos);
		//ret_pos=this.tree.create(temp2[parentid],pos,temp,false,true);
		ret_pos = this.tree.create_node(jQuery(temp2[parentid]), temp, pos);
		return this.getAbsIndexOfNode(jQuery('#' + ret_pos));
	}  
	pos=(pos===null?"last":pos);
	if (parentid == -1){
		//ret_pos=this.tree.create(-1,pos,temp,false,true);
		ret_pos = this.tree.create_node(-1, temp, pos);
	}else{
		var temp2 = jQuery(this.inttreename).find('li');
		ret_pos = this.tree.create_node(jQuery(temp2[parentid]), temp, pos);
		//ret_pos=this.tree.create(temp2[parentid],pos,temp,false,true);
		}
	this.tree.open_node(jQuery(temp2[parentid]));
	return this.getAbsIndexOfNode(jQuery('#' + ret_pos));
}

ExtJSTreeView.prototype.TEJSTclear = function(node, parentid){
	this.clear();
}

ExtJSTreeView.prototype.clear = function(node, parentid){
	jQuery(this.inttreename).unbind("move_node.jstree", _treeonmoved);
	jQuery(this.inttreename).unbind("copy_node.jstree", _treeonmoved);
	jQuery(this.inttreename).unbind("rename_node.jstree", _treeonrename);
	jQuery(this.inttreename).unbind("delete_node.jstree", _treeondelete);
	jQuery(this.inttreename).unbind("select_node.jstree", _treeonselect);
	jQuery(this.inttreename).unbind("before.jstree",onbeforehandler);
	jQuery(this.inttreename).unbind("redraw.jstree", _treeonredraw);
	jQuery(this.inttreename).unbind("open_node.jstree", _treeonopennode);
	jQuery(this.inttreename).unbind("close_node.jstree", _treeonclosenode);
	jQuery(this.inttreename).unbind("ready.jstree", _treeonready);
	this.tree.intideaobj=null;
	this.tree.destroy();
	jQuery(this.inttreename).empty();
	jQuery(this.inttreename).jstree(idea_treeconfig);
	this.tree = jQuery.jstree.reference(this.inttreename);
	this.tree.intideaobj=this; 
	jQuery(this.inttreename).bind("move_node.jstree", _treeonmoved);
	jQuery(this.inttreename).bind("copy_node.jstree", _treeonmoved);
	jQuery(this.inttreename).bind("rename_node.jstree", _treeonrename);
	jQuery(this.inttreename).bind("delete_node.jstree", _treeondelete);
	jQuery(this.inttreename).bind("select_node.jstree", _treeonselect);
	jQuery(this.inttreename).bind("before.jstree",onbeforehandler);
	jQuery(this.inttreename).bind("redraw.jstree", _treeonredraw);
	jQuery(this.inttreename).bind("open_node.jstree", _treeonopennode);
	jQuery(this.inttreename).bind("close_node.jstree", _treeonclosenode);  
	jQuery(this.inttreename).bind("ready.jstree", _treeonready);
	this.isTreeInit=true;
}

ExtJSTreeView.prototype.TEJSTcutNode = function(nodeid){
    if (nodeid && nodeid != "") {
        nodeid = AnyToInt(nodeid);
        var temp = jQuery(this.inttreename).find('li');
        if (nodeid < temp.size()) 
            this.tree.cut(temp[nodeid]);
    }
    else {
        this.tree.cut();
    }
}
ExtJSTreeView.prototype.TEJSTcopyNode = function(nodeid){
    if (nodeid && nodeid != "") {
        nodeid = AnyToInt(nodeid);
        var temp = jQuery(this.inttreename).find('li');
        if (nodeid < temp.size()) 
            this.tree.copy(temp[nodeid]);
    }
    else {
        this.tree.copy();
    }
}
ExtJSTreeView.prototype.TEJSTpasteNode = function(nodeid, position){
	var ret=null;
	var buffer = this.tree.get_buffer();
	var movednode = buffer.node[0];
	if (typeof nodeid != 'undefined' && nodeid !== "") {
		nodeid = AnyToInt(nodeid);
		var temp = jQuery(this.inttreename).find('li');
		var pnt = temp[nodeid];
		if (nodeid < temp.size()) {
			this.tree.open_node(pnt);
			//neue Version vom Baum benutzt "position" anders.
			if(position == 4){
				position = 'last';
			} else {
				//jQuery('#' + temp[nodeid].id) //Node an sich
				pnt = this.tree.get_node(jQuery('#' + temp[nodeid].id).parent().parent().attr('id'));
				position = jQuery('#' + temp[nodeid].id).parent().children().index(jQuery('#' + temp[nodeid].id)); //Position am Parent
				position = AnyToInt(position) + 1;
			}
			this.tree.paste(pnt, position);
			this.tree.open_node(pnt);
		}
	}else{
		this.tree.paste();
	}
	if(buffer.mode == 'copy_node'){
		var ndselector = '#' + this.tree.get_selected()[0];
		// Seitenzähler aktualsieren 
		/* wird ertsmal durch den Client synchronisert
		if (AnyToInt(temp[this.Index()].getAttribute('rel'))>1){
			this.attr_PageCount++;
		}
		*/
		return this.getAbsIndexOfNode(jQuery('#' + this.tree.get_selected()[0]));
	} else {
		return this.getAbsIndexOfNode(jQuery('#' + movednode.id));
	}
}
ExtJSTreeView.prototype.TEJSTmoveNode = function(nodeid, destid, position){
    if (nodeid && nodeid != "") {
        nodeid = AnyToInt(nodeid);
        destid = AnyToInt(destid);
        var temp = jQuery(this.inttreename).find('li');
        if (nodeid < temp.size()) 
            this.tree.move_node(temp[nodeid],temp[destid],this.posConst[position]);
    }    
}
ExtJSTreeView.prototype.TEJSTremoveNode = function(nodeid){
	if (!arguments.length || isNaN(nodeid) || nodeid === "" || AnyToInt(nodeid) < 0 ){
		return false
	}
	// if (nodeid && nodeid != "" && nodeid != -1) {
	nodeid = AnyToInt(nodeid);
	var temp = jQuery(this.inttreename).find('li');
	if (nodeid < temp.size()) {
		// Seitenzähler aktualsieren 
		/* wird ertsmal durch den Client synchronisert
		if (AnyToInt(temp[nodeid].getAttribute('rel'))>1){
			this.attr_PageCount--;
		}
		*/
		this.tree.delete_node(jQuery('#' + temp[nodeid].id));
		return true;
	}
	return false
}
ExtJSTreeView.prototype.TEJSTcallNodeTextEditor = function(nodeid){
     if (nodeid && nodeid != "") {
        nodeid = AnyToInt(nodeid);
        var temp = jQuery(this.inttreename).find('li');
        if (nodeid < temp.size()) 
            this.tree.edit(temp[nodeid]);
    }
    else {
        this.tree.edit();
    }
}
ExtJSTreeView.prototype.TEJSTsearchNode = function(searchstr){  
    this.tree.search(searchstr);
}
ExtJSTreeView.prototype.TEJSTclearSearchNode = function(searchstr){
    this.tree.clear_search();
}
ExtJSTreeView.prototype.TEJSTtoggleopclose = function(nodeid){
    if (nodeid && nodeid != "") {
        nodeid = AnyToInt(nodeid);
        var temp = jQuery(this.inttreename).find('li');
        if (nodeid < temp.size()) 
            this.tree.toggle_node(temp[nodeid]);
    }
    else {
        this.tree.toggle_node();
    }
}
ExtJSTreeView.prototype.Width = function(width){
    if (!arguments.length) {
        return TStdVisibleComponent.prototype.Width.call(this);
    }
    TStdVisibleComponent.prototype.Width.call(this, width);
    this.obj.firstChild.style.Width = width + px;
}
ExtJSTreeView.prototype.getHoverNode = function(){
  var hoverednode = jQuery(this.inttreename).find('.jstree-hovered').parent();
  return this.getAbsIndexOfNode(hoverednode);
}

ExtJSTreeView.prototype.Height = function(height){
    if (!arguments.length) {
        return TStdVisibleComponent.prototype.Height.call(this);
    }
    TStdVisibleComponent.prototype.Height.call(this, height);
    this.obj.firstChild.style.Height = height + px;
}
ExtJSTreeView.prototype.selectXMLNodes = function(path, xml){  
	var nodes=null;
	var a = [];
	if(xml===null){
		return nodes;
	}
	if (window.ActiveXObject){
		nodes = xml.ownerDocument.selectNodes(path);
		for(var i = 1; i < nodes.length; i++) {
			a[i-1] = nodes.item(i);  
		}
	} else if (document.implementation && document.implementation.createDocument) {
		// !! IE11 unterstützt kein XPATH mehr !! 
		path=StrReplace(path,"//","");
		nodes= xml.ownerDocument.querySelectorAll(path);
		for(var i = 1; i < nodes.length; i++) {
			a[i-1] = nodes[i];
		}
		//nodes = xml.ownerDocument.evaluate(path,xml.ownerDocument, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		//for(var i = 1; i < nodes.snapshotLength; i++) {  
		//   a[i-1] = nodes.snapshotItem(i);  
		//}
	}
	if(a.length>0)
		nodes=a;
		else {
			if(nodes.snapshotLength>0) {
				a[0]=nodes.snapshotItem(0);
				nodes=a;
			}
		}
	return nodes;
}
ExtJSTreeView.prototype.get_XML=function(obj,rec){
  var result = "";
  var localNodeStr;
  //obj = this.tree.get_node(obj, true);
  var type;
  var _this = this;
  var tmp2="";
  if(!obj || obj === -1) {
    obj = jQuery(this.inttreename).find("> ul > li");
  }
  obj.each(function () {    
    li = jQuery(this);
    var templi= li.find("> ul > li");
    result+=(templi.length?li.attr("nodeinfo").replace(/regexwa/g,">"):li.attr("nodeinfo").replace(/regexwa/g,"/>"));
    type=li.attr("rel");
    li = templi;
    if(li.length){ 
      tmp2 = _this.get_XML(li,true);
    }
    else{
      tmp2= "";
    }
    result   += tmp2;   
    result  +=(templi.length?"</TStdOrganization>":"");
  });
  return result;
}
ExtJSTreeView.prototype.TEJSTSetXMLAttribute=function(index,name,value){
  var temp=this.GetTreeViewInfo(index);
  if (isVarUndefined(temp))
    return false;
  var regex=""+name+"=\"([^\\\"]*)\""; 
  var temp2=new RegExp(regex,"i");
  if(typeof temp2.exec(temp)!== "undefined" && temp2.exec(temp)!=null){
    temp=temp.replace(temp2,""+name+"=\""+value+"\"");
  }
  else{
     temp=StrInsert(""+name+"=\""+value+"\" ", temp, temp.indexOf(" ")+2);
  }    
  this.SetTreeViewInfo(index,temp);
  if((name=="Caption") && (this.attr_JSTCaptionAsName=="1")) //PW 11.10.11
  {
    this.SetTreeViewText(index,value);
  } 
  return true;
}
ExtJSTreeView.prototype.TEJSTGetXMLAttribute=function(index,name,retvalue){
  var temp=this.GetTreeViewInfo(index); 
  if (isVarUndefined(temp))
    return retvalue;
  var regex=""+name+"=\"([^\\\"]*)\|"+name+"='([^\\']*)'"; ; 
  var temp2=new RegExp(regex,"i").exec(temp);
  return (temp2===null?retvalue:(typeof temp2[1] !== "undefined"?temp2[1]:temp2[2]));
}
ExtJSTreeView.prototype.TEJSTRemoveXMLAttribute=function(index,name){
    var temp=this.GetTreeViewInfo(index);
    var regex=""+name+"=\"([^\\\"]*)\""; 
  var temp2=new RegExp(regex,"i");
  temp=temp.replace(temp2,"");
  this.SetTreeViewInfo(index,temp);
}
ExtJSTreeView.prototype.TEJSTSaveXMLFile=function(){
 // PageTrees haben ein anderes endElement   
 if ((this.rootElement=="<PageTree >")||(this.rootElement=="<PageTree>"))
   return this.rootElement+this.get_XML(-1)+"</"+this.rootElement.substr(1);
 else 
   return this.rootElement+this.get_XML(-1)+this.endElement;
}
ExtJSTreeView.prototype.TEJSTSearchNodeWithAttr =function(attrname,value){
   var xpath="//*";
   value=AnyToStr(value);
   var ret=this.selectXMLNodes(xpath,GetXMLDocFromString(this.TEJSTSaveXMLFile()));
   var _l=ret.length;
   for(var i=0;i<_l;i++){
     if(ret[i].getAttribute(attrname)===value)
       return i;
   }
   return -1;
}


ExtJSTreeView.prototype.deInit = function(){
  jQuery(this.inttreename).unbind("move_node.jstree", _treeonmoved);
  jQuery(this.inttreename).unbind("copy_node.jstree", _treeonmoved);
  jQuery(this.inttreename).unbind("rename_node.jstree", _treeonrename);
  jQuery(this.inttreename).unbind("delete_node.jstree", _treeondelete);
  jQuery(this.inttreename).unbind("select_node.jstree", _treeonselect);
  jQuery(this.inttreename).unbind("before.jstree",onbeforehandler);  
  jQuery(this.inttreename).unbind("redraw.jstree", _treeonredraw);
  jQuery(this.inttreename).unbind("open_node.jstree", _treeonopennode);
  jQuery(this.inttreename).unbind("close_node.jstree", _treeonclosenode);
  jQuery(this.inttreename).unbind("ready.jstree", _treeonready);
  
  this.tree.intideaobj=null;
  this.tree.destroy();
  jQuery(this.inttreename).empty();
  TStdVisibleComponent.prototype.deInit.call(this);
}
ExtJSTreeView.prototype.removeEdit = function(){
  jQuery($("treeeditbox")).blur();
}

_fninternalpet = {
  load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_xml(obj, function () { _this.__callback({ "obj" : obj }); s_call.call(this); }, e_call); },
  _is_loaded : function (obj) { 
    var s = this._get_settings().xml_data;
    obj = this._get_node(obj);
    return obj == -1 || !obj || !s.ajax || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
  },
  load_node_xml : function (obj, s_call, e_call) {
    var s = this.get_settings().xml_data,
      error_func = function () {},
      success_func = function () {};

    obj = this._get_node(obj);
    if(obj && obj !== -1) {
      if(obj.data("jstree-is-loading")) { return; }
      else { obj.data("jstree-is-loading",true); }
    }
    switch(!0) {
      case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
      case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
        if(!obj || obj == -1) {
          this.parse_xml(s.data, $.proxy(function (d) {
            if(d) {
              d = d.replace(/ ?xmlns="[^"]*"/ig, "");
              if(d.length > 10) {
                d = $(d);
                this.get_container().children("ul").empty().append(d.children());
                if(s.clean_node) { this.clean_node(obj); }
                if(s_call) { s_call.call(this); }
              }
            }
            else { 
              if(s.correct_state) { 
                this.get_container().children("ul").empty(); 
                if(s_call) { s_call.call(this); }
              }
            }
          }, this));
        }
        break;
      case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
        error_func = function (x, t, e) {
          var ef = this.get_settings().xml_data.ajax.error; 
          if(ef) { ef.call(this, x, t, e); }
          if(obj !== -1 && obj.length) {
            obj.children(".jstree-loading").removeClass("jstree-loading");
            obj.data("jstree-is-loading",false);
            if(t === "success" && s.correct_state) { obj.removeClass("jstree-open jstree-closed").addClass("jstree-leaf"); }
          }
          else {
            if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
          }
          if(e_call) { e_call.call(this); }
        };
        success_func = function (d, t, x) {
          d = x.responseText;
          var sf = this.get_settings().xml_data.ajax.success; 
          if(sf) { d = sf.call(this,d,t,x) || d; }
          if(d == "") {
            return error_func.call(this, x, t, "");
          }
          this.parse_xml(d, $.proxy(function (d) {
            if(d) {
              d = d.replace(/ ?xmlns="[^"]*"/ig, "");
              if(d.length > 10) {
                d = $(d);
                if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
                else { obj.children(".jstree-loading").removeClass("jstree-loading"); obj.append(d); obj.data("jstree-is-loading",false); }
                if(s.clean_node) { this.clean_node(obj); }
                if(s_call) { s_call.call(this); }
              }
              else {
                if(obj && obj !== -1) { 
                  obj.children(".jstree-loading").removeClass("jstree-loading");
                  obj.data("jstree-is-loading",false);
                  if(s.correct_state) { 
                    obj.removeClass("jstree-open jstree-closed").addClass("jstree-leaf"); 
                    if(s_call) { s_call.call(this); } 
                  }
                }
                else {
                  if(s.correct_state) { 
                    this.get_container().children("ul").empty();
                    if(s_call) { s_call.call(this); } 
                  }
                }
              }
            }
          }, this));
        };
        s.ajax.context = this;
        s.ajax.error = error_func;
        s.ajax.success = success_func;
        if(!s.ajax.dataType) { s.ajax.dataType = "xml"; }
        if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
        if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
        $.ajax(s.ajax);
        break;
    }
  },
  parse_xml : function (xml, callback) {
    var s = this._get_settings().xml_data;
    $.vakata.xslt(xml, xsl[s.xsl], callback);
  },
  get_xml : function (tp, obj, li_attr, a_attr, is_callback) {
    var result = "", 
      s = this._get_settings(), 
      _this = this,
      tmp1, tmp2, li, a, lang;
    if(!tp) { tp = "flat"; }
    if(!is_callback) { is_callback = 0; }
    obj = this._get_node(obj);
    if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
    li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
    if(!is_callback && this.data.types && $.inArray(s.types.type_attr, li_attr) === -1) { li_attr.push(s.types.type_attr); }

    a_attr = $.isArray(a_attr) ? a_attr : [ ];

    if(!is_callback) { result += "<root>"; }
    obj.each(function () {
      result += "<item";
      li = $(this);
      $.each(li_attr, function (i, v) { result += " " + v + "=\"" + (li.attr(v) || "").replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"") + "\""; });
      if(li.hasClass("jstree-open")) { result += " state=\"open\""; }
      if(li.hasClass("jstree-closed")) { result += " state=\"closed\""; }
      if(tp === "flat") { result += " parent_id=\"" + is_callback + "\""; }
      result += ">";
      result += "<content>";
      a = li.children("a");
      a.each(function () {
        tmp1 = $(this);
        lang = false;
        result += "<name";
        if($.inArray("languages", s.plugins) !== -1) {
          $.each(s.languages, function (k, z) {
            if(tmp1.hasClass(z)) { result += " lang=\"" + z + "\""; lang = z; return false; }
          });
        }
        if(a_attr.length) { 
          $.each(a_attr, function (k, z) {
            result += " " + z + "=\"" + (tmp1.attr(z) || "").replace(/jstree[^ ]*|$/ig,'') + "\"";
          });
        }
        if(tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
          result += ' icon="' + tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"") + '"';
        }
        if(tmp1.children("ins").get(0).style.backgroundImage.length) {
          result += ' icon="' + tmp1.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","") + '"';
        }
        result += ">";
        result += "<![CDATA[" + _this.get_text(tmp1, lang) + "]]>";
        result += "</name>";
      });
      result += "</content>";
      tmp2 = li[0].id;
      li = li.find("> ul > li");
      if(li.length) { tmp2 = _this.get_xml(tp, li, li_attr, a_attr, tmp2); }
      else { tmp2 = ""; }
      if(tp == "nest") { result += tmp2; }
      result += "</item>";
      if(tp == "flat") { result += tmp2; }
    });
    if(!is_callback) { result += "</root>"; }
    return result;
  }
}

function createExtJSTreeView(id, parent, pageName, multiSelect){
    idea_treeconfig.core.multiple=AnyToBool(multiSelect);
    var obj = document.createElement("div");
    parent.obj.appendChild(obj);
    var obj2 = document.createElement("div");
    obj.setAttribute("id", pageName + id);
    obj.appendChild(obj2);
    obj2.setAttribute("id", pageName + id + "int");
    obj2.style.MozBoxSizing = "content-box";
    obj2.style.overflow="auto";
    var child = document.createElement("ul");
    obj2.appendChild(child);
    obj.pageName = pageName;
    obj.obj = id;
    return new ExtJSTreeView(obj);
} 

function ieQuirksSlideUp(target, duration, callback) {
    var h = target.height();
    var cssHeight=target.css('height');
    target.animate( {
            height: '1px' }, duration, function() {
            target.hide();
            target.height(h);
            target.css('height',cssHeight);
            target.css('display',"none");
            });

}

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    var parent = this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}