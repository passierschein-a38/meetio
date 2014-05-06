function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function trackEvent( cat, key, val )
{
	ga( 'send', 'event', cat, key, val ); 
}

var hack_currentRemoteStreamId=0;

function onRemoteStreamRemoved ( stream )
{
	if( stream.stream.id != hack_currentRemoteStreamId ){
		return;
	}

	console.log( 'onRemoteStreamRemoved ' + stream.stream.id );
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = 0;
	remote_video.hidden=true;
}

function onRemoteStreamAdded( stream )
{
	console.log( 'onRemoteStreamAdded' + stream.stream.id );
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = URL.createObjectURL(stream.stream);
	remote_video.hidden=false;	
	hack_currentRemoteStreamId = stream.stream.id;
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