(function () {
  function repair() {
    document.querySelectorAll('.logo-marquee').forEach(marquee => {
      const tracks = marquee.querySelectorAll('.logo-track');
      tracks.forEach(track => {
        const sets = [...track.querySelectorAll('.logo-set')];
        if (!sets.length) return;

        // Keep first set as source of truth, rebuild exact duplicate for seamless -50% loop
        const source = sets[0];
        sets.slice(1).forEach(s => s.remove());

        const clone = source.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);

        // Ensure animation class still applies
        if (!track.style.animationDuration) {
          // leave CSS animation as defined in page
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(repair, 50));
  } else {
    setTimeout(repair, 50);
  }

  // Re-run after content scripts may have touched DOM
  setTimeout(repair, 800);
})();
