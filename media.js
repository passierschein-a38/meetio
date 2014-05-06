var pc_console_handler = function (err) {
    console.error(err);
};

var pc_constraints = {
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }
};

var pc_media_options = {
    video: true,
    audio: true
};

function onIceCandidate( event )
{
	if( event.candidate === null ){		
		return;
	}

	g_iceCache.push( JSON.stringify( event.candidate ) );
}