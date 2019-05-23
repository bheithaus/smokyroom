(function() {
  var x = -225;
  var y = 70;
  var z = -250

  var smokePointsData = [];

  var i, j, k, l;
  // 30 smoke points in grid
  // x (side to side)
  var intensity;
  for (i = 0; i < 3; i++) { 
    // y (vertical)
    for (j = 0; j < 2; j++) { 
      // z (front to back)
      for (k = 0; k < 5; k++) {
        intensity = [];
        for (l = 0; l < 100; l++) {
          // random intensity between .2 - 2
          intensity.push(Math.random() * 1.8 + .2)
        }

        smokePointsData.push({
          coords: {
            x: x + i * 200,
            y: y + j * 150,
            z: z + k * 125
          },
          intensity: intensity
        });
      }
    }
  }

  window.smokePointsData = smokePointsData;

  window.smokeParticleEngineMeta = {
    positionStyle    : Type.CUBE,
    positionBase     : new THREE.Vector3( 0, 0, 0 ),
    positionSpread   : new THREE.Vector3( 30, 10, 30 ),

    velocityStyle    : Type.CUBE,
    velocityBase     : new THREE.Vector3( 0, 30, 0 ),
    velocitySpread   : new THREE.Vector3( 80, 50, 80 ), 
    accelerationBase : new THREE.Vector3( 0,-10,0 ),
    
    particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),

    angleBase               : 0,
    angleSpread             : 720,
    angleVelocityBase       : 0,
    angleVelocitySpread     : 720,
    
    sizeTween    : new Tween( [0, 1], [32, 128] ),
    opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
    colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

    particlesPerSecond : 5,
    particleDeathAge   : 3.0,   
    emitterDeathAge    : 60
  };  
})();

