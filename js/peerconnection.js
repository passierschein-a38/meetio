function PeerConnection( peer_name ){	

	var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};	
    	
	this.pc = new RTCPeerConnection(pc_config);	
	
	this.pc.onicecandidate = this.onIceCandidate;
	this.pc.onaddstream    = this.onRemoteStreamAdded;
	this.pc.onremovestream = this.onRemoteStreamRemoved;
		
	this.local_media_stream = 0;	
	this.remote_media_stream = 0;
	this.pc_name = peer_name;
	this.ice_cache = [];
	
	this.pc_constraints = {
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true
		}
	};
}

PeerConnection.prototype.pc = 0;
PeerConnection.prototype.local_media_track = 0;
PeerConnection.prototype.remote_media_stream = 0;
PeerConnection.prototype.ice_cache = [];
PeerConnection.prototype.pc_name = 0;
PeerConnection.prototype.pc_constraints = 0;


PeerConnection.prototype.onIceCandidate = function( event ){	

	if( event.candidate === null ){		
		return;
	}

	g_app.pc.ice_cache.push( JSON.stringify( event.candidate ) );
}

PeerConnection.prototype.onRemoteStreamAdded = function( event ){
	
	g_app.pc.remote_media_stream = event.stream;
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = URL.createObjectURL(event.stream);
	remote_video.hidden=false;			
}

PeerConnection.prototype.onRemoteStreamRemoved = function( event ){	
	
	if( event.stream.id != g_app.pc.remote_media_stream.id ){
		return;
	}
	
	var remote_video = document.getElementById("remote_video_stream");
	remote_video.src = 0;
	remote_video.hidden=true;	
	g_app.pc.remote_media_stream = 0;
}

PeerConnection.prototype.addStream = function( stream ){		
	this.pc.addStream( stream );
}

PeerConnection.prototype.removeStream = function( stream ){		

	if( webrtcDetectedBrowser == "firefox" ){
		//not yet implemented
		return;
	}

	this.pc.removeStream( stream );
}

PeerConnection.prototype.close = function(){		
	this.pc.close();
}

PeerConnection.prototype.setRemoteDescription = function( desc ){		
	this.pc.setRemoteDescription( desc );
}

PeerConnection.prototype.setLocalDescription = function( desc ){		
	this.pc.setLocalDescription( desc );
}

PeerConnection.prototype.addIceCandidate = function( ice ){		
	this.pc.addIceCandidate( ice );
}

PeerConnection.prototype.createOffer = function( success, error, constraints ){		
	this.pc.createOffer( success, error, constraints );
}

PeerConnection.prototype.createAnswer = function( success, error, constraints ){		
	this.pc.createAnswer( success, error, constraints );
}

PeerConnection.prototype.getIceAsJSON = function(){		
	return JSON.stringify( this.ice_cache );
}

PeerConnection.prototype.clearIceCache = function(){		
	this.ice_cache = [];
}

PeerConnection.prototype.getPeerName = function(){		
	return this.pc_name;
}