"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

type PeanutInstance = {
  group: THREE.Group;
  path: PeanutPath;
  baseScale: number;
  drift: number;
  spin: number;
  speed: number;
};

type Point3 = readonly [number, number, number];

type PeanutPath = {
  start: Point3;
  orbit: Point3;
  wave: Point3;
  exit: Point3;
  scale: number;
  orbitRadius: number;
  spinRate: number;
  phase: number;
};

const DESKTOP_PATHS: PeanutPath[] = [
  { start: [-3.15, 1.68, -0.6], orbit: [-2.25, 1.18, -0.95], wave: [-3.18, 0.44, -0.62], exit: [-4.15, 1.95, -0.5], scale: 1.02, orbitRadius: 0.2, spinRate: 1, phase: 0 },
  { start: [3.1, 1.5, -0.55], orbit: [2.25, 1.08, -0.9], wave: [3.15, 0.5, -0.58], exit: [4.25, 1.8, -0.45], scale: 1.06, orbitRadius: 0.22, spinRate: -1, phase: 1.1 },
  { start: [-3.28, -1.48, -0.7], orbit: [-2.35, -1.08, -1.0], wave: [-3.0, -0.52, -0.66], exit: [-4.1, -1.85, -0.58], scale: 0.92, orbitRadius: 0.18, spinRate: -1, phase: 2.1 },
  { start: [3.18, -1.48, -0.68], orbit: [2.35, -1.1, -0.98], wave: [3.0, -0.58, -0.64], exit: [4.12, -1.9, -0.56], scale: 0.94, orbitRadius: 0.18, spinRate: 1, phase: 3.1 },
  { start: [-1.45, 2.18, -1.05], orbit: [-1.35, 1.56, -1.22], wave: [-2.3, 1.78, -0.92], exit: [-2.9, 2.55, -0.9], scale: 0.7, orbitRadius: 0.14, spinRate: 1, phase: 4.1 },
  { start: [1.55, 2.04, -1.05], orbit: [1.35, 1.48, -1.18], wave: [2.35, 1.76, -0.9], exit: [2.95, 2.44, -0.86], scale: 0.72, orbitRadius: 0.14, spinRate: -1, phase: 5.2 },
  { start: [-1.35, -2.2, -1.02], orbit: [-1.42, -1.56, -1.16], wave: [-2.28, -1.72, -0.84], exit: [-2.8, -2.55, -0.84], scale: 0.7, orbitRadius: 0.14, spinRate: -1, phase: 6.2 },
  { start: [1.42, -2.08, -1.04], orbit: [1.42, -1.52, -1.14], wave: [2.3, -1.68, -0.82], exit: [2.95, -2.42, -0.82], scale: 0.72, orbitRadius: 0.14, spinRate: 1, phase: 7.15 },
  { start: [-0.32, 2.5, -1.35], orbit: [-0.92, 1.86, -1.38], wave: [-1.95, 1.06, -0.98], exit: [-1.1, 2.95, -1.05], scale: 0.58, orbitRadius: 0.12, spinRate: 1, phase: 8.1 },
  { start: [0.44, -2.52, -1.32], orbit: [0.92, -1.86, -1.34], wave: [1.98, -1.05, -0.96], exit: [1.15, -2.92, -1.02], scale: 0.6, orbitRadius: 0.12, spinRate: -1, phase: 9.2 },
] ;

const MOBILE_PATHS: PeanutPath[] = [
  { start: [-1.42, 1.86, -0.82], orbit: [-1.18, 1.18, -0.94], wave: [-1.58, 0.7, -0.48], exit: [-1.88, 2.05, -0.62], scale: 0.74, orbitRadius: 0.14, spinRate: 1, phase: 0.4 },
  { start: [1.36, 1.52, -0.78], orbit: [1.12, 0.98, -0.9], wave: [1.58, 0.56, -0.46], exit: [1.88, 1.92, -0.58], scale: 0.78, orbitRadius: 0.15, spinRate: -1, phase: 1.5 },
  { start: [-1.34, 0.18, -1.02], orbit: [-1.18, -0.02, -1.08], wave: [-1.62, -0.42, -0.58], exit: [-1.84, 0.18, -0.78], scale: 0.62, orbitRadius: 0.12, spinRate: -1, phase: 2.6 },
  { start: [1.3, -0.12, -1.0], orbit: [1.16, -0.08, -1.08], wave: [1.62, -0.58, -0.56], exit: [1.84, -0.12, -0.75], scale: 0.64, orbitRadius: 0.13, spinRate: 1, phase: 3.7 },
  { start: [-1.14, -1.72, -0.86], orbit: [-1.02, -1.14, -0.95], wave: [-1.42, -1.72, -0.46], exit: [-1.72, -2.18, -0.58], scale: 0.7, orbitRadius: 0.13, spinRate: 1, phase: 4.8 },
  { start: [1.14, -1.58, -0.84], orbit: [1.02, -1.04, -0.92], wave: [1.42, -1.66, -0.44], exit: [1.72, -2.08, -0.56], scale: 0.72, orbitRadius: 0.14, spinRate: -1, phase: 5.9 },
  { start: [1.82, 2.12, -0.25], orbit: [1.62, 1.42, -0.28], wave: [1.86, 0.42, -0.16], exit: [2.06, -1.1, -0.18], scale: 0.98, orbitRadius: 0.08, spinRate: 1, phase: 6.8 },
] ;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const mixPoint = (from: Point3, to: Point3, amount: number): Point3 => [
  mix(from[0], to[0], amount),
  mix(from[1], to[1], amount),
  mix(from[2], to[2], amount),
];

function pointForProgress(path: PeanutPath, progress: number): Point3 {
  if (progress < 0.35) return mixPoint(path.start, path.orbit, easeInOut(progress / 0.35));
  if (progress < 0.7) return mixPoint(path.orbit, path.wave, easeInOut((progress - 0.35) / 0.35));
  return mixPoint(path.wave, path.exit, easeInOut((progress - 0.7) / 0.3));
}

function normalizeModel(model: THREE.Group) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;

  model.position.sub(center);
  model.scale.setScalar(1 / maxAxis);
  model.rotation.set(Math.PI * 0.18, 0, Math.PI * 0.08);
}

export function HeroPeanutScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xf2b15a, 2.15);
    const key = new THREE.DirectionalLight(0xffffff, 3.15);
    key.position.set(-2, 3, 4);
    const rim = new THREE.DirectionalLight(0xffd36b, 1.35);
    rim.position.set(3, -1, 3);
    scene.add(hemi, key, rim);

    const group = new THREE.Group();
    scene.add(group);

    let frame = 0;
    let disposed = false;
    let peanuts: PeanutInstance[] = [];
    let heroProgress = 0;

    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const readProgress = () => {
      const hero = mount.closest(".hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const span = Math.max(hero.clientHeight - window.innerHeight, 1);
      heroProgress = THREE.MathUtils.clamp(-rect.top / span, 0, 1);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readProgress, { passive: true });
    readProgress();

    const textureLoader = new THREE.TextureLoader();
    const objLoader = new OBJLoader();

    Promise.all([
      textureLoader.loadAsync("/peanut/textures/peanut.jpeg"),
      textureLoader.loadAsync("/peanut/textures/peanutbump.jpeg"),
      objLoader.loadAsync("/peanut/source/SketchfabPeanut/SketchfabPeanut.obj"),
    ]).then(([map, bumpMap, model]) => {
      if (disposed) return;

      map.colorSpace = THREE.SRGBColorSpace;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;

      const peanutMaterial = new THREE.MeshStandardMaterial({
        map,
        bumpMap,
        bumpScale: 0.09,
        roughness: 0.58,
        metalness: 0.02,
        color: new THREE.Color("#f4b25f"),
      });

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = peanutMaterial;
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      normalizeModel(model);

      const mobileScene = window.matchMedia("(max-width: 768px)").matches;
      const paths = mobileScene ? MOBILE_PATHS : DESKTOP_PATHS;
      const sceneScale = mobileScene ? 1.52 : 1.34;
      peanuts = paths.map((path, index) => {
        const clone = model.clone(true);
        const [x, y, z] = path.start;
        const baseScale = model.scale.x * path.scale * sceneScale;
        clone.position.set(x, y, z);
        clone.scale.setScalar(baseScale);
        clone.rotation.set(index * 0.7, index * 0.45, index * 0.9);
        group.add(clone);
        return {
          group: clone,
          path,
          baseScale,
          drift: index * 1.7,
          spin: path.spinRate,
          speed: 0.55 + index * 0.06,
        };
      });
      mount.classList.add("loaded");
    });

    const animate = (time: number) => {
      const t = time / 1000;
      readProgress();
      for (const peanut of peanuts) {
        const progress = prefersReduced ? 0 : heroProgress;
        const point = pointForProgress(peanut.path, progress);
        const orbit = Math.sin(progress * Math.PI * 2 + peanut.path.phase) * peanut.path.orbitRadius;
        const idleX = prefersReduced ? 0 : Math.sin(t * peanut.speed + peanut.drift) * 0.1;
        const idleY = prefersReduced ? 0 : Math.cos(t * (peanut.speed + 0.15) + peanut.drift) * 0.13;
        peanut.group.position.x = point[0] + idleX + orbit * 0.55;
        peanut.group.position.y = point[1] + idleY + Math.cos(progress * Math.PI * 2 + peanut.path.phase) * peanut.path.orbitRadius;
        peanut.group.position.z = point[2] + Math.sin(t * 0.4 + peanut.drift) * 0.08 + orbit * 0.25;

        const depthScale = 1 + Math.max(0, -point[2]) * 0.05 + Math.sin(progress * Math.PI + peanut.path.phase) * 0.045;
        peanut.group.scale.setScalar(peanut.baseScale * depthScale);
        if (!prefersReduced) {
          peanut.group.rotation.x += 0.0028 * peanut.spin;
          peanut.group.rotation.y += 0.0048 * peanut.spin;
          peanut.group.rotation.z += 0.002 * peanut.spin;
        }
      }
      group.rotation.z = prefersReduced ? 0 : Math.sin(t * 0.18) * 0.035 + heroProgress * 0.08;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readProgress);
      window.cancelAnimationFrame(frame);
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="hero__peanut3d" aria-hidden />;
}
