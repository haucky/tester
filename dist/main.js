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
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === items.length - 1;
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
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentIndex < items.length - 1) {
                scrollToIndex(currentIndex + 1);
            }
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
            teamPrevBtn.disabled = teamCurrentIndex === 0;
            teamNextBtn.disabled = teamCurrentIndex === teamItems.length - 1;
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
            if (teamCurrentIndex > 0) {
                teamScrollToIndex(teamCurrentIndex - 1);
            }
        });

        teamNextBtn.addEventListener("click", () => {
            if (teamCurrentIndex < teamItems.length - 1) {
                teamScrollToIndex(teamCurrentIndex + 1);
            }
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

        // ===================== MAP ZOOM FUNCTIONALITY =====================
        const mapContainer = shadowRoot.getElementById('map-container');
        const mapSvg = shadowRoot.getElementById('map-svg');
        const mapPngOverlay = shadowRoot.getElementById('map-png-overlay');
        const mapTextContainer = shadowRoot.getElementById('map-text-container');
        const mapBuildingImg = shadowRoot.getElementById('map-building-img');
        const mapLabel = shadowRoot.getElementById('map-label');
        const freilabElement = shadowRoot.getElementById('freilab');

        // Initial viewBox values (full map)
        const initialViewBox = {
            x: 0,
            y: 0,
            width: 1740,
            height: 903
        };

        // Calculate target viewBox (zoomed into #freilab)
        // We need to get the bounding box dynamically for accuracy
        let targetViewBox = null;

        function calculateTargetViewBox() {
            // TESTING: Hardcode zoom center to viewport center (50% x 50%)
            // Map viewBox is 0 0 1740 903
            const centerX = 1740 * 0.5; // 870 (50% horizontal center)
            const centerY = 903 * 0.5;  // 451.5 (50% vertical center)

            // Keep the aspect ratio of the original viewBox
            const originalAspect = initialViewBox.width / initialViewBox.height;

            // Zoom to 70% of original size (less aggressive zoom)
            const targetWidth = initialViewBox.width * 0.7;
            const targetHeight = targetWidth / originalAspect;

            // Center the viewBox on the hardcoded center
            return {
                x: centerX - targetWidth / 2,
                y: centerY - targetHeight / 2,
                width: targetWidth,
                height: targetHeight
            };
        }

        // Interpolate between two viewBox values
        function interpolateViewBox(start, end, progress) {
            // Use easing function for smoother animation
            const eased = easeInOutCubic(progress);

            return {
                x: start.x + (end.x - start.x) * eased,
                y: start.y + (end.y - start.y) * eased,
                width: start.width + (end.width - start.width) * eased,
                height: start.height + (end.height - start.height) * eased
            };
        }

        // Easing function
        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Convert viewBox object to string
        function viewBoxToString(vb) {
            return `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
        }

        // Calculate scroll progress
        let scrollProgress = 0;
        let isAnimating = false;

        function updateMapZoom() {
            if (!targetViewBox) {
                targetViewBox = calculateTargetViewBox();
                if (!targetViewBox) return;
            }

            // Cap scrollProgress at 0.5 for interpolation (zoom stops at 50%)
            // Apply slower zoom: use power function
            // At 25% scroll → ~10% zoom, at 50% scroll → ~50% zoom, then stops
            const cappedProgress = Math.min(scrollProgress, 0.5) * 2; // Scale 0-0.5 to 0-1
            const zoomProgress = Math.pow(cappedProgress, 1.8) * 0.5; // Slow zoom, reaches 50% of target at 50% scroll

            const currentViewBox = interpolateViewBox(
                initialViewBox,
                targetViewBox,
                zoomProgress
            );

            mapSvg.setAttribute('viewBox', viewBoxToString(currentViewBox));

            // Fade out label as we zoom (starts fading at 15% progress, ends at 50%)
            if (scrollProgress > 0.15) {
                const labelFade = 1 - ((scrollProgress - 0.15) / 0.35);
                mapLabel.style.opacity = Math.max(0, labelFade);
            } else {
                mapLabel.style.opacity = 1;
            }

            // Fade in text with circle at 70% progress
            // Text appears much later, well after zoom stops at 50%
            if (scrollProgress >= 0.70) {
                const textFadeProgress = (scrollProgress - 0.70) / 0.05; // 5% transition window
                mapTextContainer.style.opacity = Math.min(1, textFadeProgress);
            } else {
                mapTextContainer.style.opacity = 0;
            }

            // Fade in building image at 75% progress (slowly over 10% window)
            if (scrollProgress >= 0.75) {
                const buildingFadeProgress = (scrollProgress - 0.75) / 0.10; // 10% transition window (75-85%)
                mapBuildingImg.style.opacity = Math.min(1, buildingFadeProgress);
            } else {
                mapBuildingImg.style.opacity = 0;
            }

            // Keep overlay container visible (children control their own opacity)
            mapPngOverlay.style.opacity = 1;
            // Keep SVG always visible
            mapSvg.style.opacity = 1;
        }

        // Scroll listener with throttling
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = mapContainer.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    const sectionTop = rect.top;
                    const sectionBottom = rect.bottom;
                    const sectionHeight = rect.height;

                    // Calculate progress based on scroll position
                    // Start animation when 5% of map is visible
                    // Stop at 50% progress (when map is centered in viewport)
                    let progress = 0;

                    if (sectionTop <= windowHeight && sectionBottom >= 0) {
                        // Start when 5% of section is visible
                        // End when entire map is fully in viewport (sectionBottom <= windowHeight)
                        const startPoint = windowHeight * 0.95; // 5% visible
                        const endPoint = startPoint + (sectionHeight - windowHeight); // Distance until fully visible

                        if (sectionTop <= startPoint) {
                            // Calculate how far we've scrolled from start point
                            const scrolledDistance = startPoint - sectionTop;
                            progress = scrolledDistance / endPoint;

                            // Allow progress to go beyond 0.5 for PNG fade, cap at 0.9
                            progress = Math.max(0, Math.min(0.9, progress));
                        }
                    }

                    scrollProgress = progress;
                    updateMapZoom();

                    ticking = false;
                });

                ticking = true;
            }
        }

        // Add scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial calculation
        setTimeout(() => {
            targetViewBox = calculateTargetViewBox();
            onScroll();
        }, 100);

        // Recalculate on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                targetViewBox = calculateTargetViewBox();
                onScroll();
            }, 250);
        });
    })();
