/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var Line = THREE.Line;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// Game Variables
// Message displayed to screen in index.html
var screenMessage = document.getElementById("message");
var messageWidth;
var scene;
var currentScene;
var renderer;
var camera;
var play;
var menu;
var over;
var stats;
var canvas;
var assets;
var manifest = [
    { id: "land", src: "../../Assets/audio/land.wav" },
    { id: "jump", src: "../../Assets/audio/jump.wav" },
    { id: "yeah", src: "../../Assets/audio/yeah.mp3" },
    { id: "bling", src: "../../Assets/audio/bling.wav" },
    { id: "damage", src: "../../Assets/audio/damage.mp3" },
    { id: "yayChord", src: "../../Assets/audio/yaychord.wav" },
    { id: "gameover", src: "../../Assets/audio/gameover.mp3" },
    { id: "gamelost", src: "../../Assets/audio/gamelost.wav" },
    { id: "StartButton", src: "../../Assets/images/StartButton.png" }
];
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this); // run init (initialize scene) when preload complete
    assets.loadManifest(manifest); // load array
}
function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}
function init() {
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
function onWindowResize() {
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
function gameLoop() {
    stats.update();
    scene.update();
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x1da2ba, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
    console.log("Finished setting up Camera...");
}
function changeScene() {
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
    }
}
window.onload = preload;
//# sourceMappingURL=game.js.map