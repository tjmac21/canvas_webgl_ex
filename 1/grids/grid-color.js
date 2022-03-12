const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const colorCount = random.rangeFloor(3, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    const createGrid = () => {
        const points = [];
        const count = 45;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                points.push({
                    color: random.pick(palette),
                    pos: [u, v],
                    // radius: random.value() * 0.01,
                    radius: Math.abs(0.01 + random.gaussian() * 0.01),
                });
            }
        }
        return points;
    };

    // const points = createGrid();
    // const points = createGrid().filter(() => Math.random() > 0.5);
    random.setSeed(512);
    const points = createGrid().filter(() => random.value() > 0.5);
    const margin = 200;

    return ({ context, width, height }) => {
        const ctx = context;
        const w = width;
        const h = height;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);

        points.forEach((data) => {
            const { pos, radius, color } = data;
            const [u, v] = pos;
            const x = lerp(margin, w - margin, u);
            const y = lerp(margin, h - margin, v);

            ctx.beginPath();
            ctx.arc(x, y, radius * width, 0, Math.PI * 2, false);
            ctx.fillStyle = color;
            ctx.fill();
        });
    };
};

canvasSketch(sketch, settings);
