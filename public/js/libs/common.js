﻿//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
console.log('comon.js load');
requirejs.config({
	//这个设置是基于引用comon.js的页面来设置的.
    baseUrl: '/js/lib',
	//基于baseUrl
    paths: {
        app: '../app',
		jquery:'jquery-1.9.1.min',
		flotr_lib:'./flotr_lib',
		flotr:'./flotr_lib/flotr2.amd',
		bean:'./flotr_lib/bean',
		IScroll:'./iscroll/iscroll-probe',
		IScrollLoadData:'./iscroll/iscroll-load-data'
    },
	
	//shim的key 先在paths配置中找,如果没有的话,再以baseUrl指定目录下去找
    shim: {
        backbone: {
			//deps属性相当于require([])命令的第一个参数,指定所依赖的模块,
			//require([])参数路径规则:
			//1.  以./,../打头的总是参照baseUrl去找,
			//2.  直接路径开头的,先在paths配置中找,如果没有的话再以baseUrl为基准去找
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        
		'underscore':{
		    exports: '_'
		}
    }
	
});
