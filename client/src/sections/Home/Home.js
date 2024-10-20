import React, { useEffect } from 'react';
import useTypewriter from './useTypewriter';
import './Home.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Lenis from '@studio-freight/lenis';

const Home = () => {
  const phrases = ["Surveys", "Data", "Analysis"];
  const prefix = "Better ";
  const typedText = useTypewriter(prefix, phrases);

  useEffect(() => {
    // Initialize Three.js
    const canvas = document.querySelector('#three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set background color to #f8f3ea
    renderer.setClearColor(0xf8f3ea);

    // Add enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Increase ambient light intensity to 1
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2); // Increase the intensity to 1
    directionalLight1.position.set(5, 10, 7.5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Another directional light from a different angle
    directionalLight2.position.set(-5, -10, -7.5);
    scene.add(directionalLight2);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8); // Hemisphere light for soft sky and ground lighting
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    let model; // Variable to hold the loaded model

    // Load custom GLB model instead of cube
    const loader = new GLTFLoader();
    loader.load('/assets/common/iphone_15_pro_-_free_downoald_-_2024.glb', (gltf) => {
      model = gltf.scene;
      
      // Ensure the model's pivot point is centered
      // model.traverse((node) => {
      //   if (node.isMesh) {
      //     node.geometry.center(); // Center the geometry if needed
      //   }
      // });

      model.scale.set(0.5, 0.5, 0.5); // Adjust the model size
      model.position.set(0, -5, 0); // Ensure the model stays at the center
      scene.add(model);
    }, undefined, (error) => {
      console.error('Error loading the model:', error);
    });

    camera.position.z = 20;

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let scrollVelocity = 0;

    // Capture the scroll velocity from Lenis
    lenis.on('scroll', ({ velocity }) => {
      scrollVelocity = velocity * 0.01;
    });

    // Infinite spinning + scroll-based rotation
    function animate(time) {
      lenis.raf(time);

      if (model) {
        model.rotation.y += scrollVelocity || 0.01; // Continuous rotation + scroll-based
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []); // Run only once when the component is mounted

  return (
    <div className="app-container">
      <main className="main-content">
        {/* Other sections */}
        <section className="hero">
          <p className="typewriter">
            <span>{typedText}</span>
            <span className="blinking-cursor">|</span>
          </p>
          <img className="w-[20px]" src="/assets/common/iPhone14.svg" alt="Mockup" />
          <p className="subtext">Welcome to the future of surveying</p>
          <p className="description">
            Transform the way you collect data. Our AI generates questions tailored to your form's purpose, asks further questions, and provides deep insights with built-in response and data analysis.
          </p>
          <button className="create-form-btn-large">Create Your First Form</button>
        </section>

        <section className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-title">Define Your Purpose</div>
            <p className="step-des">Simply tell us the goal of your form, and our AI will handle the rest.</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-title">Gather Profound Information</div>
            <p className="step-des">Our AI asks further, extensive questions, extracting more information from respondents.</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-title">Gain Deeper Insights</div>
            <p className="step-des">Get real-time insights and in-depth analysis of the responses with our built-in data tools.</p>
          </div>
        </section>

        {/* Add the Three.js canvas at the bottom */}
        <div style={{ width: '100%', height: '400px' }}>
          <canvas id="three-canvas" />
        </div>
      </main>
    </div>
  );
};

export default Home;