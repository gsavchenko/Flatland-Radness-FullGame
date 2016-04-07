var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * The Scenes module is a namespace to reference all scene objects
 *
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * The Play class is where the main action occurs for the game
     *
     * @class Play
     * @param havePointerLock {boolean}
     */
    var Play = (function (_super) {
        __extends(Play, _super);
        /**
         * @constructor
         */
        function Play() {
            _super.call(this);
            this.health = 100;
            this.score = 0;
            this.coins = [];
            this.boulders = [];
            this.numberOfBoulders = 10;
            this.numberOfCoins = 2;
            this.gameOver = false;
            this.blue_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/blue_t.png')
            }), 0.4, 0);
            this.yellow_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/yellow_t.png')
            }), 0.4, 0);
            this.red_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/red_t.png')
            }), 0.4, 0);
            this.green_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/green_t.png')
            }), 0.4, 0);
            this.rock_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/rock_t.png')
            }), 0.4, 0);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++
        /**
         * Sets up the initial canvas for the play scene
         *
         * @method setupCanvas
         * @return void
         */
        Play.prototype._setupCanvas = function () {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", "0");
            canvas.style.backgroundColor = "#000000";
        };
        /**
         * The initialize method sets up key objects to be used in the scene
         *
         * @method _initialize
         * @returns void
         */
        Play.prototype._initialize = function () {
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";
            // setup canvas for menu scene
            this._setupCanvas();
            this.updatePlayerStats(); // display player stats (health/score) on initialization   
            this.coins = [];
            for (var i = 0; i < this.numberOfCoins; i++) {
                this.coins.push(undefined);
            }
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            // setup a THREE.JS Clock object
            this.clock = new Clock();
            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        };
        /**
         * This method sets up the scoreboard for the scene
         *
         * @method setupScoreboard
         * @returns void
         */
        Play.prototype.updatePlayerStats = function () {
            var text2 = document.getElementById("playerStats");
            text2.style.color = "white";
            text2.style.fontSize = "20";
            text2.style.top = 50 + 'px';
            text2.style.left = 50 + 'px';
            text2.innerHTML = "Health: " + this.health + "<br>"
                + "Score: " + this.score + "<br><br>"
                + "Current Power Up: " + this.powerUp + "<br>"
                + "Power Up Time Remaining: " + this.powerUpTime;
        };
        /**
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        Play.prototype.addSpotLight = function () {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(0, 150, 0);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 1;
            this.spotLight.lookAt(new Vector3(0, 0, 0));
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
            //Add point light
            this.pointLight = new PointLight(0xffffff, 1, 0);
            this.pointLight.position.set(0, 50, 0);
            this.pointLight.castShadow = true;
            this.add(this.pointLight);
            console.log("Added pointLight to scene");
        };
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        Play.prototype.addGround = function () {
            // Ground
            this.groundGeometry = new BoxGeometry(50, 1, 50);
            var wallGeo = new BoxGeometry(50, 1, 15);
            this.groundMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
            // Wall One
            this.wall = new Physijs.ConvexMesh(wallGeo, this.groundMaterial, 0);
            this.wall.receiveShadow = true;
            this.wall.name = "Wall1";
            this.wall.rotation.x = Math.PI / 2;
            ;
            this.wall.position.set(0, 7, -25);
            this.add(this.wall);
            // Wall Two
            this.wall2 = new Physijs.ConvexMesh(wallGeo, this.groundMaterial, 0);
            this.wall2.receiveShadow = true;
            this.wall2.name = "Wall2";
            this.wall2.rotation.x = -Math.PI / 2;
            ;
            this.wall2.position.set(0, 7, 25);
            this.add(this.wall2);
            // Wall Three
            this.wall3 = new Physijs.ConvexMesh(wallGeo, this.groundMaterial, 0);
            this.wall3.receiveShadow = true;
            this.wall3.name = "Wall3";
            this.wall3.rotation.x = -Math.PI / 2;
            ;
            this.wall3.rotation.z = -Math.PI / 2;
            ;
            this.wall3.position.set(25, 7, 0);
            this.add(this.wall3);
            // Wall Four
            this.wall4 = new Physijs.ConvexMesh(wallGeo, this.groundMaterial, 0);
            this.wall4.receiveShadow = true;
            this.wall4.name = "Wall4";
            this.wall4.rotation.x = -Math.PI / 2;
            ;
            this.wall4.rotation.z = -Math.PI / 2;
            ;
            this.wall4.position.set(-25, 7, 0);
            this.add(this.wall4);
            console.log("Walls Added");
        };
        /**
         * Adds the player controller to the scene
         *
         * @method addPlayer
         * @return void
         */
        Play.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 2, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(20, 5, 5);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.player.rotation.y = 1.5;
            this.add(this.player);
            console.log("Added Player to Scene");
        };
        /**
         * Event Handler method for any pointerLockChange events
         *
         * @method pointerLockChange
         * @return void
         */
        Play.prototype.pointerLockChange = function (event) {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            }
            else {
                if (this.health <= 0) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                }
                else {
                    this.blocker.style.display = '-webkit-box';
                    this.blocker.style.display = '-moz-box';
                    this.blocker.style.display = 'box';
                    this.instructions.style.display = '';
                }
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                console.log("PointerLock disabled");
            }
        };
        /**
         * Event handler for PointerLockError
         *
         * @method pointerLockError
         * @return void
         */
        Play.prototype.pointerLockError = function (event) {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        };
        // Check Controls Function
        /**
         * This method updates the player's position based on user input
         *
         * @method checkControls
         * @return void
         */
        Play.prototype.checkControls = function () {
            if (this.keyboardControls.enabled) {
                var velocity = new THREE.Vector3();
                var time = performance.now();
                var delta = (time - this.prevTime) / 1000;
                var direction = new Vector3(0, 0, 0);
                if (this.isGrounded) {
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        velocity.z -= 600.0 * delta;
                    }
                    if (this.keyboardControls.moveLeft) {
                        velocity.x -= 600.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        velocity.z += 600.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        velocity.x += 600.0 * delta;
                    }
                    if (this.keyboardControls.jump) {
                        velocity.y += 4000.0 * delta;
                        if (this.player.position.y > 2) {
                            this.isGrounded = false;
                            createjs.Sound.play("jump");
                        }
                    }
                    this.player.setDamping(0.9, 0.1);
                    // Changing player's rotation
                    this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                    direction.addVectors(direction, velocity);
                    direction.applyQuaternion(this.player.quaternion);
                    if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                        this.player.applyCentralForce(direction);
                    }
                    this.cameraLook();
                } // isGrounded ends
                for (var i = 0; i < this.numberOfCoins; i++) {
                    var velocity2 = new Vector3();
                    var direction2 = new Vector3();
                    var rand = this.getRandomInt(0, 100);
                    // Trying to get balls going back and forth
                    // Get random number between 0 and 100 to provide more *even* ball movement
                    // 0 - 24 = apply force to ball positively along x axis
                    // 25 - 49 = apply force to ball negatively along x axis
                    // 50 - 74 = apply force to ball positively along z axis
                    // 75 - 100 = apply force to ball negatively along z axis
                    if (rand < 25) {
                        velocity2.x += 500 * delta;
                    }
                    else if (rand > 25 && rand < 50) {
                        velocity2.x -= 500 * delta;
                    }
                    else if (rand > 50 && rand < 75) {
                        velocity2.z += 500 * delta;
                    }
                    else {
                        velocity2.z -= 500 * delta;
                    }
                    direction2.addVectors(direction2, velocity2);
                    // If the collecitble ball is NOT undefined give it a rotation and apply force
                    if (this.coins[i] != undefined) {
                        direction2.applyQuaternion(this.coins[i].quaternion);
                        this.coins[i].applyCentralForce(direction2);
                    }
                }
                // How many boulders to spawn in the different corners 
                for (var i = 0; i < this.numberOfBoulders; i++) {
                    var velocity3 = new Vector3();
                    var direction3 = new Vector3();
                    var rand = this.getRandomInt(0, 100);
                    if (rand < 25) {
                        velocity3.x += 500 * delta;
                    }
                    else if (rand > 25 && rand < 50) {
                        velocity3.x -= 500 * delta;
                    }
                    else if (rand > 50 && rand < 75) {
                        velocity3.z += 500 * delta;
                    }
                    else {
                        velocity3.z -= 500 * delta;
                    }
                    // If boulders are NOT undefined apply a rotation/speed/force
                    direction3.addVectors(direction3, velocity3);
                    if (this.boulders[i] != undefined) {
                        direction3.applyQuaternion(this.boulders[i].quaternion);
                        this.boulders[i].applyCentralForce(direction3);
                    }
                }
                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;
                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        }; // checkControls ends
        // Helper method that returns random number between min/max
        Play.prototype.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        ;
        Play.prototype._unpauseSimulation = function () {
            this.onSimulationResume();
            console.log("resume simulation");
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Play.prototype.start = function () {
            var _this = this;
            // Set Up Scoreboard
            this.updatePlayerStats();
            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;
            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;
                this.instructions.addEventListener('click', function () {
                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");
                    _this.element.requestPointerLock = _this.element.requestPointerLock ||
                        _this.element.mozRequestPointerLock ||
                        _this.element.webkitRequestPointerLock;
                    _this.element.requestPointerLock();
                });
                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }
            // Scene changes for Physijs
            this.name = "Main";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));
            // start simulation
            /*
            this.addEventListener('update', this._simulateScene);
            console.log("Start Simulation"); */
            // Add Spot Light to the scene
            this.addSpotLight();
            // Ground Object
            this.addGround();
            // Add player controller
            this.addPlayer();
            // Collision Check
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    this.isGrounded = true;
                    createjs.Sound.play("land");
                    console.log("player hit the ground");
                }
                if (eventObject.name === "Boulder") {
                    this.health = this.health - 1;
                    if (this.health <= 0) {
                        this.health = 0;
                        createjs.Sound.play("gamelost");
                        // Exit Pointer Lock
                        document.exitPointerLock();
                        this.children = []; // an attempt to clean up
                        this._isGamePaused = true;
                        // Play the Game Over Scene
                        currentScene = config.Scene.OVER;
                        changeScene();
                    }
                    this.updatePlayerStats();
                    console.log("player hit the boulder");
                }
                if (eventObject.name === "CollectibleBall") {
                    this.score = this.score + 1;
                    /* George Please Fix
                    if(this.score < 10){
                        this.flashFeedback();
                    } else {
                        this.giveFeedback();
                        createjs.Sound.play("gameover");
                    } */
                    var indexId = this.coins.indexOf(eventObject);
                    this.remove(this.coins[indexId]);
                    this.coins[indexId] = undefined;
                    this.updatePlayerStats();
                    console.log("Player hit the collectible ball");
                    createjs.Sound.play("bling");
                }
            }.bind(this));
            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0, 1, 0);
            this.simulate();
        };
        /**
         * Camera Look function
         *
         * @method cameraLook
         * @return void
         */
        Play.prototype.cameraLook = function () {
            var zenith = THREE.Math.degToRad(30);
            var nadir = THREE.Math.degToRad(-30);
            var cameraPitch = camera.rotation.x + this.mouseControls.pitch;
            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        };
        /**
         * @method update
         * @returns void
         */
        Play.prototype.update = function () {
            this.checkControls();
            this.stage.update();
            this.checkSpawns();
            this.checkScores();
            if (!this.keyboardControls.paused) {
                this.simulate();
            }
        };
        /**
         * Responds to screen resizes
         *
         * @method resize
         * @return void
         */
        Play.prototype.resize = function () {
            canvas.style.width = "100%";
            this.stage.update();
        };
        // Function that checks scores and game over (contantly looped)
        Play.prototype.checkScores = function () {
            var btnString = "<br><br><br>Press 'R' + 'Y' to restart the game...";
            if (this.health <= 0) {
                // Player lost, show message and restart
                this.health = 0;
                this.displayMessage("You lost... :'( Try again!" + btnString);
                this.gameOver = true;
            }
            else if (this.score >= 10) {
                // Player won, show message and restart
                this.displayMessage("You win yeah! :)" + btnString);
                this.gameOver = true;
            }
            else {
                this.gameOver = false;
            }
        };
        // Displays given string to screen (using the "message" div/id in index.html)
        Play.prototype.displayMessage = function (message) {
            screenMessage.style.color = "white";
            screenMessage.style.fontSize = "60px";
            messageWidth = (screenMessage.clientWidth / 2);
            screenMessage.style.display = "none";
            screenMessage.style.top = 200 + 'px';
            screenMessage.style.left = ((screen.width / 2) - messageWidth) + 'px';
            screenMessage.innerHTML = message;
            screenMessage.style.display = "block";
        };
        // Check spawns helper method
        Play.prototype.checkSpawns = function () {
            this.spawnBoulders();
            this.spawnCollecibleBall();
        };
        // Spawn boulders (do damage)
        Play.prototype.spawnBoulders = function () {
            for (var i = 0; i < this.numberOfBoulders; i++) {
                if (this.boulders[i] == undefined) {
                    var xRand = this.getRandomSphereCoordinate();
                    var zRand = this.getRandomSphereCoordinate();
                    this.sphereGeometry = new SphereGeometry(1, 32, 32);
                    this.sphereMaterial = this.rock_t;
                    this.sphere = new Physijs.SphereMesh(this.sphereGeometry, this.sphereMaterial, 1);
                    this.sphere.position.set(xRand, 5, zRand);
                    this.sphere.receiveShadow = true;
                    this.sphere.castShadow = true;
                    this.sphere.name = "Boulder";
                    this.boulders.push(this.sphere);
                    this.add(this.boulders[i]);
                }
            }
        };
        ;
        // Spawn the 'collectible' ball (scores points)
        Play.prototype.spawnCollecibleBall = function () {
            // Collectible Ball object            
            for (var i = 0; i < this.numberOfCoins; i++) {
                if (this.coins[i] == undefined || this.coins[i].name == "Reset") {
                    var xRand = this.getRandomSphereCoordinate();
                    var zRand = this.getRandomSphereCoordinate();
                    this.sphereGeometry = new SphereGeometry(0.5, 32, 32);
                    this.sphereMaterial = this.getCoinMaterial(); //get material randomly (trexture)
                    this.sphere = new Physijs.SphereMesh(this.sphereGeometry, this.sphereMaterial, 1);
                    this.sphere.position.set(xRand, 5, zRand);
                    this.sphere.receiveShadow = true;
                    this.sphere.castShadow = true;
                    this.sphere.name = "CollectibleBall";
                    this.coins[i] = this.sphere;
                    this.add(this.coins[i]);
                }
            }
        };
        Play.prototype.getCoinMaterial = function () {
            var returnMaterial;
            var rand = this.getRandomInt(0, 100);
            if (rand < 70) {
                returnMaterial = this.yellow_t;
            }
            else if (rand >= 70 && rand < 80) {
                returnMaterial = this.green_t;
            }
            else if (rand >= 80 && rand < 90) {
                returnMaterial = this.red_t;
            }
            else {
                returnMaterial = this.blue_t;
            }
            return returnMaterial;
        };
        // Get random coordinates helper method
        Play.prototype.getRandomSphereCoordinate = function () {
            var ret = 0; // Middle pls rename
            var intRand = this.getRandomInt(0, 100);
            if (intRand > 50) {
                ret = 20;
            }
            else {
                ret = -20;
            }
            return ret;
        };
        return Play;
    })(scenes.Scene);
    scenes.Play = Play;
})(scenes || (scenes = {}));
//# sourceMappingURL=play.js.map