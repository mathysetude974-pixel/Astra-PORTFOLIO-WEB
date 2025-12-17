// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Reveal on scroll
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Fallback: show everything
  revealElements.forEach((el) => el.classList.add("visible"));
}

// Filter gallery
const filterButtons = document.querySelectorAll(".filter-btn");
const photoCards = document.querySelectorAll(".photo-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filterValue = btn.getAttribute("data-filter");

    // Active state avec animation
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.classList.remove("pulse");
    });
    btn.classList.add("active");
    btn.classList.add("pulse");

    // Première phase : Animation de sortie pour toutes les cartes
    photoCards.forEach((card) => {
      card.classList.add("filter-out");
    });

    // Deuxième phase : Après l'animation de sortie, mise à jour de la visibilité
    setTimeout(() => {
      let visibleIndex = 0;
      
      photoCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        card.classList.remove("filter-out");
        
        if (filterValue === "all" || filterValue === category) {
          card.classList.remove("hidden");
          
          // Animation d'entrée avec délai progressif seulement pour les cartes visibles
          setTimeout(() => {
            card.classList.add("filter-in");
            setTimeout(() => {
              card.classList.remove("filter-in");
            }, 500);
          }, visibleIndex * 80); // Délai progressif plus long pour plus de fluidité
          
          visibleIndex++;
        } else {
          card.classList.add("hidden");
        }
      });
    }, 250); // Délai pour laisser l'animation de sortie se terminer

    // Retirer l'effet pulse après l'animation
    setTimeout(() => {
      btn.classList.remove("pulse");
    }, 800);
  });
});

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 320) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close menu on link click (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// Gestion du formulaire de contact avec Web3Forms
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    
    // Vérifier que la clé d'accès est configurée
    const accessKey = contactForm.querySelector('input[name="access_key"]').value;
    if (accessKey === "YOUR_ACCESS_KEY_HERE") {
      showNotification("⚠️ Configurez d'abord votre clé Web3Forms dans le code !", "error");
      return;
    }
    
    // Afficher le loader
    btnText.style.display = "none";
    btnLoader.style.display = "inline";
    submitBtn.disabled = true;
    
    try {
      // Créer les données du formulaire
      const formData = new FormData(contactForm);
      
      // Envoyer via Web3Forms
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Succès
        showNotification("✅ Message envoyé avec succès ! Je vous répondrai bientôt.", "success");
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      showNotification("❌ Erreur lors de l'envoi. Veuillez réessayer.", "error");
    } finally {
      // Restaurer le bouton
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
      submitBtn.disabled = false;
    }
  });
}

// Fonction pour afficher les notifications
function showNotification(message, type) {
  // Supprimer les notifications existantes
  const existingNotifs = document.querySelectorAll('.notification');
  existingNotifs.forEach(notif => notif.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Afficher la notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Masquer après 4 secondes
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxDescription = document.querySelector(".lightbox-description");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const clickableCards = document.querySelectorAll(".photo-card.clickable");

// Function to open lightbox
function openLightbox(imageClass, title, description) {
  // Get the computed background-image from the original element
  const originalElement = document.querySelector(`.${imageClass}`);
  const computedStyle = window.getComputedStyle(originalElement);
  const backgroundImage = computedStyle.backgroundImage;
  
  // Extract the URL from the background-image property
  if (backgroundImage && backgroundImage !== 'none') {
    const imageUrl = backgroundImage.slice(4, -1).replace(/["']/g, "");
    lightboxImage.src = imageUrl;
  }
  
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxDescription.textContent = description;
  
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Function to close lightbox
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Add click listeners to photo cards
clickableCards.forEach((card) => {
  card.addEventListener("click", () => {
    const imageClass = card.getAttribute("data-image");
    const title = card.getAttribute("data-title");
    const description = card.getAttribute("data-description");
    
    openLightbox(imageClass, title, description);
  });
});

// Close lightbox events
lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);

// Close lightbox with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

// Prevent lightbox content click from closing
document.querySelector(".lightbox-content").addEventListener("click", (e) => {
  e.stopPropagation();
});

// ========== EFFETS AVANCÉS ==========

// Effet de parallaxe pour le héros
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateParallax() {
  targetX += (mouseX - targetX) * 0.02;
  targetY += (mouseY - targetY) * 0.02;
  
  const heroFrame = document.querySelector('.hero-frame');
  if (heroFrame) {
    const x = (targetX - window.innerWidth / 2) * 0.01;
    const y = (targetY - window.innerHeight / 2) * 0.01;
    heroFrame.style.transform = `translate(${x}px, ${y}px)`;
  }
  
  requestAnimationFrame(updateParallax);
}
updateParallax();

// Effet de particules flottantes
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  document.body.appendChild(particlesContainer);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Effet de typing pour le titre principal
function typeWriter(element, text, speed = 100) {
  if (!element) return;
  
  element.innerHTML = '';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialiser les effets au chargement
window.addEventListener('load', () => {
  createParticles();
  
  // Effet de typing sur le titre principal après un délai
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 80);
    }
  }, 1000);
});

// Logo sans effet de glitch

// Effet de vague sur les boutons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Effet de rotation 3D sur les cartes photo
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// Effet de surlignage de texte animé
function highlightText() {
  const highlights = document.querySelectorAll('.about-highlight');
  highlights.forEach(highlight => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('highlight-animate');
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(highlight);
  });
}

// Effet de compte à rebours sur les sections
let sectionCounter = 0;
document.querySelectorAll('.section').forEach(section => {
  section.style.setProperty('--section-delay', sectionCounter * 0.2 + 's');
  sectionCounter++;
});

// Initialiser les effets de surbrillance
highlightText();

// Curseur personnalisé supprimé
