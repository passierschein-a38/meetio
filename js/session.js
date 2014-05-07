function Session( session_id ){	
	
	trackEvent( 'session', 'create', session_id );	
	
	this.session_id = session_id		
	this.local_user_id = 0;		
	var fb = new Firebase( 'https://' + env_fb_db + '.firebaseio.com/sessions/' );
	this.fb_session = fb.child( this.session_id );	
	
	this.from_hack = 0;
	this.to_hack = 0;
}

Session.prototype.session_id = 0;
Session.prototype.isCaller 	 = 0;
Session.prototype.fb_session = 0;

Session.prototype.from_hack = 0;
Session.prototype.to_hack = 0;

Session.prototype.join = function( user_id, is_caller ){	

	this.local_user_id = user_id;

	trackEvent( 'session', 'join', this.local_user_id + ' isCaller: ' + is_caller );	
		
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

	trackEvent( 'session', 'leave', this.local_user_id );	
	
	//-- unreigster our user
	this.fb_session.child('user').child( this.local_user_id ).remove();	
}

//-- as a callee we got an offer from an caller, respond to it
Session.prototype.fb_offerEvent = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var offer = JSON.parse( snapshot.val() );
	g_app.session.from_hack = offer.from;
	
	trackEvent( 'session', 'received-offer', g_app.session.from_hack );	
	
	g_app.pc.setRemoteDescription( new RTCSessionDescription( offer.desc ) );

	g_app.pc.createAnswer( function( answer ) {	  
	
		trackEvent( 'session', 'send-answer', g_app.session.from_hack );
	
        g_app.pc.setLocalDescription(answer);
		
		var a = new Object();
		a.answer = answer;
		a.from   = g_app.session.local_user_id;
		
		var json = JSON.stringify(a);			
		
		g_app.session.fb_session.child( 'user' ).child( g_app.session.from_hack ).child( 'answer' ).set( json );					
		g_app.session.fb_session.child( 'user' ).child( g_app.session.from_hack ).child( 'answer' ).onDisconnect().remove();
    }, pc_console_handler, pc_constraints );
}

//-- as a callee we got an offer from an caller, respond to it
Session.prototype.fb_ice_event = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var from = snapshot.name();
	var arr  = JSON.parse( snapshot.val() ); 
	
	trackEvent( 'session', 'received-ice', from ); 
	
	for ( var i = 0; i < arr.length; i = i + 1 ) {
			var ice = new RTCIceCandidate ( JSON.parse( arr[ i ] ) );
			g_app.pc.addIceCandidate( ice );
	}	
	
	g_app.session.fb_session.child( 'user' ).child( from ).child( 'ice' ).child( g_app.session.local_user_id ).set( g_app.pc.getIceAsJSON() );					
}

//-- as a caller we receive an event that a calle has joined
Session.prototype.fb_joinEvent = function( snapshot ){	

	if( snapshot.name() === g_app.session.local_user_id ){
		return;
	}
	
	if( snapshot.val() === null ){
		return;
	}

	trackEvent( 'session', 'join', snapshot.name() ); 	
		
	g_app.session.create_and_send_offer( snapshot.name() );	
}

//-- as a caller we receive an event that a calle has left
Session.prototype.fb_leaveEvent = function( snapshot ){	

	if( snapshot.name() === g_app.session.local_user_id ){
		return;
	}
	
	trackEvent( 'session', 'leave', snapshot.name() ); 
	
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = 0;
	remote_video.hidden=true;
	
	g_app.session.fb_session.child('user').child( g_app.session.local_user_id  ).child( 'ice').remove();	
	
	g_app.recyclePeerConnection();	
}

Session.prototype.fb_answerEvent = function( snapshot ){	

	if( snapshot.val() === null ){
		return;
	}
	
	var answer = JSON.parse( snapshot.val() );
			
	trackEvent( 'session', 'received-answer', answer.from ); 
	
	g_app.pc.setRemoteDescription( new RTCSessionDescription( answer.answer ) );
	
	trackEvent( 'session', 'send-ice', g_app.session.to_hack ); 
	
	//-- now we publish our ice candidates
	g_app.session.fb_session.child( 'user' ).child( answer.from ).child( 'ice' ).child( g_app.session.local_user_id ).set( g_app.pc.getIceAsJSON()  );				
}

//-- as a caller we create and send offers
Session.prototype.create_and_send_offer = function( to ){	

	trackEvent( 'session', 'send-offer', to ); 

	g_app.session.to_hack = to;
	
	//clear last ice cache
	g_app.pc.clearIceCache();
	
	g_app.pc.createOffer( function (sessionDescription) {				
		
		g_app.pc.setLocalDescription(sessionDescription);

		var offer = new Object();
		offer.desc = sessionDescription;
		offer.from = g_app.session.local_user_id;		
		var json = JSON.stringify( offer );		
		
		g_app.session.fb_session.child( 'user' ).child( g_app.session.to_hack ).child( 'offer' ).set( json );		
		
	}, pc_console_handler, pc_constraints );	
}
