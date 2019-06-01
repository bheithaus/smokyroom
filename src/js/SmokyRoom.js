// TODO
// - ONE SOURCE OF TRUTH, Data shall only be stored once
          // use conversion functions for any values that are calculated from the
          // source of truth

// - SERIOUS clean up and beautify (look into docker / ES6 / babel setup)
// - GET INTO MORE LOW-LEVEL ANIMATION CONTROL OF THE SMOKE


/*
  Smoky room

  date: 5/24/2019
  author: Brian Heithaus
*/

const CAMERA_START_POSITION = {
        x: 600,
        y: 400,
        z: 1000
      },
      ELAPSED_START_TIME = 200,
      PM_READING_INTERVAL_SECONDS = 20,
      INITIAL_RENDER_UPDATE_INTERVAL_SECONDS = .25,

      trialNumber = '17',
      timeScale = 20;

/**
 * [scalePMtoColorHSL description]
 * @param  {float} PM   particulate matter reading
 *
 * @return {object}    HSL
 * @return {object.H}    Hue
 * @return {object.L}    Lightness
 */
function scalePMtoColorHL(PM) {
  // ~ PM range 1 - 5000
  //
  // ????
  // thats challening to map to a color scale
  //
  // perhaps it should be based on 'safety' of PM levels?


  // hue, saturation, lightness - floats between 0 & 1
  // red 0 - .3 green

  let hue,
      lightness;

  if (PM < 1000) {
    hue = Math.abs(.3 - (PM * .3 / 1000));
    lightness = .5;
  } else {
    hue = 0;
    if (PM < 2000) {

      // old range from 5000 - 2000
      // new range from .1 - .3

      Math.abs(PM * .3 / 3000)
      lightness = .3;
    } else if (PM < 3000) {
      lightness = .2;
    } else {
      lightness = .1;
    }
  }

  return {
    h: hue,
    l: lightness
  }
}

function formatMSS(s) {return(s-(s%=60))/60+(9<s?':':':0')+s}

/* smoke.js */
class Smoke {
  constructor(options) {
    const defaults = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    Object.assign(this, options, defaults);

    // bind methods for external API
    this.onResize = this.onResize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.update = this.update.bind(this);

    this.addEventListeners();
    this.init();
  }

  init() {
    const { width, height } = this;

    this.clock = new THREE.Clock();
    this.clock.intervalCounter = 0;

    this.renderUpdateInterval = INITIAL_RENDER_UPDATE_INTERVAL_SECONDS;

    const renderer = this.renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);

    this.scene = new THREE.Scene();

    // mouseover
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.cubeSineDriver = 0;
    this.elapsedTime = ELAPSED_START_TIME;

    this.setupDisplayBox();
    this.addGui();
    this.addCamera();
    this.addControls();
    this.addStats();
    this.addLights();
    this.addHouse();
    this.addSkyBox();
    this.addSmokeSensorSpheres();
    this.addParticles();

    document.body.appendChild(renderer.domElement);
  }

  setupOutlinePass() {
    const {
      renderer,
      scene,
      camera
    } = this;

    const composer = this.composer = new THREE.EffectComposer( renderer );
    const outlinePass = this.outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    const renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );
    composer.addPass( outlinePass );
  }

  opacityFromPM(PM) {
    const opacity = PM / 1000;

    // value between 0 & 1
    return opacity;
  }

  evolveSmoke() {
    const {
      smokeSensors,
      camera,
      clock,
      timeSlider
    } = this;

    if (clock.intervalCounter > this.renderUpdateInterval) {
      clock.intervalCounter = 0;
      this.timeSlider.slider('value', this.elapsedTime);
      this.elapsedTime += 1;
    }

    const { elapsedTime } = this;

    let sensor,
        PM,
        hl;

    for (let i = 0; i < this.smokeSensors.length; i++) {
      sensor = this.smokeSensors[i];
      if (!sensor.particulateReadings[elapsedTime]) break;

      PM = sensor.particulateReadings[elapsedTime].PM;

      // every this.renderUpdateInterval seconds
      if (clock.intervalCounter === 0) {
        // update sphere colors with particulateReadings from data every 2 seconds

        hl = scalePMtoColorHL(PM);
        sensor.sphere.material.color.setHSL(hl.h, 0.5, hl.l);
        this.updateDisplayBox();

        // Update smokemesh opacity
        sensor.smokeParticles.forEach((smokeMesh) => {
          smokeMesh.material.opacity = this.opacityFromPM(PM);

          // simulate 3D
          smokeMesh.lookAt(camera.position);

          // move around a little
          // smokeMesh.translateX(1.3 * (Math.random() - .5));
          // smokeMesh.translateY(1.3 * (Math.random() - .5));
        });
      }
    };
  }

  setupDisplayBox() {
    const $displayBox = $('#pm-readings');

    this.$displayBox = {
      speed: $displayBox.find('#speed'),
      elapsedTime: $displayBox.find('#elapsed-time'),
      sensorReference: $displayBox.find('#sensor-reference'),
      PM: $displayBox.find('#pm'),
      min: $displayBox.find('#min'),
      max: $displayBox.find('#max'),
    };

    const $this = this;
    $('#pm-readings :checkbox').change(function(event) {
        if ($(this).is(':checked')) {
          $this.paused = true;
        } else {
          $this.paused = false;
          $this.update();
        }
    });
  }

  updateDisplayBox() {
    const {
      $displayBox,
      elapsedTime,
      intersectedSphere
    } = this;

    $displayBox.elapsedTime.text(formatMSS(PM_READING_INTERVAL_SECONDS * elapsedTime));

    if (intersectedSphere) {
      const sensor = intersectedSphere.sensor;

      $displayBox.sensorReference.text(sensor.sensor['Ref No.']);
      $displayBox.min.text(sensor.meta.min);
      $displayBox.max.text(sensor.meta.max);

      if (sensor.particulateReadings[elapsedTime]) {
        $displayBox.PM.text(sensor.particulateReadings[elapsedTime].PM);
      }
    }
  }

  addGui() {
    const { $displayBox } = this;

    // GUI for experimenting with parameters
    this.timeSlider = $('#time-slider').slider({
      min: 0,
      max: this.smokeSensors[0] && this.smokeSensors[0].particulateReadings.length,
      step: 1,

      change: (event, ui) => {
        // ~~ === performance optimized Math.floor
        this.elapsedTime = ~~ui.value;
        this.evolveSmoke();
        this.updateDisplayBox();
      }
    });

    // TODO - attempt to fix glitch in time slider @ high speed
    // $('#time-slider').mousedown(() => {

    // })

    // speedSlider
    this.speedSlider = $('#speed-slider').slider({
      min: 1,
      max: 20,
      step: 1,
      value: INITIAL_RENDER_UPDATE_INTERVAL_SECONDS,

      change: (event, ui) => {
        // ~~ === performance optimized Math.floor
        this.renderUpdateInterval = 1 / ~~ui.value;
        $displayBox.speed.text(`${ 20 * ui.value } x real-time speed`);
      }
    });
  }

  addLights() {
    const { scene } = this;
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
  }

  addCamera() {
    const { scene } = this;
    const SCREEN_WIDTH = window.innerWidth,
          SCREEN_HEIGHT = window.innerHeight;
    const VIEW_ANGLE = 45,
          ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
          NEAR = 2,
          FAR = 5000;

    const camera = this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(CAMERA_START_POSITION.x, CAMERA_START_POSITION.y, CAMERA_START_POSITION.z);
    camera.lookAt(scene.position);

    scene.add(camera);
  }

  addControls() {
    const { camera, renderer } = this;

    // CONTROLS
    this.controls = new THREE.OrbitControls(camera, renderer.domElement);
  }

  addStats() {
    const stats = this.stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
  }

  addParticles() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('images/smokeparticle.png');
    const smokeGeometry = new THREE.PlaneBufferGeometry(20, 20);
    const spaceRandomness = 50;

    this.smokeSensors.forEach((sensor) => {
      const smokeMaterial = new THREE.MeshLambertMaterial({
        // color: 0xefefef,
        map: texture,
        transparent: true,
        opacity: .1
      });
      smokeMaterial.map.minFilter = THREE.LinearFilter;

      const smokeMeshes = [];
      const smokeParticles = sensor.smokeParticles = [];
      let limit = 30;

      while(limit--) {
        smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);

        smokeMeshes[limit].position.set(
          sensor.position.x + (Math.random() - .5) * spaceRandomness,
          sensor.position.y + (Math.random() - .5) * spaceRandomness,
          sensor.position.z + (Math.random() - .5) * spaceRandomness
        );

        smokeMeshes[limit].rotation.z = Math.random() * 360;
        smokeParticles.push(smokeMeshes[limit]);

        scene.add(smokeMeshes[limit]);
      }

    });

  }

  findRaycasterIntersectedSphere() {
    const {
      raycaster,
      mouse,
      camera,
      scene,
      outlinePass
    } = this;
    let savedIntersectedSphere = this.intersectedSphere;
    const highlightedSphereColorScalar = 80;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children)
                                .filter(intersect => intersect.object && intersect.object.sensor);

    // well this just got ugly!
    if (intersects.length > 0) {
      const newlyIntersected = intersects[0].object;

      if (newlyIntersected == savedIntersectedSphere) {
        return savedIntersectedSphere;
      }

      if (newlyIntersected && newlyIntersected.sensor) {
        // its a sensor sphere!
        // reset saved sphere to looking normal
        if (savedIntersectedSphere) savedIntersectedSphere.material.opacity = 1;

        // set newlyIntersected sphere change look
        newlyIntersected.material.opacity = .5;

        return newlyIntersected;
      }
    } else {
      // reset saved one to looking normal
      if (savedIntersectedSphere) savedIntersectedSphere.material.opacity = 1;

      return null;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    if (!this.paused) {
      this.clock.intervalCounter += this.clock.getDelta();
    }

    this.evolveSmoke();
    this.controls.update();
    this.stats.update();
    this.render();

    requestAnimationFrame(this.update);
  }

  // EVENT HANDLERS
  onResize() {
    const { camera } = this;

    const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    this.renderer.setSize(windowWidth, windowHeight);
  }

  onMouseMove(event) {
    const { mouse } = this;
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.intersectedSphere = this.findRaycasterIntersectedSphere();
  }

  onMouseDown(event) {
    // return intersected sphere
    if (this.intersectedSphere != this.selectedSphere) {
      this.selectedSphere = this.intersectedSphere;
      console.log('new selectedSphere', this.selectedSphere);

      this.updateDisplayBox();
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('click', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove, false);
  }

  addSkyBox() {
    const { scene } = this;
    const skyBoxGeometry = new THREE.CubeGeometry(4000, 4000, 4000);
    const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xbad4ff, side: THREE.BackSide });
    const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

    scene.add(skyBox);
  }

  addSmokeSensorSpheres() {
    // spheres
    const { scene } = this;

    this.smokeSensors.forEach((sensor, i) => {
      const position = sensor.position;
      const geometry = new THREE.SphereGeometry(20, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0xbbb00,
        transparent: true
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(position.x, position.y, position.z);

      sensor.sphere = sphere;
      sphere.sensor = sensor;

      scene.add(sphere);
    });
  }

  // messy plane renderings
  addHouse() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const floorGeometry = new THREE.PlaneGeometry(1500, 1500, 10, 10);

    const floorTexture = textureLoader.load('images/checkerboard.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const floorMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: 0x444444,
      map: floorTexture,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // render house
    housePlaneRenderOptions.forEach((planeRenderOptions) => {
      renderPlane(planeRenderOptions);
    });

    function renderPlane(options) {
      console.log('Render plane', options);
      let defaultOptions = {
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        size: {
          h: 550,
          w: 550
        },
      };

      options = options || defaultPlaneOptions;

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('images/rock-512.jpg');
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0x444444,
        map: texture,
        side: THREE.DoubleSide
      });

      if (options.opacity && options.opacity < 1) {
        material.transparent = true;
        material.opacity = options.opacity;
      }

      const geometry = new THREE.PlaneGeometry(options.size.h, options.size.w, 10, 10);
      const plane = new THREE.Mesh(geometry, material);

      plane.position.set(options.position.x, options.position.y, options.position.z);
      plane.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

      scene.add(plane);
    };

    // cylinder
    (function(){
      const geometry = new THREE.CylinderGeometry(35, 35, 50, 64);
      const material = new THREE.MeshBasicMaterial({color: 0xff6a00});
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.set(150,25,-100);

      scene.add(cylinder);
    })();
  }
}

/* app.js */
$(function() {
  var parameters;

  getSmokeData()
    .then(function(smokeSensors) {
      const smoke = new Smoke({
        smokeSensors
      });
      smoke.update();
    });
})

function getSmokeData() {
  const promise = $.Deferred();

  $.get('/csv', processSmokeData(promise));

  return promise;
}

function processSmokeData(promise) {
  return function(response) {
    // scale to fit our 3d model
    const scale = 180,
        offsetX = -300,
        offsetY = -120,
        offsetZ = -250;

    const smokeSensors = [];

    // use array of sensors to position smoke emitters
    response.sensors.data.forEach(function(sensor, i) {
      const referenceNumber = sensor['Ref No.'];
      let readings;

      // TODO - make parsing of sensor readings more robust
      // (trial number could be problematic)
      if (!response.readings[referenceNumber + trialNumber]) {
        console.warn('WARNING: missing readings for Sensor - Ref No. ', referenceNumber)
      } else {
        readings = response.readings[referenceNumber + trialNumber];
        smokeSensors.push({
          sensor: sensor,
          position: {
            x: offsetX + scale * parseFloat(sensor['X']),
            y: offsetY + scale * parseFloat(sensor['Y']),
            z: offsetZ + scale * parseFloat(sensor['Z'])
          },
          meta: readings.meta,
          particulateReadings: readings.data
        });
      }
    });

    promise.resolve(smokeSensors);
  }
}
