/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:26
 */

define(function () {
    "use strict";

    return {
        execute:function (options) {
            var onResponse = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        options.onSuccess(request.response);
                    }
                } else {
                    options.onError(request.statusText);
                }
            };

            var request = new XMLHttpRequest();
            request.onreadystatechange = onResponse;

            request.open(options.method, options.path, true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(options.payload);
        }
    };
});