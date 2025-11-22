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
    })();
