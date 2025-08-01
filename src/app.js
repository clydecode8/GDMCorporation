// Load header component
async function loadHeaderComponent() {
    try {
        const response = await fetch('../components/header.html');
        const headerHTML = await response.text();
        document.getElementById('header-component').innerHTML = headerHTML;
        
        // Add scroll effect to header after loading
        initHeaderScrollEffect();
        
        // Initialize mobile menu after loading
        initMobileMenu();
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

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (!mobileMenuToggle || !mainNav) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on nav links
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
    
    // Close mobile menu on window resize if screen gets larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 479) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
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
        thumbnail.addEventListener('click', () => {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load header component first
    await loadHeaderComponent();
    
    // Then initialize other components
    initCarousel();
    initDragScroll();
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