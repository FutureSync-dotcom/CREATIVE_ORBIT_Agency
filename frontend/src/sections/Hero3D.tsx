import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, OrbitControls, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import * as THREE from 'three';
import { cn } from '../utils/cn';

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Subtle rotation follow based on time
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F2FF" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#7000FF" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1, 128, 128]} scale={2.2}>
          <MeshDistortMaterial
            color="#00F2FF"
            attach="material"
            distort={0.45}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive="#001A1C"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
    </>
  );
}

export function Hero3D({ settings }: { settings: any }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const agencyName = settings?.agencyName || 'Agency';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-primary">
      {/* 3D Background with Parallax */}
      <motion.div 
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-accent-purple/10 blur-[120px] rounded-full animate-slow-fade" />
      <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-accent-cyan/10 blur-[120px] rounded-full animate-slow-fade" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-accent-cyan">
            {settings?.tagline || 'Next-Gen Software Solutions'}
          </span>
          
          <h1 className="text-5xl md:text-8xl font-display font-extrabold mb-8 leading-[1.1] tracking-tight">
            {[agencyName, 'is', 'the', 'Future'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                className={cn(
                  "inline-block mr-4 uppercase",
                  i === 0 || word === 'Future' ? "text-gradient" : ""
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-xl text-white/50 mb-12 leading-relaxed">
            We architect scalable software, intuitive interfaces, and high-performance 
            mobile ecosystems for global enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-8 py-4 bg-accent-cyan text-primary font-bold rounded-full flex items-center gap-2 group hover:scale-105 transition-all" data-magnetic>
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent-cyan to-transparent" />
      </motion.div>
    </section>
  );
}
