import { useEffect, useRef } from "react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scroll = window.scrollY;
        heroRef.current.style.transform = `translateY(${scroll * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        ref={heroRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center px-6 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-6 text-sm bg-accent/80 text-accent-foreground rounded-full backdrop-blur-sm">
            Introducing Innovation
          </span>
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            Create Something Amazing
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-8">
            Experience the future of design with our cutting-edge platform that
            brings your ideas to life.
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;