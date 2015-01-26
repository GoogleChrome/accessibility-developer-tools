module("Audio");

test("Audio has no controls attribute.", function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  fixture.innerHTML = "<audio src=\"http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg\" autoplay></audio>";
  var audio = document.querySelector('audio');
  audio.addEventListener('canplay', function() {
    deepEqual(
        axs.AuditRules.getRule('audioWithoutControls').run({ scope: fixture }),
        { elements: [ audio ], result: axs.constants.AuditResult.FAIL }
    );
  })
});