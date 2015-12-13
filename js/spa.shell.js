/*
*spa.shell.js
*Shell module for SPA
*/
/*jslint browser : true, continue : true,
devel : true, indent:2, maxerr:50,
newcap:true, nomen :true,plusplus:true,
vars : false,regexp:true,sloppy:true,
white : true
*/
/*global $, spa */
spa.shell = (function(){
	//begin module scope variables
	var 
	configMap = {
		main_html : String()
		+' <div class="spa-shell-head">'
		+' <div class="spa-shell-head-logo"></div>'
		+' <div class="spa-shell-head-acct"></div>'
		+' <div class="spa-shell-head-search"></div>'
		+'</div>'
		+'<div class="spa-shell-main">'
		+' <div class="spa-shell-main-nav"></div>'
		+' <div class="spa-shell-main-content"></div>'
		+'</div>'
		+'<div class="spa-shell-foot"></div>'
		+'<div class="spa-shell-chat"></div>'
		+'<div class="spa-shell-modal"></div>',

		chat_extend_time : 1000,
		chat_retract_time : 300,
		chat_extend_height : 450,
		chat_retract_height : 15,
		chat_extend_title :'Click to retract',
		chat_retracted_title : 'Click to extend'
		
	},
	stateMap ={
	$container :null,
	is_chat_retracted:true
	},//将整个模块中共享的动态信息放在stateMap变量中
	jqueryMap ={},//将jquery集合缓存在jqueryMap中
	setJqueryMap ,toggleChat,onClickChat,initModule;//jquery的用途是大大减少jquery对文档遍历次数，可以提高性能

	//----------end module scope variables--------------
	//----------begin utility methods-------------保留区块 这些函数不和页面元素交互
	//----------end utility methods-----------------
	//----------begin dom methods-----------------将创建和操作页面元素的函数放在dom method 中
	//begin dom method /setJqueryMap/
	setJqueryMap = function(){
		var $container = stateMap.$container;

		jqueryMap = {
		$container : $container,
		$chat : $container.find('.spa-shell-chat')//?
		}; //??
	};
	//End DOM method /setJqueryMap/
	//begin dom method /setJqueryMap/
	//purpose :Extends or retracts chat slider 
	//Arguments :
	//	* do_extend - if true,extends slider; if false retracts
	//	* callback - optional function to execute at end of animation 
	//Settings :
	//	* chat_extend_time, chat_retract_time
	//	* chat_extend_height, chat_retract_height
	// State : sets stateMap.is_chat_retracted 更新togglechat api文档 指出该方法是如何设置stateMap.is_chat_retracted的
	//* true - slider is retracted 
	//* false - slider is extend

	toggleChat = function(do_extend,callback){
		var
		px_chat_ht = jqueryMap.$chat.height(),
		is_open = px_chat_ht === configMap.chat_extend_height,
		is_closed = px_chat_ht ===configMap.chat_retract_height,
		is_sliding = ! is_open && ! is_closed;
		//avoid race condition
		if (is_sliding) {return false;}
		//begin extend chat slider
		if(do_extend){
			jqueryMap.$chat.animate(
			{
				height : configMap.chat_extend_height
			},
				configMap.chat_extend_time,
				function(){
					if(callback){callback(jqueryMap.$chat);}
				}
				);
			
			return true;
		}
		//end extend chat slider

		//begin retract chat slider
		jqueryMap.$chat.animate(
		{
			height:configMap.chat_extend_height
		},
			configMap.chat_retract_time,
			function(){
				jqueryMap.$chat.attr(
					'title',configMap.chat_retracted_title);
				stateMap.is_chat_retracted = true;
			
				if(callback){callback(jqueryMap.$chat);}

			}
		);
		return true;
		//end retract chat slider

 	};

	//---------end dom methods--------------
	//---------begin event handlers----------为jquery事件处理函数保留区块


	onClickChat = function(event){
		toggleChat(stateMap.is_chat_retracted);
		return false;
	};

//------------ end event handlers-----------
	//---------begin public methods-------------放置公开方法
	//begin public method /initModule/
	initModule = function($container){
		//load HTML and map jquery collections
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();
		//initialize that slider and bind click handler
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat
		.attr('title',configMap.chat_retracted_title)
		.click(onClickChat); 
		
	};
	//end public method /initModule/	
	return {initModule:initModule};
	//-----------end public methods----------------

}());