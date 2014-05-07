<?php
$session_id = uniqid();
$user_id 	= uniqid();
$env_base_url 	= isset( $_ENV['BASE_URL'] ) ? $_ENV['BASE_URL'] 	: 'http://localhost/meetio';
$env_run_url 	= isset( $_ENV['RUN_URL'] ) ? $_ENV['RUN_URL'] 	: 'http://localhost/meetio';

if( isset( $_REQUEST['q'] ) ){

	$params = explode( '/', $_REQUEST['q'] );
	
	if( isset( $params[0] ) ){
		$session_id = $params[0];
	}
	
	if( isset( $params[1] ) ){
		$user_id = $params[1];
	}	
}else{

	//build redirect
	$uri = sprintf( '%s/%s/%s', $env_run_url, $session_id, $user_id );
	header("Location: $uri");
	die;
}

require 'template.php';
?>