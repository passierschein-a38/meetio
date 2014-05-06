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