"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import styles from "./Bear.module.scss";

export const Bear = () => {
  const bearRef = useRef<HTMLDivElement | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const animationsRef = useRef<THREE.AnimationClip[] | null>(null);

  useEffect(() => {
    if (!bearRef.current) {
      console.error("bearRef is null, stopping execution.");
      return;
    }

    const scene = new THREE.Scene();
    scene.background = null;

    const width = bearRef.current.clientWidth || 800;
    const height = bearRef.current.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, -5, 60);
    camera.lookAt(0, 0, 0); 

    if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        bearRef.current.innerHTML = ""; // **既存の子要素をクリア**
        bearRef.current.appendChild(rendererRef.current.domElement); // **追加**
      }

    const renderer = rendererRef.current;

    //影を有効化
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //影を受ける地面追加
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({opacity: 0.5});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -10;
    plane.receiveShadow = true;
    scene.add(plane);

    // **光源の追加**
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(2, 5, 5);
    light.castShadow = true;
    light.position.set(2, 10, 10);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 100;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // **GLTFLoader の設定**
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    const updateModelPosition = () => {
      if (!bearRef.current || !modelGroupRef.current) return;
      const maxWidth = 1024;
      const screenWidth = Math.min(bearRef.current.clientWidth || 800, maxWidth);
      modelGroupRef.current.position.set(-screenWidth / 4 / 10, -10, 0);
    };

    // **GLTF モデルの読み込み**
    loader.load(
      "/models/bear.glb",
      (gltf) => {
        console.log("Model loaded:", gltf);

        const model = gltf.scene;
        model.scale.set(9, 9, 9);
        model.position.set(0, -5, 0);
        model.rotation.y = Math.PI * 0.116;

        modelRef.current = model;

        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        scene.add(modelGroup);
        console.log("Scene after adding model:", scene); 
        modelGroupRef.current = modelGroup;

        updateModelPosition();
        console.log("Camera Position:", camera.position); // **カメラ位置の確認**
        console.log("Model Position:", model.position);   // **モデル位置の確認**

        // **カメラがモデルを見るように調整**
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        if (gltf.animations.length > 0) {
          animationsRef.current = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopRepeat, 1);
          action.clampWhenFinished = false;
        }

        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = false;
          }
        })
      },
      (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% completed`),
      (error) => console.error("Error loading model:", error)
    );

    // **アニメーションの更新**

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    animate();

    // **クリックイベントの処理**
    const onClick = (event: MouseEvent) => {
      if (!bearRef.current || !modelRef.current || !mixerRef.current || !animationsRef.current) return;

      const rect = bearRef.current.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObject(modelRef.current, true);

      if (intersects.length > 0) {
        console.log("Model clicked! Playing animation.");
        const action = mixerRef.current.clipAction(animationsRef.current[0]);
        action.weight = 1;
        action.timeScale = 0.5;
        action.clampWhenFinished = false;
        action.stop();
        action.play();
      }
    };
    window.addEventListener("click", onClick);

    // **リサイズ処理**
    const handleResize = () => {
      if (!bearRef.current) return;
      const width = bearRef.current.clientWidth || 800;
      const height = bearRef.current.clientHeight || 600;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateModelPosition();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onClick);
      renderer.dispose();
    };
  }, []);

  return <div ref={bearRef} className={styles.bearSection}></div>;
};
