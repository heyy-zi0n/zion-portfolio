import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Link smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        lenis.scrollTo(target, {
          offset: -80, // Adjust for sticky header
        });
      }
    });
  });


  // Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Navbar background glass effect on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleNavbarScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // check initial state
  }

  // Hero Section Opening Animation
  const heroTimeline = gsap.timeline();
  
  // Hide element flashes by setting opacity before animating
  gsap.set('.hero-badge, .hero-desc, .hero-ctas, .hero-visual', { opacity: 0 });
  
  heroTimeline
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo('.reveal-line', 
      { yPercent: 100 }, 
      { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.15 }, 
      '-=0.6'
    )
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .to('.hero-visual', { opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out' }, '-=0.8');

  // Fade Up Scroll Trigger Animations
  const fadeUpItems = document.querySelectorAll('.animate-fade-up');
  fadeUpItems.forEach(item => {
    gsap.fromTo(item, 
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  });

  // Stagger list containers
  const staggerContainers = document.querySelectorAll('.animate-stagger-container');
  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.animate-stagger-item');
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  });

  // Stat counter animations
  const counters = document.querySelectorAll('.stat-counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    const obj = { count: 0 };
    
    gsap.to(obj, {
      scrollTrigger: {
        trigger: counter,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      count: target,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        counter.textContent = Math.floor(obj.count) + suffix;
      }
    });
  });

  // Testimonials Slider Animation
  let currentTestimonialIndex = 0;
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  
  if (testimonials.length > 0 && prevBtn && nextBtn) {
    const showTestimonial = (index) => {
      testimonials.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.remove('hidden');
          gsap.fromTo(slide, 
            { opacity: 0, x: 30 }, 
            { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
          );
        } else {
          slide.classList.add('hidden');
        }
      });
    };

    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      showTestimonial(currentTestimonialIndex);
    });

    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonialIndex);
    });

    // Auto rotate every 7 seconds
    let interval = setInterval(() => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      showTestimonial(currentTestimonialIndex);
    }, 7000);

    // Stop auto-rotate on user click
    const stopRotation = () => clearInterval(interval);
    prevBtn.addEventListener('click', stopRotation);
    nextBtn.addEventListener('click', stopRotation);
  }
}
