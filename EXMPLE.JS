HTML  SCSS  JS Result
EDIT ON
 // cleaning console

console.clear();

//пустые переменные
    var renderer, scene, camera, distance, raycaster, projector;
    var container = document.getElementById('container');
     var raycaster = new THREE.Raycaster(),INTERSECTED;
     var mouse = new THREE.Vector2();
    var distance = 400;

function init() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x140b33, 1);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 25000);
    camera.position.set(100, 100, 2000);
    scene.add(camera);
    
    light = new THREE.PointLight(0xffffff, 1, 4000);
    light.position.set(50, 0, 0);
    light_two = new THREE.PointLight(0xffffff, 1, 4000);
    light_two.position.set(-100, 800, 800);
    lightAmbient = new THREE.AmbientLight(0x404040);
    scene.add(light, light_two, lightAmbient);


    createSpheres();
    createDiamond();
    createSpace();

    
     document.addEventListener('mousemove', onMouseMove, false);
     window.addEventListener('resize', onWindowResize, false);
    renderer.render(scene, camera);

}

function createSpheres() {
spheres = new THREE.Object3D();
    for (var i = 0; i < 80; i++) {
        var sphere = new THREE.SphereGeometry(4, Math.random() * 12, Math.random() * 12);
        var material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xff00000 - 0xff00000,
            shading: THREE.FlatShading,
        })

        var particule = new THREE.Mesh(sphere, material);
        particule.position.x = Math.random() * distance * 10;
        particule.position.y = Math.random() * -distance * 6;
        particule.position.z = Math.random() * distance * 4;
        particule.rotation.y = Math.random() * 2 * Math.PI;
        particule.scale.x = particule.scale.y = particule.scale.z = Math.random() * 12 + 5;
        spheres.add(particule);
    }

    spheres.position.y = 1200;
    spheres.position.x = -2000;
    spheres.position.z = -100;
    spheres.rotation.y = Math.PI * 600;
    scene.add(spheres);
};

function createDiamond() {
    diamondsGroup = new THREE.Object3D();
    var loader = new THREE.JSONLoader();
loader.load('https://raw.githubusercontent.com/PavelLaptev/test-rep/master/threejs-post/diamond.json', function(geometry) {
        for (var i = 0; i < 60; i++) {
            var material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xff00000 - 0xff00000,
                shading: THREE.FlatShading
            });
            var diamond = new THREE.Mesh(geometry, material);
            diamond.position.x = Math.random() * -distance * 6;
            diamond.position.y = Math.random() * -distance * 2;
            diamond.position.z = Math.random() * distance * 3;
            diamond.rotation.y = Math.random() * 2 * Math.PI;
            diamond.scale.x = diamond.scale.y = diamond.scale.z = Math.random() * 50 + 10;
            diamondsGroup.add(diamond);
        }

        diamondsGroup.position.x = 1400;
         diamondsGroup.position.y = 400;
        scene.add(diamondsGroup);
          renderer.render(scene, camera);
    });
};

function createSpace() {

    dots = new THREE.Object3D();

    for (var i = 0; i < 420; i++) {
        var circleGeometry = new THREE.SphereGeometry(2, Math.random() * 5, Math.random() * 5);
        var material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xff00000 - 0xff00000,
            shading: THREE.FlatShading,
        })
        var circle = new THREE.Mesh(circleGeometry, material);
        material.side = THREE.DoubleSide;

        circle.position.x = Math.random() * -distance * 60;
        circle.position.y = Math.random() * -distance * 6;
        circle.position.z = Math.random() * distance * 3;
        circle.rotation.y = Math.random() * 2 * Math.PI;
        circle.scale.x = circle.scale.y = circle.scale.z = Math.random() * 6 + 5;
        dots.add(circle);
    }

    dots.position.x = 7000;
    dots.position.y = 900;
    dots.position.z = -2000;
    dots.rotation.y = Math.PI * 600;
    dots.rotation.z = Math.PI * 500;

    scene.add(dots);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
    camera.position.x += (mouseX - camera.position.x) * 0.01;
    camera.position.y += (mouseY - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
};

function animate() {
    requestAnimationFrame(animate);
    render();
};

function render() {
    var timer = 0.00001 * Date.now();

    for (var i = 0, l = diamondsGroup.children.length; i < l; i++) {
        var object = diamondsGroup.children[i];
        object.position.y = 500 * Math.cos(timer + i);
        object.rotation.y += Math.PI / 500;
    }

    for (var i = 0, l = spheres.children.length; i < l; i++) {
        var object = spheres.children[i];
        object.rotation.y += Math.PI / 60;
        if (i < 20) {
            object.rotation.y -= Math.PI / 40;
        }
    }
    
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(diamondsGroup.children);
    
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(Math.random() * 0xff00000 - 0xff00000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }

    renderer.render(scene, camera);
};

init();
animate();

Resources 1×0.5×0.25× Rerun