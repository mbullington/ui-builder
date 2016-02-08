var suite = new (require('benchmark').Suite);

var R = require('./react/core.js')({
  createElement: function() {
  }
}).R;

suite.add('R', function() {
  R("hello world")("one", 1).prop("two", 2).style("three", 3).child("hello world")("four", 4).build()
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run({ 'async': true });
