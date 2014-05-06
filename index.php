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

var fb_key = 'sizzling-fire-7348'; //dev - production over heroku
var base_url = 'http://localhost/meetio/';
<?php
if( isset( $_ENV['FIREBASE'] ) ){
	echo sprintf( "fb_key='%s'", $_ENV['FIREBASE'] );
}

if( isset( $_ENV['BASE_URL'] ) ){
	echo sprintf( "base_url='%s'", $_ENV['base_url'] );
}

?>

var fb = new Firebase( 'https://' + fb_key + '.firebaseio.com/sessions/' );		

fb.child( window.location.search ).once( 'value', function( snapshot ) {
	
	//session does not exists
	if( snapshot.val() === null ){
		window.location.href = base_url + 'caller.html' + window.location.search;
	}else{
		window.location.href = base_url + 'callee.html' + window.location.search;
	}
});
</script>
<?php
if( isset( $_ENV['PRODUCTION'] ) ){
	echo '<script type=\'text/javascript\' src=\'ga.js\'></script>';
}
?>	
</body>
</html>