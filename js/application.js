function Application( peer_name ){		
	this.session = 0;
	this.pc = new PeerConnection( peer_name );	
}

Application.prototype.session = 0;
Application.prototype.pc = 0;

Application.prototype.run = function( session_id ){	
	this.session   = new Session( session_id , this.pc );		
	this.session.start();
}

Application.prototype.stop = function(){	
	this.session.leave();	
}