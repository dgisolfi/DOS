"use strict";
exports.__esModule = true;
var request = require("request");
var DOS;
(function (DOS) {
    // This class is devoted to creating API Requests 
    var APIrequests = /** @class */ (function () {
        function APIrequests() {
        }
        // Call a handy API I found on the web which returns the client IP in JSON
        APIrequests.prototype.getIP = function (args) {
            request.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK', function (error, response, body) {
                console.log(error);
                console.log(response);
                console.log(body);
                return response;
            });
        };
        return APIrequests;
    }());
    DOS.APIrequests = APIrequests;
})(DOS || (DOS = {}));
