<html>
<head>
<title>Meetio - Easy Simple Online Meeting</title>
<script type='text/javascript' src='https://cdn.firebase.com/js/client/1.0.11/firebase.js'></script>
<script type='text/javascript' src='js/config.php'></script>
<script type='text/javascript' src='js/functions.js'></script>
<script type='text/javascript' src='js/firebase.js'></script>
</head>
<body>

<script type="text/javascript">		
if( !window.location.search.length ){		
	window.location.search = guid();
}
</script>

<script>
var fb = createFireBaseSession();		

fb.child( window.location.search ).once( 'value', function( snapshot ) {
	
	//session does not exists
	if( snapshot.val() === null ){
		window.location.href = env_base_url + 'caller.php' + window.location.search;
	}else{
		window.location.href = env_base_url + 'callee.php' + window.location.search;
	}
});
</script>

<?php
include 'ga.php';
?>

</body>
</html>