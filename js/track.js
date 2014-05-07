function trackEvent( cat, key, val ){
	ga( 'send', 'event', cat, key, val ); 
	
	if( window.console ){
			console.log( cat + ': ' + key + ' | ' + val );
	}
}

function generic_error_handler( error ){
	trackEvent( 'error', 'generic', JSON.stringify(error) );	
	
	if( window.console ){
		console.log( error );
	}	
}