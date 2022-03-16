/**
 * Use `equirectangular` images to find spherical images
 * Use `diffuse` or `texture map` or `pbr` for the "texture" of an image
 */

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { Mesh } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load('earth.jpg');
  const moonTexture = loader.load('moon.jpg');

  // Setup a material
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 1,
    metalness: 0
  });
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 1,
    metalness: 0
  });

  const moonGroup =  new THREE.Group();
  const lightGroup =  new THREE.Group();

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5, 1, 0);
  moonMesh.scale.setScalar(0.25);
  scene.add(earthMesh);

  moonGroup.add(moonMesh);
  scene.add(moonGroup);

  const light = new THREE.PointLight('white', 1.5);
  light.position.set(100,100,0);
  lightGroup.add(light);
  scene.add(lightGroup);

  // scene.add(new THREE.PointLightHelper(light, 0.1))

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time* 0.15;
      moonMesh.rotation.y = time * 0.075;
      moonGroup.rotation.y = time * 0.5;
      lightGroup.rotation.x = -time * 0.6;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
