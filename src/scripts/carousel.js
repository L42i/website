// carousel.js — the ONLY carousel behavior on the site.
// Loaded once by src/layouts/BaseLayout.astro.
//
// For every .md-carousel on the page it injects prev/next buttons
// and wires them to scroll the track one frame at a time. The track
// itself already snaps via CSS (scroll-snap), so swipe/trackpad also
// works with no JS. Add a carousel in markdown like:
//
//   <div class="md-carousel">
//     <div class="md-carousel-track">
//       <img src="/assets/.../one.png" alt="..." />
//       <img src="/assets/.../two.png" alt="..." />
//     </div>
//   </div>

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.md-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.md-carousel-track');
    if (!track || track.children.length < 2) return; // nothing to navigate

    const makeBtn = (cls, label, glyph) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `md-carousel-btn ${cls}`;
      btn.setAttribute('aria-label', label);
      btn.textContent = glyph;
      return btn;
    };

    const prev = makeBtn('md-carousel-prev', 'Previous image', '\u2039'); // ‹
    const next = makeBtn('md-carousel-next', 'Next image', '\u203A');     // ›

    prev.addEventListener('click', () =>
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' })
    );
    next.addEventListener('click', () =>
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' })
    );

    carousel.append(prev, next);
  });
});
