/**
 * Created by seven on 15/7/13.
 */
// require the module
var Hashes = require('jshashes')
// sample string
var str = 'This is a sample text!'
// new SHA1 instance and base64 string encoding
var SHA1 = new Hashes.SHA1().b64(str)
// output to console
console.log('SHA1: ' + SHA1)