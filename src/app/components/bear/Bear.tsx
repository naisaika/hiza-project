"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import styles from "./Bear.module.scss";
import { cabinSketch } from "../../layout"; // ✅ Cabin Sketch のフォントをインポート

export const Bear = () => {
  const bearRef = useRef<HTMLDivElement | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const animationsRef = useRef<THREE.AnimationClip[] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const welcomeTextRef = useRef<HTMLParagraphElement | null>(null);

  const particlesRef = useRef<THREE.Points | null>(null);
  const particleMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clock = useRef(new THREE.Clock());


  const [isModelLoaded, setIsModelLoaded] = useState(false);

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
    camera.position.set(0, -10, 60);
    camera.lookAt(0, 0, 0); 
    cameraRef.current = camera;

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
    
      if (bearRef.current) {
        bearRef.current.appendChild(rendererRef.current.domElement); // **ここで直接追加**
      }
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
    plane.position.y = -20;
    plane.receiveShadow = true;
    scene.add(plane);

    // **光源の追加**
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 20, 10);
    light.castShadow = true;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 100;
    light.shadow.camera.left = -30;
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    light.shadow.camera.bottom = -30;

    const target = new THREE.Object3D();
    target.position.set(0, -5, 0);
    scene.add(target);
    light.target = target;

    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // **GLTFLoader の設定**
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    //パーティクルのセットアップ
    const numParticles = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const velocities = new Float32Array(numParticles * 3);

    for(let i = 0; i < numParticles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        u_time: { value: 0.0 }
      },
      vertexShader: `
        uniform float u_time;
        attribute vec3 velocity;
        void main() {
          vec3 newPosition = position + velocity * u_time * 5.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = 5.0;
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 0.8, 0.5, 0.8);
        }
      `
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.visible = false;
    scene.add(particles);

    particlesRef.current = particles;
    particleMaterialRef.current = particleMaterial;

    const updateModelPosition = () => {
      if (!bearRef.current || !modelGroupRef.current) return;
      const maxWidth = 1024;
      const screenWidth = Math.min(bearRef.current.clientWidth || 800, maxWidth);
      modelGroupRef.current.position.set(-screenWidth / 4 / 10, -10, 0);
    };

    const updateTextPosition = () => {
      if (!textRef.current || !modelRef.current || !cameraRef.current || !bearRef.current) return;
    
      const vector = new THREE.Vector3();
    
      // ✅ クマの頭の 3D 座標を取得（モデルの中心ではなく頭の中心）
      modelRef.current.getWorldPosition(vector);
    
      // ✅ クマの頭の位置に適切なオフセットを加える
      const headOffsetY = modelRef.current.scale.y * 22.8; // Y方向の補正
      vector.y += headOffsetY;
    
      // ✅ X方向のズレを補正する
      const headOffsetX = modelRef.current.scale.x * -1.4; // 右にずれているなら左方向に補正
      vector.x += headOffsetX;
    
      // ✅ 3D座標を 2Dスクリーン座標に変換
      vector.project(cameraRef.current);
    
      const width = window.innerWidth;
      const height = window.innerHeight;
    
      // ✅ Three.js の座標系 (-1 ~ 1) を 画面座標に変換
      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (-vector.y * 0.5 + 0.5) * height;
    
      // ✅ CSS で正しく位置を更新
      textRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      textRef.current.style.display = "block";
    };

    const updateWelcomeTextPosition = () => {
      if (!textRef.current || !modelRef.current || !cameraRef.current || !bearRef.current || !welcomeTextRef.current) return;
    
      const vector = new THREE.Vector3();
      modelRef.current.getWorldPosition(vector);
    
      // ✅ クマの反対側に配置
      const offsetY = modelRef.current.scale.y * 22.5;
      vector.y += offsetY;
    
      const width = window.innerWidth;
      const height = window.innerHeight;
    
      vector.project(cameraRef.current);
    
      // ✅ `x` の計算を修正（画面幅の中央を基準に反転）
      const x = (1 - (vector.x * 0.5 + 0.5)) * width; // **正しく反転**
      const y = (-vector.y * 0.5 + 0.5) * height;
    
      // ✅ `useRef` を使って要素を直接操作
      welcomeTextRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      welcomeTextRef.current.style.display = "block";
    };

    // **GLTF モデルの読み込み**
    loader.load(
      "/models/bear.glb",
      (gltf) => {
        console.log("Model loaded:", gltf);

        const model = gltf.scene;
        model.scale.set(9, 9, 9);
        model.position.set(0, -10, 0);
        model.rotation.y = Math.PI * 0.116;

        modelRef.current = model;

        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        scene.add(modelGroup);
        console.log("Scene after adding model:", scene); 
        modelGroupRef.current = modelGroup;
        setIsModelLoaded(true);
        updateTextPosition();
        updateWelcomeTextPosition();
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
            node.receiveShadow = true;
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
      updateTextPosition();
      updateWelcomeTextPosition();
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

      if(particlesRef.current) {
        particlesRef.current.visible = true;
        if(!particleMaterialRef.current) return;
        particleMaterialRef.current.uniforms.u_tile.value = 0;
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
      updateTextPosition();
      updateWelcomeTextPosition(); 
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onClick);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={bearRef} className={styles.bearSection}>
        {isModelLoaded && (
          <div ref={textRef} className={`${styles.text} ${cabinSketch.className}`}>
            Click Me!
            <div className={styles.arrowContainer}>
              <div className={styles.arrow}></div>
            </div>
          </div>
        )}
      </div>
      <p ref={welcomeTextRef} className={styles.welcomeText}>
        ようこそ、初めまして。<br/>
        あなたにお会いできて<br/>
        とても嬉しいです。<br/>
        まずは、こちらをどうぞ！
      </p> 
    </>
  )
};