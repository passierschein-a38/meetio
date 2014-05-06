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
	audio: true,
    video: true
};