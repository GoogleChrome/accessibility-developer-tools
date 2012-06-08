var auditResultElements = {};
var lastElementId = 0;
function convertElementToResult(element) {
    var elementId = '' + lastElementId++;
    auditResultElements[elementId] = element;
    return elementId;
}

function getResultElement(elementId) {
    var resultElement = auditResultElements[elementId];
    delete auditResultElements[elementId];
    return resultElement;
}
