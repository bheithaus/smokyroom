window.housePlaneRenderOptions = [
  // back wall
  {
    position: {
      x: 0,
      y: 225,
      z: -325
    },
    rotation: {
      x: Math.PI,
      y: 0,
      z: 0,
    },
    size: {
      h: 550,
      w: 450
    }
  },

  // side walls
  {
    position: {
      x: -275,
      y: 225,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI / 2,
      z: 0,
    },
    size: {
      h: 650,
      w: 450
    }
  },

  {
    position: {
      x: 275,
      y: 225,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI / 2,
      z: 0,
    },
    size: {
      h: 650,
      w: 450
    }
  },

  // Ceiling
  {
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
  },

  // Ceiling
  {
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
  }
];
