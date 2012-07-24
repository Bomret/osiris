/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:26
 */

define(function () {
    "use strict";

    return {
        execute:function (pathToFileOnServer, successCallback, errorCallback) {
            var onResponse = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        successCallback(request.response);
                    }
                }
                errorCallback(request.statusText);
            };

            var request = new XMLHttpRequest();
            request.onreadystatechange = onResponse;

            request.open("GET", pathToFileOnServer, true);
            request.send(null);
        }
    };
});