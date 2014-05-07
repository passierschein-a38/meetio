function Application( peer_name ){		
	this.session = 0;
	this.pc = 0;
	this.local_media_track = 0; 
	this.peer_name = peer_name;
	this.is_caller = 0;
	
}

Application.prototype.session = 0;
Application.prototype.pc = 0;
Application.prototype.local_media_track = 0;
Application.prototype.peer_name = 0;
Application.prototype.is_caller = 0;

Application.prototype.run = function( session_id ){	

	var fb_session_root = new Firebase( 'https://' + env_fb_db + '.firebaseio.com/sessions/' );

	//-- check if session already exists
	fb_session_root.child( session_id ).once( 'value', function( snapshot ) {
	
		g_app.is_caller = ( snapshot.val() == null );	
		trackEvent( 'getUserMedia', 'before', g_app.peer_name );
		
		var pc_media_options = {
				audio: true,
				video: true
		};
		
		getUserMedia(pc_media_options, function (stream) {	
			trackEvent( 'getUserMedia', 'after - success', stream.id );			
			
			//prepare peer connection
			g_app.local_media_track = stream;
			g_app.pc = new PeerConnection( g_app.peer_name );	
			g_app.pc.addStream( stream );		
			
			g_app.session   = new Session( session_id , g_app.pc );					
			g_app.session.join( g_app.peer_name , g_app.is_caller );		
			
			var video = document.getElementById("local_video_stream");
			video.src = URL.createObjectURL(stream);			
			
		}, function( error ) {		
			trackEvent( 'getUserMedia', 'after - failed: ' + error.name, g_app.pc.getPeerName() );		
		});		
	});
}

Application.prototype.recyclePeerConnection = function(){

	//remove local media stream
	this.pc.removeStream( this.local_media_track );
	
	this.pc = new PeerConnection( g_app.peer_name );	
	g_app.pc.addStream( this.local_media_track );		
}

Application.prototype.stop = function(){	
	this.session.leave();	
	this.pc.close();
	this.pc = 0;
	this.session = 0;
}