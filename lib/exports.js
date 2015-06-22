/**
 * Created by seven on 15/6/21.
 */

window.RTCPeerConnection = require('./adapter').RTCPeerConnection;
window.RTCSessionDescription = require('./adapter').RTCSessionDescription;
window.RTCIceCandidate = require('./adapter').RTCIceCandidate;

window.DomActor = require('./dom');
window.CdnKit = require('./cdnkit');
window.util = require('./util');