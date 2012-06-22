var formatters = {
    'contrast-ratio': function(li, properties) {
        if (!('value' in properties)) {
            li.className = 'property hidden';
            return;
        }

        if ('alert' in properties)
            li.className = 'property warning';

        var valueDiv = document.getElementById('contrast-ratio-value');
        var value = properties.value;
        valueDiv.innerText = value;
        if ('background-color' in properties && 'foreground-color' in properties) {
            var bevelElement = document.getElementById('contrast-ratio-bevel');
            bevelElement.style.setProperty('border-right-color', properties['background-color']);
            bevelElement.style.setProperty('border-top-color', properties['foreground-color']);
        }
    },

    'no-label': function(li, value) {
        li.className = 'property warning';
    },

    'aria-label': function(li, value) {
        formatters.standardString(li, 'aria-label', value);
    },

    'aria-labelledby': function(li, value) {
        formatters.standardElement(li, 'aria-labelledby', value);
    },

    'label-for': function(li, value) {
        formatters.standardElement(li, 'label-for', value);
    },

    'label-wrapped': function(li, value) {
        formatters.standardElement(li, 'label-wrapped', value);
    },

    'alt': function(li, value) {
        formatters.standardString(li, 'alt', value);
    },

    'title': function(li, value) {
        formatters.standardString(li, 'title', value);
    },

    'role': function(li, value) {
        formatters.standardString(li, 'role', value);
    },

    'caption-tracks': function(li, value) {
        formatters.tracks(li, value, 'caption');
    },

    'description-tracks': function(li, value) {
        formatters.tracks(li, value, 'description');
    },

    'chapter-tracks': function(li, value) {
         formatters.tracks(li, value, 'chapter');
    },

    tracks: function(li, value, kind) {
        var ul = document.getElementById(kind + '-tracks-value-list');
        var span = document.getElementById(kind + '-tracks-none-value');
        if (typeof value == 'string') {
            ul.className = 'hidden';
            span.className = '';
            formatters.standard(li, kind + '-tracks-none', value);
            return;
        }
        ul.className = 'properties';
        ul.innerHTML = '';
        span.className = 'hidden';
        for (var i = 0; i < value.length; i++) {
            var track = value[i];
            var li = document.createElement('li');
            li.className = 'property';
            var label = document.createElement('span');
            label.className = 'property';
            var labelText = '';
            if (track['label'])
                labelText += track['label'];
            if (track['srclang']) {
                if (labelText.length > 0)
                    labelText += ' ';
                labelText += '(' + track['srclang'] + ')';
            }
            if (labelText.length == 0)
                labelText = '[unnamed]'
            label.textContent = labelText;
            li.appendChild(label);
            li.appendChild(document.createTextNode(': '));
            var src = document.createElement('span');
            if (track['src'])
                src.innerText = track['src'];
            else {
                li.className = 'property warning';
                src.innerHTML = 'No <code>src</code> provided';
            }
            li.appendChild(src);
            ul.appendChild(li);
        }
    },

    'fallback-content': function(li, value) {
        var div = document.getElementById('fallback-content-value');
        var span = document.getElementById('fallback-content-none-value');
        if (value.lastIndexOf('!', 0) === 0) {
            div.className = 'hidden';
            span.className = '';
            formatters.standard(li, 'fallback-content-none', value.substring(1));
            return;
        }
        div.className = '';
        span.className = 'hidden';
        document.getElementById('fallback-content-value').innerHTML = value;
    },

    error: function(li, property, value) {
        li.className = 'property warning';
        value = value.substring(1);
        var valueSpan = document.getElementById(property + '-value');
        valueSpan.innerText = value;
    },

    standardElement: function(li, property, value) {
        if (value.lastIndexOf('!', 0) === 0) {
            console.log('error');
            formatters.error(li, property, value);
            return;
        }
        function formatElement(node, outerHTML) {
            node.innerText = outerHTML; // TODO highlight element in page? Format element?
            updateHeight();
        }
        var node = document.getElementById(property + '-value');
        chrome.devtools.inspectedWindow.eval(
            'getResultElement("' + value + '").outerHTML',
            { useContentScriptContext: true },
            formatElement.bind(null, node));
    },

    standardString: function(li, property, value) {
        if (value.lastIndexOf('!', 0) === 0) {
            formatters.error(li, property, value);
            return;
        }
        document.getElementById(property + '-value').innerText = '"' + value + '"';
    },

    standard: function(li, property, value) {
        document.getElementById(property + '-value').innerText = value;
    },

};

function formatProperty(li, property, value) {
    if (formatters[property])
        formatters[property](li, value);
    else
        console.warn("no formatter for", property);
}

function updateView(result) {
    if (!result) {
        console.warn('no result');
        result = {};
    }

    var sections = document.querySelectorAll('.properties-container');
    var foundProperty = false;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var sectionId = section.id;
        if (!sectionId in result || !result[sectionId]) {
            section.className = "hidden properties-container";
            continue;
        }
        var sectionProperties = result[sectionId];
        var propertyList = document.querySelector('#' + sectionId + ' ul');
        var propertyItems = propertyList.children;
        var foundSectionProperty = false;
        for (var j = 0; j < propertyItems.length; j++) {
            var propertyItem = propertyItems[j];
            var propertyId = propertyItem.id;
            if (!propertyId in sectionProperties || !sectionProperties[propertyId]) {
                propertyItem.className = 'property hidden';
                continue;
            }
            propertyItem.className = 'property';
            formatProperty(propertyItem, propertyId, sectionProperties[propertyId]);
            foundSectionProperty = true;
        }
        if (foundSectionProperty) {
            section.className = "properties-container";
            foundProperty = true;
        } else {
            section.className = "hidden properties-container";
        }
    }

    if (foundProperty) {
        document.getElementById('all-properties').className = 'properties-container'; // FIXME
        document.getElementById('empty').className = 'info hidden';
    } else {
        document.getElementById('all-properties').className = 'properties-container hidden';
        document.getElementById('empty').className = 'info';
    }
    updateHeight();
}

function updateHeight() {
    var styleHeightPx = window.getComputedStyle(document.body).height;
    var matches = styleHeightPx.match(/((\d+)(\.\d+)?)px/);
    var styleHeight = parseInt(matches[1]);
    var calculatedScrollHeight = styleHeight + 5; // not sure why 5 but it works

    window.sidebar.setHeight(calculatedScrollHeight + "px");
}

function onSelectionChanged() {
    if (!chrome.experimental.devtools.inspectedWindow.tabId) {
        return;
    }
    chrome.devtools.inspectedWindow.eval(
        'Properties.getAllProperties($0)',
        { useContentScriptContext: true },
        updateView);
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);
onSelectionChanged();
