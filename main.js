(function(window, document)
{
	'use strict';
	
	var pbjs = pbjs || {};
	pbjs.que = pbjs.que || [];

	var googletag = googletag || {};
	googletag.cmd = googletag.cmd || [];

	var iterator = 0;

	window.refreshBid = function(element)
	{
		var config = [{
			// first ad unit config
			component: 'ad-slot-1',
			dfp_code: '/19968336/header-bid-tag-1',
			sizes:  [300, 250],
			bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13144370
        }
    }]
		}];

		var container = document.getElementById( element.getAttribute('rel') );
		
		googletag.cmd.push( function()
		{
      
      var slots = [];
			
			config.forEach( function( config_item, index )
			{
				var component_name = config_item.component;
				// get that custom element
				var component = container.getElementsByName(component_name)[0];
				
				// generate new DFP ID
				var new_ad_slot_id = 'div-gpt-ad-' + component_name + '-' + iterator;
				component.setAttribute('id', new_ad_slot_id);
				
				// store DFP ID on pbjs config
				config[index].code = new_ad_slot_id;
				
				// define GPT slot
				var new_dfp_slot = googletag.defineSlot( config_item.dfp_code, config_item.sizes, new_ad_slot_id ).addService(googletag.pubads());
				// assuming you have initial load disabled - display() is required for initialization - otherwise this needs to be moved below in bidsBackHandler and refresh() removed
				googletag.display( new_ad_slot_id );
				
				// store it for later reference on auction callback
				slots.push( new_dfp_slot );
			});
			
			pbjs.que.push( function()
			{
				pbjs.addAdUnits( config );

				// get newly generated IDs - or you can store them in array above of course
				var slotCodes = slots
					.map( function( slot ) { return slot.getSlotElementId() || ''; } )
					.filter( function( id ) { return id; } );

				// run auction only for newly generated DFP IDs
				pbjs.requestBids({
					adUnitCodes: slotCodes,
					bidsBackHandler: function( bidResponses )
					{
						pbjs.setTargetingForGPTAsync( slotCodes );
						googletag.pubads().refresh( slots );
					}
         } );
			});

      //
		});
		iterator++;
	};
	
	// wait for DOM to load - and launch first non-ajax auction
	
	document.addEventListener("DOMContentLoaded", function(event)
	{
		refreshBid( document.getElementById('content') );
	} );
  
})(window, document);



