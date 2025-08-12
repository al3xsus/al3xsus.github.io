import { useEffect, useRef } from "preact/hooks";

export default function VisualCoreSimple({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Create random vertices for a complex shape
    const points = 12 + Math.floor(Math.random() * 6); // 12–17 points
    const vertices = Array.from({ length: points }, (_, i) => {
      const angle = (i / points) * Math.PI * 2;
      const variation = 0.7 + Math.random() * 0.6; // Adds randomness to radius
      return {
        baseX: Math.cos(angle) * radius * variation,
        baseY: Math.sin(angle) * radius * variation,
        orbit: Math.random() * 0.015 + 0.005, // Oscillation speed per point
        offset: Math.random() * 100, // Random phase offset
        depthScale: 0.8 + Math.random() * 0.4, // Y-axis flattening effect
      };
    });

    let frame = 0;
    let rotation = 0; // Rotation angle in radians

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Set the accent color based on the theme, needs to be reworked
      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#38c4b4";

      // Create a radial gradient for stroke lighting
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 1.5
      );
      // Add colors to the gradient, needs to be reworked
      gradient.addColorStop(0, accent);
      gradient.addColorStop(1, "#00000033");

      ctx.save();
      ctx.translate(centerX, centerY); // Move to center
      ctx.rotate(rotation); // Apply slow rotation
      ctx.strokeStyle = gradient;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = -6;
      ctx.shadowOffsetY = 6;
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();

      // Draw the animated shape
      vertices.forEach((v, i) => {
        const a = Math.sin((frame + v.offset) * v.orbit); // Oscillation in X
        const b = Math.cos((frame + v.offset) * v.orbit); // Oscillation in Y

        const x = v.baseX + a * 6; // Base X + slight animation
        const y = (v.baseY + b * 6) * v.depthScale * 0.85; // Base Y + slight animation and depth

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.closePath();
      ctx.stroke();

      // Fill shape with slight transparency
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();

      frame++;
      rotation += 0.0001; // Slow continuous rotation (adjust this value for speed)

      requestAnimationFrame(draw);
    }

    draw();
  }, [theme]); // Re-run if theme changes (to pick up updated accent color)

  return (
    <div className="w-full h-full animate-fade-in">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label="Animated Geometry"
      />
    </div>
  );
}
