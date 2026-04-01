// Set Current Year in Footer
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// Mobile Navigation Toggle
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

const navSlide = () => {
    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Animate Links
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });
};

navSlide();

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            navLinksItems.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});

// ==========================================
// Sticky Navbar specific to Scroll Event
// ==========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// Smooth Scrolling functionality for anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Account for sticky header height
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// ==========================================
// Intersection Observer for Scroll Animations
// ==========================================
const revealElements = document.querySelectorAll('.section-reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // observer.unobserve(entry.target);
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const sectionObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    sectionObserver.observe(el);
});

// ==========================================
// Form Submission Handler Placeholder
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        // Simulating sending state
        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.style.opacity = '0.7';
        
        setTimeout(() => {
            // Simulating success
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.opacity = '1';
            
            // Revert back and clear form
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = ''; // reset to css class gradient
                this.reset();
            }, 3000);
            
        }, 1500);
    });
}

// Add animation keyframes dynamically to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;
document.head.appendChild(styleSheet);

// ==========================================
// Lightbox Gallery Logic
// ==========================================
const albums = {
    'shoot1': [
        'shoot1-1.jpg', 'shoot1-2.jpg', 'shoot1-3.jpg', 'shoot1-4.jpg', 'shoot1-5.jpg',
        'shoot1-6.jpg', 'shoot1-7.jpg', 'shoot1-8.jpg', 'shoot1-9.jpg', 'shoot1-10.jpg',
        'shoot1-11.jpg', 'shoot1-12.jpg', 'shoot1-13.jpg', 'shoot1-14.jpg', 'shoot1-15.jpg'
    ],
    'shoot2': [
        'shoot2-1.jpg', 'shoot2-2.jpg', 'shoot2-3.jpg', 'shoot2-4.jpg', 'shoot2-5.jpg',
        'shoot2-6.jpg', 'shoot2-7.jpg', 'shoot2-8.jpg', 'shoot2-9.jpg'
    ],
    'shoot3': [
        'shoot3-1.jpg', 'shoot3-2.jpg', 'shoot3-3.jpg', 'shoot3-4.jpg', 'shoot3-5.jpg',
        'shoot3-6.jpg', 'shoot3-7.jpg', 'shoot3-8.jpg', 'shoot3-9.jpg'
    ],
    'shoot4': ['photo3.jpg'],
    'shoot5': ['photo4.jpg'],
    'shoot6': ['photo5.jpg']
};

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-arrow');
const nextBtn = document.querySelector('.next-arrow');
const currentIdxElem = document.getElementById('current-idx');
const totalIdxElem = document.getElementById('total-idx');
const galleryItems = document.querySelectorAll('.photo-item');

let currentAlbumKey = null;
let currentPhotoIndex = 0;

function openLightbox(albumKey, startIndex = 0) {
    if (!albums[albumKey] || albums[albumKey].length === 0) return;
    
    currentAlbumKey = albumKey;
    currentPhotoIndex = startIndex;
    
    updateLightboxImage();
    
    // Hide arrows if only 1 photo
    if (albums[albumKey].length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
    
    totalIdxElem.textContent = albums[albumKey].length;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    
    // Slight delay to clear image source after transition
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
}

function updateLightboxImage() {
    const images = albums[currentAlbumKey];
    lightboxImg.src = images[currentPhotoIndex];
    currentIdxElem.textContent = currentPhotoIndex + 1;
}

function nextPhoto() {
    const images = albums[currentAlbumKey];
    currentPhotoIndex = (currentPhotoIndex + 1) % images.length;
    updateLightboxImage();
}

function prevPhoto() {
    const images = albums[currentAlbumKey];
    currentPhotoIndex = (currentPhotoIndex - 1 + images.length) % images.length;
    updateLightboxImage();
}

// Event Listeners for Gallery Items
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const albumKey = item.getAttribute('data-album');
        if(albumKey) {
            openLightbox(albumKey);
        }
    });
});

// Event Listeners for Lightbox Controls
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

// Close lightbox when clicking outside the content
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard Navigation support
window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' && albums[currentAlbumKey].length > 1) nextPhoto();
    if (e.key === 'ArrowLeft' && albums[currentAlbumKey].length > 1) prevPhoto();
});
