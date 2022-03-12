/**
 * A cool next step would be to iterate
 * over points and move each point "forward"
 * so as to create an animate of movement
 */

const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

random.setSeed(random.getRandomSeed());

const settings = {
    suffix: random.getSeed(),
    dimensions: [2048, 2048],
};

const sketch = () => {
    const colorCount = random.rangeFloor(3, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    const createGrid = () => {
        const points = [];
        const count = 50;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                const radius = Math.abs(random.noise2D(u, v)) * 0.06;
                points.push({
                    color: random.pick(palette),
                    pos: [u, v],
                    radius,
                    rotation: random.noise2D(u, v),
                });
            }
        }
        return points;
    };

    const points = createGrid().filter(() => random.value() > 0.5);
    const margin = 200;

    return ({ context, width, height }) => {
        const ctx = context;
        const w = width;
        const h = height;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);

        points.forEach((data) => {
            const { pos, radius, color, rotation } = data;
            const [u, v] = pos;
            const x = lerp(margin, w - margin, u);
            const y = lerp(margin, h - margin, v);

            ctx.save();
            ctx.fillStyle = color;
            ctx.font = `${radius * w}px "Helvetica"`;
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillText("=", 0, 0);

            ctx.restore();
        });
    };
};

canvasSketch(sketch, settings);
