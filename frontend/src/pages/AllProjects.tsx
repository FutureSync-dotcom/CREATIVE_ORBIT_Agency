import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ProjectCard } from '../components/ProjectCard';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';

export function AllProjects({ settings }: { settings: any }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    return () => {
      // Clean up lenis if needed
    };
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  return (
    <main className="min-h-screen bg-primary">
      <Navigation settings={settings} />
      
      <div className="pt-40 pb-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-widest mb-6 hover:gap-4 transition-all">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-5xl md:text-8xl font-display font-bold">
              Project <span className="text-gradient">Archive</span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:border-accent-cyan/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                filter === cat 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-transparent border-white/5 text-white/40 hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse" />
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/40 text-lg italic">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings} />
    </main>
  );
}
