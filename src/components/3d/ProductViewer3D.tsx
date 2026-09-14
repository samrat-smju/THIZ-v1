import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Sparkles, Box } from 'lucide-react';

interface ProductViewer3DProps {
  modelType?: 'headphones' | 'chronograph' | 'sculptural';
  accentColor?: string;
  autoRotateSpeed?: number;
  className?: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  modelType = 'headphones',
  accentColor = '#ff5722',
  autoRotateSpeed = 1.5,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState<'titanium' | 'obsidian' | 'copper'>('titanium');
  const [hasWebGL, setHasWebGL] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
    }

    let animationFrameId: number;
    let width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.parentElement?.clientHeight || 400;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Create Renderer
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to static visual', e);
      setHasWebGL(false);
      return;
    }

    // Lighting Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7388a9, 1.2);
    fillLight.position.set(-5, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(new THREE.Color(accentColor).getHex(), 3.5, 20);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Group for product geometry
    const productGroup = new THREE.Group();
    scene.add(productGroup);
    meshGroupRef.current = productGroup;

    // Base materials
    materialsRef.current = [];

    const getMaterialConfig = () => {
      if (activeMaterial === 'obsidian') {
        return { color: 0x12141a, roughness: 0.25, metalness: 0.85 };
      }
      if (activeMaterial === 'copper') {
        return { color: 0xc87d55, roughness: 0.35, metalness: 0.9 };
      }
      // Titanium default
      return { color: 0x8892a0, roughness: 0.3, metalness: 0.95 };
    };

    const matConfig = getMaterialConfig();
    const primaryMat = new THREE.MeshStandardMaterial({
      color: matConfig.color,
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
      wireframe,
    });
    materialsRef.current.push(primaryMat);

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor).getHex(),
      roughness: 0.3,
      metalness: 0.9,
      wireframe,
    });
    materialsRef.current.push(accentMat);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1b1d24,
      roughness: 0.6,
      metalness: 0.2,
      wireframe,
    });
    materialsRef.current.push(darkMat);

    // Procedural Industrial Geometry representing precision acoustics / horology
    if (modelType === 'headphones' || modelType === 'sculptural') {
      // Acoustic Headband Torus
      const headbandGeo = new THREE.TorusGeometry(2.3, 0.12, 24, 60, Math.PI * 0.95);
      const headband = new THREE.Mesh(headbandGeo, primaryMat);
      headband.rotation.z = Math.PI * 0.025;
      headband.position.y = 0.5;
      productGroup.add(headband);

      // Left Driver Cup
      const cupGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.45, 48);
      const cupLeft = new THREE.Mesh(cupGeo, primaryMat);
      cupLeft.position.set(-2.2, -0.6, 0);
      cupLeft.rotation.z = Math.PI / 2;
      productGroup.add(cupLeft);

      // Left Earpad
      const earpadGeo = new THREE.TorusGeometry(0.85, 0.28, 20, 48);
      const padLeft = new THREE.Mesh(earpadGeo, darkMat);
      padLeft.position.set(-2.4, -0.6, 0);
      padLeft.rotation.y = Math.PI / 2;
      productGroup.add(padLeft);

      // Left Accent Bevel Ring
      const ringGeo = new THREE.TorusGeometry(1.06, 0.04, 16, 48);
      const ringLeft = new THREE.Mesh(ringGeo, accentMat);
      ringLeft.position.set(-2.0, -0.6, 0);
      ringLeft.rotation.y = Math.PI / 2;
      productGroup.add(ringLeft);

      // Right Driver Cup
      const cupRight = new THREE.Mesh(cupGeo, primaryMat);
      cupRight.position.set(2.2, -0.6, 0);
      cupRight.rotation.z = Math.PI / 2;
      productGroup.add(cupRight);

      // Right Earpad
      const padRight = new THREE.Mesh(earpadGeo, darkMat);
      padRight.position.set(2.4, -0.6, 0);
      padRight.rotation.y = Math.PI / 2;
      productGroup.add(padRight);

      // Right Accent Bevel Ring
      const ringRight = new THREE.Mesh(ringGeo, accentMat);
      ringRight.position.set(2.0, -0.6, 0);
      ringRight.rotation.y = Math.PI / 2;
      productGroup.add(ringRight);

      // Center Precision Dial
      const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 36);
      const centerDial = new THREE.Mesh(dialGeo, accentMat);
      centerDial.position.set(-2.2, -0.6, 0.3);
      centerDial.rotation.x = Math.PI / 2;
      productGroup.add(centerDial);
    } else {
      // Chrono geometry
      const caseGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.45, 64);
      const watchCase = new THREE.Mesh(caseGeo, primaryMat);
      watchCase.rotation.x = Math.PI / 4;
      productGroup.add(watchCase);

      const bezelRingGeo = new THREE.TorusGeometry(1.92, 0.08, 20, 64);
      const bezel = new THREE.Mesh(bezelRingGeo, accentMat);
      bezel.rotation.x = Math.PI / 4;
      productGroup.add(bezel);

      const dialFaceGeo = new THREE.CircleGeometry(1.7, 48);
      const dialFace = new THREE.Mesh(dialFaceGeo, darkMat);
      dialFace.position.set(0, 0.23, 0);
      dialFace.rotation.x = -Math.PI / 4;
      productGroup.add(dialFace);
    }

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !meshGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      meshGroupRef.current.rotation.y += deltaX * 0.008;
      meshGroupRef.current.rotation.x += deltaY * 0.008;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !meshGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;

      meshGroupRef.current.rotation.y += deltaX * 0.008;
      meshGroupRef.current.rotation.x += deltaY * 0.008;

      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!canvas.parentElement) return;
      const newWidth = canvas.parentElement.clientWidth;
      const newHeight = canvas.parentElement.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        rendererRef.current?.setSize(newWidth, newHeight);
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isRotating && !isDragging && meshGroupRef.current) {
        meshGroupRef.current.rotation.y += delta * autoRotateSpeed * 0.3;
      }

      rendererRef.current?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      rendererRef.current?.dispose();
    };
  }, [modelType, accentColor, autoRotateSpeed, isRotating, wireframe, activeMaterial]);

  if (!hasWebGL) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-[#141721] rounded-2xl border border-white/10 text-slate-400 ${className}`}>
        <Box className="w-12 h-12 text-[#ff5722] mb-2" />
        <p className="text-xs">3D Canvas Fallback Mode</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none"
        title="Click and drag to rotate in 3D"
      />

      {/* Floating 3D Control Badges */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Left: Material switch */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-[#0b0d13]/85 backdrop-blur-md rounded-xl border border-white/10 shadow-lg text-[11px]">
          {(['titanium', 'obsidian', 'copper'] as const).map((mat) => (
            <button
              key={mat}
              onClick={() => setActiveMaterial(mat)}
              className={`px-2 py-1 rounded-lg capitalize transition-colors font-medium ${
                activeMaterial === mat
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* Right: Rotation & Wireframe toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-[#0b0d13]/85 backdrop-blur-md rounded-xl border border-white/10 shadow-lg text-slate-300">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg transition-colors ${
              isRotating ? 'text-[#ff5722] bg-[#ff5722]/10' : 'hover:text-white'
            }`}
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg transition-colors ${
              wireframe ? 'text-[#e5a93c] bg-[#e5a93c]/10' : 'hover:text-white'
            }`}
            title="Toggle geometry wireframe"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Drag Hint */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-medium tracking-wide">
        <Sparkles className="w-3 h-3 text-[#ff5722]" />
        <span>Interactive 3D • Drag to inspect</span>
      </div>
    </div>
  );
};
