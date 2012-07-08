/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:26
 */

define(function() {
    "use strict";

    return {
        execute: function(pathToFileOnServer) {
            var request = new XMLHttpRequest();
            request.open("GET", pathToFileOnServer, false);
            request.send(null);

            if (request.readyState === 4) {
                if (request.status === 200) {
                    return request.response;
                }
            }

            throw new Error("The file " + pathToFileOnServer + " could not be loaded");
        }
    };
});