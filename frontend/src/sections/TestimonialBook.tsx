import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useMediaQuery } from '@react-hook/media-query';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface Testimonial {
  image?: string;
  text: string;
  name: string;
  jobtitle: string;
  rating: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    jobtitle: "CEO at TechFlow",
    text: "CREATIVE ORBIT transformed our vision into a stunning reality. Their attention to detail and futuristic design language is exactly what we needed.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Michael Chen",
    jobtitle: "Product Manager at Nexus",
    text: "The speed and efficiency of their development team is unmatched. They don't just build software; they architect digital experiences.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=michael"
  },
  {
    name: "Elena Rodriguez",
    jobtitle: "Creative Director",
    text: "The AR features they implemented for our brand were mind-blowing. Truly a next-gen agency that understands the future of tech.",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=elena"
  },
  {
    name: "David Smith",
    jobtitle: "Founder of Aero",
    text: "Working with this team was the best decision for our startup. They delivered a complex fintech platform in record time.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=david"
  }
];

export function TestimonialBook() {
  const bookRef = useRef<any>(null);
  const isLaptop = useMediaQuery('(min-width: 1024px) and (max-width: 1440px)');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch('/api/testimonials/approved');
        if (!res.ok) throw new Error('Testimonials fetch failed');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };
    fetchApproved();
  }, []);

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 mb-12 lg:mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 block"
        >
          Success Stories
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-white"
        >
          Client <span className="text-gradient">Wall of Fame</span>
        </motion.h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-12">
        <div className="relative group">
          {/* @ts-ignore */}
          <HTMLFlipBook
            width={isSmallScreen ? 320 : (isLaptop ? 400 : 450)}
            height={isSmallScreen ? 480 : (isLaptop ? 540 : 600)}
            size="fixed"
            minWidth={315}
            maxWidth={1000}
            minHeight={420}
            maxHeight={1350}
            showCover={true}
            mobileScrollSupport={true}
            className="shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            ref={bookRef}
            onFlip={(e) => setCurrentPage(e.data)}
            style={{ backgroundColor: 'transparent' }}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={isSmallScreen}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Front Cover */}
            <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-12 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-cyan/5" />
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 group-hover:rotate-12 transition-transform duration-700">
                  <Quote className="w-8 h-8 md:w-12 md:h-12 text-accent-cyan fill-accent-cyan/20" />
                </div>
                <h3 className="text-2xl md:text-4xl font-display font-black tracking-tighter text-white leading-tight">
                  CREATIVE <br /> <span className="text-accent-cyan">ORBIT</span> <br /> JOURNALS
                </h3>
                <div className="w-12 md:w-16 h-1 bg-accent-cyan mx-auto rounded-full" />
                <p className="text-[10px] md:text-sm text-white/40 uppercase tracking-[0.3em] font-bold">
                  Testimonials Edition <br /> 2026
                </p>
              </div>
            </div>

            {/* Index / Intro Page */}
            <div className="bg-zinc-900 border border-white/5 p-6 md:p-10 flex flex-col shadow-inner">
               <h4 className="text-accent-cyan text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-10 border-b border-white/10 pb-4">Table of Contents</h4>
               <div className="space-y-4 md:space-y-6">
                 {testimonials.map((t, i) => (
                   <button 
                    key={i}
                    onClick={() => bookRef.current.pageFlip().flip(i + 2)}
                    className="w-full flex items-center justify-between group hover:pl-2 transition-all"
                   >
                     <div className="flex items-center gap-3">
                       <img src={t.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10" />
                       <span className="text-white/60 font-bold text-xs md:text-sm group-hover:text-accent-cyan transition-colors">{t.name}</span>
                     </div>
                     <span className="text-white/20 font-mono text-[10px] md:text-xs">pg. {i + 2}</span>
                   </button>
                 ))}
               </div>
               <div className="mt-auto pt-10">
                 <p className="text-[10px] text-white/20 italic leading-relaxed">
                   "A collection of voices from those who joined us in redefining the digital frontier."
                 </p>
               </div>
            </div>

            {/* Testimonial Pages */}
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#f5f5f5] p-6 md:p-12 flex flex-col items-center justify-center text-center relative shadow-inner overflow-hidden">
                <div className="absolute top-4 right-6 text-zinc-300 font-mono text-xs">{i + 2}</div>
                
                <div className="relative mb-6 md:mb-10">
                  <div className="absolute -inset-4 bg-accent-cyan/10 blur-2xl rounded-full" />
                  <img src={t.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} alt={t.name} className="relative w-20 h-20 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-white shadow-xl object-cover" />
                </div>

                <div className="space-y-1 md:space-y-2 mb-4 md:mb-8">
                  <h4 className="text-lg md:text-2xl font-display font-bold text-zinc-900">{t.name}</h4>
                  <p className="text-accent-cyan text-[9px] md:text-xs font-black uppercase tracking-widest">{t.jobtitle}</p>
                </div>

                <div className="relative mb-6 md:mb-10 px-2">
                  <Quote className="absolute -top-4 -left-2 md:-top-6 md:-left-6 w-6 h-6 md:w-10 md:h-10 text-zinc-200 -z-10" />
                  <p className="text-zinc-600 font-serif text-sm md:text-xl italic leading-snug md:leading-relaxed">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      className={cn(
                        "w-4 h-4 md:w-[18px] md:h-[18px]",
                        starI < t.rating ? "fill-accent-cyan text-accent-cyan" : "text-zinc-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Back Cover */}
            <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-12 flex flex-col items-center justify-center text-center shadow-inner relative">
               <div className="absolute inset-0 bg-gradient-to-tl from-accent-cyan/10 via-transparent to-accent-cyan/5" />
               <h3 className="text-2xl md:text-3xl font-display font-bold text-white relative z-10">Thank You!</h3>
               <p className="text-white/40 text-sm md:text-base mt-2 md:mt-4 relative z-10">Your feedback drives <br /> our innovation.</p>
               <div className="mt-8 md:mt-12 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center relative z-10">
                 <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
               </div>
            </div>
          </HTMLFlipBook>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => bookRef.current.pageFlip().flipPrev()}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            {[...Array(testimonials.length + 3)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  currentPage === i ? "bg-accent-cyan w-4" : "bg-white/10"
                )} 
              />
            ))}
          </div>
          <button 
            onClick={() => bookRef.current.pageFlip().flipNext()}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
