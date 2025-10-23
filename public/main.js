const text = "We Make Brands Talk...";
    let index = 0;
    const speed = 120;

    function typeEffect() {
      if (index < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, speed);
      } else {
        setTimeout(eraseEffect, 1500);
      }
    }
    function eraseEffect() {
      if (index > 0) {
        document.getElementById("typing").innerHTML = text.substring(0, index - 1);
        index--;
        setTimeout(eraseEffect, 60);
      } else {
        setTimeout(typeEffect, 500);
      }
    }
    window.onload = typeEffect;

    function togglemenu() {
      document.querySelector(".nav-links").classList.toggle("active");
    }

    const cards = document.querySelectorAll(".card");
    window.addEventListener("scroll", () => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 50 && rect.bottom > 50) {
          card.classList.add("show");
        } else {
          card.classList.remove("show");
        }
      });
    });

  function toggleMenu() {
    document.getElementById("nav").classList.toggle("active");
  }

const overlay = document.getElementById('cookieOverlay');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');

if (!localStorage.getItem('cookieConsent')) {
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // freeze body scroll
}

acceptBtn.onclick = () => {
  localStorage.setItem('cookieConsent', 'accepted');
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
};

rejectBtn.onclick = () => {
  localStorage.setItem('cookieConsent', 'rejected');
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
};
