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
module config {
    export class Screen {
        static WIDTH:number = window.innerWidth;
        static HEIGHT:number = window.innerHeight;
        static RATIO:number = window.innerWidth / window.innerHeight;
    }
    
    // Scene Constants
    export class Scene {
        public static MENU: number = 0;
        public static PLAY: number = 1;
        public static OVER: number = 2;
        public static RULES: number = 3;
    }
    
}