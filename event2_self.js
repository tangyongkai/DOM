function on(ele,type,fn){
	if(/^self/.test(type)){
		if(!ele["selfEvent"+type]){
			ele["selfEvent"+type]=[];	
		}
		var a=ele["selfEvent"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;	
		}
		a.push(fn);
	}else if(ele.addEventListener)
		ele.addEventListener(type,fn,false);
		
	else{
		if(!ele["onEvent"+type]){
			ele["onEvent"+type]=[];	
			ele.attachEvent("on"+type,function(){run.call(ele)});
		}
		var a=ele["onEvent"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;
		}
		
		a.push(fn);
	}

}


function run(){
	var e=window.event;
	var type=e.type;
	
	e.target=e.srcElement;
	e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
	e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
	e.preventDefault=function(){e.returnValue=false;}
	e.stopPropagation=function(){e.cancelBubble=true;}
	
	var a=this["onEvent"+type];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);	
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
	
}


//新定义一个selfRun方法，专门处理自定义事件的“通知”
//它负责当主行为发生的时候，遍历on的时候保存在对应的数组里的方法并且执行
function selfRun(selfType,e){//selfType是指的约定好的自定义事件类型;第二个参数e是系统的事件对象，是可选参数
	var a=this["selfEvent"+selfType];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);	
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
	
}


function off(ele,type,fn){
	if(/^self/.test(type)){
		var a=ele["selfEvent"+type];
		if(a&&a.length){
			for(var i=0;i<a.length;i++){
				if(a[i]==fn){
					a[i]=null;
					break;	
				}
			}
		}
	}else
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
	}else{
		var a=ele["onEvent"+type];
		if(a&&a.length){
			for(var i=0;i<a.length;i++){
				if(a[i]==fn){
					a[i]=null;
					return;	
				}
			}
		}
	}
}


function processThis(fn,context){
			return function(e){fn.call(context,e);this};	
		}