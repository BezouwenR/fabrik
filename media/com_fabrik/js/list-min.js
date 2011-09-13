var FbListPlugin=new Class({Implements:[Events,Options],options:{requireChecked:true},initialize:function(a){this.setOptions(a);this.result=true;head.ready(function(){this.listform=this.getList().getForm();var b=this.listform.getElement("input[name=listid]");if(typeOf(b)==="null"){return}this.listid=b.value;this.watchButton()}.bind(this))},getList:function(){return Fabrik.blocks["list_"+this.options.listid]},clearFilter:Function.from(),watchButton:function(){var a=document.getElements("."+this.options.name);if(!a||a.length===0){return}a.addEvent("click",function(c){c.stop();var d,g;if(c.target.getParent(".fabrik_row")){d=c.target.getParent(".fabrik_row");if(d.getElement("input[name^=ids]")){g=d.getElement("input[name^=ids]");this.listform.getElements("input[name^=ids]").set("checked",false);g.set("checked",true)}}var b=false;this.listform.getElements("input[name^=ids]").each(function(e){if(e.checked){b=true}});d=c.target.getParent(".fabrik___heading");if(d&&b===false){this.listform.getElements("input[name^=ids]").set("checked",true);this.listform.getElement("input[name=checkAll]").set("checked",true);b=true}if(!b&&this.options.requireChecked){alert(Joomla.JText._("COM_FABRIK_PLEASE_SELECT_A_ROW"));return}var f=this.options.name.split("-");this.listform.getElement("input[name=fabrik_listplugin_name]").value=f[0];this.listform.getElement("input[name=fabrik_listplugin_renderOrder]").value=f.getLast();this.buttonAction()}.bind(this))},buttonAction:function(){this.list.submit("doPlugin")}});var FbListFilter=new Class({Implements:[Options,Events],options:{container:"",type:"list",id:""},initialize:function(d){this.filters=$H({});this.setOptions(d);this.container=document.id(this.options.container);this.filterContainer=this.container.getElement(".fabrikFilterContainer");var a=this.container.getElement(".toggleFilters");if(typeOf(a)!=="null"){a.addEvent("click",function(f){var g=a.getPosition();f.stop();var b=g.x-this.filterContainer.getWidth();var h=g.y+a.getHeight();var c=this.filterContainer.getStyle("display")==="none"?this.filterContainer.show():this.filterContainer.hide();this.filterContainer.fade("toggle")}.bind(this));if(typeOf(this.filterContainer)!=="null"){this.filterContainer.fade("hide").hide()}}if(typeOf(this.container)==="null"){return}this.getList();var e=this.container.getElement(".clearFilters");if(typeOf(e)!=="null"){e.removeEvents();e.addEvent("click",function(b){b.stop();this.container.getElements(".fabrik_filter").each(function(c){if(c.get("tag")==="select"){c.selectedIndex=0}else{c.value=""}});this.getList().plugins.each(function(c){c.clearFilter()});new Element("input",{name:"resetfilters",value:1,type:"hidden"}).inject(this.container);if(this.options.type==="list"){this.list.submit("list.filter")}else{this.container.getElement("form[name=filter]").submit()}}.bind(this))}},getList:function(){this.list=Fabrik.blocks[this.options.type+"_"+this.options.id];return this.list},addFilter:function(a,b){if(this.filters.has(a)===false){this.filters.set(a,[])}this.filters.get(a).push(b)},getFilterData:function(){var a={};this.container.getElements(".fabrik_filter").each(function(c){if(c.id.test(/value$/)){var b=c.id.match(/(\S+)value$/)[1];if(c.get("tag")==="select"&&c.selectedIndex!==-1){a[b]=document.id(c.options[c.selectedIndex]).get("text")}else{a[b]=c.get("value")}a[b+"_raw"]=c.get("value")}}.bind(this));return a},update:function(){this.filters.each(function(a,b){a.each(function(c){c.update()}.bind(this))}.bind(this))}});var FbList=new Class({Implements:[Options,Events],options:{admin:false,filterMethod:"onchange",ajax:false,form:"listform_"+this.id,hightLight:"#ccffff",primaryKey:"",headings:[],labels:{},Itemid:0,formid:0,canEdit:true,canView:true,page:"index.php",actionMethod:"",formels:[],data:[],rowtemplate:""},initialize:function(b,a){this.id=b;this.setOptions(a);this.getForm();this.list=document.id("list_"+this.id);this.actionManager=new FbListActions(this,this.options.actionMethod);new FbGroupedToggler(this.form);new FbListKeys(this);if(this.list){this.tbody=this.list.getElement("tbody");if(typeOf(this.tbody)==="null"){this.tbody=this.list}if(window.ie){this.options.rowtemplate=this.list.getElement(".fabrik_row")}}this.watchAll(false);window.addEvent("fabrik.form.submitted",function(){this.updateRows()}.bind(this))},setRowTemplate:function(){if(typeOf(this.options.rowtemplate)==="string"){var a=this.list.getElement(".fabrik_row");if(window.ie&&typeOf(a)!=="null"){this.options.rowtemplate=a}}},watchAll:function(a){a=a?a:false;this.watchNav();if(!a){this.watchRows()}this.watchFilters();this.watchOrder();this.watchEmpty();this.watchButtons()},watchButtons:function(){this.exportWindowOpts={id:"exportcsv",title:"Export CSV",loadMethod:"html",minimizable:false,width:360,height:120,content:""};if(this.form.getElements(".csvExportButton")){this.form.getElements(".csvExportButton").each(function(a){if(a.hasClass("custom")===false){a.addEvent("click",function(c){var b=this.makeCSVExportForm();this.form.getElements(".fabrik_filter").each(function(e){var d=new Element("input",{type:"hidden",name:e.name,id:e.id,value:e.get("value")});d.inject(b)}.bind(this));this.exportWindowOpts.content=b;this.exportWindowOpts.onContentLoaded=function(){this.fitToContent()};Fabrik.getWindow(this.exportWindowOpts)}.bind(this))}}.bind(this))}},makeCSVExportForm:function(){var n="<input type='radio' value='1' name='incfilters' checked='checked' />"+Joomla.JText._("JYES");var h="<input type='radio' value='1' name='incraw' checked='checked' />"+Joomla.JText._("JYES");var f="<input type='radio' value='1' name='inccalcs' checked='checked' />"+Joomla.JText._("JYES");var e="<input type='radio' value='1' name='inctabledata' checked='checked' />"+Joomla.JText._("JYES");var d="<input type='radio' value='1' name='excel' checked='checked' />Excel CSV";var a="index.php?option=com_fabrik&view=list&listid="+this.id+"&format=csv";var b={styles:{width:"200px","float":"left"}};var m=new Element("form",{action:a,method:"post"}).adopt([new Element("div",b).set("text",Joomla.JText._("COM_FABRIK_FILE_TYPE")),new Element("label").set("html",d),new Element("label").adopt([new Element("input",{type:"radio",name:"excel",value:"0"}),new Element("span").set("text","CSV")]),new Element("br"),new Element("br"),new Element("div",b).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_FILTERS")),new Element("label").set("html",n),new Element("label").adopt([new Element("input",{type:"radio",name:"incfilters",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",b).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_DATA")),new Element("label").set("html",e),new Element("label").adopt([new Element("input",{type:"radio",name:"inctabledata",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",b).appendText(Joomla.JText._("COM_FABRIK_INCLUDE_RAW_DATA")),new Element("label").set("html",h),new Element("label").adopt([new Element("input",{type:"radio",name:"incraw",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]),new Element("br"),new Element("div",b).appendText(Joomla.JText._("COM_FABRIK_INLCUDE_CALCULATIONS")),new Element("label").set("html",f),new Element("label").adopt([new Element("input",{type:"radio",name:"inccalcs",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))])]);new Element("h4").set("text",Joomla.JText._("COM_FABRIK_SELECT_COLUMNS_TO_EXPORT")).inject(m);var l="";var k=0;$H(this.options.labels).each(function(o,g){if(g.substr(0,7)!=="fabrik_"&&g!=="____form_heading"){var p=g.split("___")[0];if(p!==l){l=p;new Element("h5").set("text",l).inject(m)}var c="<input type='radio' value='1' name='fields["+g+"]' checked='checked' />"+Joomla.JText._("JYES");o=o.replace(/<\/?[^>]+(>|$)/g,"");var q=new Element("div",b).appendText(o);q.inject(m);new Element("label").set("html",c).inject(m);new Element("label").adopt([new Element("input",{type:"radio",name:"fields["+g+"]",value:"0"}),new Element("span").appendText(Joomla.JText._("JNO"))]).inject(m);new Element("br").inject(m)}k++}.bind(this));if(this.options.formels.length>0){new Element("h5").set("text",Joomla.JText._("COM_FABRIK_FORM_FIELDS")).inject(m);this.options.formels.each(function(g){var c="<input type='radio' value='1' name='fields["+g.name+"]' checked='checked' />"+Joomla.JText._("JYES");var o=new Element("div",b).appendText(g.label);o.inject(m);new Element("label").set("html",c).inject(m);new Element("label").adopt([new Element("input",{type:"radio",name:"fields["+g.name+"]",value:"0"}),new Element("span").set("text",Joomla.JText._("JNO"))]).inject(m);new Element("br").inject(m)}.bind(this))}new Element("div",{styles:{"text-align":"right"}}).adopt(new Element("input",{type:"button",name:"submit",value:Joomla.JText._("COM_FABRIK_EXPORT"),"class":"button",events:{click:function(c){c.stop();c.target.disabled=true;new Element("div",{id:"csvmsg"}).set("html",Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>').inject(c.target,"before");this.triggerCSVImport(0)}.bind(this)}})).inject(m);new Element("input",{type:"hidden",name:"view",value:"table"}).inject(m);new Element("input",{type:"hidden",name:"option",value:"com_fabrik"}).inject(m);new Element("input",{type:"hidden",name:"listid",value:this.id}).inject(m);new Element("input",{type:"hidden",name:"format",value:"csv"}).inject(m);new Element("input",{type:"hidden",name:"c",value:"table"}).inject(m);return m},triggerCSVImport:function(f,c,a){var b="index.php?option=com_fabrik&view=list&format=csv&listid="+this.id;if(f!==0){c=this.csvopts;a=this.csvfields}else{if(!c){c={};if(typeOf(document.id("exportcsv"))!=="null"){$A(["incfilters","inctabledata","incraw","inccalcs","excel"]).each(function(h){var g=document.id("exportcsv").getElements("input[name="+h+"]");if(g.length>0){c[h]=g.filter(function(k){return k.checked})[0].value}})}}if(!a){a={};if(typeOf(document.id("exportcsv"))!=="null"){document.id("exportcsv").getElements("input[name^=field]").each(function(h){if(h.checked){var g=h.name.replace("fields[","").replace("]","");a[g]=h.get("value")}})}}c.fields=a;this.csvopts=c;this.csvfields=a}var e=b+"&start="+f;var d=new Request.JSON({url:e,method:"post",data:c,onSuccess:function(h){if(h.err){alert(h.err)}else{if(typeOf(document.id("csvcount"))!=="null"){document.id("csvcount").set("text",h.count)}if(typeOf(document.id("csvtotal"))!=="null"){document.id("csvtotal").set("text",h.total)}if(typeOf(document.id("csvfile"))!=="null"){document.id("csvfile").set("text",h.file)}if(h.count<h.total){this.triggerCSVImport(h.count)}else{var g=Fabrik.liveSite+"index.php?option=com_fabrik&view=list&format=csv&listid="+this.id+"&start="+h.count;var k=Joomla.JText._("COM_FABRIK_CSV_COMPLETE");k+=' <a href="'+g+'">'+Joomla.JText._("COM_FABRIK_CSV_DOWNLOAD_HERE")+"</a>";if(typeOf(document.id("csvmsg"))!=="null"){document.id("csvmsg").set("html",k)}}}}.bind(this)});d.send()},addPlugins:function(b){b.each(function(a){a.list=this}.bind(this));this.plugins=b},watchEmpty:function(c){var a=document.id(this.options.form).getElement(".doempty",this.options.form);if(a){a.addEvent("click",function(b){b.stop();if(confirm(Joomla.JText._("COM_FABRIK_CONFIRM_DROP"))){this.submit("list.doempty")}}.bind(this))}},watchOrder:function(){var a=document.id(this.options.form).getElements(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc");a.removeEvents("click");a.each(function(b){b.addEvent("click",function(d){var f="";var c="";b=document.id(d.target);var g=b.findClassUp("fabrik_ordercell");if(b.tagName!=="a"){b=g.getElement("a")}switch(b.className){case"fabrikorder-asc":c="fabrikorder-desc";f="desc";break;case"fabrikorder-desc":c="fabrikorder";f="-";break;case"fabrikorder":c="fabrikorder-asc";f="asc";break}g=g.className.split(" ")[2].replace("_order","").replace(/^\s+/g,"").replace(/\s+$/g,"");b.className=c;this.fabrikNavOrder(g,f);d.stop()}.bind(this))}.bind(this))},watchFilters:function(){var b="";if(this.options.filterMethod!=="submitform"){document.id(this.options.form).getElements(".fabrik_filter").each(function(c){b=c.get("tag")==="select"?"change":"blur";c.removeEvent(b);c.store("initialvalue",c.get("value"));c.addEvent(b,function(d){d.stop();if(d.target.retrieve("initialvalue")!==d.target.get("value")){this.submit("list.filter")}}.bind(this))}.bind(this))}else{var a=document.id(this.options.form).getElement(".fabrik_filter_submit");if(a){a.removeEvents();a.addEvent("click",function(c){this.submit("list.filter")}.bind(this))}}document.id(this.options.form).getElements(".fabrik_filter").addEvent("keydown",function(c){if(c.code===13){c.stop();this.submit("list.filter")}}.bind(this))},setActive:function(a){this.list.getElements(".fabrik_row").each(function(b){b.removeClass("activeRow")});a.addClass("activeRow")},watchRows:function(){if(!this.list){return}this.rows=this.list.getElements(".fabrik_row");this.links=this.list.getElements(".fabrik___rowlink");if(this.options.ajax){this.list.addEvent("click:relay(.fabrik_edit)",function(c){c.stop();var d=c.target.findClassUp("fabrik_row");this.setActive(d);var b=d.id.replace("list_"+this.id+"_row_","");var a=Fabrik.liveSite+"index.php?option=com_fabrik&view=form&formid="+this.options.formid+"&rowid="+b+"&tmpl=component&ajax=1";Fabrik.getWindow({id:"add."+this.options.formid,title:"Edit",loadMethod:"xhr",contentURL:a})}.bind(this));this.list.addEvent("click:relay(.fabrik_view)",function(c){c.stop();var d=c.target.findClassUp("fabrik_row");this.setActive(d);var b=d.id.replace("list_"+this.id+"_row_","");var a=Fabrik.liveSite+"index.php?option=com_fabrik&view=details&formid="+this.options.formid+"&rowid="+b+"&tmpl=component&ajax=1";Fabrik.getWindow({id:"view.."+this.options.formid+"."+b,title:"Details",loadMethod:"xhr",contentURL:a})}.bind(this))}},getForm:function(){if(!this.form){this.form=document.id(this.options.form)}return this.form},submit:function(a){this.getForm();if(a==="list.delete"){var b=false;this.form.getElements("input[name^=ids]").each(function(d){if(d.checked){b=true}});if(!b){alert(Joomla.JText._("COM_FABRIK_SELECT_ROWS_FOR_DELETION"));Fabrik.loader.stop("listform_"+this.id);return false}if(!confirm(Joomla.JText._("COM_FABRIK_CONFIRM_DELETE"))){Fabrik.loader.stop("listform_"+this.id);return false}}Fabrik.loader.start("listform_"+this.id);if(a==="list.filter"){this.form.task.value=a;if(this.form["limitstart"+this.id]){this.form.getElement("#limitstart"+this.id).value=0}}else{if(a!==""){this.form.task.value=a}}if(this.options.ajax){this.form.getElement("input[name=option]").value="com_fabrik";this.form.getElement("input[name=view]").value="list";this.form.getElement("input[name=format]").value="raw";if(!this.request){this.request=new Request({url:this.form.get("action"),data:this.form,onComplete:function(c){c=JSON.decode(c);this._updateRows(c);Fabrik.loader.stop("listform_"+this.id)}.bind(this)})}this.request.send();window.fireEvent("fabrik.list.submit",[a,this.form.toQueryString().toObject()])}else{this.form.submit();Fabrik.loader.stop("listform_"+this.id)}return false},fabrikNav:function(a){this.form.getElement("#limitstart"+this.id).value=a;window.fireEvent("fabrik.list.navigate",[this,a]);if(!this.result){this.result=true;return false}this.submit("list.view");return false},fabrikNavOrder:function(a,b){this.form.orderby.value=a;this.form.orderdir.value=b;window.fireEvent("fabrik.list.order",[this,a,b]);if(!this.result){this.result=true;return false}this.submit("list.order")},removeRows:function(b){for(i=0;i<b.length;i++){var c=document.id("list_"+this.id+"_row_"+b[i]);var a=new Fx.Morph(c,{duration:1000});a.start({backgroundColor:this.options.hightLight}).chain(function(){this.start({opacity:0})}).chain(function(){c.dispose();this.checkEmpty()}.bind(this))}},editRow:function(){},clearRows:function(){this.list.getElements(".fabrik_row").each(function(a){a.dispose()})},updateRows:function(){new Request.JSON({url:Fabrik.liveSite+"index.php?option=com_fabrik&view=list&format=raw&listid="+this.id,onSuccess:function(a){this._updateRows(a)}.bind(this)}).send()},_updateRows:function(d){if(d.id===this.id&&d.model==="list"){var e=document.id(this.options.form).getElements(".fabrik___heading").getLast();var m=new Hash(d.headings);m.each(function(p,n){n="."+n;try{if(typeOf(e.getElement(n))!=="null"){e.getElement(n).set("html",p)}}catch(o){fconsole(o)}});this.clearRows();var a=0;var k=0;trs=[];this.options.data=d.data;if(d.calculations){this.updateCals(d.calculations)}if(typeOf(this.form.getElement(".fabrikNav"))!=="null"){this.form.getElement(".fabrikNav").set("html",d.htmlnav)}this.setRowTemplate();var f=this.options.isGrouped?$H(d.data):d.data;var l=0;f.each(function(q,o){var n,t;var p=this.options.isGrouped?this.list.getElements(".fabrik_groupdata")[l]:this.tbody;l++;for(i=0;i<q.length;i++){if(typeOf(this.options.rowtemplate)==="string"){n=(!this.options.rowtemplate.match(/<tr/))?"div":"table";t=new Element(n);t.set("html",this.options.rowtemplate)}else{n=this.options.rowtemplate.get("tag")==="tr"?"table":"div";t=new Element(n);t.adopt(this.options.rowtemplate.clone())}var u=$H(q[i]);$H(u.data).each(function(y,x){var w="."+x;var r=t.getElement(w);if(typeOf(r)!=="null"){r.set("html",y)}k++}.bind(this));t.getElement(".fabrik_row").id=u.id;if(typeOf(this.options.rowtemplate)==="string"){var v=t.getElement(".fabrik_row").clone();v.id=u.id;v.inject(p)}else{var s=t.getElement(".fabrik_row");s.inject(p);t.empty()}a++}}.bind(this));var b=this.list.findClassUp("fabrikDataContainer");var h=this.list.findClassUp("fabrikForm").getElement(".emptyDataMessage");if(k===0){if(typeOf(b)!=="null"){b.setStyle("display","none")}if(typeOf(h)!=="null"){h.setStyle("display","")}}else{if(typeOf(b)!=="null"){b.setStyle("display","")}if(typeOf(h)!=="null"){h.setStyle("display","none")}}if(typeOf(this.form.getElement(".fabrikNav"))!=="null"){this.form.getElement(".fabrikNav").set("html",d.htmlnav)}this.watchAll(true);window.fireEvent("fabrik.table.updaterows");try{Slimbox.scanPage()}catch(c){fconsole("slimbox scan:"+c)}try{Mediabox.scanPage()}catch(g){fconsole("mediabox scan:"+g)}window.fireEvent("fabrik.list.update",[this,d])}this.stripe();Fabrik.loader.stop("listform_"+this.id)},addRow:function(d){var c=new Element("tr",{"class":"oddRow1"});var a={test:"hi"};for(var b in d){if(this.options.headings.indexOf(b)!==-1){var e=new Element("td",{}).appendText(d[b]);c.appendChild(e)}}c.inject(this.tbody)},addRows:function(a){for(i=0;i<a.length;i++){for(j=0;j<a[i].length;j++){this.addRow(a[i][j])}}this.stripe()},stripe:function(){var a=this.list.getElements(".fabrik_row");for(i=0;i<a.length;i++){if(i!==0){var b="oddRow"+(i%2);a[i].addClass(b)}}},checkEmpty:function(){var a=this.list.getElements("tr");if(a.length===2){this.addRow({label:Joomla.JText._("COM_FABRIK_NO_RECORDS")})}},watchCheckAll:function(b){var a=this.form.getElement("input[name=checkAll]");if(typeOf(a)!=="null"){a.addEvent("click",function(g){var h=document.id(g.target);var f=this.list.findClassUp("fabrikList").getElements("input[name^=ids]");h=!h.checked?"":"checked";for(var d=0;d<f.length;d++){f[d].checked=h;this.toggleJoinKeysChx(f[d])}}.bind(this))}this.form.getElements("input[name^=ids]").each(function(c){c.addEvent("change",function(d){this.toggleJoinKeysChx(c)}.bind(this))}.bind(this))},toggleJoinKeysChx:function(a){a.getParent().getElements("input[class=fabrik_joinedkey]").each(function(b){b.checked=a.checked})},watchNav:function(d){var c=this.form.getElement("#limit"+this.id);if(c){c.addEvent("change",function(g){var f=window.fireEvent("fabrik.list.limit",[this]);if(this.result===false){this.result=true;return false}this.submit("list.filter")}.bind(this))}var b=this.form.getElement(".addRecord");if(typeOf(b)!=="null"&&(this.options.ajax)){b.removeEvents();b.addEvent("click",function(f){f.stop();Fabrik.getWindow({id:"add-"+this.id,title:"Add",loadMethod:"xhr",contentURL:b.href})}.bind(this))}var a=document.getElements(".fabrik_delete a");if(a){a.addEvent("click",function(g){var f=g.target.findClassUp("fabrik_row");if(f){var h=f.getElement("input[type=checkbox][name*=id]");if(typeOf(h)!=="null"){this.form.getElements("input[type=checkbox][name*=id], input[type=checkbox][name=checkAll]").each(function(e){e.checked=false})}if(typeOf(h)!=="null"){h.checked=true}}else{this.form.getElements("input[type=checkbox][name*=id], input[type=checkbox][name=checkAll]").each(function(e){e.checked=true})}if(!this.submit("list.delete")){g.stop()}}.bind(this))}if(document.id("fabrik__swaptable")){document.id("fabrik__swaptable").addEvent("change",function(f){window.location="index.php?option=com_fabrik&task=list.view&cid="+f.target.get("value")}.bind(this))}if(this.options.ajax){if(typeOf(this.form.getElement(".pagination"))!=="null"){this.form.getElement(".pagination").getElements(".pagenav").each(function(e){e.addEvent("click",function(f){f.stop();if(e.get("tag")==="a"){var g=e.href.toObject();this.fabrikNav(g["limitstart"+this.id])}}.bind(this))}.bind(this))}}this.watchCheckAll()},updateCals:function(b){var a=["sums","avgs","count","medians"];this.form.getElements(".fabrik_calculations").each(function(d){a.each(function(c){$H(b[c]).each(function(g,e){var f=d.getElement(".fabrik_row___"+e);if(typeOf(f)!=="null"){f.set("html",g)}})})})}});var FbListKeys=new Class({initialize:function(a){window.addEvent("keyup",function(c){if(c.alt){switch(c.key){case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_ADD"):var b=a.form.getElement(".addRecord");if(a.options.ajax){b.fireEvent("click")}if(b.getElement("a")){a.options.ajax?b.getElement("a").fireEvent("click"):document.location=b.getElement("a").get("href")}else{if(!a.options.ajax){document.location=b.get("href")}}break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_EDIT"):console.log("edit");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_DELETE"):console.log("delete");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_FILTER"):console.log("filter");break}}}.bind(this))}});var FbGroupedToggler=new Class({initialize:function(a){a.addEvent("click:relay(.fabrik_groupheading a.toggle)",function(g){g.stop();var c=g.target.getParent(".fabrik_groupheading");var b=c.getElement("img");var f=b.retrieve("showgroup",true);var d=c.getParent().getNext();f?d.hide():d.show();if(f){b.src=b.src.replace("orderasc","orderneutral")}else{b.src=b.src.replace("orderneutral","orderasc")}f=f?false:true;b.store("showgroup",f)})}});var FbListActions=new Class({initialize:function(a,b){b=b?b:"";this.list=a;this.actions=[];this.setUpSubMenus();this.method=b;console.log(this.method);if(this.method==="floating"){window.addEvent("keydown",function(c){if(c.key==="esc"){this.closeWidgets()}}.bind(this))}window.addEvent("fabrik.list.update",function(d,c){this.observe()}.bind(this));this.observe()},observe:function(){if(this.method==="floating"){this.setUpFloating()}else{this.setUpDefault()}},setUpSubMenus:function(){this.actions=this.list.form.getElements("ul.fabrik_action");this.actions.each(function(b){if(b.getElement("ul")){var d=b.getElement("ul");var e=d.clone();e.inject(document.body);e.fade("hide");var a=d.getParent();a.store("trigger",e);e.setStyles({position:"absolute"});a.addEvent("click",function(f){f.stop();var g=a.retrieve("trigger");g.setStyle("top",a.getTop()+a.getHeight());g.setStyle("left",a.getLeft()+a.getWidth()/1.5);g.fade("toggle")});d.dispose()}})},setUpDefault:function(){this.actions=this.list.form.getElements("ul.fabrik_action");this.actions.each(function(a){if(a.getParent().hasClass("fabrik_buttons")){return}a.fade(0.6);var b=a.getParent(".fabrik_row")?a.getParent(".fabrik_row"):a.getParent(".fabrik___heading");if(b){b.addEvents({mouseenter:function(c){a.fade(0.99)},mouseleave:function(c){a.fade(0.6)}})}})},setUpFloating:function(){this.list.form.getElements("ul.fabrik_action").each(function(d){if(d.findClassUp("fabrik_row")){if(i=d.getParent(".fabrik_row").getElement("input[type=checkbox]")){d.addClass("floating-tip");var e=d.clone().inject(document.body,"inside");this.actions.push(e);e.fade("out");e.addClass("fabrik_row");e.setStyle("position","absolute");console.log(d);i.addEvent("click",function(c){this.toggleWidget(c,e)}.bind(this));d.dispose()}}}.bind(this));if(this.list.list.getElements(".fabrik_actions")){this.list.list.getElements(".fabrik_actions").hide()}if(this.list.list.getElements(".fabrik_calculation")){var a=this.list.list.getElements(".fabrik_calculation").getLast();if(typeOf(a)!=="null"){a.hide()}}var b=this.list.form.getElement("input[name=checkAll]");if(typeOf(b)!=="null"){b.addEvent("click",function(c){this.toggleWidget(c,this.actions[0],true)}.bind(this))}},toggleRowSpecific:function(e,b){var d=e.getElement(".fabrik_edit");var a=e.getElement(".fabrik_view");if(b){if(typeOf(d)!=="null"){d.hide()}if(typeOf(a)!=="null"){a.hide()}}else{if(typeOf(d)!=="null"){d.show()}if(typeOf(a)!=="null"){a.show()}}},toggleWidget:function(f,g,a){if(f.target.name==="checkAll"){return}a=a?a:false;if(f.target.checked){this.closeWidgets(g);this.toggleRowSpecific(g,a);var b=10;if(f.target.getPosition().x+g.getWidth()+b>window.getSize().x){b=(b*-1)-g.getWidth()}var d={left:(f.page.x+b)+"px",top:f.page.y+"px"};g.setStyles(d);g.fade("in")}else{g.fade("out")}},closeWidgets:function(a){this.actions.each(function(b){if(b!==a&&!b.hasClass("neverToggle")){b.fade("out")}}.bind(this))}});