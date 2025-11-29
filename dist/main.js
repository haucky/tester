    (function () {
        const host = document.getElementById("lifelab-shadow-host");
        const template = document.getElementById("lifelab-template");

        // Create shadow root
        const shadowRoot = host.attachShadow({ mode: "open" });

        // Clone template content into shadow DOM
        shadowRoot.appendChild(template.content.cloneNode(true));

        // Fix WordPress lazy loading interference in Shadow DOM
        const images = shadowRoot.querySelectorAll("img");
        console.log("Total images found in Shadow DOM:", images.length);

        images.forEach((img, index) => {
            // WordPress lazy loading plugins store real URLs in data attributes
            const dataSrc =
                img.getAttribute("data-src") ||
                img.getAttribute("data-lazy-src") ||
                img.getAttribute("data-original");

            const currentSrc = img.getAttribute("src");

            console.log(`Image ${index + 1} - src:`, currentSrc);
            console.log(`Image ${index + 1} - data-src:`, dataSrc);

            // If we found a data-src and current src is a placeholder, restore the real URL
            if (
                dataSrc &&
                currentSrc &&
                currentSrc.includes("data:image/svg")
            ) {
                img.setAttribute("src", dataSrc);
                img.removeAttribute("data-src");
                img.removeAttribute("data-lazy-src");
                img.removeAttribute("data-original");
                console.log(
                    `Image ${index + 1} - Restored from data-src:`,
                    dataSrc,
                );
            }

            // Remove lazy loading classes that might interfere
            img.classList.remove(
                "lazy",
                "lazyload",
                "lazyloading",
                "jetpack-lazy-image",
            );
            img.removeAttribute("loading"); // Remove loading="lazy"

            img.onerror = () =>
                console.error(`Failed to load image ${index + 1}:`, img.src);
            img.onload = () =>
                console.log(`Successfully loaded image ${index + 1}:`, img.src);
        });

        // Initialize carousel inside shadow DOM
        const carousel = shadowRoot.getElementById("testimonial-carousel");
        const prevBtn = shadowRoot.querySelector(".carousel-nav-btn.prev");
        const nextBtn = shadowRoot.querySelector(".carousel-nav-btn.next");
        const indicatorsContainer = shadowRoot.getElementById(
            "carousel-indicators",
        );
        const items = carousel.querySelectorAll(".testimonial-content");

        let currentIndex = 0;

        // Create indicators
        items.forEach((_, index) => {
            const indicator = document.createElement("button");
            indicator.classList.add("carousel-indicator");
            indicator.setAttribute(
                "aria-label",
                `Go to testimonial ${index + 1}`,
            );
            if (index === 0) indicator.classList.add("active");
            indicator.addEventListener("click", () => scrollToIndex(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = indicatorsContainer.querySelectorAll(
            ".carousel-indicator",
        );

        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle("active", index === currentIndex);
            });
        }

        function updateButtons() {
            // For infinite carousel, buttons are never disabled
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }

        function scrollToIndex(index) {
            currentIndex = index;
            const item = items[index];
            carousel.scrollTo({
                left: item.offsetLeft - carousel.offsetLeft,
                behavior: "smooth",
            });
            updateIndicators();
            updateButtons();
        }

        prevBtn.addEventListener("click", () => {
            // Infinite loop: go to last item when at first
            const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            scrollToIndex(newIndex);
        });

        nextBtn.addEventListener("click", () => {
            // Infinite loop: go to first item when at last
            const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            scrollToIndex(newIndex);
        });

        // Update current index on scroll
        carousel.addEventListener("scroll", () => {
            const scrollLeft = carousel.scrollLeft;
            const itemWidth = items[0].offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateIndicators();
                updateButtons();
            }
        });

        // Initialize
        updateButtons();

        // Initialize team carousel inside shadow DOM
        const teamCarousel = shadowRoot.getElementById("team-carousel");
        const teamPrevBtn = shadowRoot.querySelector(".team-nav-btn.prev");
        const teamNextBtn = shadowRoot.querySelector(".team-nav-btn.next");
        const teamIndicatorsContainer = shadowRoot.getElementById(
            "team-indicators",
        );
        const teamItems = teamCarousel.querySelectorAll(".team-member");

        let teamCurrentIndex = 0;

        // Create team indicators
        teamItems.forEach((_, index) => {
            const indicator = document.createElement("button");
            indicator.classList.add("team-indicator");
            indicator.setAttribute(
                "aria-label",
                `Go to team member ${index + 1}`,
            );
            if (index === 0) indicator.classList.add("active");
            indicator.addEventListener("click", () => teamScrollToIndex(index));
            teamIndicatorsContainer.appendChild(indicator);
        });

        const teamIndicators = teamIndicatorsContainer.querySelectorAll(
            ".team-indicator",
        );

        function updateTeamIndicators() {
            teamIndicators.forEach((indicator, index) => {
                indicator.classList.toggle("active", index === teamCurrentIndex);
            });
        }

        function updateTeamButtons() {
            // For infinite carousel, buttons are never disabled
            teamPrevBtn.disabled = false;
            teamNextBtn.disabled = false;
        }

        function teamScrollToIndex(index) {
            teamCurrentIndex = index;
            const item = teamItems[index];
            teamCarousel.scrollTo({
                left: item.offsetLeft - teamCarousel.offsetLeft,
                behavior: "smooth",
            });
            updateTeamIndicators();
            updateTeamButtons();
        }

        teamPrevBtn.addEventListener("click", () => {
            // Infinite loop: go to last item when at first
            const newIndex = teamCurrentIndex > 0 ? teamCurrentIndex - 1 : teamItems.length - 1;
            teamScrollToIndex(newIndex);
        });

        teamNextBtn.addEventListener("click", () => {
            // Infinite loop: go to first item when at last
            const newIndex = teamCurrentIndex < teamItems.length - 1 ? teamCurrentIndex + 1 : 0;
            teamScrollToIndex(newIndex);
        });

        // Update current index on scroll
        teamCarousel.addEventListener("scroll", () => {
            const scrollLeft = teamCarousel.scrollLeft;
            const itemWidth = teamItems[0].offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== teamCurrentIndex) {
                teamCurrentIndex = newIndex;
                updateTeamIndicators();
                updateTeamButtons();
            }
        });

        // Initialize team carousel
        updateTeamButtons();

        // Handle hero-cta click for smooth scroll to instructions
        const heroCta = shadowRoot.querySelector('.hero-cta');
        const instructionsSection = shadowRoot.querySelector('#instructions');

        if (heroCta && instructionsSection) {
            heroCta.addEventListener('click', (e) => {
                e.preventDefault();
                instructionsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }

        // FAQ accordion behavior - only one category and one item open at a time
        initFaqAccordion(shadowRoot);

        function initFaqAccordion(shadowRoot) {
            const faqCategories = shadowRoot.querySelectorAll('.faq-category');
            const faqItems = shadowRoot.querySelectorAll('.faq-item');

            // Close other categories when one is opened
            faqCategories.forEach(category => {
                category.addEventListener('toggle', () => {
                    if (category.open) {
                        faqCategories.forEach(other => {
                            if (other !== category && other.open) {
                                other.open = false;
                            }
                        });
                    }
                });
            });

            // Close other items when one is opened
            faqItems.forEach(item => {
                item.addEventListener('toggle', () => {
                    if (item.open) {
                        faqItems.forEach(other => {
                            if (other !== item && other.open) {
                                other.open = false;
                            }
                        });
                    }
                });
            });
        }

        // Freilab Easter Egg
        initFreilabEasterEgg(shadowRoot);

        function initFreilabEasterEgg(shadowRoot) {
            const freilab = shadowRoot.querySelector('.freilab');
            if (!freilab) return;

            let clickCount = 0;
            let clickTimeout;

            freilab.addEventListener('click', (e) => {
                clickCount++;

                // Reset click count after 3 seconds of no clicks
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 3000);

                // Activate on 7th click
                if (clickCount === 7) {
                    freilab.classList.add('blinking');
                    startRainbowCircles(shadowRoot, freilab);
                    clickCount = 0;
                }
            });
        }

        function startRainbowCircles(shadowRoot, freilab) {
            const svg = shadowRoot.getElementById('map-svg');
            if (!svg) return;

            const circles = Array.from(svg.querySelectorAll('circle'));
            const activeCircles = [];

            function getRandomRainbowColor() {
                const colors = [
                    '#F44336', // Material Red
                    '#E91E63', // Material Pink
                    '#9C27B0', // Material Purple
                    '#673AB7', // Material Deep Purple
                    '#3F51B5', // Material Indigo
                    '#2196F3', // Material Blue
                    '#00BCD4', // Material Cyan
                    '#009688', // Material Teal
                    '#4CAF50', // Material Green
                    '#8BC34A', // Material Light Green
                    '#FFEB3B', // Material Yellow
                    '#FF9800', // Material Orange
                    '#FF5722'  // Material Deep Orange
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            function updateActiveCircles() {
                activeCircles.forEach(circle => {
                    circle.style.fill = getRandomRainbowColor();
                });
            }

            // Add one circle to the cycle every 150ms
            let circleIndex = 0;
            const addCircleInterval = setInterval(() => {
                if (circleIndex < circles.length) {
                    const circle = circles[circleIndex];
                    activeCircles.push(circle);
                    circle.style.fill = getRandomRainbowColor();
                    circleIndex++;
                } else {
                    clearInterval(addCircleInterval);
                    // All circles added - now activate freilab and start hearts
                    freilab.classList.remove('blinking');
                    freilab.classList.add('activated');
                    const rect = freilab.getBoundingClientRect();
                    startHeartBursts(rect, shadowRoot);
                }
            }, 150);

            // Update colors of active circles every 500ms
            setInterval(updateActiveCircles, 500);
        }

        function startHeartBursts(initialRect, shadowRoot) {
            // Create container for hearts in the shadow DOM
            let container = shadowRoot.querySelector('.heart-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'heart-container';
                container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10000;';
                shadowRoot.appendChild(container);
            }

            function createBurst() {
                // Get current position of freilab (in case of scroll)
                const freilab = shadowRoot.querySelector('.freilab');
                const rect = freilab ? freilab.getBoundingClientRect() : initialRect;
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Random burst size between 5-15 hearts
                const burstSize = 5 + Math.floor(Math.random() * 11);

                for (let i = 0; i < burstSize; i++) {
                    setTimeout(() => {
                        const heart = document.createElement('div');
                        heart.className = 'heart-particle';
                        heart.textContent = '❤️';

                        // Random direction and distance
                        const angle = (Math.random() * 360) * (Math.PI / 180);
                        const distance = 100 + Math.random() * 200;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance - 100; // Bias upward
                        const rot = (Math.random() - 0.5) * 720;

                        heart.style.cssText = `
                            left: ${centerX}px;
                            top: ${centerY}px;
                            --tx: ${tx}px;
                            --ty: ${ty}px;
                            --rot: ${rot}deg;
                            font-size: ${15 + Math.random() * 15}px;
                        `;

                        container.appendChild(heart);

                        // Remove heart after animation
                        setTimeout(() => heart.remove(), 2000);
                    }, i * 30);
                }

                // Schedule next burst with random interval (800-2000ms)
                const nextBurstDelay = 800 + Math.random() * 1200;
                setTimeout(createBurst, nextBurstDelay);
            }

            // Start the first burst immediately
            createBurst();
        }
    })();
