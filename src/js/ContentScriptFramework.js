auditResultElements = {};
lastElementId = 0;
convertElementToResult = function(element) {
    var elementId = '' + lastElementId++;
    auditResultElements[elementId] = element;
    return elementId;
}

getResultElement = function(elementId) {
    var resultElement = auditResultElements[elementId];
    delete auditResultElements[elementId];
    return resultElement;
}
