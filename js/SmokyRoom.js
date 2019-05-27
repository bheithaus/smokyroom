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
      ELAPSED_START_TIME = 0,

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
  // ~ PM range 1 - 1000

  // 1 - 300 / greens
  // 300 - 600 / yellows
  //
  // OldRange = (OldMax - OldMin)
  // NewRange = (NewMax - NewMin)
  // NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin

  // hue, saturation, lightness - floats between 0 & 1
  // red 0 - .3 green

  return {
    h: Math.abs(.3 - (PM * .3 / 1000)),
    l: .5
  }
}

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
    this.onMouseMove = this.onMouseMove.bind(this);
    this.update = this.update.bind(this);

    this.addEventListeners();
    this.init();
  }

  init() {
    const { width, height } = this;

    this.clock = new THREE.Clock();
    this.clock.twoSecondInterval = 0;
    const renderer = this.renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);

    this.scene = new THREE.Scene();

    // mouseover
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const meshGeometry = new THREE.CubeGeometry(200, 200, 200);
    const meshMaterial = new THREE.MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);

    this.cubeSineDriver = 0;
    this.elapsedTime = ELAPSED_START_TIME;

    this.addGui();
    this.addCamera();
    this.addControls();
    this.addStats();
    this.addLights();
    this.addHouse();
    this.addSkyBox();
    this.addSmokePoints();
    this.addParticles();
    this.addBackground();
    this.setupDisplayBox();

    document.body.appendChild(renderer.domElement);
  }

  evolveSmoke(delta) {
    const { smokeParticles } = this;

    let smokeParticlesLength = smokeParticles.length;

    while(smokeParticlesLength--) {
      smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
    }
  }

  setupDisplayBox() {
    const $displayBox = $('.pm-readings');

    this.displayBox = {
      elapsedTime: $displayBox.find('#elapsed-time'),
      sensorReference: $displayBox.find('#sensor-reference'),
      PM: $displayBox.find('#pm')
    };
  }

  updateDisplayBox() {
    const {
      displayBox,
      elapsedTime,
      intersectedSphere
    } = this;

    displayBox.elapsedTime.text(elapsedTime);


    if (intersectedSphere) {
    console.log(intersectedSphere, intersectedSphere.sensor)
      const sensor = intersectedSphere.sensor;

      displayBox.sensorReference.text(sensor.sensor['Ref No.']);

      if (sensor.ParticulateReadings[elapsedTime]) {
        displayBox.PM.text(sensor.ParticulateReadings[elapsedTime].PM);
      }
    }
  }

  addGui() {
    // GUI for experimenting with parameters
    const gui = this.gui = new dat.GUI();

    this.timeSlider = gui.add({ 'time': this.elapsedTime }, 'time')
    .min(0)
    .max(this.smokeSensors[0] && this.smokeSensors[0].ParticulateReadings.length)
    .step(1)
    .onChange((newValue) => {
      this.elapsedTime = newValue;
      this.updateDisplayBox();
    });

    gui.open();
  }

  addLights() {
    const { scene } = this;
    const light = new THREE.DirectionalLight(0xffffff, 0.75);

    light.position.set(-1, 0, 1);
    scene.add(light);
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
    this.controls = new THREE.OrbitControls( camera, renderer.domElement );
  }

  addStats() {
    const stats = this.stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );
  }

  addParticles() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const smokeParticles = this.smokeParticles = [];

    textureLoader.load('images/smoke512.png', texture => {
      const smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true
      });
      smokeMaterial.map.minFilter = THREE.LinearFilter;
      const smokeGeometry = new THREE.PlaneBufferGeometry(300, 300);

      const smokeMeshes = [];
      let limit = 10;

      while(limit--) {
        smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
        smokeMeshes[limit].position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
        smokeMeshes[limit].rotation.z = Math.random() * 360;
        smokeParticles.push(smokeMeshes[limit]);
        scene.add(smokeMeshes[limit]);
      }
    });
  }

  addBackground() {
    // const { scene } = this;
    // const textureLoader = new THREE.TextureLoader();
    // const textGeometry = new THREE.PlaneBufferGeometry(600, 320);

    // textureLoader.load('https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/background.jpg', texture => {
    //   const textMaterial = new THREE.MeshLambertMaterial({
    //     blending: THREE.AdditiveBlending,
    //     color: 0xffffff,
    //     map: texture,
    //     opacity: 1,
    //     transparent: true
    //   });
    //   textMaterial.map.minFilter = THREE.LinearFilter;
    //   const text = new THREE.Mesh(textGeometry, textMaterial);

    //   text.position.z = 800;
    //   scene.add(text);
    // });
  }

  findRaycasterIntersects() {
    const {
      raycaster,
      mouse,
      camera,
      scene
    } = this;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      if ( this.intersectedSphere != intersects[0].object ) {
        if (intersects[0].object && intersects[0].object.sensor) {
          // its a sensor sphere!
          this.intersectedSphere = intersects[0].object;
          this.updateDisplayBox();
        }
      }
    } else {
      // this.intersectedSphere = null;
    }
  }

  render() {
    const { mesh } = this;
    let { cubeSineDriver } = this;

    cubeSineDriver += 0.01;

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;

    this.findRaycasterIntersects();

    this.renderer.render(this.scene, this.camera);
  }

  update() {
    const { clock, stats, controls, timeSlider } = this;
    const delta = clock.getDelta();
    let { elapsedTime } = this;
    clock.twoSecondInterval += delta;

    controls.update();
    stats.update();

    this.evolveSmoke(this.clock.delta);
    this.render();

    requestAnimationFrame(this.update);

    if (clock.twoSecondInterval > 2) {
      elapsedTime += 1;
      clock.twoSecondInterval = 0;
      timeSlider.setValue(elapsedTime);
    }

    this.smokeSensors.forEach((sensor) => {
      // change color based on scale
      var PM;

      if (clock.twoSecondInterval === 0) {
        // update with ParticulateReadings from data every 2 seconds
        const hl = scalePMtoColorHL(sensor.ParticulateReadings[elapsedTime] && sensor.ParticulateReadings[elapsedTime].PM);
        sensor.sphere.material.color.setHSL(hl.h, 0.5, hl.l);
        this.updateDisplayBox();
      }
    });
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

  onMouseMove( event ) {
    const { mouse } = this;
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove, false);
  }

  addSkyBox() {
    const { scene } = this;
    const skyBoxGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
    const skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xbad4ff, side: THREE.BackSide } );
    const skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );

    scene.add(skyBox);
  }

  addSmokePoints() {
    const { scene, gui } = this;


    // HSL TESTER
    //
    // let storedSensor;
    // let hsl = {
    //   h: .3,
    //   s: 1,
    //   l: 1
    // }

    // gui.add(hsl, 'h')
    //   .min(0)
    //   .max(1)
    //   .onChange((newValue) => {
    //     storedSensor.sphere.material.color.setHSL(newValue, hsl.s, hsl.l);
    //   });

    // gui.add(hsl, 's')
    //   .min(0)
    //   .max(1)
    //   .onChange((newValue) => {
    //     storedSensor.sphere.material.color.setHSL(hsl.h, newValue, hsl.l);
    //   });

    // gui.add(hsl, 'l')
    //   .min(0)
    //   .max(1)
    //   .onChange((newValue) => {
    //     storedSensor.sphere.material.color.setHSL(hsl.h, hsl.s, newValue);
    //   });

    this.smokeSensors.forEach((sensor, i) => {
      const position = sensor.position;
      const geometry = new THREE.SphereGeometry( 20, 10, 5 );
      const material = new THREE.MeshBasicMaterial( {color: 0xbbb00} );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.set(position.x, position.y, position.z);

      sensor.sphere = sphere;
      sphere.sensor = sensor;

      scene.add( sphere );

      // console.log('create particle engine at point', smokeDataPoint),
      // smokeDataPoint.particleValues = this.smokeParticleEngineMeta;

      // // custom position
      // smokeDataPoint.particleValues.positionBase = new THREE.Vector3( smokeDataPoint.coords.x, smokeDataPoint.coords.y, smokeDataPoint.coords.z );
      // // smokeDataPoint.particleValues.opacity = 1;

      // const engine = new ParticleEngine();
      // engine.data = smokeDataPoint;
      // engine.setValues( smokeDataPoint.particleValues );
      // engine.initialize();

      // this.particleEngines.push(engine);
    });
  }

  // messy plane renderings
  addHouse() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const floorGeometry = new THREE.PlaneGeometry(1500, 1500, 10, 10);

    const floorTexture = textureLoader.load('images/checkerboard.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );

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
      texture.repeat.set( 10, 10 );
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
      const geometry = new THREE.CylinderGeometry( 35, 35, 50, 64 );
      const material = new THREE.MeshBasicMaterial( {color: 0x384170} );
      const cylinder = new THREE.Mesh( geometry, material );
      cylinder.position.set(150,25,-100);

      scene.add( cylinder );
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
    response.sensors.forEach(function(sensor, i) {
      const referenceNumber = sensor['Ref No.'];
      // TODO - make parsing of sensor readings more robust
      // (trial number could be problematic)
      if (!response.readings[referenceNumber + trialNumber]) {
        console.warn('WARNING: missing readings for Sensor - Ref No. ', referenceNumber)
      } else {
        smokeSensors.push({
          sensor: sensor,
          position: {
            x: offsetX + scale * parseFloat(sensor['X']),
            y: offsetY + scale * parseFloat(sensor['Y']),
            z: offsetZ + scale * parseFloat(sensor['Z'])
          },
          ParticulateReadings: response.readings[referenceNumber + trialNumber]
        });
      }
    });

    promise.resolve(smokeSensors);
  }
}

// // FUNCTIONS
// function init()
// {
//   // SCENE
//   scene = new THREE.Scene();
//   // CAMERA
//   var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
//   var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
//   camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
//   scene.add(camera);
//   camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
//   camera.lookAt(scene.position);
//   // RENDERER
//   if ( Detector.webgl )
//     renderer = new THREE.WebGLRenderer( {antialias:true} );
//   else
//     renderer = new THREE.CanvasRenderer();
//   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
//   container = document.getElementById( 'ThreeJS' );
//   container.appendChild( renderer.domElement );
//   // EVENTS
//   THREEx.WindowResize(renderer, camera);
//   THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
//   // CONTROLS
//   controls = new THREE.OrbitControls( camera, renderer.domElement );
//   // STATS
//   stats = new Stats();
//   stats.domElement.style.position = 'absolute';
//   stats.domElement.style.bottom = '0px';
//   stats.domElement.style.zIndex = 100;
//   container.appendChild( stats.domElement );

//   // LIGHT
//   var light = new THREE.PointLight(0xffffff);
//   light.position.set(0,250,0);
//   scene.add(light);

//   drawHouse(scene);

//   // SKYBOX/FOG
//   // var skyBoxGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
//   // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xbad4ff, side: THREE.BackSide } );
//   // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
//   //   // scene.add(skyBox);

//   ////////////
//   // CUSTOM //
//   ////////////
// }



// function animate()
// {
//   requestAnimationFrame( animate );
//   render();
//   update();
// }

// function restartEngine(parameters)
// {
//   resetCamera();

//   // change to color renders or smoke renders

//   window.particleEngines.forEach((engine) => {
//     engine.destroy();
//     engine = new ParticleEngine();
//     engine.setValues( parameters );
//     engine.initialize();
//   })
// }

// function resetCamera()
// {
//   // CAMERA
//   var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
//   var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
//   camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
//   //camera.up = new THREE.Vector3( 0, 0, 1 );
//   camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
//   camera.lookAt(scene.position);
//   scene.add(camera);

//   controls = new THREE.OrbitControls( camera, renderer.domElement );
//   THREEx.WindowResize(renderer, camera);
// }

// function update()
// {
//   controls.update();
//   stats.update();

//   var dt = clock.getDelta();
//   clock.twoSecondInterval += dt;

//   if (clock.twoSecondInterval > 2) {
//     elapsedTime += 1;
//     clock.twoSecondInterval = 0;
//     window.timeSlider.setValue(elapsedTime);
//   }

//   window.particleEngines.forEach(function(engine) {
//     var ParticulateReadings;
//     if (clock.twoSecondInterval === 0) {
//       // update with ParticulateReadings from data every 2 seconds
//       ParticulateReadings = engine.data.ParticulateReadings[elapsedTime] && engine.data.ParticulateReadings[elapsedTime].PM  * SMOKE_ParticulateReadings_SCALE;

//       // console.log('update smoke ParticulateReadings', ParticulateReadings);
//       // console.log('engine.data', engine.data.sensor)
//     }

//     engine.update(dt, ParticulateReadings);
//   });
// }

// function render()
// {
//   renderer.render( scene, camera );
// }


