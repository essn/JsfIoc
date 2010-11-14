﻿

function GraphVizFormatting(ioc) {
    this._ioc = ioc;
}

GraphVizFormatting.prototype = {
    constructor: GraphVizFormatting,

    GetBinding: function (name) {

        var binding = this._ioc._bindings[name];

        if (binding == null)
            return name + ' [ shape="record", label="' + name + ' | (instance)" ]';

        var bindingName = binding.GetFriendlyName();

        var eventListenerString = "";

        if (binding._eventListener.length > 0) {
            eventListenerString = " | \\>";

            var events = binding._eventListener.slice();

            events.sort();

            for (var i = 0; i < events.length; i++) {
                eventListenerString = eventListenerString + " " + events[i]

                if (i % 4 == 3) {
                    eventListenerString = eventListenerString + " | \\>";
                }
            }
        }

        var eventSourceString = "";

        if (binding._eventSource.length > 0) {
            eventSourceString = " |";

            var events = binding._eventSource.slice();

            events.sort();

            for (var i = 0; i < events.length; i++) {
                eventSourceString = eventSourceString + " " + events[i]

                if (i % 4 == 3) {
                    eventSourceString = eventSourceString + " \\> |";
                }
            }

            eventSourceString += " \\>";
        }

        var relationString = "";

        for (var i = 0; i < binding._requires.length; i++) {

            var targetName = binding._requires[i];

            if (this._ioc._bindings[targetName]) {
                targetName = this._ioc._bindings[targetName].GetFriendlyName();
            }

            relationString = relationString + "; " + bindingName + " -> " + targetName;
        }

        return bindingName + ' [ shape="record", label="' + bindingName + eventListenerString + eventSourceString + '" ]' + relationString;
    },

    AppendSampleCodetoDocument: function () {

        var vizString = 'digraph {\n    graph [rankdir = "LR"];';

        for (var bindingName in ioc._bindings) {

            if (!ioc._bindings.hasOwnProperty(bindingName))
                continue;

            vizString += "    " + this.GetBinding(bindingName) + "\n";
        }

        vizString += "}";

        $("body").append("<pre>" + vizString + "</pre>");
    }
}