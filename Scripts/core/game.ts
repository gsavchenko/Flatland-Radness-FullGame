/// <reference path="_reference.ts"/>

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

// THREEJS Aliases
import Scene = Physijs.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import LineBasicMaterial = THREE.LineBasicMaterial;
import PhongMaterial = THREE.MeshPhongMaterial;
import Material = THREE.Material;
import Texture = THREE.Texture;
import Line = THREE.Line;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import CScreen = config.Screen;
import Clock = THREE.Clock;

// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";

// Game Variables
// Message displayed to screen in index.html
var screenMessage = document.getElementById("message");
var messageWidth;

var scene: scenes.Scene;
var currentScene: number;
var renderer: Renderer;
var camera: PerspectiveCamera;

var play: scenes.Play;
var menu: scenes.Menu;
var over: scenes.Over;
var rules: scenes.Rules;

var stats: Stats;
var canvas: HTMLElement;
var assets: createjs.LoadQueue;
var manifest = [
    {id: "land", src:"../../Assets/audio/land.wav"},
    {id: "jump", src:"../../Assets/audio/jump.wav"},
    {id: "yeah", src:"../../Assets/audio/yeah.mp3"},
    {id: "bling", src:"../../Assets/audio/bling.wav"},
    {id: "damage", src:"../../Assets/audio/damage.mp3"},
    {id: "yayChord", src:"../../Assets/audio/yaychord.wav"},
    {id: "gameover", src:"../../Assets/audio/gameover.mp3"},
    {id: "gamelost", src:"../../Assets/audio/gamelost.wav"},
    {id: "background", src:"../../Assets/audio/background.mp3"}, // Eric Skiff Arpanauts
    {id: "StartButton", src: "../../Assets/images/StartButton.png"},
    {id: "ExitButton", src: "../../Assets/images/ExitButton.png"},
    {id: "InstructionsButton", src: "../../Assets/images/InstructionsButton.png"},
    {id: "RestartButton", src: "../../Assets/images/RestartButton.png"},
    {id: "MenuButton", src: "../../Assets/images/MenuButton.png"}
];

function preload(): void {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this); // run init (initialize scene) when preload complete
    assets.loadManifest(manifest); // load array
}

function setupCanvas(): void {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}

function init(): void {
    // setup the canvas for the game
    setupCanvas();

    // setup the default renderer
    setupRenderer();

    // setup the camera
    setupCamera();

    // set initial scene
    currentScene = config.Scene.MENU;
    changeScene();

    // Add framerate stats
    addStatsObject();

    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	

    // setup the resize event listener
    window.addEventListener('resize', onWindowResize, false);
}

// Window Resize Event Handler
function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.resize();
}

// Add Frame Rate Stats to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

// Setup main game loop
function gameLoop(): void {
    stats.update();

    scene.update();

    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);

    // render the scene
    renderer.render(scene, camera);
}


// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x1da2ba, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
    console.log("Finished setting up Camera...");
}

function changeScene(): void {
    // Launch various scenes
    switch (currentScene) {
        case config.Scene.MENU:
            // show the MENU scene
            menu = new scenes.Menu();
            scene = menu;
            console.log("Starting MENU Scene"); 
            break;
        case config.Scene.PLAY:
            // show the PLAY scene
            play = new scenes.Play();
            scene = play;
            console.log("Starting PLAY Scene");
            break;
        case config.Scene.OVER:
            // show the game OVER scene
            over = new scenes.Over();
            scene = over;
            console.log("Starting OVER Scene");
            break;
        case config.Scene.RULES:
            // show the game OVER scene
            rules = new scenes.Rules();
            scene = rules;
            console.log("Starting OVER Scene");
            break;
    }
}

window.onload = preload;

