// AOS - Animation on Scroll v2.3.4
// MIT License - github.com/michalsnik/aos
(function(window, document) {
    'use strict';

    var AOS = {};

    /**
     * Initiate AOS
     */
    AOS.init = function(options) {

        var settings = Object.assign({
            offset: 120,
            delay: 0,
            duration: 400,
            easing: 'ease',
            once: false,
            mirror: false,
            anchorPlacement: 'top-bottom',
            startEvent: 'DOMContentLoaded'
        }, options);

        // Create elements array
        var elements = document.querySelectorAll('[data-aos]');
        var aosElements = Array.prototype.slice.call(elements, 0);

        // Initialize elements
        aosElements.forEach(function(el) {
            el.aos = {
                position: null,
                animation: el.getAttribute('data-aos'),
                anchor: el.getAttribute('data-aos-anchor'),
                anchorPlacement: el.getAttribute('data-aos-anchor-placement') || settings.anchorPlacement,
                delay: parseInt(el.getAttribute('data-aos-delay') || settings.delay, 10),
                duration: parseInt(el.getAttribute('data-aos-duration') || settings.duration, 10),
                easing: el.getAttribute('data-aos-easing') || settings.easing,
                once: el.getAttribute('data-aos-once') !== null ? true : settings.once,
                mirror: el.getAttribute('data-aos-mirror') !== null ? true : settings.mirror,
                animated: false
            };

            // Set CSS transitions
            el.style.transitionProperty = 'all';
            el.style.transitionDuration = el.aos.duration + 'ms';
            el.style.transitionTimingFunction = el.aos.easing;
            el.style.transitionDelay = el.aos.delay + 'ms';
        });

        // Prepare initial positions
        prepare();

        // Handle scroll event
        window.addEventListener('scroll', throttle(function() {
            animate();
        }, 20));

        // Handle resize event
        window.addEventListener('resize', debounce(function() {
            refresh();
        }, 50));

        // Handle startEvent
        document.addEventListener(settings.startEvent, function() {
            refresh();
        });

        // Initial animation
        animate();
    };

    /**
     * Prepare all elements positions
     */
    function prepare() {
        var elements = document.querySelectorAll('[data-aos]');
        Array.prototype.slice.call(elements, 0).forEach(function(el) {
            el.aos.position = getPosition(el);
        });
    }

    /**
     * Get element's position
     */
    function getPosition(el) {
        var scrollY = window.pageYOffset;
        var elTop = el.getBoundingClientRect().top + scrollY;
        var elHeight = el.offsetHeight;
        var windowHeight = window.innerHeight;

        // Calculate position based on anchor placement
        var anchor = el.aos.anchor ? document.querySelector(el.aos.anchor) : el;
        var anchorRect = anchor.getBoundingClientRect();
        var anchorTop = anchorRect.top + scrollY;
        var anchorHeight = anchor.offsetHeight;

        var position = {
            top: anchorTop,
            height: anchorHeight,
            elementTop: elTop,
            elementHeight: elHeight,
            windowHeight: windowHeight
        };

        return position;
    }

    /**
     * Handle scroll event and animate elements
     */
    function animate() {
        var scrollY = window.pageYOffset;
        var windowHeight = window.innerHeight;

        var elements = document.querySelectorAll('[data-aos]');
        Array.prototype.slice.call(elements, 0).forEach(function(el) {
            if (el.aos.animated) return;

            var position = el.aos.position;
            var offset = position.top - scrollY;
            var triggerPoint = windowHeight * 0.2;

            // Check if element is in viewport
            if (offset < windowHeight - triggerPoint && offset + position.height > triggerPoint) {
                // Animate element
                el.classList.add('aos-animate');
                el.aos.animated = true;

                // If once option is true, remove attribute
                if (el.aos.once) {
                    el.removeAttribute('data-aos');
                }
            } else if (el.aos.mirror && el.aos.animated) {
                // Reset animation if mirror option is true
                el.classList.remove('aos-animate');
                el.aos.animated = false;
            }
        });
    }

    /**
     * Refresh AOS elements
     */
    AOS.refresh = function() {
        prepare();
        animate();
    };

    /**
     * Throttle function
     */
    function throttle(func, limit) {
        var lastFunc;
        var lastRan;
        return function() {
            var context = this;
            var args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Export AOS
    window.AOS = AOS;

})(window, document);
