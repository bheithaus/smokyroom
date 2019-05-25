window.smokeParticleEngineMeta = {
  positionStyle    : Type.CUBE,
  positionBase     : new THREE.Vector3( 0, 0, 0 ),
  positionSpread   : new THREE.Vector3( 6, 0, 6 ),

  velocityStyle    : Type.CUBE,
  velocityBase     : new THREE.Vector3( 0, 0, 0 ),
  velocitySpread   : new THREE.Vector3( 0, 3, 0 ), 
  accelerationBase : new THREE.Vector3( 0, -5, 0 ),
  
  particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),

  angleBase               : 0,
  angleSpread             : 720,
  angleVelocityBase       : 0,
  angleVelocitySpread     : 720,
  
  sizeTween    : new Tween( [0, 1], [32, 128] ),
  opacityBase: 0, 
  colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

  particlesPerSecond : 10,
  particleDeathAge   : 2.0,   
  emitterDeathAge    : 100
};
