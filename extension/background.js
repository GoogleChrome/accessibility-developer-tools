var inspectedTabs = [];

function injectContentScript(tabId, opt_callback) {
    chrome.tabs.executeScript(
        tabId,
        { file: 'generated_accessibility.js' },
        function() {
            if (chrome.extension.lastError) {
                if (opt_callback)
                    callback({ error: chrome.extension.lastError.message });
                return;
            }
            if (opt_callback)
                callback();
        });
};

chrome.extension.onRequest.addListener(
    function(request, sender, callback) {
        var tabId = request.tabId;
        injectContentScript(tabId, callback);
        if (inspectedTabs.indexOf(tabId) == -1) {
            chrome.webNavigation.onCommitted.addListener(
                function(details) {
                    if (details.tabId == tabId && details.frameId == 0) {
                        injectContentScript(tabId);
                    }
                });
            inspectedTabs.push(tabId);
        }
});
