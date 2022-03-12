/**
 * Can export in the browser with ctrl+shift+s
 * with an --output flag with the rel dir on the start script
 * and turn into an mp4 if you have ffmpeg with:
 * `canvas-sketch-mp4 {dir-name}`
 */

global.THREE = require("three");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const BezierEasing = require("bezier-easing");
const glslify = require("glslify");

const canvasSketch = require("canvas-sketch");

const settings = {
    animate: true,
    dimensions: [1024, 1280],
    fps: 24,
    duration: 4,
    // Get a WebGL canvas rather than 2D
    context: "webgl",
    // Turn on MSAA
    attributes: { antialias: true },
};

const sketch = ({ context, width, height }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        context,
    });

    // WebGL background color
    renderer.setClearColor("hsl(0, 0%, 95%)", 1);

    // Setup a camera, we will update its settings on resize
    const camera = new THREE.OrthographicCamera();

    // Setup your scene
    const scene = new THREE.Scene();

    // Re-use the same Geometry across all our cubes
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    const palette = random.pick(palettes);

    const fragmentShader = glslify(`
    varying vec2 vUv;

    uniform float time;
    uniform vec3 color;

    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    void main () {
        float n = 0.3 * noise(vec3(vUv.xy * 5.0, time));
        gl_FragColor = vec4(vec3(color * vUv.x) + n, 1.0);
    }
    `);
    const vertexShader = glslify(`
    varying vec2 vUv;

    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main () {
        vUv = uv;
        vec3 pos = position.xyz;
        pos -= normal * noise(vec4(position.xyz * 0.50, time*0.5));
        pos += normal * noise(vec4(position.xyz * 0.50, time*1.5));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `);

    const meshes = [];
    for (let i = 0; i < 20; i++) {
        // Basic "unlit" material with no depth
        const material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                color: { value: new THREE.Color(random.pick(palette)) },
                time: { value: 0 },
            },
        });
        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            random.range(-1, 1),
            random.range(-1, 1),
            random.range(-1, 1)
        );
        // Smaller cube
        mesh.scale.set(
            random.range(-1, 1),
            random.range(-1, 1),
            random.range(-1, 1)
        );
        mesh.scale.multiplyScalar(0.25);

        // Then add the group to the scene
        scene.add(mesh);
        meshes.push(mesh);
    }

    scene.add(new THREE.AmbientLight("hsl(0, 0%, 40%)"));

    const light = new THREE.DirectionalLight("white", 1);
    light.position.set(2, 2, 4);
    scene.add(light);

    const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99); // can tweak these numbers at cubic-bezier.com

    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight);
            const aspect = viewportWidth / viewportHeight;

            // Ortho zoom
            const zoom = 1.5;

            // Bounds
            camera.left = -zoom * aspect;
            camera.right = zoom * aspect;
            camera.top = zoom;
            camera.bottom = -zoom;

            // Near/Far
            camera.near = -100;
            camera.far = 100;

            // Set position & look at world center
            camera.position.set(zoom, zoom, zoom);
            camera.lookAt(new THREE.Vector3());

            // Update the camera
            camera.updateProjectionMatrix();
        },
        // And render events here
        render({ playhead, time }) {
            // scene.rotation.y = eases.expoInOut(Math.sin(playhead * Math.PI));
            scene.rotation.y = easeFn(Math.sin(playhead * Math.PI));
            meshes.forEach((mesh) => {
                mesh.material.uniforms.time.value = time;
            });
            // Draw scene with our camera
            renderer.render(scene, camera);
        },
        // Dispose of WebGL context (optional)
        unload() {
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);
