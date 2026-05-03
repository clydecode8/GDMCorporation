// Resolve component paths from repo root (index.html) vs src/html/*.html
function siteResourcePrefix() {
    const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    return pathname.includes('/src/html/') ? '../' : 'src/';
}

// Load header component
async function loadHeaderComponent() {
    try {
        const response = await fetch(`${siteResourcePrefix()}components/header.html`);
        let headerHTML = await response.text();
        if (siteResourcePrefix() === 'src/') {
            headerHTML = headerHTML
                .replace(/href="\.\.\/\.\.\/index\.html"/g, 'href="index.html"')
                .replace(/href="services\.html"/g, 'href="src/html/services.html"')
                .replace(/\.\.\/assets\//g, 'src/assets/');
        }
        document.getElementById('header-component').innerHTML = headerHTML;
        
        // Add scroll effect to header after loading
        initHeaderScrollEffect();
        
        // Initialize mobile menu after loading with a small delay
        setTimeout(() => {
            initMobileMenu();
        }, 100);
    } catch (error) {
        console.error('Error loading header component:', error);
    }
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Hamburger menu functionality
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    
    if (!hamburgerMenu || !mainNav) {
        console.log('Hamburger menu or navigation not found');
        return;
    }
    
    console.log('Initializing hamburger menu');
    
    // Ensure menu starts in closed state
    hamburgerMenu.classList.remove('active');
    mainNav.classList.remove('active');
    document.body.style.overflow = '';
    
    hamburgerMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger menu clicked');
        
        hamburgerMenu.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('Menu closed');
        }
    });
    
    // Close hamburger menu when clicking on nav links
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked, closing menu');
            hamburgerMenu.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close hamburger menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('active') && 
            !hamburgerMenu.contains(e.target) && 
            !mainNav.contains(e.target)) {
            console.log('Clicked outside, closing menu');
            hamburgerMenu.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close hamburger menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            console.log('Escape pressed, closing menu');
            hamburgerMenu.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Carousel functionality
let currentSlide = 0;
let slideItems = document.querySelectorAll('.featured-project .list .item');
let thumbnailItems = document.querySelectorAll('.thumbnail .item');
let prevButton = document.getElementById('prev');
let nextButton = document.getElementById('next');
let autoSlideInterval;
let userInteractionTimeout;
let isUserInteracting = false;

// Initialize carousel
function initCarousel() {
    if (slideItems.length === 0 || thumbnailItems.length === 0) return;
    
    updateSlide(0);
    startAutoSlide();
    
    // Add click events to thumbnails
    thumbnailItems.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', (event) => {
            const targetLink = thumbnail.getAttribute('href') || thumbnail.dataset.link;
            if (targetLink) {
                event.preventDefault();
                window.location.href = targetLink;
                return;
            }

            currentSlide = index;
            updateSlide(currentSlide);
            handleUserInteraction();
        });
    });
    
    // Navigation buttons for carousel (not thumbnail scrolling)
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            scrollThumbnails('next');
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            scrollThumbnails('prev');
        });
    }
}

function updateSlide(index) {
    // Update featured project
    slideItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Update thumbnails
    thumbnailItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideItems.length;
    updateSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideItems.length) % slideItems.length;
    updateSlide(currentSlide);
}

function startAutoSlide() {
    // Clear any existing interval
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto-slide with 5-second interval
    autoSlideInterval = setInterval(() => {
        if (!isUserInteracting) {
            nextSlide();
        }
    }, 5000);
}

function handleUserInteraction() {
    // Set user interaction flag
    isUserInteracting = true;
    
    // Clear any existing timeout
    if (userInteractionTimeout) {
        clearTimeout(userInteractionTimeout);
    }
    
    // Clear the auto-slide interval
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    
    // Set timeout for 1 minute (60000ms) before resuming auto-slide
    userInteractionTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoSlide();
    }, 60000); // 1 minute
}

function resetAutoSlide() {
    // This function is now used only for page visibility changes
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    
    if (!isUserInteracting) {
        startAutoSlide();
    }
}

// Drag scroll variables
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;
let dragDistance = 0;
let isClick = true;

let thumbnail = document.querySelector('.thumbnail');
let thumbnailContainer = document.querySelector('.thumbnail-container');

function initDragScroll() {
    if (!thumbnail || !thumbnailContainer) return;
    
    // Disable drag scrolling for screens 800px and below
    if (window.innerWidth <= 800) {
        return;
    }
    
    // Prevent default drag behavior on images
    thumbnail.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
    
    // Touch events - passive false to prevent scrolling
    thumbnail.addEventListener('touchstart', handleStart, { passive: false });
    thumbnail.addEventListener('touchmove', handleMove, { passive: false });
    thumbnail.addEventListener('touchend', handleEnd, { passive: false });

    // Mouse events
    thumbnail.addEventListener('mousedown', handleStart);
    thumbnail.addEventListener('mousemove', handleMove);
    thumbnail.addEventListener('mouseup', handleEnd);
    thumbnail.addEventListener('mouseleave', handleEnd);

    // Prevent context menu
    thumbnail.addEventListener('contextmenu', e => e.preventDefault());
    
    // Prevent text selection
    thumbnail.addEventListener('selectstart', e => e.preventDefault());
}

function handleStart(e) {
    isDragging = true;
    isClick = true;
    dragDistance = 0;
    thumbnail.style.cursor = 'grabbing';
    
    if (e.type === 'touchstart') {
        startPos = e.touches[0].clientX;
        e.preventDefault();
    } else {
        startPos = e.clientX;
        e.preventDefault();
    }
    
    thumbnail.style.transition = 'none';
}

function handleMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    let currentPos;
    if (e.type === 'touchmove') {
        currentPos = e.touches[0].clientX;
    } else {
        currentPos = e.clientX;
    }
    
    const diff = currentPos - startPos;
    dragDistance = Math.abs(diff);
    
    // If we've moved more than 5px, it's a drag, not a click
    if (dragDistance > 5) {
        isClick = false;
    }
    
    const newTranslate = prevTranslate + diff;
    
    // Add some resistance at the edges
    const maxTranslate = 0;
    const minTranslate = -(thumbnail.scrollWidth - thumbnailContainer.offsetWidth);
    
    if (newTranslate > maxTranslate) {
        currentTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
    } else if (newTranslate < minTranslate) {
        currentTranslate = minTranslate + (newTranslate - minTranslate) * 0.3;
    } else {
        currentTranslate = newTranslate;
    }
    
    setTransform();
}

function handleEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    thumbnail.style.cursor = 'grab';
    
    // If it was a click (minimal movement), allow the click event to fire
    if (isClick && dragDistance <= 5) {
        // Don't prevent the click event
        return;
    }
    
    prevTranslate = currentTranslate;
    
    // Add transition for smooth finish
    thumbnail.style.transition = 'transform 0.3s ease-out';
    
    // Snap to boundaries
    const maxTranslate = 0;
    const minTranslate = -(thumbnail.scrollWidth - thumbnailContainer.offsetWidth);
    
    if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
    }
    
    setTransform();
    
    setTimeout(() => {
        thumbnail.style.transition = '';
    }, 300);
}

function setTransform() {
    thumbnail.style.transform = `translateX(${currentTranslate}px)`;
}

// Simple scroll for arrow buttons
function scrollThumbnails(direction) {
    // Disable horizontal scrolling for screens 800px and below
    if (window.innerWidth <= 800) {
        return;
    }
    
    const scrollAmount = 300; // Scroll by 300px
    
    if (direction === 'next') {
        currentTranslate -= scrollAmount;
    } else {
        currentTranslate += scrollAmount;
    }
    
    // Add boundary checks
    const maxTranslate = 0;
    const minTranslate = -(thumbnail.scrollWidth - thumbnailContainer.offsetWidth);
    
    if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
    }
    
    prevTranslate = currentTranslate;
    thumbnail.style.transition = 'transform 0.3s ease';
    setTransform();
    
    setTimeout(() => {
        thumbnail.style.transition = '';
    }, 300);
}

// Thumbnail toggle functionality
function initThumbnailToggle() {
    const toggleBtn = document.getElementById('thumbnail-toggle-btn');
    const projectsRow = document.getElementById('projects-row');
    const toggleText = document.querySelector('.toggle-text');
    const toggleContainer = document.getElementById('thumbnail-toggle');
    
    if (!toggleBtn || !projectsRow || !toggleText || !toggleContainer) return;

    function setProjectsVisibility(showProjects) {
        if (showProjects) {
            projectsRow.classList.remove('hidden');
            toggleBtn.classList.add('active');
            toggleText.textContent = 'Hide Projects';
            document.body.classList.add('projects-overlay-open');
        } else {
            projectsRow.classList.add('hidden');
            toggleBtn.classList.remove('active');
            toggleText.textContent = 'Show Projects';
            document.body.classList.remove('projects-overlay-open');
        }
    }
    
    // Toggle functionality
    toggleBtn.addEventListener('click', () => {
        const isHidden = projectsRow.classList.contains('hidden');
        setProjectsVisibility(isHidden);
    });
    
    // Close button functionality
    const closeBtn = document.getElementById('close-projects-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            setProjectsVisibility(false);
        });
    }

    // Ensure overlay toggle is always available on all device sizes.
    toggleContainer.style.display = 'block';
    setProjectsVisibility(false);
}

// Make all back links behave like browser back.
function initBackLinkBehavior() {
    const backLinks = document.querySelectorAll('.back-link');
    if (backLinks.length === 0) return;

    backLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            const fallbackHref = link.getAttribute('href');
            if (fallbackHref) {
                window.location.href = fallbackHref;
            }
        });
    });
}

// Open project images in a zoomable lightbox UI.
function initImageLightbox() {
    const imageSelectors = [
        '.featured-image img',
        '.project-image img',
        '.gallery-item img',
        '.mural-item img',
        '.mural-image img',
        '.before-image img',
        '.process-item img',
        '.showcase-item img',
        '.grid-item img'
    ];

    const images = document.querySelectorAll(imageSelectors.join(', '));
    if (images.length === 0) return;

    let overlay = document.getElementById('image-lightbox-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'image-lightbox-overlay';
        overlay.className = 'image-lightbox-overlay';
        overlay.innerHTML = `
            <button type="button" class="image-lightbox-close" aria-label="Close image preview">×</button>
            <img class="image-lightbox-image" src="" alt="">
            <p class="image-lightbox-caption"></p>
        `;
        document.body.appendChild(overlay);
    }

    const lightboxImage = overlay.querySelector('.image-lightbox-image');
    const lightboxCaption = overlay.querySelector('.image-lightbox-caption');
    const closeButton = overlay.querySelector('.image-lightbox-close');

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    function openLightbox(sourceImage) {
        const src = sourceImage.getAttribute('src');
        const alt = sourceImage.getAttribute('alt') || 'Project image';

        lightboxImage.setAttribute('src', src);
        lightboxImage.setAttribute('alt', alt);
        lightboxCaption.textContent = alt;

        overlay.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    images.forEach((image) => {
        if (image.closest('a') || image.dataset.noLightbox === 'true') return;

        image.classList.add('lightbox-enabled-image');
        image.addEventListener('click', () => openLightbox(image));
    });

    closeButton.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load header component first
    await loadHeaderComponent();
    
    // Then initialize other components
    initCarousel();
    initDragScroll();
    initThumbnailToggle();
    initBackLinkBehavior();
    initImageLightbox();
});

// Pause auto-slide when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(autoSlideInterval);
    } else {
        resetAutoSlide();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize drag scroll based on screen width
    initDragScroll();
    
    // Reset position if needed
    const maxTranslate = 0;
    const minTranslate = -(thumbnail.scrollWidth - thumbnailContainer.offsetWidth);
    
    if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
    }
    
    prevTranslate = currentTranslate;
    setTransform();
});