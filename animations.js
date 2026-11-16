const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealTargets = document.querySelectorAll(
    ".intro, .prose, .footer-contact, .copyright",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );

  document.documentElement.classList.add("has-scroll-reveal");
  revealTargets.forEach((element) => {
    element.setAttribute("data-reveal", "");
    observer.observe(element);
  });
}
