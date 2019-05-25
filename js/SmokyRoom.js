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

var cameraPosition = {
  x: 600,
  y: 400,
  z: 1000
}

var trialNumber = '17';
var elapsedTime = 600;
var timeScale = 20;
var timeScaleLabel = 's';
var smokeIntensityScale = 20;

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
clock.sumDT = 0;
var gui;

$(function() {
  var parameters;

  getSmokeData()
    .then(function() {
      init();
      createSmokePoints();
      animate();

    });

  // GUI for experimenting with parameters
  gui = new dat.GUI();  
  parameters = {
    smoke:  function() { restartEngine( Examples.smoke   ); },
    colors: function() { restartEngine( Examples.colors ); }
  };

  gui.add( parameters, 'smoke'   ).name("Smoke");
  gui.add( parameters, 'colors' ).name("Color Gradient");


  
  gui.open();
})

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.lookAt(scene.position);  
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );

  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);

  drawHouse(scene);

  // SKYBOX/FOG
  // var skyBoxGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
  // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xbad4ff, side: THREE.BackSide } );
  // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  //   // scene.add(skyBox);
  
  ////////////
  // CUSTOM //
  ////////////
}

function getSmokeData() { 
  return $.get('/csv', function(response) {
    // scale to fit our 3d model
    var scale = 180,
        offsetX = -300,
        offsetY = -150,
        offsetZ = -250;

    var smokeDataPoints = [];

    // use array of sensors to position smoke emitters
    response.sensors.forEach(function(sensor, i) {
      smokeDataPoints.push({
        coords: {
          x: offsetX + scale * parseFloat(sensor['X']),
          y: offsetY + scale * parseFloat(sensor['Y']),
          z: offsetZ + scale * parseFloat(sensor['Z'])
        },
        intensity: response.readings[sensor['Ref No.'] + trialNumber] || []
      });
    });

    window.smokeDataPoints = smokeDataPoints;
    
    gui.add({ 'num': elapsedTime }, 'num')
      .min(0)
      .max(smokeDataPoints[0] && smokeDataPoints[0].intensity.length)
      .step(1)
      .listen()
      .onChange(function(update) { 
        console.log('outside change', update)

        elapsedTime = update;
      });
  });
}

function createSmokePoints() {
  // init smoke particle engines
  window.particleEngines = [];
  window.smokeDataPoints.forEach(function(smokeDataPoint, i) {
    console.log('create particle engine at point', smokeDataPoint),
    smokeDataPoint.particleValues = window.smokeParticleEngineMeta;

    // custom position
    smokeDataPoint.particleValues.positionBase = new THREE.Vector3( smokeDataPoint.coords.x, smokeDataPoint.coords.y, smokeDataPoint.coords.z );
    smokeDataPoint.particleValues.opacity = 0;

    var engine = new ParticleEngine();
    engine.data = smokeDataPoint;
    engine.setValues( smokeDataPoint.particleValues );
    engine.initialize();

    window.particleEngines.push(engine);
  });
} 

function animate() 
{
  requestAnimationFrame( animate );
  render();   
  update();
  // up
}

function restartEngine(parameters)
{
  resetCamera();
  
  // change to color renders or smoke renders

  window.particleEngines.forEach((engine) => {
    engine.destroy();
    engine = new ParticleEngine();
    engine.setValues( parameters );
    engine.initialize();
  })
}

function resetCamera()
{
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  //camera.up = new THREE.Vector3( 0, 0, 1 );
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.lookAt(scene.position);  
  scene.add(camera);
  
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  THREEx.WindowResize(renderer, camera);
}

function update()
{
  controls.update();
  stats.update();
  
  var dt = clock.getDelta();
  var opacity, updateOpacity;

  clock.sumDT += dt;

  if (clock.sumDT > 2) {
    console.log({time: elapsedTime, interval: clock.sumDT});
    elapsedTime += 1;
    clock.sumDT = 0;
    updateOpacity = true;
  }

  window.particleEngines.forEach(function(engine) {
    opacity = null;
    if (updateOpacity) {
      // update with opacity from data every 2 seconds
      opacity = engine.data.intensity[elapsedTime] && engine.data.intensity[elapsedTime].PM  / smokeIntensityScale;
    }

    // scale opacity x PM reading   -- PM / 100
    engine.update( dt * 0.5 , opacity);
  });
}

function render() 
{
  renderer.render( scene, camera );
}

function drawHouse(scene) {
  // FLOOR
  (function(){
    console.log('Render checkerboard floor');
    var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1500, 1500, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -10.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
  })();

  // house
  function renderPlane(geometry, x,y,z, rotation) {
    console.log('Render plane', geometry);
    let defaultPlaneGeometry = {
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

    geometry = geometry || defaultPlaneGeometry;
    // legacy ?
    // geometry.size = geometry.size || defaultPlaneGeometry.size;

    var texture = new THREE.ImageUtils.loadTexture( 'images/rock-512.jpg' );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set( 10, 10 );
    var material = new THREE.MeshBasicMaterial( { color: 0x444444, map: texture, side: THREE.DoubleSide } );
    if (geometry.opacity && geometry.opacity < 1) {
      material.transparent = true;
      material.opacity = geometry.opacity;
    }

    var floorGeometry = new THREE.PlaneGeometry(geometry.size.h, geometry.size.w, 10, 10);
    var wall1 = new THREE.Mesh(floorGeometry, material);
    wall1.position.set(geometry.position.x, geometry.position.y, geometry.position.z);
    wall1.rotation.set(geometry.rotation.x, geometry.rotation.y, geometry.rotation.z);

    scene.add(wall1);
  };

  // back wall
  renderPlane({
    position: {
      x: 0,
      y: 150,
      z: -325
    },
    rotation: {
      x: Math.PI,
      y: 0,
      z: 0,
    },
    size: {
      h: 550,
      w: 650
    }
  });

  // side walls
  renderPlane({
    position: {
      x: -275,
      y: 150,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI / 2,
      z: 0,
    },
    size: {
      h: 650,
      w: 650
    }
  });

  renderPlane({
    position: {
      x: 275,
      y: 150,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI / 2,
      z: 0,
    },
    size: {
      h: 650,
      w: 650
    }
  });

  // Ceiling
  renderPlane({
    position: {
      x: -173,
      y: 540,
      z: 0, 
    },
    rotation: {
      x: Math.PI / 2,
      y: Math.PI / 5,
      z: 0,
    },
    size: {
      h: 425,
      w: 650
    },
    opacity: .2
  });

  // Ceiling
  renderPlane({
    position: {
      x: 173,
      y: 540,
      z: 0, 
    },
    rotation: {
      x: Math.PI / 2,
      y: - Math.PI / 5,
      z: 0,
    },
    size: {
      h: 425,
      w: 650
    },
    opacity: .2
  });

  // cylinder
  (function(){
    var geometry = new THREE.CylinderGeometry( 20, 20, 30, 64 );
    var material = new THREE.MeshBasicMaterial( {color: 0x384170} );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(200,0,-200);
    
    console.log('CYLINDER', cylinder)
    scene.add( cylinder );
  })();
}