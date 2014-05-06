<html>
<head>
<title>WEBRTC SAMPLE VIDEO</title>
<script type='text/javascript' src='https://cdn.firebase.com/js/client/1.0.11/firebase.js'></script>
<script type='text/javascript' src='functions.js'></script>
</head>
<body>
<script type="text/javascript">		
if( !window.location.search.length ){		
	window.location.search = guid();
}
</script>


<script>
var fb = new Firebase( 'https://sizzling-fire-7348.firebaseio.com/sessions/' );		

fb.child( window.location.search ).once( 'value', function( snapshot ) {

	//session does not exists
	if( snapshot.val() === null ){
		window.location.href = 'http://localhost/webrtc/multi_fastsupport/caller.html' + window.location.search;
	}else{
		window.location.href = 'http://localhost/webrtc/multi_fastsupport/callee.html' + window.location.search;
	}
});

</script>
	
</body>
</html>