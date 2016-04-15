/*
MAIN GAME FILE
Source file	name:       game.ts
Author’s name:	        George Savcheko and Jason Gunter
Last modified by:       George Savchenko
Date last modified:     2016-04-15
Program	description:    Create an original 3D game. The game must have a Menu Scene, Instructions Scene, at least 3
                        Game-Level Scenes, and a Game-Over Scene. A scoring system must also be included.
Revision history:       added music, fixed menu, commented code
THREEJS Aliases
*/
var config;
(function (config) {
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = window.innerWidth;
        Screen.HEIGHT = window.innerHeight;
        Screen.RATIO = window.innerWidth / window.innerHeight;
        return Screen;
    })();
    config.Screen = Screen;
    // Scene Constants
    var Scene = (function () {
        function Scene() {
        }
        Scene.MENU = 0;
        Scene.PLAY = 1;
        Scene.OVER = 2;
        Scene.RULES = 3;
        return Scene;
    })();
    config.Scene = Scene;
})(config || (config = {}));
//# sourceMappingURL=screen.js.map