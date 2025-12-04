document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('landing-page-form');
    const formMessage = document.getElementById('form-message');
    const emailInput = document.getElementById('user-email');
    const slotsRemaining = document.getElementById('slots-remaining');
    const liveVisitorsDisplay = document.getElementById('live-visitors');
    const testimonialRotator = document.getElementById('testimonial-rotator');

    // --- CONFIGURATION ---
    const STORAGE_KEY = 'ai_landing_page_visitors';
    const SESSION_KEY = 'ai_session_visited';
    const BASE_COUNT = 1500; // Starting point for social proof
    let currentSlots = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Scarcity counter
    // --- END CONFIGURATION ---

    slotsRemaining.textContent = currentSlots;

    // --- 1. CORE VISITOR COUNTING LOGIC ---

    const trackEvent = (eventName, data = {}) => {
        console.log(`[ANALYTICS] Event: ${eventName}`, data);
        // *** REAL AD TRACKING INTEGRATION GOES HERE ***
        // Example: window.fbq('track', eventName, data); 
        // Example: window.gtag('event', eventName, data);
    };

    // 1a. Initialize/Retrieve Global Count
    let globalVisitorCount = parseInt(localStorage.getItem(STORAGE_KEY)) || BASE_COUNT;

    // 1b. Check if user has visited in this session (Prevents refresh counting)
    const hasVisitedInSession = sessionStorage.getItem(SESSION_KEY);

    if (!hasVisitedInSession) {
        // Increment the global count and update storage
        globalVisitorCount++;
        localStorage.setItem(STORAGE_KEY, globalVisitorCount);
        sessionStorage.setItem(SESSION_KEY, 'true');
        trackEvent('NewSessionVisit', { total_visits: globalVisitorCount });
    }

    // 1c. Display the Simulated Live Count
    // Adds a small, random offset to the persistent count for a 'live' fluctuation effect
    const liveOffset = Math.floor(Math.random() * 15) + 5;
    const currentLiveCount = globalVisitorCount + liveOffset;

    liveVisitorsDisplay.textContent = currentLiveCount.toLocaleString('en-US');

    // --- 2. Ad-Specific Tracking (Engagement) ---
    trackEvent('ViewContent', { content_name: 'AI_Landing_Page_Pro_V2' });

    // Track when the user scrolls to the form (Simulating 'InitiateCheckout')
    const formSection = document.getElementById('cta-form');
    let formViewed = false;
    window.addEventListener('scroll', () => {
        if (!formViewed && window.scrollY + window.innerHeight > formSection.offsetTop) {
            trackEvent('InitiateCheckout', { step: 'Form_Viewed' });
            formViewed = true;
        }
    });

    // --- 3. Dynamic Social Proof Rotator ---
    const testimonials = [
        "\"Since integrating this AI, our ad spend ROI increased 4.5X in the first month. Game changer.\"",
        "\"The content is indistinguishable from top-tier human copywriters, but 100x faster. A must-have.\"",
        "\"We went from writing 10 pieces of content a week to 100. Our growth is exponential! Highly recommend.\""
    ];
    let currentTestimonialIndex = 0;

    const rotateTestimonial = () => {
        // Fade out
        testimonialRotator.style.opacity = 0;
        setTimeout(() => {
            // Update content
            testimonialRotator.innerHTML = `<p>${testimonials[currentTestimonialIndex]}</p>`;
            // Fade in
            testimonialRotator.style.opacity = 1;
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        }, 500);
    };

    // Start rotation every 5 seconds
    rotateTestimonial();
    setInterval(rotateTestimonial, 5000);

    // --- 4. Form Submission (The Conversion Event) ---
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userEmail = emailInput.value;

        // Decrement scarcity counter
        if (currentSlots > 0) {
            currentSlots--;
            slotsRemaining.textContent = currentSlots;
        }

        // Log Conversion (The most valuable event for the ad platform)
        trackEvent('CompleteRegistration', { email: userEmail, value: 0.00 });

        // Success feedback
        formMessage.textContent = `Success! Access details are being sent to ${userEmail}. Check spam/promotions.`;
        formMessage.classList.remove('hidden');
        formMessage.style.color = '#1e3c72';
        formMessage.style.fontWeight = 'bold';

        emailInput.value = '';
        form.querySelector('.button-form').disabled = true;
    });
});