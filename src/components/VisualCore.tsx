"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * LivingSphere
 *
 * Animated 2D canvas simulating a pseudo-3D rotating dot sphere.
 * Clean, minimalistic version — no user interaction effects.
 */
export default function VisualCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // === Setup canvas and context ===
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // === Constants ===
    const DOTS_AMOUNT = 500; // Total number of dots
    const DOT_RADIUS = 2.5; // Dot size
    const CONNECTION_DISTANCE = 60; // Max distance to draw connecting lines
    const ROTATION_SPEED = 0.0004; // Rotation speed factor
    const BREATHING_SPEED = 0.002; // Breathing deformation speed factor

    // === Canvas and projection setup ===
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let rotation = 0;
    let globeRadius = width * 0.4;
    let globeCenterZ = -globeRadius;
    let projectionCenterX = width / 2;
    let projectionCenterY = height / 2;
    let fieldOfView = width * 0.8;
    const dots: Dot[] = [];

    const mode = theme?.split("-")[0] ?? "blueprint"; // Extract mode from theme

    // === Utility: Resize canvas ===
    function resizeCanvas() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transforms
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Update projection parameters
      globeRadius = width * 0.4;
      globeCenterZ = -globeRadius;
      projectionCenterX = width / 2;
      projectionCenterY = height / 2;
      fieldOfView = width * 0.8;
    }

    // === Class: Dot ===
    class Dot {
      x = 0;
      y = 0;
      z = 0;
      theta: number;
      phi: number;
      xProject = 0;
      yProject = 0;
      sizeProjection = 0;

      constructor(theta: number, phi: number) {
        this.theta = theta;
        this.phi = phi;
      }

      /**
       * Update 3D coordinates based on breathing deformation
       */
      updateGeometry(t: number) {
        const rMod =
          mode === "sustainable"
            ? 0.85 + 0.15 * Math.sin(t + this.theta * 2)
            : mode === "journal"
            ? 1.0 + 0.1 * Math.cos(t + this.phi * 2)
            : mode === "deco"
            ? 0.95 + 0.05 * Math.sin(t * 2)
            : 1;

        const r = globeRadius * rMod;
        this.x = r * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = r * Math.sin(this.phi) * Math.sin(this.theta);
        this.z = r * Math.cos(this.phi) + globeCenterZ;
      }

      /**
       * Project 3D coordinates onto 2D canvas space
       */
      project(sin: number, cos: number) {
        const rotX = cos * this.x + sin * (this.z - globeCenterZ);
        const rotZ =
          -sin * this.x + cos * (this.z - globeCenterZ) + globeCenterZ;
        this.sizeProjection = fieldOfView / (fieldOfView - rotZ);
        this.xProject = rotX * this.sizeProjection + projectionCenterX;
        this.yProject = this.y * this.sizeProjection + projectionCenterY;
      }

      /**
       * Draw a single dot
       */
      drawDot(accent: string) {
        ctx.beginPath();
        ctx.arc(
          this.xProject,
          this.yProject,
          DOT_RADIUS * this.sizeProjection,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.fillStyle = accent;
        ctx.fill();
      }

      /**
       * Draw line to another dot if close enough
       */
      drawLines(other: Dot, accent: string) {
        const dx = this.xProject - other.xProject;
        const dy = this.yProject - other.yProject;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(this.xProject, this.yProject);
          ctx.lineTo(other.xProject, other.yProject);
          ctx.strokeStyle = accent + (mode === "deco" ? "33" : "55");
          ctx.lineWidth = 0.4 * this.sizeProjection;
          ctx.stroke();
        }
      }
    }

    // === Create initial dots ===
    function createDots() {
      dots.length = 0;
      for (let i = 0; i < DOTS_AMOUNT; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        dots.push(new Dot(theta, phi));
      }
    }

    // === Render loop ===
    function render(a: number) {
      ctx.clearRect(0, 0, width, height);

      rotation = a * ROTATION_SPEED;
      const sin = Math.sin(rotation);
      const cos = Math.cos(rotation);

      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#38c4b4";

      // Update dot positions
      for (const dot of dots) {
        dot.updateGeometry(a * BREATHING_SPEED);
        dot.project(sin, cos);
      }

      // Draw dots and connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < i + 10 && j < dots.length; j++) {
          dots[i].drawLines(dots[j], accent);
        }
        dots[i].drawDot(accent);
      }

      requestAnimationFrame(render);
    }

    // === Initialize ===
    resizeCanvas();
    createDots();
    requestAnimationFrame(render);

    // === Handle window resize ===
    window.addEventListener("resize", resizeCanvas);

    // === Cleanup on unmount ===
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]); // Re-run if theme changes (for color/mode)

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-bg rounded-full animate-fade-in"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full"
        aria-label="Living Sphere Animated Shape"
      />
    </div>
  );
}
