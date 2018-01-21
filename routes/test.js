var IOTA = require("iota.lib.js");
var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14700
});

iota.api.getNodeInfo(function(err, res) {
  console.log(res);
});
