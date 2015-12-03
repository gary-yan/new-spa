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
		+'<div class="spa-shell-modal"></div>'
		
	},
	stateMap ={$container :null},//将整个模块中共享的动态信息放在stateMap变量中
	jqueryMap ={},//将jquery集合缓存在jqueryMap中
	setJqueryMap ,initModule;//jquery的用途是大大减少jquery对文档遍历次数，可以提高性能

	//----------end module scope variables--------------
	//----------begin utility methods-------------保留区块 这些函数不和页面元素交互
	//----------end utility methods-----------------
	//----------begin dom methods-----------------将创建和操作页面元素的函数放在dom method 中
	//begin dom method /setJqueryMap/
	setJqueryMap = function(){
		var $container = stateMap.$container;
		jqueryMap = {$container : $container}; //??
	};
	//End DOM method /setJqueryMap/
	//---------end dom methods--------------
	//---------begin event handlers----------为jquery事件处理函数保留区块
	//---------begin public methods-------------放置公开方法
	//begin public method /initModule/
	initModule = function($container){
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();
	};
	//end public method /initModule/	
	return {initModule:initModule};
	//-----------end public methods----------------

}());