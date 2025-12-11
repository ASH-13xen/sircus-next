"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 100;
    const AMOUNTX = 50;
    const AMOUNTY = 50;

    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    // Adjusted camera position for better visibility
    camera.position.z = 1000;
    camera.position.y = 500; 

    const renderer = new THREE.WebGLRenderer({
      alpha: true, // Crucial for transparent background
      antialias: true,
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Particles
    const positions: number[] = [];
    const colors: number[] = [];
    
    // FORCE COLOR: Light Blue/White to be visible on dark bg
    // Using a slight blue tint (R:0.6, G:0.8, B:1.0) for a "tech" feel
    const color = new THREE.Color(0xa5b4fc); 

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        const y = 0;

        positions.push(x, y, z);
        colors.push(color.r, color.g, color.b);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4, // Adjusted size
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let count = 0;
    
    const animate = () => {
      const id = requestAnimationFrame(animate);
      
      // Wave Animation
      const positions = particles.geometry.attributes.position.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          // Updated wave math for smoother flow
          positions[index + 1] = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
          i++;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;
      
      if (sceneRef.current) sceneRef.current.animationId = id;
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    sceneRef.current = { scene, camera, renderer, animationId: 0, count };

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        // Safety check before removing
        if (containerRef.current.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      cancelAnimationFrame(sceneRef.current?.animationId || 0);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // Removed -z-1 to prevent it from hiding behind body
      className={cn("pointer-events-none fixed inset-0 top-0 left-0", className)}
      {...props}
    />
  );
}