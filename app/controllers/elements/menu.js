init();
function init() {
  	var items = [
  		{ properties: { itemId: 'elements/page' }, title: { text: 'Test page' }, icon: { image: '/images/menu/timeline.png' } },
  	];
  	
  	$.lvMenu.sections = [ Ti.UI.createListSection({ items: items }) ];
}
exports.reload = init;

/*
 params = {
 	index: 0,
 	title: ''
 }
 * */
exports.update = function(params) {
	var section = $.lvMenu.sections[0],
		item = section.getItemAt( params.index );
	
	if (params.title) {
		item.title.text = params.title;
	}
		
	section.updateItemAt(params.index, item, { animated: false });	
};

function menuClick(e) {
	var url = e.itemId;
	
	switch (url) {
		// case 'newsletter':
			// Ti.Platform.openURL('http://www.australianfrequentflyer.com.au/aff-gazette/');
			// Alloy.Globals.UI.toggleLeftWindow();
			// break;
			
		default:
			var item = e.section.getItemAt(e.itemIndex),
				data = {
		  			title:  item.title.text,
		  			url: 	url
		  		};
		  	Alloy.Globals.UI.setCenterWindow(data);
			break;		
	}
}
