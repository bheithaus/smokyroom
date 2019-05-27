var POSITION_SPREAD = 40,
    PARTICLE_COUNT_INTENSITY_SCALE = 10;

window.smokeParticleEngineMeta = {
  positionStyle    : Type.CUBE,
  positionBase     : new THREE.Vector3( 0, 0, 0 ),
  positionSpread   : new THREE.Vector3( POSITION_SPREAD, POSITION_SPREAD, POSITION_SPREAD ),

  velocityStyle    : Type.CUBE,
  velocityBase     : new THREE.Vector3( -3, -3, -3 ),
  velocitySpread   : new THREE.Vector3( 3, 3, 3 ),
  accelerationBase : new THREE.Vector3( 0, 0, 0 ),

  particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),

  angleBase               : 0,
  angleSpread             : 720,
  angleVelocityBase       : 0,
  angleVelocitySpread     : 180,

  sizeTween    : new Tween( [0, 3], [32, 128] ),
  opacityTween : new Tween( [0, 3], [1, 0] ),
  colorTween   : new Tween( [0.4, 3], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

  particlesPerSecond : 5,
  particleDeathAge   : 5,
  emitterDeathAge    : 100,

  particleCountIntensityScale: PARTICLE_COUNT_INTENSITY_SCALE
};
