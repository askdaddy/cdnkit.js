/**
 * Created by seven on 15/6/21.
 */

module.exports.RTCSessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription;
module.exports.RTCPeerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
module.exports.RTCIceCandidate = window.RTCIceCandidate ||
    window.mozRTCIceCandidate;

//module.exports.getUserMedia = navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);