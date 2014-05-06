<html>
<head>
<title>Meetio - Easy Simple Online Meeting</title>
<script type='text/javascript' src='http://code.jquery.com/jquery-latest.min.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/js/client/1.0.11/firebase.js'></script>
<script type='text/javascript' src='js/config.php'></script>
<script type='text/javascript' src='js/adapter.js'></script>
<script type='text/javascript' src='js/firebase.js'></script>
<script type='text/javascript' src='js/functions.js'></script>
<script type='text/javascript' src='js/media.js'></script>
<script type='text/javascript' src='js/session.js'></script>
</head>
<body>
<script type="text/javascript">
	
if( !window.location.search.length ){		
		window.location.search = guid();
		return;
}

var g_local_id  = guid();
var g_iceCache  = [];
var g_peer_connection = createPeerConnection();
var g_session   = new Session( window.location.search, g_peer_connection );	

getUserMedia(pc_media_options, function (stream) {

		var video = document.getElementById("local_video_stream");
		video.src = URL.createObjectURL(stream);
		g_peer_connection.addStream( stream );		

		//ready to join session, all media is setup		
		g_session.join( g_local_id, true );
		
	}, pc_console_handler);

</script>	

	<div id="local_video">
		<video id="local_video_stream" controls  autoplay></video>
	</div>

	<div id="remote_video">
		<video id="remote_video_stream" controls  autoplay></video>
	</div>

<?php
include 'ga.php';
?>
	
</body>
</html>