/*
 args = {
 	title: 'window title',
 	url: 'window url',
 	params: OBJ
 }
 * */
var args = arguments[0],
	currentUrl,
	controller;

init();
function init() {
	menuLoad();
}

exports.init = function(cache) {
	menuInit(cache);
};

exports.cleanup = function(e) {
	menuCleanup();
};

exports.reload = function(e) {
	menuReload();
};

exports.unload = function() {
	menuUnload();
};

// exports.orientationchange = function(e) {
	// menuOrientationchange(e);
// };

// == MENU

/* TODO: download these widgets + modules
Widget: 
	https://github.com/FokkeZB/nl.fokkezb.drawer
Modules:
 	- iOS: https://github.com/viezel/NappDrawer
 	- Android: https://github.com/manumaticx/Ti.DrawerLayout
*/

exports.getView = function() {
    return $.drawer.window;
};

function menuLoad() {
  	if (OS_IOS) {
		// hack navigationWindow for window manager
		$.drawer.window.hasNavigationWindow = 'false';
	}
	
	Alloy.Globals.UI.updateNav = updateNav;
	Alloy.Globals.UI.setCenterWindow = setCenterWindow;
	Alloy.Globals.UI.toggleLeftWindow = toggleLeftWindow;
	
	setCenterWindow(args, false);
	setLeftWindow();
}

function menuInit(cache) {
  	if (OS_IOS) {
		// hack navigationWindow for window manager
		cache.navigationWindow = $.drawer.getCenterWindow();
	}
}

function menuCleanup(e) {
  	if (controller && controller.cleanup) {
		controller.cleanup(e);
	}
}

function menuReload(e) {
  	if (controller && controller.reload) {
		controller.reload(e);
	}
}

function menuUnload(e) {
  	if (controller) {
		controller.cleanup && controller.cleanup();
		controller.unload && controller.unload();
		controller = null;
	}
	// Alloy.Globals.UI.toggleLeftWindow = null;
	// Alloy.Globals.UI.setCenterWindow = null;
	// Alloy.Globals.UI.updateNav = null;
	// Alloy.Globals.UI.Menu = null;
}

function menuOrientationchange(e) {
  	if (controller && controller.orientationchange) {
		controller.orientationchange(e);
	}
}

function setLeftWindow() {
	var menu = Alloy.createController('elements/menu');
	
	Alloy.Globals.UI.Menu = {
		reloadMenu: menu.reload,
		updateMenu: menu.update
	};
	
	var left = $.UI.create(OS_IOS ? 'Window' : 'View', { classes: 'win' });
	left.add( menu.getView() );
	
	$.drawer.setLeftWindow(left);
}

function toggleLeftWindow(e) {
    $.drawer.toggleLeftWindow();
}

function setCenterWindow(params, hideDrawer) {
	if (hideDrawer !== false) {
		toggleLeftWindow();
	}
	
	if (currentUrl == params.url) { return; }
	
	menuUnload();
	
	controller = Alloy.createController(params.url, params.params);
	
	var center;
	if (OS_IOS) {
		var win = $.UI.create('Window', { classes: 'win' });
		win.add( controller.getView() );
		center = Ti.UI.iOS.createNavigationWindow({ window: win });
		
		// hack navigationWindow for window manager
		var cache = Alloy.Globals.WinManager.getCache(0); // page home
		cache && (cache.navigationWindow = center);
	} else {
		center = $.UI.create('View', { classes: 'win' });
		center.add( controller.getView() );
	}
	
	$.drawer.setCenterWindow(center);
	
	var nav = { title: params.title || '' };
	if (OS_ANDROID) { nav.rightNavButtons = []; }
	updateNav(nav);
	
  	controller.init && controller.init();
}

function updateNav(nav) {
	if (OS_IOS && (!nav.leftNavButton || !nav.leftNavButtons)) {
		nav.leftNavButtons = [{
			icon: '/images/menu.png',
			callback: toggleLeftWindow
		}];
	}
	
	var oNav = require('managers/nav');
	oNav.load((OS_IOS ? $.drawer.getCenterWindow() : $.drawer).window, nav);
}

