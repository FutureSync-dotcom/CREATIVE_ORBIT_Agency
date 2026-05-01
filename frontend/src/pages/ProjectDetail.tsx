import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Zap, 
  Globe, 
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import Lenis from 'lenis';
import { cn } from '../utils/cn';

interface Project {
  _id: string;
  name: string;
  client: {
    name: string;
    company: string;
  };
  category: string;
  image: string;
  description: string;
  results: string[];
  tags: string[];
  challenge: string;
  dueDate: string;
  status: string;
  link?: string;
}

export function ProjectDetail({ settings }: { settings: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const fetchProjectData = async () => {
      try {
        const [res, allRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch('/api/projects')
        ]);
        
        const data = await res.json();
        const allData = await allRes.json();
        
        setProject(data);
        
        // Find next project for navigation
        const currentIndex = allData.findIndex((p: any) => p._id === id);
        if (currentIndex !== -1 && currentIndex < allData.length - 1) {
          setNextProject(allData[currentIndex + 1]);
        } else if (allData.length > 1) {
          setNextProject(allData[0]);
        }
      } catch (err) {
        console.error('Failed to fetch project', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
    window.scrollTo(0, 0);

    return () => {
      // Clean up
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-cyan" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-display font-bold">Project Not Found</h1>
        <Link to="/projects" className="px-8 py-4 bg-accent-cyan text-primary font-bold rounded-full">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-primary selection:bg-accent-cyan selection:text-primary">
      <Navigation settings={settings} />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-end overflow-hidden">
        <motion.div 
          style={{ scale, opacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-full object-cover grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
        </motion.div>

        <div className="container mx-auto px-6 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Link to="/projects" className="inline-flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-[0.3em] mb-8 hover:gap-4 transition-all">
              <ArrowLeft size={14} /> Back to Archive
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest">
                {project.category || 'Case Study'}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{new Date(project.dueDate).getFullYear()}</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-bold leading-[0.85] tracking-tighter mb-8">
              {project.name.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-4">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Overview Grid */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="space-y-2">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Client</p>
              <h3 className="text-xl font-bold">{project.client?.name || 'N/A'}</h3>
              <p className="text-white/40 text-sm">{project.client?.company || ''}</p>
            </div>
            <div className="space-y-2">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Services</p>
              <h3 className="text-xl font-bold">{project.category}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Timeline</p>
              <h3 className="text-xl font-bold">{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
            </div>
            <div className="md:text-right">
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-accent-cyan transition-colors"
                >
                  Launch Project <ExternalLink size={18} />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Project Summary */}
            <div className="lg:col-span-8 space-y-20">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-display font-bold">The Brief</h2>
                <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {project.challenge && (
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-5xl font-display font-bold">The Challenge</h2>
                  <div className="glass-effect p-8 md:p-12 rounded-[2.5rem] border-white/5 relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 blur-3xl rounded-full" />
                    <p className="text-lg md:text-xl text-white/50 leading-relaxed italic">
                      "{project.challenge}"
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-12">
                <h2 className="text-3xl md:text-5xl font-display font-bold">Key Deliverables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.results.map((res, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="text-lg font-bold text-white/80">{res}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar / Tech Stack */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-12">
                <div className="glass-effect p-8 rounded-[2rem] border-white/5 space-y-8">
                  <div className="flex items-center gap-3 text-accent-cyan">
                    <Zap size={20} className="fill-accent-cyan" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Technologies Used</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 space-y-6">
                  <h4 className="text-xl font-bold">Have a similar project in mind?</h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Let's discuss how we can bring your vision to life with our expertise in {project.category}.
                  </p>
                  <Link 
                    to="/#contact"
                    className="w-full py-4 bg-white text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-accent-cyan transition-colors"
                  >
                    Start a Conversation <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Navigation */}
      {nextProject && (
        <section className="py-40 border-t border-white/5 relative overflow-hidden group">
          <Link to={`/project/${nextProject._id}`} className="block">
            <div className="container mx-auto px-6 text-center space-y-8">
              <p className="text-accent-cyan text-xs font-bold uppercase tracking-[0.4em]">Up Next</p>
              <h2 className="text-5xl md:text-8xl font-display font-bold group-hover:scale-105 transition-transform duration-700">
                {nextProject.name}
              </h2>
              <div className="flex justify-center items-center gap-4 text-white/20 group-hover:text-white transition-colors">
                <span className="text-lg font-bold uppercase tracking-widest">Explore Case Study</span>
                <ArrowRight size={32} />
              </div>
            </div>
          </Link>
          {/* Hover Image Preview */}
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
            <img 
              src={nextProject.image} 
              alt="Next" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
            />
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </main>
  );
}
