document.addEventListener('DOMContentLoaded', function main() {

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // Schema definitions
    //

    var documentTypeRex = "Playbill|London Stage|Yorkshire Stage|" +
                          "Other Compendia|Periodical Advertisement|" +
                          "Periodical Review";
    var occasionRex = "Command performance|Benefit Performance|" +
                      "Charitable Benefit Performance|Occasional Performance";
    var performanceKindRex = "Main Piece|Interlude|After Piece|Interpolation";

    var boolRex = ""; // Make this correct

    var floatingPointRex = "";  // Make this correct
    var intRex = "";  // Make this correct 
    var dateRex = "";  // Make this correct
    var timeRex = "";  // Make this correct
    var URLRex = "";  // Make this correct
    var freeTextRex = "";  // This is actually correct as is!
   
    var currencyRex = "";  // Yowza...
    
    // [LIBRARY, COLLECTION_NAME, CALL_NUMBER]
    var libraryRex = freeTextRex;
    var collectionRex = freeTextRex;
    var callNumberRex = freeTextRex;

    var periodicalTitleRex = "";  // Create a rex-based controlled vocab

    // [NAME_OF_PRINTER, PLACE]
    var venueRex = freeTextRex;  // Create a rex-based controlled vocab?
    var locationRex = freeTextRex; // Create a rex-based controlled vocab?

    var personRex = URLRex;  // Use a URI for open linked data?
    var nationalityRex = freeTextRex;
    
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

    var contributor = {
        "contributor": {
            "contributorName": {
                "validator": personRex,
                "documentation": "The name of the contributor."
            },
            "contributorType": {
                "validator": personRex,
                "documentation": "The type of contributor (e.g. Scene " +
                                 "Painter, Director, etc.)"
            }
        }
    };

    var newPerformerNotes = {
        "newPerformerNotes": {
            "newRole": {
                "validator": boolRex,
                "formType": "checkbox",
                "documentation": "An indicator set to true if the document " +
                                 "identifies this as the performer's first " +
                                 "appearance in this role."
            },
            "newPerformer": {
                "validator": boolRex,
                "formType": "checkbox",
                "documentation": "An indicator set to true if the document " +
                                 "identifies this as the performer's first " +
                                 "appearance at this venue."
            },
            "newPerformerOrigin": {
                "validator": venueRex,
                "documentation": "The performer's previous venue, if given " +
                                 "by the document, and if the document " +
                                 "identifies this as the performer's first " +
                                 "appearance at this venue."
            }
        }
    };

    var performer = {
        "performer": {
            "performerName": {
                "validator": personRex,
                "documentation": "The name of the performer."
            },
            "role": {
                "validator": freeTextRex,
                "documentation": "The name of the performer's role."
            },
            "roleNotes": {
                "validator": freeTextRex,
                "documentation": "Notes on the role or performer, exactly " +
                                 "as given by the document."
            },
            "newPerformerNotes": newPerformerNotes.newPerformerNotes
        }
    };

    var performanceFeaturedAttraction = {
        "performanceFeaturedAttraction": {
            "attraction": {
                "validator": freeTextRex,
                "documentation": "Any featured attractions described in the " +
                                 "document, exactly as given."
            },
            "isInterpolation": {
                "validator": boolRex,
                "formType": "checkbox",
                "documentation": "An indicator set to true if the document " +
                                 "identifies this as an interpolation " +
                                 "within the larger performance."
            }
        }
    };

    var performance = {
        "performance": {
            "orderOfPerformance": {
                "validator": intRex,
                "documentation": "An integer describing the position of " +
                                 "this performance within the larger show. " +
                                 "Starts at 1. Interpolations should be " +
                                 "numbered in order, and are assumed to " +
                                 "occur within the last full piece listed."
            },
            "title": {
                "validator": freeTextRex,
                "documentation": "The title of the work being performed, " +
                                 "exactly as given by the document."
            },
            "contributors": [contributor.contributor],
            "kindOfPerformance": {
                "validator": performanceKindRex,
                "documentation": "Kind of performance. May either be " +
                                 "Main Piece or After Piece."
            },
            "performers": [performer.performer],
            "genreClaim": {
                "validator": freeTextRex,
                "documentation": "The genre claim, exactly as given by the " +
                                 "document."
            },
            "featuredAttractions": 
                [performanceFeaturedAttraction.performanceFeaturedAttraction],
        }
    };

    var performanceOccasion = {
        "performanceOccasion": {
            "occasionAsStated": {
                "validator": freeTextRex,
                "documentation": "The occasion for an occasional performance, " +
                                 "exactly as given by the document."
            },
            "occasionType": {
                "validator": occasionRex,
                "documentation": "The type of occasional performance. " +
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
            "occasioner": [{
                "validator": personRex,
                "documentation": "One or more people, ideally denoted by " +
                                 "URIs from a controlled vocabulary."
            }],
        }
    };

    var showRecord = {
        "showRecord": {
            "location": {
                "validator": freeTextRex,
                "documentation": "The geographical location of the " +
                                 "performance, exactly as given by the " +
                                 "document."
            },
            "venue": {
                "validator": venueRex,
                "documentation": "The venue of the performance, exactly " +
                                 "as given by the document."
            },
            "date": {
                "validator": dateRex,
                "formType": "date",
                "documentation": "The exact date of the performance. For " +
                                 "ranges of dates, create a separate Show " +
                                 "Record for each date."
            },
            "theaterCompany": {
                "validator": freeTextRex,
                "documentation": "The name of the theater company, exactly " +
                                 "as given by the document."
            },
            "ticketing": ticketing.ticketing,
            "doorsOpen": {
                "validator": timeRex,
                "documentation": "The time when doors open, if listed, using " +
                                 "a 24-hour clock."
            },
            "occasions": [performanceOccasion.performanceOccasion],
            "performanceBegins": {
                "validator": timeRex,
                "documentation": "The time when the performance begins, " +
                                 "using a 24-hour clock."
            },
            "featuredAttractionsForShow": [{
                "validator": freeTextRex,
                "documentation": "Any featured attractions described in the " +
                                 "document, exactly as given."
            }],
            "notes": [{
                "validator": freeTextRex,
                "documentation": "Notes describing compelling or otherwise " +
                                 "important details from the document that " +
                                 "will not be captured by any other field."
            }],
            "performances": [performance.performance],
            //"upcomingPerformances": [showRecord.showRecord],  // it's a 
                                                              // recursive 
                                                              // type!!
        }
    };

    var documentPrinter = {
        "documentPrinter": {
            "name": {
                "validator": personRex,
                "documentation": "The name of the printer."
            },
            "location": {
                "validator": locationRex,
                "documentation": "The city where the document was printed."
            }
        }
    };

    var ephemeralRecord = {
        "ephemeralRecord": {
            "dataCataloger": {
                "validator": freeTextRex,
                "documentation": "Your unique identifier as a cataloger. " +
                                 "May be your name, your initials, or some " +
                                 "other unique word or phrase of your choice."
            },
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
                "validator": libraryRex,
                "documentation": "The name of the library or archive that " +
                                 "holds the document."
            },
            "containingCollection": {
                "validator": collectionRex,
                "documentation": "The name of the collection the document " +
                                 "resides in."
            },
            "callNumber": {
                "validator": callNumberRex,
                "documentation": "The call number of the document as " +
                                 "specified by the holding institution."
            },
            "periodicalTitle": {
                "validator": periodicalTitleRex,
                "documentation": "The name of the containing periodical " +
                                 "(e.g. for advertisements). We may develop " +
                                 "a controlled vocabulary for this."
            },
            "documentPrinter": documentPrinter.documentPrinter,
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
            },
            "advertisements": [{
                "validator": freeTextRex,
                "documentation": "The text of each advertisement, as given " +
                                 "by the document, to be entered at the " +
                                 "discression of the cataloger."
            }],
            "announcements": [{
                "validator": freeTextRex,
                "documentation": "The text of each advertisement, as given " +
                                 "by the document, to be entered at the " +
                                 "discression of the cataloger."
            }]
        }
    };

    var playbillRecord = {
        "ephemeralRecord": ephemeralRecord.ephemeralRecord,
    };  // One megaform to rule them all!!!

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // Utilities for string manipulation, etc.
    //

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

    function idToList(keys) {
        // Take id keys in the form "yabba-dabba_doo" and convert them to 
        // a list of keys in the form `['yabbaDabba', 'doo']`.
        if (typeof keys === 'string') {
            keys = keys.split('_');
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i].split('-');
                for (j = 0; j < key.length; j++) {
                    key[j] = key[j][0].toUpperCase() + key[j].slice(1);
                }
                key = key.join('');
                keys[i] = key[0].toLowerCase() + key.slice(1);
            }
        }
        return keys;
    }

    function listToId(keyList) {
        // Take a list of keys in the form `['yabbaDabba', 'doo']` and
        // convert them to id keys in the form "yabba-dabba_doo".
        var ids = keyList.map(function (i) { return toId('' + i); });
        return ids.join('_');
    }

    function singular(s) {
        return s.replace(/(s$)/g, '');
    }

    function stripNum(s) {
        return s.replace(/([0-9]+\s*$)/g, '');
    }

    function isPrimitive(val) {
        var vtype = typeof val;
        return (vtype === 'string') ||
               (vtype === 'number') ||
               (vtype === 'boolean') ||
               (val === null) ||
               (val === undefined);
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // Rendering DOM elements
    //

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
        inputEl.setAttribute('class', 'main-form-input');
        inputEl.setAttribute('type', attribs.formType || 'text');

        var renderHelpText = function() {
            var help = document.getElementById('help-window-text');
            var helpHeader = document.createElement('h5');
            var title = document.createTextNode(stripNum(label));
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
        var headerText = document.createTextNode(text);
        var header = document.createElement('h3');

        for (var attribKey in attribs) {
            header.setAttribute(attribKey, attribs[attribKey]);
        }
        header.appendChild(headerText);
        root.appendChild(header);
        return header;
    }

    function renderSubRoot(root, id, attribs) {
        var subRoot = document.createElement('div');
        subRoot.setAttribute('id', id);

        for (var attribKey in attribs) {
            subRoot.setAttribute(attribKey, attribs[attribKey]);
        }
        root.appendChild(subRoot);
        return subRoot;
    }

    subFormFactory = (function() {
        // A factory object that creates and keeps track of the callbacks
        // that render new copies of forms that can be repeated. For
        // example, if a scheme allows multiple `tree`s in a list, this
        // renders a new `tree` sub-form each time it is called, with
        // a key that reflects its order of creation. (tree_1, tree_2, etc.)

        var factory = {};
        factory.getRendererFromKey = {};
        factory.buildRenderer = function(root, key, subForm, idPrefix) {
            
            var renderSubForm = function(n) {
                // This closure maintains the renderFunc's state (`n`).
                var renderFunc = function() {
                    // This function renders the actual form, tracking
                    // and updating the value of `n` attached to its closure.
                    var newHeader = singular(titleCase(key)) + ' ' + n;
                    render(renderSubRoot(root), subForm, 
                           toId(key, idPrefix) + '_' + n, newHeader);
                    n += 1;
                    event.preventDefault();
                    return false;
                };
                
                factory.getRendererFromKey[toId(key, idPrefix)] = renderFunc; 
                return renderFunc;
            };

            return renderSubForm(1);
        };

        return factory;
    })();

    function renderNewItemButton(root, key, subForm, idPrefix) {
        var renderSubForm = subFormFactory.buildRenderer(
            root, key, subForm, idPrefix
        );

        var button = document.createElement('a');
        var text = document.createTextNode(
                '+ New ' + singular(titleCase(key))
        );

        button.setAttribute('href', '#');
        button.setAttribute('class', 'button');
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

            var nodeId = toId(key, idPrefix);
            if (subForm.hasOwnProperty('documentation')) {
                renderInput(root, subHeader, nodeId, subForm);
            } else if (Array.isArray(subForm)) {
                renderHeader(root, subHeader, {'class': 'subheader'});
                subRoot = renderSubRoot(root, 
                                        nodeId,
                                        {'class': 'subform-group'});
                var button = renderNewItemButton(
                        subRoot, key, subForm, idPrefix);
                button = wrapWith('div', button, 
                        {'class': 'subform-group ui-element'});
                root.appendChild(button);
            } else {
                renderHeader(root, subHeader, {'class': 'instance-header'});
                render(renderSubRoot(root, nodeId),
                       subForm, 
                       nodeId);
            }
        }
    }

    function resetForm() {
        var formRoot = document.getElementById('playbill-form');
        while (formRoot.lastChild) {
            formRoot.removeChild(formRoot.lastChild);
        }
        render(formRoot, playbillRecord);
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // Recursive object indexing and traversal
    //

    function assignKey(obj, keys, val) {
        keys = idToList(keys);

        if (keys.length < 1) {
            return;
        }

        // Convert the first key to an integer if it's an integer.
        var first = keys[0];
        first = isNaN(parseInt(first)) ? first : parseInt(first) - 1;

        // If it's the only value, this is a terminal key. End recursion.
        if (keys.length === 1) {
            obj[first] = val;
            return;
        }
      
        // If there are more values, we need to make sure they have an
        // object or array to live in, and to create one if not. 
        if (!obj.hasOwnProperty(first)) {
            if (isNaN(parseInt(keys[1]))) {
                obj[first] = {};
            } else {
                obj[first] = [];
            }
        }

        // Now we can recurse...
        assignKey(obj[first], keys.slice(1), val);
    }

    function getKey(obj, keys) {
        keys = idToList(keys);

        if (keys.length < 1) {
            return;
        }

        var first = keys[0];
        first = isNaN(parseInt(first)) ? first : parseInt(first) - 1;

        if (keys.length === 1) {
            return obj ? obj[first] : null;
        } else {
            return obj ? getKey(obj[first], keys.slice(1)) : null;
        }
    }

    function walkObj(obj, callback, condition, keyPath) {
        var useCondition = (typeof condition === 'function') ? true : false;
        var keys, i;

        keyPath = keyPath || [];
        var newKeyPath = keyPath.slice();
        newKeyPath.push(null);

        if (Array.isArray(obj)) {
            keys = [];
            for (i = 0; i < obj.length; i++) {
                keys.push(i);
            }
        } else {
            keys = Object.keys(obj);
        }

        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = obj[key];
            newKeyPath[newKeyPath.length - 1] = key;

            if (!isPrimitive(val)) {
                callback(val, newKeyPath);
                walkObj(val, callback, condition, newKeyPath);
            } else if (!useCondition || condition(val, newKeyPath)) {
                callback(val, newKeyPath);
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // File IO
    //

    function jsonToFilename(json) {
        var venue = json.ephemeralRecord.shows[0].venue;
        var date = json.ephemeralRecord.shows[0].date;
        var title = json.ephemeralRecord.shows[0].performances[0].title;
        var cataloger = json.ephemeralRecord.dataCataloger;
        var elements = [date, venue, title, cataloger];
        var tojoin = [];

        for (var i = 0; i < elements.length; i++) {
            if (elements[i] !== '') {
                tojoin.push(elements[i]);
            }
        }

        var filename = toId(tojoin.join(' '));
        filename = filename === '' ? 'empty-record.json' : filename + '.json';
        return filename;
    }

    // Add event listeners to static UI elements.

    var submitButton = document.getElementById('playbill-submit');
    submitButton.addEventListener('click', function() {
        var elements = document.querySelectorAll('input.main-form-input');
        var out = {};
        for (var i = 0; i < elements.length; i++) {
            var value = elements[i].type === 'checkbox' ? elements[i].checked : 
                                                          elements[i].value;
            assignKey(out, elements[i].id, value);
        }
        
        var filename = jsonToFilename(out);

        var dl = document.createElement('a');
        dl.setAttribute('href', 'data:text/plain;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(out, null, 2)));
        dl.setAttribute('download', filename);
        dl.style.display = 'none';

        document.body.appendChild(dl);
        dl.click();
        document.body.removeChild(dl);
        
        event.preventDefault();
        return false; 
    });

    var loadFileChooser = document.getElementById('playbill-load');
    loadFileChooser.addEventListener('change', function(evt) {
        var file = evt.target.files[0];
        var reader = new FileReader();

        // Prepare the form for re-rendering.
        resetForm();

        reader.addEventListener('load', function(evt) {
            obj = JSON.parse(evt.target.result);

            walkObj(obj, function(val, keyPath) {
                keyPath = keyPath.slice();  // Mutating data, so make a copy.
                for (var i = 0; i < keyPath.length; i++) {
                    if ((typeof keyPath[i]) === 'number') {
                        keyPath[i] += 1;
                    }
                }
                
                var fieldId = listToId(keyPath);
                var tail = keyPath.pop();

                // Is the last value in keyPath a number? If so, this is
                // an array field. Check to see whether the corresponding 
                // form fields have been created yet and create them if not.
                if ((typeof tail) === 'number') {
                    var renderId = listToId(keyPath);

                    if (document.getElementById(fieldId) === null) {
                        var render = subFormFactory
                            .getRendererFromKey[renderId];
                        console.log(renderId);
                        console.log(fieldId);
                        if (render) {
                            console.log('ACTUALLY RENDERED');
                            render();
                        }
                    }
                }
                // TODO: Here, check to see if the field exists and if not, call the renderer.
            });

            var elements = document.querySelectorAll('input.main-form-input');
            for (var i = 0; i < elements.length; i++) {
                var key = elements[i].id;
                var value = getKey(obj, key);

                if (elements[i].type === 'checkbox') {
                    elements[i].checked = value;
                } else {
                    elements[i].value = value;
                }
            }
        });
        reader.readAsText(file);
    });

    // Finally...
    resetForm();

    console.log(JSON.stringify(playbillRecord));
});

