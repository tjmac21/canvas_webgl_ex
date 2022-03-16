// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

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
  renderer.setClearColor("#FFF", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enableZoom = false;

  // Setup your scene
  const scene = new THREE.Scene();
  const gridScale = 10;
  scene.add(new THREE.GridHelper(gridScale, 10, "hsl(0, 0%, 50%)", "hsl(0, 0%,70%)"))

  // Setup a geometry
  const geometry = new THREE.BufferGeometry();
  // Define some vertices
  const verts = [
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0.5, -0.5, 0),
    new THREE.Vector3(-0.5, -0.5, 0),
    new THREE.Vector3(0.5, 0.5, 0)
  ];

  // Flatten into buffer attribute
  const vertsFlat = verts.map(p => p.toArray()).flat();
  const vertsArray = new Float32Array(vertsFlat);
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertsArray, 3 ) );
  
  const faces = [
    [ 0, 1, 2 ],
    [ 0, 3, 1 ]
  ];
  const facesFlat = faces.flat();
  const facesArray = new Uint16Array(facesFlat);
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(facesArray), 1));
  geometry.computeVertexNormals();

  // Setup a material
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
