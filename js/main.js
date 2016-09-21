document.addEventListener('DOMContentLoaded', function main() {
    var documentTypeRex = "Playbill|London Stage|Yorkshire Stage|" +
                          "Other Compendia|Periodical Advertisement|" +
                          "Periodical Review";
    var occasionRex = "Command performance|Benefit Performance|" +
                      "Charitable Benefit Performance|Occasional Performance";
    var performanceKindRex = "Main Piece|Interlude|After Piece|Interpolation";

    var floatingPointRex = "";  // Make this correct
    var intRex = "";  // Make this correct 
    var dateRex = "";  // Make this correct
    var timeRex = "";  // Make this correct
    var URLRex = "";  // Make this correct
    var freeTextRex = "";  // This is actually correct as is!
   
    var currencyRex = "";  // Yowza...
    
    // [LIBRARY, COLLECTION_NAME, CALL_NUMBER]
    var archiveRex = [freeTextRex, freeTextRex, freeTextRex]; 

    var periodicalTitleRex = "";  // Create a rex-based controlled vocab

    // [NAME_OF_PRINTER, PLACE]
    var printerOfDocumentRex = [freeTextRex, freeTextRex];
    var venueRex = freeTextRex;  // Create a rex-based controlled vocab?

    var personRex = URLRex;  // Use a URI for open linked data?
    
    var contributorRex = [personRex, contributorTypeRex];
    var contributorTypeRex = "Playwright|Composer|Scene Painter|Dance Master" +
                             "Set Designer";

    var performerRex = [personRex, freeTextRex];

    var ticketing = {
        "ticketing": {
            "currency": {
                "validator": currencyRex,
                "documentation": "The unit of currency."
            },
            "boxPrice": {
                "validator": intRex,
                "converter": 0,
                "documentation": "The cost of a box seat, as measured using " +
                                 "the smallest possible unit of currency."
            },
            "galleryPrice": {
                "validator": intRex,
                "converter": 0,
                "documentation": "The cost of a box seat, as measured using " +
                                 "the smallest possible unit of currency."
            },
            "upperGalleryPrice": {
                "validator": intRex,
                "converter": 0,
                "documentation": "The cost of a box seat, as measured using " +
                                 "the smallest possible unit of currency."
            },
            "toBeHad": {
                "validator": freeTextRex,
                "documentation": "The name of the ticketing agent or agents."
            },
            "totalReceipts": {
                "validator": intRex,
                "converter": 0,
                "documentation": "The cost of a box seat, as measured using " +
                                 "the smallest possible unit of currency."
            },
            "costsOrFees": {
                "validator": intRex,
                "converter": 0,
                "documentation": "The cost of a box seat, as measured using " +
                                 "the smallest possible unit of currency."
            },
        }
    };

    var performance = {
        "performance": {
            "orderOfPerformance": {
                "validator": intRex,
                "documentation": "An integer describing the position of " +
                                 "this performance within the larger show. " +
                                 "Starts at 1."
            },
            "title": {
                "validator": freeTextRex,
                "documentation": "The title of the work being performed, " +
                                 "exactly as given by the playbill."
            },
            "contributors": [{
                "validator": contributorRex,
                "documentation": "A comma-separated 2-tuple containing the " +
                                 "person and the type of their contribution."
            }],
            "kindOfPerformance": {
                "validator": performanceKindRex,
                "documentation": "Kind of performance. One of Main Piece / " +
                                 "Interlude / After Piece / Interpolation."
            },
            "performers": [{
                "validator": performerRex,
                "documentation": "A comma-separated 2-tuple containing the " +
                                 "person and the name of their role."
            }],
            "genreClaim": {
                "validator": freeTextRex,
                "documentation": "The genre claim, exactly as given by the " +
                                 "playbill."
            }
        }
    };

    var showRecord = {
        "showRecord": {
            "location": {
                "validator": freeTextRex,
                "documentation": "The geographical location of the " +
                                 "performance, exactly as given by the " +
                                 "playbill."
            },
            "venue": {
                "validator": venueRex,
                "documentation": "The venue of the performance, exactly " +
                                 "as given by the playbill."
            },
            "date": {
                "validator": dateRex,
                "documentation": "The exact date of the performance in " +
                                 "YYYYMMDD format. For ranges of dates, " +
                                 "create a separate Show Record for each date."
            },
            "theaterCompany": {
                "validator": freeTextRex,
                "documentation": "The name of the theater company, exactly " +
                                 "as given by the playbill."
            },
            "occasion": {
                "validator": occasionRex,
                "documentation": "The occasion for occasional performances. " +
                                 "One of Command performance / " +
                                 "Benefit Performance / " +
                                 "Charitable Benefit Performance / " +
                                 "Occasional Performance"
            },
            "beneficiary": [{
                "validator": personRex,
                "documentation": "One or more people, ideally denoted by " +
                                 "URIs from a controlled vocabulary."
            }],
            "ticketing": ticketing.ticketing,
            "doorsOpen": {
                "validator": timeRex,
                "documentation": "The time when doors open, if listed, using" +
                                 "a 24-hour clock."
            },
            "performanceBegins": {
                "validator": timeRex,
                "documentation": "The time when the performance begins, " +
                                 "using a 24-hour clock."
            },
            "featuredAttractions": [{
                "validator": freeTextRex,
                "documentation": "Any featured attractions described in the " +
                                 "playbill, exactly as given."
            }],
            "notes": [{
                "validator": freeTextRex,
                "documentation": "Notes describing compelling or otherwise " +
                                 "important details from the playbill that " +
                                 "will not be captured by any other field."
            }],
            "performances": [performance.performance],
            //"upcomingPerformances": [showRecord.showRecord],  // it's a 
                                                              // recursive 
                                                              // type!!
        }
    };

    var ephemeralRecord = {
        "ephemeralRecord": {
            "documentType": {
                "validator": documentTypeRex,
                "documentation": "The document type. One of Playbill / " +
                                 "London Stage / Yorkshire Stage / " +
                                 "Other Compendia / Periodical Advertisement" +
                                 " / Periodical Review",
            },
            "persistentURL": {
                "validator": URLRex,
                "documentation": "A persistent URL where identifying " + 
                                 "information about the document may be " +
                                 "found",
            },
            "archiveHoldingDocument": {
                "validator": archiveRex,
                "documentation": "A comma-separated 3-tuple containing the " +
                                 "name of the library or archive, the name " +
                                 "of the holding collection, and a call number"
            },
            "periodicalTitle": {
                "validator": periodicalTitleRex,
                "documentation": "The name of the containing periodical " +
                                 "(e.g. for advertisements). We may develop " +
                                 "a controlled vocabulary for this."
            },
            "documentPrinter": {
                "validator": printerOfDocumentRex,
                "documentation": "A comma-separated 2-tuple containing the " +
                                 "name of the printer, and the location of " +
                                 "the printer, e.g. London. We may deelop a " +
                                 "controlled vocabulary for one or both terms."
            },
            "shows": [showRecord.showRecord],
            "dimensions": {
                "validator": [floatingPointRex, floatingPointRex],
                "converter": [0.0, 0.0],
                "documentation": "A comma-separated 2-tuple containing the " +
                                 "length and width of the document in " +
                                 "centimeters."
            },
            "printedArea": {
                "validator": [floatingPointRex, floatingPointRex],
                "converter": [0.0, 0.0],
                "documentation": "A comma-separated 2-tuple containing the " +
                                 "length and width of the printed area of " +
                                 "the document in centimeters."
            }
        },
    };

    var playbillRecord = {
        "ephemeralRecords": [ephemeralRecord.ephemeralRecord],
    };  // One megaform to rule them all!!!


    function insertSpace(match, val) {
        return val + ' ';
    }

    function upperCase(match, val) {
        return val.toUpperCase();
    }

    function splitCamel(s) {
        return s.replace(/([a-z](?=[A-Z]))/g, insertSpace)  // Split CamelCase
                .replace(/([a-z](?=[0-9]))/g, insertSpace)  // Separate Digits
                .replace(/([0-9](?=[a-zA-Z]))/g, insertSpace);   // (ditto)
    }

    function titleCase(s) {
        s = splitCamel(s);
        return s.replace(/(^[a-z])/g, s[0].toUpperCase())   // First Cap
                .replace(/( [a-z])/g, upperCase);           // Cap After Space
    }

    function toId(s, prefix) {
        s = splitCamel(s);
        prefix = prefix ? s ? prefix + '_' : prefix : '';
        return prefix + s.replace(/(\s)/g, '-').toLowerCase();
    }

    function singular(s) {
        return s.replace(/(s$)/g, '');
    }

    function enumerate(s, n, spacer) {
        spacer = (spacer || spacer === '') ? spacer : ' ';
        return singular(s) + spacer + n;
    }

    function wrapWith(tagname, el, attribs) {
        var tag = document.createElement(tagname);
        for (var key in attribs) {
            tag.setAttribute(key, attribs[key]);
        }
        tag.appendChild(el);
        return tag;
    }

    function renderInput(root, label, id, attribs) {
        var labelEl = document.createElement('label');
        var labelText = document.createTextNode(label);
        labelEl.appendChild(labelText);
        labelEl.setAttribute('for', id);
        labelEl = wrapWith('div', labelEl);

        var inputEl = document.createElement('input');
        inputEl.setAttribute('id', id);
        inputEl.setAttribute('size', '40');

        var renderHelpText = function() {
            var help = document.getElementById('help-window-text');
            var helpHeader = document.createElement('h5');
            var title = document.createTextNode(label);
            var text = document.createTextNode(attribs.documentation);

            help.innerHTML = "";
            helpHeader.appendChild(title);
            help.appendChild(helpHeader);
            help.appendChild(text);
        };
        inputEl.addEventListener('mouseover', renderHelpText);
        inputEl.addEventListener('focus', renderHelpText);
        inputEl = wrapWith('div', inputEl);

        var container = document.createElement('p');
        container.appendChild(labelEl);
        container.appendChild(inputEl);
        root.appendChild(container);
        return container;
    }

    function renderHeader(root, text, attribs) {
        var header = document.createElement('h3');
        var headerText = document.createTextNode(text);

        for (var attribKey in attribs) {
            header.setAttribute(attribKey, attribs[attribKey]);
        }
        header.appendChild(headerText);
        root.appendChild(header);
        return header;
    }

    function renderSubRoot(root, attribs) {
        var subRoot = document.createElement('div');

        for (var attribKey in attribs) {
            subRoot.setAttribute(attribKey, attribs[attribKey]);
        }
        root.appendChild(subRoot);
        return subRoot;
    }

    function buildRenderSubForm(root, key, subForm, idPrefix) {
        renderSubForm = function(n) {
            renderFunc = function() {
                var newHeader = singular(titleCase(key)) + ' ' + n;
                render(renderSubRoot(root), subForm, 
                       toId(key, idPrefix) + '_' + n, newHeader);
                n += 1;
                event.preventDefault();
                return false;
            };
           
            return renderFunc;
        };
        return renderSubForm(1);
    }

    function renderNewItemButton(root, key, subForm, idPrefix) {
        var renderSubForm = buildRenderSubForm(root, key, subForm, idPrefix);
        var button = document.createElement('a');
        var text = document.createTextNode(
                '+ New ' + singular(titleCase(key))
        );

        button.setAttribute('href', '#');
        button.appendChild(text);
        button.addEventListener('click', renderSubForm);
        renderSubForm();
        return button;
    }

    function render(root, formSpec, idPrefix, header) {
        var formKeys;
        var renderButton;
        idPrefix = idPrefix ? idPrefix : '';

        if (Array.isArray(formSpec)) {
            formKeys = [0];  // Lists must always be length 1, and the
                             // "key" should be empty.
        } else {
            formKeys = Object.keys(formSpec);
            formKeys.sort(function cmp(a, b) {
                if (formSpec[a].hasOwnProperty('documentation')) {
                    if (!formSpec[b].hasOwnProperty('documentation')) {
                        return -1;
                    }
                } else {
                    if (formSpec[b].hasOwnProperty('documentation')) {
                        return 1;
                    }
                }
                
                return a < b ? -1 : a == b ? 0 : 1;
            });
        }

        for (var i = 0; i < formKeys.length; i++) {
            var key = formKeys[i];
            if (!formSpec.hasOwnProperty(key)) {
                continue;
            }

            var subForm = formSpec[key];
            if (Array.isArray(formSpec)) {  // The new item renderer will
                key = '';                   // handle keys for sequences.
            }

            var subHeader = header ? header : titleCase(key);
            var subRoot;

            if (subForm.hasOwnProperty('documentation')) {
                renderInput(root, subHeader, toId(key, idPrefix), subForm);
            } else if (Array.isArray(subForm)) {
                renderHeader(root, subHeader, {'class': 'subheader'});
                subRoot = renderSubRoot(root, {'class': 'subform-group'});
                var button = renderNewItemButton(
                        subRoot, key, subForm, idPrefix);
                button = wrapWith('div', button, 
                        {'class': 'subform-group ui-element'});
                root.appendChild(button);
            } else {
                renderHeader(root, subHeader, {'class': 'instance-header'});
                render(renderSubRoot(root), subForm, toId(key, idPrefix));
            }
        }
    }

    function assignKey(obj, keys, val, depth) {
        if (typeof keys === 'string') {
            keys = keys.split('_');
            for (i = 0; i < keys.length; i++) {
                var key = keys[i].split('-');
                for (j = 0; j < key.length; j++) {
                    key[j] = key[j][0].toUpperCase() + key[j].slice(1);
                }
                key = key.join('');
                keys[i] = key[0].toLowerCase() + key.slice(1);
            }
        }

        if (keys.length < 1) {
            return;
        }

        var first = keys[0];
        first = isNaN(parseInt(first)) ? first : parseInt(first) - 1;

        if (keys.length === 1) {
            obj[first] = val;
            return;
        }
       
        if (!obj.hasOwnProperty(first)) {
            if (isNaN(parseInt(keys[1]))) {
                obj[first] = {};
            } else {
                obj[first] = [];
            }
        }
        assignKey(obj[first], keys.slice(1), val, depth + 1);
    }

    var formRoot = document.getElementById('playbill-form');
    render(formRoot, playbillRecord);

    var submitButton = document.getElementById('playbill-submit');
    submitButton.addEventListener('click', function() {
        var elements = document.getElementsByTagName('input');
        var out = {};
        for (var i = 0; i < elements.length; i++) {
            assignKey(out, elements[i].id, elements[i].value, 0);
        }
        
        var outDiv = document.getElementById('json-out');
        var outPre = document.createElement('pre');
        var outJson = document.createTextNode(JSON.stringify(out, null, 2));
        outDiv.innerHTML = '';
        outDiv.appendChild(outPre);
        outPre.appendChild(outJson);

        event.preventDefault();
        return false; 
    });

});

// Add form (object) (parent, name)
// Add sequence(array) (parent, name)
// Add string (parent, name)
// Add contributor_type (parent, name)
// Add document_type (parent, name)
// Add performance_type (parent, name)

/*
*/

