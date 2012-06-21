chrome.extension.onRequest.addListener(function(request, sender, callback) {
    var tabId = request.tabId;
    chrome.tabs.executeScript(tabId, { file: 'generated_accessibility.js' }, function() {
        if (chrome.extension.lastError) {
            callback({ error: chrome.extension.lastError.message });
            return;
        }
        callback();
    });
});
