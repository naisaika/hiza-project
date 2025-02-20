import { useEffect, useRef } from 'react'
import styles from "./Rabbit.module.scss";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

export const Rabbit = () => {

  const rabbitRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animationsRef = useRef<THREE.AnimationClip[] | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if(!rabbitRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const width = rabbitRef.current.clientWidth || 800;
    const height = rabbitRef.current.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    camera.position.set(0, -10, 60);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    if(!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);

      if(rabbitRef.current) {
        rabbitRef.current.appendChild(rendererRef.current.domElement);
      }
    }

    const renderer = rendererRef.current;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const PlaneGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({opacity: 0.5});
    const plane = new THREE.Mesh(PlaneGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -20;
    plane.receiveShadow = true;
    scene.add(plane);

    const light = new THREE.DirectionalLight(0xffffff, 0.3);
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    light.position.set(10, 20, 10);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/rabbit.glb",
      (gltf) => {
        if(gltf.animations.length === 0) {
          return;
        }

        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(0, -10, 0);
        model.rotation.y = Math.PI * 0.116;

        modelRef.current = model;

        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        scene.add(modelGroup);
        modelGroupRef.current = modelGroup;

        camera.lookAt(new THREE.Vector3(0, 0, 0));

        if(gltf.animations.length > 0) {
          animationsRef.current = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopRepeat, 1);
          action.play();
        }

        model.traverse((node) => {
          if(node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        
        animationsRef.current = gltf.animations;
      },
      (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% completed`),
      (error) => console.error("Error loading model:", error)
    );

    const clock = new THREE.Clock();

    const animate = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      if(mixerRef.current) {
        mixerRef.current.update(delta);
      }
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", () => {
      if (!rendererRef.current || !cameraRef.current || !rabbitRef.current) return;
      const width = rabbitRef.current.clientWidth;
      const height = rabbitRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    });

  }, []);

  return (
    <div ref={rabbitRef} className={styles.rubbitSection}></div>
  )
}
