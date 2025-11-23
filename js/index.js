 // Generate headline letters
            const text = "HAPPY SEVENTEEN";
            const headline = document.getElementById("headline");
            const colors = [
                "#ff7070",
                "#2f80ed",
                "#ffe058",
                "#c6f7d8",
                "#b39cff",
                "#f0c0c8",
            ];

            [...text].forEach((ch, index) => {
                if (ch === " ") {
                    // Create line break instead of gap for mobile responsiveness
                    const lineBreak = document.createElement("div");
                    lineBreak.className = "line-break";
                    lineBreak.style.flexBasis = "100%";
                    lineBreak.style.height = "0";
                    headline.appendChild(lineBreak);
                } else {
                    const span = document.createElement("span");
                    span.className = "letter";
                    span.textContent = ch;
                    span.style.background =
                        colors[Math.floor(Math.random() * colors.length)];
                    span.style.setProperty(
                        "--rotate",
                        `${Math.random() * 20 - 10}deg`
                    );
                    headline.appendChild(span);
                }
            });

            // Particle effect
            const particleArea = document.getElementById("particle-area");
            const rainBtn = document.getElementById("rainBtn");
            const emojis = ["🎉", "🎊", "🎈", "🎁", "💖", "✨", "🌸", "🎂"];

            function createParticle() {
                const particle = document.createElement("div");
                particle.className = "particle";
                particle.textContent =
                    emojis[Math.floor(Math.random() * emojis.length)];
                particle.style.left = Math.random() * 100 + "%";
                particle.style.fontSize = Math.random() * 20 + 15 + "px";
                particleArea.appendChild(particle);

                setTimeout(() => particle.remove(), 5000);
            }

            rainBtn.addEventListener("click", () => {
                const interval = setInterval(createParticle, 100);
                setTimeout(() => clearInterval(interval), 3000);
            });

            // Auto play music
            window.addEventListener("load", () => {
                const music = document.getElementById("bgMusic");
                music
                    .play()
                    .catch(() => console.log("Autoplay prevented by browser"));
            });