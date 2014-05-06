
function Session( id, pc ){	
	console.log( 'Session:: create new: ' + id );	
	
	this.pc = pc;
	this.session_id = id;		
	this.local_user_id = id;		
	var fb = createFireBaseSession();
	this.fb_session = fb.child( this.session_id );			
}

Session.prototype.pc = 0;
Session.prototype.session_id = 0;
Session.prototype.isCaller 	 = 0;
Session.prototype.users 	 = [];
Session.prototype.fb_session = 0;

Session.prototype.join = function( user_id, is_caller ){	

	this.local_user_id = user_id;

	console.log( 'Session::join: ' + this.local_user_id );	
	
	//-- register our user
	this.fb_session.child('user').child( this.local_user_id ).child( 'starttime' ).set( Date.now() );
	this.fb_session.child('user').child( this.local_user_id ).onDisconnect().remove();
	this.fb_session.child('user').child( this.local_user_id  ).child( 'ice').on( 'child_added', this.fb_ice_event );	
	
	//-- try to be caller
	if( is_caller ){
		this.fb_session.child( 'caller' ).set( this.local_user_id );		
		this.fb_session.child( 'caller' ).onDisconnect().remove();		
		this.fb_session.onDisconnect().remove();
		//--liste for joins
		this.fb_session.child('user').on( 'child_added', this.fb_joinEvent );	
		this.fb_session.child('user').on( 'child_removed', this.fb_leaveEvent );			
		this.fb_session.child('user').child( this.local_user_id  ).child( 'answer').on( 'value', this.fb_answerEvent );			
	}else{
	
		this.fb_session.child('user').child( this.local_user_id ).child( 'offer' ).on( 'value', this.fb_offerEvent );	
	
	}
}

Session.prototype.leave = function(){	
	console.log( 'Session::leave: ' + this.local_user_id );	
	
	//-- unreigster our user
	this.fb_session.child('user').child( this.local_user_id ).remove();	
}

var fromHack;

//-- as a callee we got an offer from an caller, respond to it
Session.prototype.fb_offerEvent = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var dirtyObj = JSON.parse( snapshot.val() );
	fromHack = dirtyObj.from_user;
	g_session.pc.setRemoteDescription( new RTCSessionDescription( dirtyObj ) );

	g_session.pc.createAnswer( function( answer ) {	  
        g_session.pc.setLocalDescription(answer);
		answer.from_user = g_session.local_user_id;
		var json = JSON.stringify(answer);		
		g_session.fb_session.child( 'user' ).child( fromHack ).child( 'answer' ).set( json );					
    }, pc_console_handler, pc_constraints );
}

//-- as a callee we got an offer from an caller, respond to it
Session.prototype.fb_ice_event = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var from = snapshot.name();
	var arr  = JSON.parse( snapshot.val() ); 
	
	for ( var i = 0; i < arr.length; i = i + 1 ) {
			var ice = new RTCIceCandidate ( JSON.parse( arr[ i ] ) );
			g_session.pc.addIceCandidate( ice );
	}	
	
	g_session.fb_session.child( 'user' ).child( from ).child( 'ice' ).child( g_session.local_user_id ).set( JSON.stringify( g_iceCache ) );					
}

//-- as a caller we receive an event that a calle has joined
Session.prototype.fb_joinEvent = function( snapshot ){	

	if( snapshot.name() === g_session.local_user_id ){
		return;
	}
	
	if( snapshot.val() === null ){
		return;
	}
	
	g_session.create_and_send_offer( snapshot.name() );	
}

//-- as a caller we receive an event that a calle has joined
Session.prototype.fb_leaveEvent = function( snapshot ){	

	if( snapshot.name() === g_session.local_user_id ){
		return;
	}
	
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = 0;
	remote_video.hidden=true;
}

var toHack;

Session.prototype.fb_answerEvent = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var obj = JSON.parse( snapshot.val() );
	var from = obj.from_user;
	
	g_session.pc.setRemoteDescription( new RTCSessionDescription( obj ) );
	
	//-- now we publish our ice candidates
	g_session.fb_session.child( 'user' ).child( from ).child( 'ice' ).child( g_session.local_user_id ).set( JSON.stringify( g_iceCache ) );				
}

//-- as a caller we create and send offers
Session.prototype.create_and_send_offer = function( to ){	

	console.log( 'create and send offer to user' + to );
	toHack = to;
	
	g_session.pc.createOffer( function (sessionDescription) {				
		g_session.pc.setLocalDescription(sessionDescription);	
		sessionDescription.from_user = g_session.local_user_id;
		var json = JSON.stringify( sessionDescription );		
		g_session.fb_session.child( 'user' ).child( toHack ).child( 'offer' ).set( json );			
	}, pc_console_handler, pc_constraints );	
}
