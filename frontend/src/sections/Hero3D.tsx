import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
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
        <Sphere ref={meshRef} args={[1, 128, 128]} scale={window.innerWidth < 768 ? 1.5 : 2.2}>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (!textRef.current || !paraRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();
      
      // Tagline reveal
      tl.from(".hero-tagline", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out"
      })
      // Character reveal for the main title
      .from(".hero-char", {
        opacity: 0,
        y: 40,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: "power4.out",
      }, "-=0.4")
      // Paragraph reveal
      .from(paraRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      // Button reveal
      .from(".hero-btn", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Scroll Animation (Parallax)
      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 150,
        opacity: 0,
        scale: 0.9,
        ease: "none"
      });
    });

    return () => ctx.revert();
  }, []);

  const agencyName = settings?.agencyName || 'Agency';

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-primary">
      {/* 3D Background with Parallax */}
      <motion.div 
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: window.innerWidth < 768 ? 90 : 75 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-1/4 w-[80%] md:w-[50%] h-[80%] md:h-[50%] bg-accent-purple/10 blur-[100px] md:blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-[80%] md:w-[50%] h-[80%] md:h-[50%] bg-accent-cyan/10 blur-[100px] md:blur-[120px] rounded-full" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="perspective-1000">
          <span className="hero-tagline inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-accent-cyan">
            {settings?.tagline || 'Next-Gen Software Solutions'}
          </span>
          
          <h1 ref={textRef} className="text-[2.5rem] sm:text-6xl md:text-8xl font-display font-extrabold mb-8 leading-[1.1] tracking-tight py-4 max-w-6xl mx-auto">
            {[agencyName, 'is', 'the', 'Future'].map((word, i) => {
              const isGradient = i === 0 || word === 'Future';
              return (
                <span
                  key={i}
                  className="inline-block mr-2 md:mr-4 uppercase"
                >
                  {word.split('').map((char, charIdx) => (
                    <span 
                      key={charIdx} 
                      className={cn(
                        "hero-char inline-block origin-bottom",
                        isGradient ? "text-gradient" : "text-white"
                      )}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>
          
          <p ref={paraRef} className="max-w-xl md:max-w-2xl mx-auto text-sm md:text-xl text-white/50 mb-10 md:mb-12 leading-relaxed px-4 md:px-0">
            We architect scalable software, intuitive interfaces, and high-performance 
            mobile ecosystems for global enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <button className="hero-btn w-full sm:w-auto px-8 py-4 bg-accent-cyan text-primary font-bold rounded-full flex items-center justify-center gap-2 group hover:scale-105 transition-all" data-magnetic>
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/20 font-bold">Explore</span>
        <div className="w-px h-8 md:h-12 bg-gradient-to-b from-accent-cyan to-transparent" />
      </motion.div>
    </section>
  );
}
