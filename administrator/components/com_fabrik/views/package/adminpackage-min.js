AdminPackage=new Class({Extends:Canvas,initialize:function(a){a.editable=true;this.parent(a);this.setup();a.editable=true;this.selectWindows={};this.blocks=this.options.blocks;this.makeBlockMenu();window.addEvent("fabrik.tab.add",this.setDrops.bindWithEvent(this));this.setDrops();this.setDrags();window.addEvent("fabrik.package.item.selected",this.addItem.bindWithEvent(this));window.addEvent("fabrik.page.block.delete",this.deleteItem.bindWithEvent(this))},makeBlockMenu:function(){var a=new Element("ul",{id:"typeList"}).adopt([new Element("li",{"class":"draggable typeList-list"}).adopt([new Element("img",{src:"components/com_fabrik/images/header/fabrik-list.png",title:"Drag this list icon onto a page"}),new Element("div").set("text","List")]).store("type","list"),new Element("li",{"class":"draggable typeList-form"}).adopt([new Element("img",{src:"components/com_fabrik/images/header/fabrik-form.png",title:"Drag this form icon onto a page"}),new Element("div").set("text","Form")]).store("type","form"),new Element("li",{"class":"draggable typeList-visualization"}).adopt([new Element("img",{src:"components/com_fabrik/images/header/fabrik-visualization.png",title:"Drag this visualization icon onto a page"}),new Element("div").set("text","Visualization")]).store("type","visualization")]);a.inject($("packagemenu"),"before")},insertPage:function(h,d,k,j,a){var l,e;if(a.width===0){a.width=50}if(a.height===0){a.height=50}a["z-index"]=100;var i=new Element("div",{id:d,"class":"fabrikWindow itemPlaceHolder itemPlaceHolder-"+j}).setStyles(a);if(h.editable){e=this.iconGen.create(icon.cross);l=new Element("a",{href:"#","class":"close",events:{click:h.removeItem.bindWithEvent(h,[d])}});e.inject(l)}else{l=null}k=new Element("span",{"class":"handlelabel"}).set("text",k);var f=new Element("div",{"class":"handle"}).adopt([k,l]);var b=new Element("div",{"class":"dragger"});var g=new Element("div",{"class":"itemContent"});i.adopt([f,g,b]);if(h.editable){i.makeResizable({handle:b,onComplete:function(){window.fireEvent("fabrik.item.resized",i)}});i.makeDraggable({handle:f,container:$("packagepages")})}i.addEvent("mousedown",function(c){window.fireEvent("fabrik.page.add",[i])});h.page.adopt(i)},openListWindow:function(b){this.activeType=b;var c="typeWindow-"+b;if(this.selectWindows[c]){this.selectWindows[c].open()}else{var a="index.php?option=com_fabrik&task=package.dolist&format=raw&list="+b+"&selected="+this.blocks[b].join(",");opts={id:c,type:"modal",title:"Select a "+b,contentType:"xhr",loadMethod:"xhr",contentURL:a,width:200,height:250,x:300,minimizable:false,collapsible:true,onClose:function(){delete this.selectWindows[c]}.bind(this)};this.selectWindows[c]=Fabrik.getWindow(opts)}},addItem:function(b){b.stop();var a=b.target.get("text");this.blocks[this.activeType].push(b.target.id);var c=this.activeType+"_"+b.target.id;this.insertLocation.height="200px";this.insertLocation.width="400px";this.pages.getActivePage().insert(c,a,this.activeType,this.insertLocation);this.selectWindows["typeWindow-"+this.activeType].close()},deleteItem:function(a){a=a.split("_");this.blocks[a[0]].erase(a[1])},prepareSave:function(){var b={};b.layout=this.pages.toJSON();b.blocks=this.blocks;var a=[];this.tabs.tabs.each(function(c){a.push(c.get("text").trim())});b.tabs=a;return b}});