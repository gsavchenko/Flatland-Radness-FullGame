var objects;
(function (objects) {
    // KeyboardControls Class +++++++++++++++
    var KeyboardControls = (function () {
        // CONSTRUCTOR ++++++++++++++++++++++++++    
        function KeyboardControls() {
            this.enabled = false;
            document.addEventListener('keydown', this.onKeyDown.bind(this), false);
            document.addEventListener('keyup', this.onKeyUp.bind(this), false);
        }
        // PUBLIC METHODS
        KeyboardControls.prototype.onKeyDown = function (event) {
            switch (event.keyCode) {
                case 38: /*up arrow*/
                case 87:
                    this.moveForward = true;
                    break;
                case 37: /*left arrow*/
                case 65:
                    this.moveLeft = true;
                    break;
                case 40: /*down arrow*/
                case 83:
                    this.moveBackward = true;
                    break;
                case 39: /*right arrow*/
                case 68:
                    this.moveRight = true;
                    break;
                //case 32: /* Spacebar */
                // this.jump = true;
                //break;
                //screw jumping
                case 69:
                    this.activatePower = true;
                    break;
                case 81:
                    this.paused = (this.paused) ? false : true;
                    break;
            }
        };
        KeyboardControls.prototype.onKeyUp = function (event) {
            switch (event.keyCode) {
                case 38: /*up arrow*/
                case 87:
                    this.moveForward = false;
                    break;
                case 37: /*left arrow*/
                case 65:
                    this.moveLeft = false;
                    break;
                case 40: /*down arrow*/
                case 83:
                    this.moveBackward = false;
                    break;
                case 39: /*right arrow*/
                case 68:
                    this.moveRight = false;
                    break;
                case 69:
                    this.activatePower = false;
                    break;
            }
        };
        return KeyboardControls;
    })();
    objects.KeyboardControls = KeyboardControls;
})(objects || (objects = {}));
//# sourceMappingURL=keyboardcontrols.js.map