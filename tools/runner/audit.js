var page = require('webpage').create(),
    system = require('system'),
    url;

if (system.args.length !== 2) {
  console.log('Usage: phantomjs audit.js URL');
  phantom.exit();
} else {
  url = system.args[1];
  page.open(url, function (status) {
    if (status !== 'success') {
      console.log('Failed to load the page at ' +
        url +
        ". Status was: " +
        status
        );
      phantom.exit();
    } else {
      page.injectJs('../../gen/axs_testing.js');
      var report = page.evaluate(function() {
        var results = axs.Audit.run();
        return axs.Audit.createReport(results);
      });
      console.log(report);
      phantom.exit();
    }
  });
}
