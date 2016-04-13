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
            this.currentLevel = 1;
            this.health = 100;
            this.score = 0;
            // real important game objects
            this.coins = [];
            this.boulders = [];
            this.platforms = [];
            this.numberOfBoulders = 4;
            this.numberOfCoins = 2;
            this.numberOfPlatforms = 0;
            this.gameOver = false;
            this.powerCharge = 100;
            this.isGroundLava = true;
            this.breakDuration = 1000;
            this.lavaDuration = 500;
            this.breakTimer = this.breakDuration;
            this.lavaTimer = this.lavaDuration;
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
                map: THREE.ImageUtils.loadTexture('../../Assets/images/bear.png')
            }), 0.4, 0);
            this.forest_t = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('../../Assets/images/forest.png')
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
            text2.style.fontSize = "20px";
            text2.style.top = 50 + 'px';
            text2.style.left = 50 + 'px';
            text2.innerHTML = "Health: " + this.health + "<br>"
                + "Score: " + this.score + "<br>"
                + "Power Charge: " + this.powerCharge + "<br>"
                + "Current Power Up: " + this.powerUp + "<br>"
                + "Current Level: " + this.currentLevel + "<br>";
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
            this.pointLight = new PointLight(0xffffff, 0.8, 0);
            this.pointLight.position.set(0, 1, 0);
            this.pointLight.castShadow = false;
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
            var wallGeo = new BoxGeometry(50, 1, 15);
            var wallMat = this.forest_t;
            this.switchGroundLava();
            // Wall One
            this.wall = new Physijs.ConvexMesh(wallGeo, wallMat, 0);
            this.wall.receiveShadow = true;
            this.wall.name = "Wall1";
            this.wall.rotation.x = Math.PI / 2;
            this.wall.position.set(0, 7, -25);
            this.add(this.wall);
            // Wall Two
            this.wall2 = new Physijs.ConvexMesh(wallGeo, wallMat, 0);
            this.wall2.receiveShadow = true;
            this.wall2.name = "Wall2";
            this.wall2.rotation.x = Math.PI / 2;
            this.wall2.rotation.z = Math.PI;
            this.wall2.position.set(0, 7, 25);
            this.add(this.wall2);
            // Wall Three
            this.wall3 = new Physijs.ConvexMesh(wallGeo, wallMat, 0);
            this.wall3.receiveShadow = true;
            this.wall3.name = "Wall3";
            this.wall3.rotation.x = -Math.PI / 2;
            this.wall3.rotation.z = -Math.PI / 2;
            this.wall3.position.set(25, 7, 0);
            this.add(this.wall3);
            // Wall Four
            this.wall4 = new Physijs.ConvexMesh(wallGeo, wallMat, 0);
            this.wall4.receiveShadow = true;
            this.wall4.name = "Wall4";
            this.wall4.rotation.x = Math.PI / 2;
            this.wall4.rotation.z = -Math.PI / 2;
            this.wall4.position.set(-25, 7, 0);
            this.add(this.wall4);
            console.log("Walls Added");
        };
        Play.prototype.switchGroundLava = function () {
            if (this.isGroundLava) {
                // Ground
                this.groundGeometry = new BoxGeometry(50, 1, 50);
                this.groundMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x20571b }), 0, 0);
                this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundMaterial, 0);
                this.ground.receiveShadow = true;
                this.ground.name = "Ground";
                this.add(this.ground);
                if (this.lava != undefined) {
                    this.remove(this.lava);
                }
                console.log("Added Ground to scene");
                this.isGroundLava = false;
            }
            else if (!this.isGroundLava) {
                // Lava
                this.lavaGeometry = new BoxGeometry(50, 1, 50);
                this.lavaMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xCF1020 }), 0, 0);
                this.lava = new Physijs.ConvexMesh(this.lavaGeometry, this.lavaMaterial, 0);
                this.lava.receiveShadow = true;
                this.lava.name = "Lava";
                this.add(this.lava);
                if (this.ground != undefined) {
                    this.remove(this.ground);
                }
                console.log("Added Lava to scene");
                this.isGroundLava = true;
            }
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
                else if (this.currentLevel == 3 && this.score == 30) {
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
                var pushUp = new Vector3(0, 25, 0);
                if (this.isGrounded) {
                    var curSpeed = 700.0;
                    if (this.powerUp == "Enhanced Movement") {
                        curSpeed = 1500.0;
                    }
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        velocity.z -= curSpeed * delta;
                    }
                    if (this.keyboardControls.moveLeft) {
                        velocity.x -= curSpeed * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        velocity.z += curSpeed * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        velocity.x += curSpeed * delta;
                    }
                    if (this.keyboardControls.jump) {
                        velocity.y += 4000.0 * delta;
                        if (this.player.position.y > 2) {
                            this.isGrounded = false;
                            createjs.Sound.play("jump");
                        }
                    }
                    if (this.keyboardControls.activatePower) {
                        if (this.powerCharge > 0) {
                            this.powerCharge -= 1.5;
                            this.updatePlayerStats();
                            // make boulders float
                            for (var i = 0; i < this.numberOfBoulders; i++) {
                                //if (this.boulders[i] == undefined) {
                                this.boulders[i].applyCentralForce(pushUp);
                            }
                            // make coins float
                            for (var i = 0; i < this.numberOfCoins; i++) {
                                if (this.coins[i] != undefined) {
                                    this.coins[i].applyCentralForce(pushUp);
                                }
                            }
                            this.player.applyCentralForce(pushUp);
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
                //coins will move freely once placed, alternatively we can have them 'slowly' move
                // away from the player.....
                // How many boulders to spawn in the different corners 
                for (var i = 0; i < this.numberOfBoulders; i++) {
                    // boulders search for player
                    var bSpeed = 1.5;
                    if (this.powerUp == "Enhanced Movement") {
                        bSpeed = 0.25;
                    }
                    if (this.boulders[i] != undefined) {
                        this.boulders[i].lookAt(this.player.position);
                        var direction = new Vector3(0, 0, 1.5);
                        direction.applyQuaternion(this.boulders[i].quaternion);
                        this.boulders[i].applyCentralForce(direction);
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
                if (eventObject.name === "Ground" || eventObject.name === "Lava") {
                    this.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "Boulder") {
                    if (this.powerUp == "Boulders are Coins") {
                        this.score = this.score + 1;
                        this.updatePlayerStats();
                        this.powerUp = "N/A";
                    }
                    else if (this.powerUp == "Immune") {
                    }
                    else {
                        this.health = this.health - 1;
                        this.updatePlayerStats();
                    }
                }
                if (eventObject.name === "CollectibleBall") {
                    this.score = this.score + 1;
                    /* George Please Fix
                    if (this.score < 10) {
                        this.flashFeedback();
                    } else {
                        this.giveFeedback();
                        createjs.Sound.play("gameover");
                    } */
                    this.SetPowerUp(eventObject.material);
                    var indexId = this.coins.indexOf(eventObject);
                    this.remove(this.coins[indexId]);
                    this.coins[indexId] = undefined;
                    this.updatePlayerStats();
                    console.log("Player hit the collectible ball");
                    createjs.Sound.play("bling");
                }
                if (eventObject.name === "Lava") {
                    this.health = 0;
                    this.updatePlayerStats();
                }
            }.bind(this));
            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0, 1, 0);
            this.simulate();
        };
        Play.prototype.SetPowerUp = function (material) {
            switch (material) {
                case this.yellow_t:
                    this.powerUp = "N/A";
                    break;
                case this.blue_t:
                    this.powerUp = "Boulders are Coins";
                    break;
                case this.red_t:
                    this.powerUp = "Enhanced Movement";
                    break;
                case this.green_t:
                    this.powerUp = "Immune";
                    break;
            }
        };
        Play.prototype.determineLevels = function () {
            //set the current level based on current score
            if (this.score < 10) {
                this.currentLevel = 1;
            }
            else if (this.score > 9 && this.score < 20) {
                this.currentLevel = 2;
            }
            else if (this.score > 19) {
                this.currentLevel = 3;
            }
            //set the current game object maximums based on current level
            if (this.currentLevel == 1) {
                this.numberOfBoulders = 4;
                this.numberOfCoins = 2;
                this.numberOfPlatforms = 2;
            }
            else if (this.currentLevel == 2) {
                this.numberOfBoulders = 8;
                this.numberOfCoins = 3;
                this.numberOfPlatforms = 1;
            }
            else if (this.currentLevel == 3) {
                this.numberOfBoulders = 16;
                this.numberOfCoins = 4;
                this.numberOfPlatforms = 0;
            }
            //Reset plaforms if the current level has changed
            if (this.numberOfPlatforms != this.platforms.length) {
                for (var i = 0; i < this.platforms.length; i++) {
                    if (this.platforms[i] != undefined) {
                        this.remove(this.platforms[i]);
                        this.platforms.splice(i, 1);
                    }
                }
            }
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
            this.determineLevels();
            if (!this.keyboardControls.paused) {
                this.simulate();
            }
            if (this.powerCharge < 100 && !this.keyboardControls.activatePower) {
                this.powerCharge += 1;
                this.updatePlayerStats();
            }
            if (this.breakTimer > 0) {
                this.breakTimer -= 1;
                if (!this.isGroundLava && this.breakTimer < 500) {
                    if (this.health > 0) {
                        this.displayMessage("The ground is going to turn into lava in " + Math.ceil(this.breakTimer / 100) + " seconds!");
                    }
                }
                else {
                    this.displayMessage("");
                }
            }
            else {
                this.switchGroundLava();
                if (!this.isGroundLava) {
                    this.breakTimer = this.breakDuration;
                    console.log("reached here 1");
                }
                if (this.isGroundLava) {
                    this.breakTimer = this.lavaDuration;
                    console.log("reached here 2");
                }
            }
            if (this.isGameOver()) {
                // Exit Pointer Lock
                document.exitPointerLock();
                this.children = []; // an attempt to clean up
                // Play the Game Over Scene
                currentScene = config.Scene.OVER;
                changeScene();
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
        Play.prototype.isGameOver = function () {
            if (this.health <= 0 || this.score >= 30) {
                return true;
            }
            else {
                return false;
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
            this.spawnPlatforms(); // add platforms to make game easier;
        };
        // Spawn boulders (do damage)
        Play.prototype.spawnBoulders = function () {
            for (var i = 0; i < this.numberOfBoulders; i++) {
                if (this.boulders[i] == undefined) {
                    var xRand = this.getRandomSphereCoordinate();
                    var zRand = this.getRandomSphereCoordinate();
                    this.sphereGeometry = new SphereGeometry(1, 32, 32);
                    this.sphereMaterial = this.rock_t;
                    this.sphere = new Physijs.SphereMesh(this.sphereGeometry, this.sphereMaterial, 2);
                    this.sphere.position.set(xRand, 5, zRand);
                    this.sphere.receiveShadow = true;
                    this.sphere.castShadow = true;
                    this.sphere.name = "Boulder";
                    this.boulders[i] = (this.sphere);
                    this.add(this.boulders[i]);
                }
            }
        };
        ;
        // Spawn the 'collectible' ball (scores points)
        Play.prototype.spawnCollecibleBall = function () {
            // Collectible Ball object            
            for (var i = 0; i < this.numberOfCoins; i++) {
                if (this.coins[i] == undefined) {
                    //coins can now drop anywhere :) 
                    var xRand = this.getRandomInt(-20, 20);
                    var zRand = this.getRandomInt(-20, 20);
                    this.sphereGeometry = new SphereGeometry(0.5, 32, 32);
                    this.sphereMaterial = this.getCoinMaterial(); //get material randomly (trexture) (learn english)
                    this.sphere = new Physijs.SphereMesh(this.sphereGeometry, this.sphereMaterial, 2);
                    this.sphere.position.set(xRand, 5, zRand);
                    this.sphere.receiveShadow = true;
                    this.sphere.castShadow = true;
                    this.sphere.name = "CollectibleBall";
                    this.coins[i] = (this.sphere);
                    this.add(this.coins[i]);
                }
            }
        };
        Play.prototype.spawnPlatforms = function () {
            for (var i = 0; i < this.numberOfPlatforms; i++) {
                if (this.platforms[i] == undefined) {
                    //coins can now drop anywhere :) 
                    var xRand = this.getRandomInt(-20, 20);
                    var zRand = this.getRandomInt(-20, 20);
                    var cubeGeo = new CubeGeometry(3, 3, 4);
                    var cubeMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xaa000a }), 0, 0); // George is an asshole about everything I do. </3
                    var platform = new Physijs.BoxMesh(cubeGeo, cubeMaterial, 100);
                    platform.position.set(xRand, 5, zRand);
                    platform.receiveShadow = true;
                    platform.castShadow = true;
                    platform.name = "Platform";
                    this.platforms[i] = (platform);
                    this.add(this.platforms[i]);
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