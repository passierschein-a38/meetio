function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}



function onRemoteStreamRemoved ( stream )
{
	console.log( 'onRemoteStreamRemoved ' );
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = 0;
}

function onRemoteStreamAdded( stream )
{
	console.log( 'onRemoteStreamAdded' );
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = URL.createObjectURL(stream.stream);	
}

function onSignalingStateChanged( event )
{
	console.log( 'onsignalingstatechange' );
}

function onIceConnectionStateChanged( event )
{
	console.log( 'oniceconnectionstatechange' );
}

function onNegotiationneeded( event )
{
	console.log( 'onnegotiationneeded' );
}

function createPeerConnection()
{	
	var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};	
    var pc = new RTCPeerConnection(pc_config);
	
	pc.onicecandidate = onIceCandidate;
	pc.onaddstream = onRemoteStreamAdded;
	pc.onremovestream = onRemoteStreamRemoved;
	pc.onsignalingstatechange = onSignalingStateChanged;
    pc.oniceconnectionstatechange = onIceConnectionStateChanged;
	pc.onnegotiationneeded = onNegotiationneeded;
	
	return pc;
}
/*
function createOffer( pc )
{
	pc.createOffer( function (sessionDescription) {				
		pc.setLocalDescription(sessionDescription);			
		publishOffer( JSON.stringify( sessionDescription ) );
	}, pc_console_handler, pc_constraints );	
}

function createAnswer( pc )
{
	pc.createAnswer( function( answer ) {	  
        pc.setLocalDescription(answer);		
		var json = JSON.stringify(answer);		
		publishAwnser( json );
    }, pc_console_handler, pc_constraints );
}

function startVideo( pc )
{	
	getUserMedia(pc_media_options, function (stream) {
		var video = document.getElementById("local_video_stream");
		video.src = URL.createObjectURL(stream);
		pc.addStream( stream );		
	}, pc_console_handler);
}

function startVideo_Callee( pc )
{	
	getUserMedia(pc_media_options, function (stream) {
		var video = document.getElementById("local_video_stream");
		video.src = URL.createObjectURL(stream);
		pc.addStream( stream );	

		//-- wait for offers after video is ready
		g_fb_user.child( 'offer' ).on( 'value', function( snapshot ){	
			if( snapshot.val() === null ){
				return;
		}
	
		var desc = new RTCSessionDescription( JSON.parse( snapshot.val() ) );
		console.log( 'received offer: ' +  desc );
	
		peer_connection.setRemoteDescription( desc );
	
		console.log( 'send awnser' );
		createAnswer( peer_connection );	
	});

		
	}, pc_console_handler);
}

function createFireBaseUser( session, id )
{
	var fb_user = session.child( id );
	fb_user.child( 'starttime' ).set( Date.now() );
	fb_user.onDisconnect().remove();
	
	return fb_user;
}

function createFireBaseSession( id )
{
	var fb_session = new Firebase('https://sizzling-fire-7348.firebaseio.com/sessions/' + id );
	return fb_session;
}

function publishOffer( json )
{
	g_fb_session.child( g_remote_id ).child( 'offer' ).set( json );
}

function publishAwnser( json )
{
	g_fb_session.child( g_remote_id ).child( 'answer' ).set( json );
}

function publishIce()
{
	g_fb_session.child( g_remote_id ).child( 'ice' ).set( JSON.stringify( g_iceCache ) );	
}*/