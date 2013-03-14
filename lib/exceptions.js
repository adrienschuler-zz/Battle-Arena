process.on('uncaughtException', function(err) {
  console.log('====================');
  console.log('ERROR');

  if (err.message) {
    console.log('Message: ' + err.message);
  }

  if (err.stack) {
    console.log('Stacktrace:');
    console.log('====================');
    console.log(err.stack);
  }
});

process.addListener('uncaughtException', function (err) {
  console.error('uncaughtException: ' + err, err);
  //process.exit(1); -- not exiting for now.
});
