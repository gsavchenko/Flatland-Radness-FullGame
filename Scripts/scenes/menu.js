var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
MAIN GAME FILE
Source file	name:       menu.ts
Author’s name:	        George Savcheko and Jason Gunter
Last modified by:       George Savchenko
Date last modified:     2016-04-15
Program	description:    Create an original 3D game. The game must have a Menu Scene, Instructions Scene, at least 3
                        Game-Level Scenes, and a Game-Over Scene. A scoring system must also be included.
Revision history:       added music, fixed menu, commented code
THREEJS Aliases
*/
/**
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * Menu Scene extends scenes.Scene superclass is used to
     * create a custom menu for the THREEJS Game
     *
     * @class Menu
     * @extends scene.Scene
     * @param blocker {HTMLElement}
     * @param _stage {createjs.Stage}
     * @param _gameLabel {createjs.Text}
     * @param _startButton {createjs.Bitmap}
     */
    var Menu = (function (_super) {
        __extends(Menu, _super);
        /**
         * Empty Constructor - calls _initialize and start methods
         *
         * @constructor
         */
        function Menu() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Menu.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundImage = "url('../../Assets/images/menu1.png')";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        Menu.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Menu.prototype.start = function () {
            createjs.Sound.play("background", -1);
            this._gameLabel = new createjs.Text("Flatland Radness", "80px Motorwerk", "#ffffff");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._gameLabel);
            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 0.5;
            this._startButton.regY = this._startButton.getBounds().height * 0.5;
            this._startButton.x = config.Screen.WIDTH * 0.5 - 100;
            this._startButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._startButton);
            this._exitButton = new createjs.Bitmap(assets.getResult("ExitButton"));
            this._exitButton.regX = this._exitButton.getBounds().width * 0.5;
            this._exitButton.regY = this._exitButton.getBounds().height * 0.5;
            this._exitButton.x = config.Screen.WIDTH * 0.5 + 200;
            this._exitButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._exitButton);
            this._instructionsButton = new createjs.Bitmap(assets.getResult("InstructionsButton"));
            this._instructionsButton.regX = this._instructionsButton.getBounds().width * 0.5;
            this._instructionsButton.regY = this._instructionsButton.getBounds().height * 0.5;
            this._instructionsButton.x = config.Screen.WIDTH * 0.5 - 400;
            this._instructionsButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._instructionsButton);
            this._startButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._startButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._startButton.on("click", function (event) {
                currentScene = config.Scene.PLAY;
                changeScene();
            });
            this._exitButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._exitButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._exitButton.on("click", function (event) {
                window.open('', '_self', '');
                window.close();
            });
            this._instructionsButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._instructionsButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._instructionsButton.on("click", function (event) {
                currentScene = config.Scene.RULES;
                changeScene();
            });
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Menu.prototype.update = function () {
            this._stage.update();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Menu.prototype.resize = function () {
            this._setupCanvas();
        };
        return Menu;
    })(scenes.Scene);
    scenes.Menu = Menu;
})(scenes || (scenes = {}));
//# sourceMappingURL=menu.js.map