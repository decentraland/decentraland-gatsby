import React, { useEffect, useRef, RefObject } from 'react'
import * as THREE from 'three/src/Three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import SingletonListener from '../../../utils/SingletonListener';


function render(ref: RefObject<HTMLCanvasElement>) {

  const canvas = ref.current
  if (!canvas) {
    return
  }

  // Three JS Template
  const params = {
    exposure: 1,
    bloomStrength: 3,
    bloomThreshold: 0.8,
    bloomRadius: 0.5
  };

  const manaShape = 6;
  const particleMaterials = [
    new THREE.MeshPhysicalMaterial({
      color: 0x98dcec,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xbfffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x04ffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    })
  ];

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize((canvas.parentElement as HTMLDivElement).clientWidth, (canvas.parentElement as HTMLDivElement).clientHeight);
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;

  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  const scene = new THREE.Scene();
  const cameraRange = 3;
  const setcolor = 0x000000;

  scene.background = new THREE.Color(setcolor);
  scene.fog = new THREE.Fog(setcolor, 2.5, 3.5);

  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  //-------------------------------------------------------------- SCENE
  const sceneGruop = new THREE.Object3D();
  const particularGruop = new THREE.Object3D();
  const modularGruop = new THREE.Object3D();

  function generateParticle(num: number, amp: number = 2) {
    const gparticular = new THREE.CircleGeometry(0.25, manaShape);

    for (let i = 1; i < num; i++) {
      const pscale = 0.02; //+ Math.abs(mathRandom(0.05));
      const particular = new THREE.Mesh(
        gparticular,
        particleMaterials[Math.floor(Math.random() * particleMaterials.length)]
      );
      particular.position.set(mathRandom(amp), mathRandom(amp), mathRandom(amp));
      // particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
      particular.scale.set(pscale, pscale, pscale);
      (particular as any).speedValue = mathRandom(0.5);

      particularGruop.add(particular);
      particularGruop.scale.x = 0.2;
      particularGruop.scale.y = 0.2;
      particularGruop.scale.z = 0.2;
    }
  }

  generateParticle(3000, 2);
  sceneGruop.add(particularGruop);
  scene.add(modularGruop);
  scene.add(sceneGruop);

  function mathRandom(num = 1) {
    var setNumber = -Math.random() * num + Math.random() * num;
    return setNumber;
  }

  //------------------------------------------------------------- CAMERA
  camera.position.set(0, 0, cameraRange);

  //------------------------------------------------------------- SCENE
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  var light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(5, 5, 2);

  var lightBack = new THREE.PointLight(0x0fffff, 5);
  lightBack.position.set(0, -3, -1);

  scene.add(sceneGruop);
  scene.add(light);
  scene.add(lightBack);

  //------------------------------------------------------------- RENDER
  const position = { top: 0, left: 0 };
  function animate() {
    if (!ref.current) {
      return
    }

    // var time = performance.now() * 0.0003;
    requestAnimationFrame(animate);

    const maxSize = 1.5;
    let mult = maxSize - particularGruop.scale.x;
    if (mult > maxSize) mult = maxSize;
    else if (mult < 0) mult = 0;

    if (particularGruop.scale.x < maxSize) {
      particularGruop.scale.x += mult * 0.014;
      particularGruop.scale.y += mult * 0.014;
      particularGruop.scale.z += mult * 0.014;
    }

    const maxOpacity = 1;
    const currentOpacity = particleMaterials[0].opacity;
    if (currentOpacity < maxOpacity) {
      particleMaterials.forEach(material => {
        if (material.opacity < maxOpacity) {
          material.opacity += mult * 0.05;
        }
      });
    }

    //---
    for (var i = 0, l = particularGruop.children.length; i < l; i++) {
      var newObject = particularGruop.children[i];
      newObject.rotation.x += (newObject as any).speedValue / 10;
      newObject.rotation.y += (newObject as any).speedValue / 10;
      newObject.rotation.z += (newObject as any).speedValue / 10;
      // console.log(newObject.rotation);
    }

    //---
    particularGruop.rotation.z += 0.0025 * position.top;
    particularGruop.rotation.y += 0.0025 * position.left;
    particularGruop.rotation.x += 0.0025 * ((position.top + position.left) / 2);

    camera.lookAt(scene.position);
    composer.render();
  }

  animate();

  //------------------------------------------------------------- DOM EVENTS
  function onWindowResize() {
    if (!ref.current) {
      return
    }

    camera.aspect = ref.current.width / ref.current.height;
    camera.updateProjectionMatrix();
    renderer.setSize((ref.current.parentElement as HTMLDivElement).clientWidth, (ref.current.parentElement as HTMLDivElement).clientHeight);
  }

  function onMouseMove(event: MouseEvent) {
    if (event.target) {
      const w = Math.floor((event.target as any).width / 2);
      const h = Math.floor((event.target as any).height / 2);
      position.top = -(event.clientY - h) / h
      position.left = (event.clientX - w) / w
    }
  }

  const windowListener = SingletonListener.from(window)
  const canvasListener = SingletonListener.from(canvas)
  windowListener.addEventListener("resize", onWindowResize)
  canvasListener.addEventListener("mousemove", onMouseMove)

  return () => {
    windowListener.removeEventListener("resize", onWindowResize)
    canvasListener.removeEventListener("mousemove", onMouseMove)
  }
}

export default function DAOBackground() {

  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => render(ref), [])

  return <canvas ref={ref} style={{
    display: 'block',
    width: '100%',
    height: '100%'
  }} />
}