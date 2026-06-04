"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

type PeanutInstance = {
  group: THREE.Group;
  baseX: number;
  baseY: number;
  baseZ: number;
  drift: number;
  spin: number;
  speed: number;
  scale: number;
};

const DESKTOP_LAYOUT = [
  [-3.45, 1.22, -0.8, 0.52],
  [3.58, 1.03, -0.72, 0.58],
  [-3.2, -1.8, -0.85, 0.48],
  [3.28, -1.78, -0.82, 0.5],
] as const;

const MOBILE_LAYOUT = [
  [-2.05, 1.15, -0.95, 0.4],
  [2.08, -1.28, -0.95, 0.42],
] as const;

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
        bumpScale: 0.07,
        roughness: 0.68,
        metalness: 0.02,
        color: new THREE.Color("#f0b25b"),
      });

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = peanutMaterial;
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      normalizeModel(model);

      const layout = window.matchMedia("(max-width: 768px)").matches ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
      peanuts = layout.map(([x, y, z, scale], index) => {
        const clone = model.clone(true);
        clone.position.set(x, y, z);
        clone.scale.multiplyScalar(scale * 1.14);
        clone.rotation.set(index * 0.7, index * 0.45, index * 0.9);
        group.add(clone);
        return {
          group: clone,
          baseX: x,
          baseY: y,
          baseZ: z,
          drift: index * 1.7,
          spin: index % 2 ? -1 : 1,
          speed: 0.55 + index * 0.06,
          scale,
        };
      });
      mount.classList.add("loaded");
    });

    const animate = (time: number) => {
      const t = time / 1000;
      readProgress();
      for (const peanut of peanuts) {
        const scrollLift = heroProgress * 0.38;
        peanut.group.position.x = peanut.baseX + Math.sin(t * peanut.speed + peanut.drift) * 0.13;
        peanut.group.position.y = peanut.baseY + Math.cos(t * (peanut.speed + 0.15) + peanut.drift) * 0.18 - scrollLift;
        peanut.group.position.z = peanut.baseZ + Math.sin(t * 0.4 + peanut.drift) * 0.12;
        if (!prefersReduced) {
          peanut.group.rotation.x += 0.0025 * peanut.spin;
          peanut.group.rotation.y += 0.004 * peanut.spin;
          peanut.group.rotation.z += 0.0018 * peanut.spin;
        }
      }
      group.rotation.z = Math.sin(t * 0.18) * 0.035;
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
