
//incomming offer via firebase
function handle_fb_offer( snapshot )
{	
	if( snapshot.val() === null ){
		return;
	}
	
	var obj = JSON.parse( snapshot.val() );
	
	//get the peer id e.g. sender of the offer
	console.log( 'handle_fb_offer: from: ' + obj.from_user );
	g_peerid = obj.from_user;
	
	//send anwser
	var desc = new RTCSessionDescription( obj );
	createAwnser( obj.from_user, desc);
	
	//after that we are ready to listen to ice
	var fb_ice = fb_user.child( 'ice' );
	fb_ice.on( 'child_added', handle_fb_icecandiate );
	
}
//incomming awnser from an offer
function handle_fb_awnser( snapshot )
{  
  if( snapshot.val() === null ){
	return;
  }
  
  var obj = JSON.parse( snapshot.val() );  
  console.log( 'got awnser from ' + obj.from_user );  
  var desc = new RTCSessionDescription( obj );
  pc.setRemoteDescription( desc );  
  
  //after that we are ready to listen to ice
  var fb_ice = fb_user.child( 'ice' );
  fb_ice.on( 'child_added', handle_fb_icecandiate );
}

function handle_fb_icecandiate( snapshot )
{

  if( snapshot.val() === null ){
	return;
  }

  if( g_ice ) {	
	return;
  }
  
  console.log( 'add ice candidate: ' + pc.signalingState );
 
  var obj = JSON.parse( snapshot.val() );    
  var ice = new RTCIceCandidate( obj.candidate );
  pc.addIceCandidate( ice );
  g_ice = 1;
}

function createFireBaseSession()
{
	var fb_session = new Firebase('https://sizzling-fire-7348.firebaseio.com/session/shopwerkstatt/');
	return fb_session;
}

function createFireBaseUser( session, id )
{
	var fb_user = session.child( id );
	fb_user.child( 'starttime' ).set( Date.now() );
	fb_user.onDisconnect().remove();
		
	//listen to offers
	var fb_offers = fb_user.child( 'offer' );
	fb_offers.on( 'value', handle_fb_offer );
	
	var fb_awnsers = fb_user.child( 'awnser' );
	fb_awnsers.on( 'value', handle_fb_awnser );
			
	return fb_user;
}

