// import * as request from 'request';
var DOS;
(function (DOS) {
    // This class is devoted to creating API Requests 
    var APIrequests = /** @class */ (function () {
        function APIrequests() {
        }
        // Call a handy API I found on the web which returns the client IP in JSON
        APIrequests.prototype.getIP = function () {
            // request.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK', (error: any, response: any, body: any) => {
            // console.log(error);
            // console.log(response);
            // console.log(body);
            // return response;
            // });
        };
        return APIrequests;
    }());
    DOS.APIrequests = APIrequests;
})(DOS || (DOS = {}));
