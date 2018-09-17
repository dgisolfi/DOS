var DOS;
(function (DOS) {
    var UserCommand = /** @class */ (function () {
        function UserCommand(command, args) {
            if (command === void 0) { command = ""; }
            if (args === void 0) { args = []; }
            this.command = command;
            this.args = args;
        }
        return UserCommand;
    }());
    DOS.UserCommand = UserCommand;
})(DOS || (DOS = {}));
