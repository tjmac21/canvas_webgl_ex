const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const createGrid = () => {
        const points = [];
        const count = 40;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);
                points.push([u, v]);
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

        points.forEach(([u, v]) => {
            const x = lerp(margin, w - margin, u);
            const y = lerp(margin, h - margin, v);

            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2, false);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 10;
            ctx.stroke();
        });
    };
};

canvasSketch(sketch, settings);
