<?php
//Generate a javascript config file

//-- firebase database
$env_fb_db 		= isset( $_ENV['FIREBASE'] ) ? $_ENV['FIREBASE'] 	: 'sizzling-fire-7348';

//-- base url
$env_base_url 	= isset( $_ENV['BASE_URL'] ) ? $_ENV['BASE_URL'] 	: 'http://localhost/meetio/';

//-- use google analytics
$env_use_ga		= isset( $_ENV['USE_GA'] )   ? $_ENV['USE_GA'] 		: '0';

$tmpl = "var env_fb_db='%s';
		 var env_base_url='%s';
		 var env_use_ga='%s';";
		 
echo  sprintf( $tmpl, 	$env_fb_db,
						$env_base_url,
						$env_use_ga	 );						
?>							