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
		anchor_schema_map : {
			chat : {open : true, closed : true}
		},
	
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
		chat_retract_time : 1000,
		chat_extend_height : 450,
		chat_retract_height : 15,
		chat_extend_title :'Click to retract',
		chat_retracted_title : 'Click to extend'
		
	},
	stateMap ={
	$container :null,
	anchor_map :{},
	is_chat_retracted:true
	},//将整个模块中共享的动态信息放在stateMap变量中
	jqueryMap ={},//将jquery集合缓存在jqueryMap中
	copyAnchorMap,changeAnchorPart, onHashchange,
	setJqueryMap ,toggleChat,onClickChat,initModule;//jquery的用途是大大减少jquery对文档遍历次数，可以提高性能

	//----------end module scope variables--------------
	//----------begin utility methods-------------保留区块 这些函数不和页面元素交互
	//Return copy of stored anchor map; minimizes overhead
	copyAnchorMap = function(){
		return $.extend(true,{},stateMap.anchor_map);
	};
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

	//Begin DOM method /changeAnchorPart/
	//Purpose : Change part of the URI anchor component
	//Arguments:
	//	*arg_map - the map describing what part of the URI anchor we want changed.
	//Rreturns : boolean
	//	* true - the Anchor portion of the URI was update
	//	* false - the Anchor portion of the URI could not be updated
	//Action : 
	//	The current anchor rep stored in stateMap.anchor_map.
	//	See uriAnchor for a discussion of encoding.
	//	This method
	//	*Create a copy of this map using copyAnchorMap().
	//	*Modifies the key-values using arg_map.
	//	*Manages the distinction between independent and dependent values in the encoding.
	//	*Attempts to change the URI using uriAnchor.
	//	*Return true on success, and false on failure.
	//
changeAnchorPart = function(arg_map){
	var
		anchor_map_revise = copyAnchorMap(),
		bool_return = true,
		key_name, key_name_dep;
	// Begin merge changes into anchor map
	KEYVAl:
	for (key_name in arg_map){
		if (arg_map.hasOwnProperty(key_name)) {
			//skip dependent keys during iteration
			if (key_name.indexOf('_')=== 0) {continue KEYVAl;}
			//update independent key value 
			anchor_map_revise[key_name] = arg_map[key_name];
		
			//update matching dependent key
			key_name_dep = '_' + key_name;
			if (arg_map[key_name_dep]) {
				anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
			}

		else{
			delete anchor_map_revise[key_name_dep];
			delete anchor_map_revise['_S' + key_name_dep];
		}
	}
}
//End merge changes into anchor map
//Begin attempt to update URI; revert if not successful
try{
	$.uriAnchor.setAnchor(anchor_map_revise);
}
catch(error){
	//replace URI with existing state
	$.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
	bool_return = false;
}
//End attempt to update URI...
return bool_return;
};
	//End DOM method /changeAnchorPart/
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
					jqueryMap.$chat.attr(
					'title',configMap.chat_extended_title);
				stateMap.is_chat_retracted = false;
					if(callback){callback(jqueryMap.$chat);}
				}
				);
			
			return true;
		}
		//end extend chat slider

		//begin retract chat slider
		jqueryMap.$chat.animate(
		{
			height : configMap.chat_retract_height
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
	//Begin Event handler /OnHashchange/
	//Purpose : Handles the hashchage event
	//Arguements : 
	//	*event - jQuery event object.
	//Settings : none
	//Returns  : false 
	//Action   :
	//	*Parse the URI anchor component 
	//	*Compares proposed application state with current
	//	*adjust the application only where proposed state
	//	differs from existing
	//
	onHashchange = function(event) {
		var
			anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed,
			s_chat_proposed;
		// attempt to parse anchor
		try{anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
		catch(error){
			$.uriAnchor.setAnchor(anchor_map_previous,null,true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;
		//convenience vars
		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;
		//Begin adjust chat component if changed
		if(!anchor_map_previous || _s_chat_previous !==_s_chat_proposed){
			s_chat_proposed = anchor_map_proposed.chat;
			switch(_s_chat_proposed){
				case 'open' :
				  toggleChat(true);
				break;
				case 'closed' :
				  toggleChat(false);
				break;
				default :
				  toggleChat(false);
				  delete anchor_map_proposed.chat;
				  $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}
		//End adjust chat component if changed
		return false;
	}
	//End Event handler /onHashchage/
	//Begin Event handler /onClickChat/


	onClickChat = function(event){
		
			changeAnchorPart({
				chat : (stateMap.is_chat_retracted ? 'open' : 'closed')
			});
		
		return false;
	};
	//End Event handler //onClickChat/

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
		//configure uriAnchor to use our schema
		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		});
		//configure and initialize feature modules
		spa.chat.configModule({});
		spa.chat.initModule(jqueryMap.$chat);
		//Handle URI anchor change events.
		//This is done /after/ all feature modules are configured
		//and initialized, otherwise they will not be ready tp handle the trigger event,
		//which is used to ensure the anchor is considered on-load
		//
		$(window)
		.bind('hashchange', onHashchange)
		.trigger('hashchange');
		
	};
	//end public method /initModule/	
	return {initModule:initModule};
	//-----------end public methods----------------

}());