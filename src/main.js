import './style.css';
import { initTheme } from './js/theme.js';
import { initAnimations } from './js/animations.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  createIcons,
  Menu,
  X,
  Globe,
  Code,
  Database,
  FileText,
  Bot,
  Palette,
  Award,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Sun,
  Moon,
  ArrowUp,
  Send,
  Check,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Star,
  Sparkles,
  Briefcase,
  Zap,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  Smartphone,
  UserCheck,
  Cpu,
  Workflow,
  Sliders,
  Search,
  BookOpen
} from 'lucide';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme (Dark/Light Mode)
  initTheme();

  // Initialize Lucide Icons
  createIcons({
    icons: {
      Menu,
      X,
      Globe,
      Code,
      Database,
      FileText,
      Bot,
      Palette,
      Award,
      Clock,
      CheckCircle,
      MessageSquare,
      ArrowRight,
      Sun,
      Moon,
      ArrowUp,
      Send,
      Check,
      Phone,
      Mail,
      MapPin,
      ExternalLink,
      Star,
      Sparkles,
      Briefcase,
      Zap,
      TrendingUp,
      HelpCircle,
      ChevronDown,
      ChevronUp,
      FileCode,
      Smartphone,
      UserCheck,
      Cpu,
      Workflow,
      Sliders,
      Search,
      BookOpen
    }
  });

  // Setup Mobile Navigation Menu
  setupMobileMenu();

  // Setup Category Filters for Services
  setupServicesFilter();

  // Setup Category Filters for Portfolio
  setupPortfolioFilter();

  // Setup FAQ Accordion
  setupFaqAccordion();

  // Setup Contact Form Submissions via AJAX
  setupContactForm();

  // Initialize Animations (Lenis, GSAP scroll triggers, cursor tracker)
  initAnimations();

  // Back to Top button functionality
  setupBackToTop();
});

function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      
      const menuIcon = menuBtn.querySelector('.menu-icon');
      const closeIcon = menuBtn.querySelector('.close-icon');
      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.setAttribute('aria-expanded', 'false');
        
        const menuIcon = menuBtn.querySelector('.menu-icon');
        const closeIcon = menuBtn.querySelector('.close-icon');
        if (menuIcon && closeIcon) {
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      });
    });
  }
}

function setupServicesFilter() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Classes on Filter Buttons
        filterBtns.forEach(b => {
          b.classList.remove('bg-brand-accent', 'text-white', 'border-transparent');
          b.classList.add('bg-transparent', 'text-brand-secondary', 'border-brand-border');
        });
        btn.classList.remove('bg-transparent', 'text-brand-secondary', 'border-brand-border');
        btn.classList.add('bg-brand-accent', 'text-white', 'border-transparent');
        
        const category = btn.getAttribute('data-filter');
        
        serviceCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.96, y: 15 }, 
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.classList.add('hidden');
          }
        });
        
        // Refresh ScrollTrigger positions
        ScrollTrigger.refresh();
      });
    });
  }
}

function setupPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Classes on Filter Buttons
        filterBtns.forEach(b => {
          b.classList.remove('bg-brand-accent', 'text-white', 'border-transparent');
          b.classList.add('bg-transparent', 'text-brand-secondary', 'border-brand-border');
        });
        btn.classList.remove('bg-transparent', 'text-brand-secondary', 'border-brand-border');
        btn.classList.add('bg-brand-accent', 'text-white', 'border-transparent');
        
        const category = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.96, y: 15 }, 
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.classList.add('hidden');
          }
        });
        
        // Refresh ScrollTrigger positions
        ScrollTrigger.refresh();
      });
    });
  }
}

function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        
        // Close all other FAQs
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.querySelector('.faq-content').classList.add('hidden');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherIcon) {
              gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
            }
          }
        });

        // Toggle current FAQ
        if (isOpen) {
          content.classList.add('hidden');
          if (icon) {
            gsap.to(icon, { rotation: 0, duration: 0.3 });
          }
        } else {
          content.classList.remove('hidden');
          gsap.fromTo(content, 
            { height: 0, opacity: 0 }, 
            { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
          if (icon) gsap.to(icon, { rotation: 180, duration: 0.3 });
        }
        
        // Refresh ScrollTrigger positions
        ScrollTrigger.refresh();
      });
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const submitText = submitBtn ? submitBtn.querySelector('.submit-text') : null;
      
      if (!submitBtn || !submitText) return;
      
      const originalText = submitText.textContent;
      submitText.textContent = 'Sending Message...';
      submitBtn.disabled = true;
      
      const email = form.querySelector('[name="email"]').value.trim();
      const name = form.querySelector('[name="name"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      
      if (!email || !name || !message) {
        submitText.textContent = 'Please fill all fields';
        submitBtn.classList.add('bg-red-600');
        setTimeout(() => {
          submitText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-red-600');
        }, 3000);
        return;
      }
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          submitText.textContent = 'Message Sent Successfully!';
          submitBtn.classList.remove('bg-brand-accent');
          submitBtn.classList.add('bg-green-600');
          form.reset();
          
          setTimeout(() => {
            submitText.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-green-600');
            submitBtn.classList.add('bg-brand-accent');
          }, 6000);
        } else {
          throw new Error('Server error response');
        }
      } catch (err) {
        submitText.textContent = 'Error sending message. Try again.';
        submitBtn.classList.remove('bg-brand-accent');
        submitBtn.classList.add('bg-red-600');
        
        setTimeout(() => {
          submitText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-red-600');
          submitBtn.classList.add('bg-brand-accent');
        }, 5000);
      }
    });
  }
}

function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
