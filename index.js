// index.js — robust version

(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Inject minimal CSS so dark mode + widget always look right
  const injectDarkModeCSS = () => {
    if (document.getElementById('dark-mode-styles')) return;
    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.textContent = `
      body.dark-mode { background:#121212; color:#f5f5f5; }
      body.dark-mode a { color:#80cbc4; }
      body.dark-mode .Hotfacts { background:#1e1e1e; }
      body.dark-mode .forText { background:#2a2a2a; }

      .toolbar { position: fixed; top: 12px; right: 12px; z-index: 10; display:flex; gap:8px; }
      .toolbar button { padding:8px 12px; border-radius:8px; cursor:pointer; border:1px solid rgba(0,0,0,.2); background:#fff; }
      body.dark-mode .toolbar button { background:#1f1f1f; border-color: rgba(255,255,255,.15); color:#f5f5f5; }

      .fact-widget { position: relative; z-index: 6; max-width: 800px; margin: 24px auto; padding: 16px;
        border-radius: 12px; border: 1px solid rgba(0,0,0,.15); background: rgba(255,255,255,.85); backdrop-filter: blur(6px); }
      body.dark-mode .fact-widget { background: rgba(18,18,18,.85); border-color: rgba(255,255,255,.12); }

      .fact-widget button { padding:10px 16px; border-radius:10px; border:1px solid rgba(0,0,0,.2); cursor:pointer; }
      body.dark-mode .fact-widget button { background:#1f1f1f; color:#f5f5f5; border-color: rgba(255,255,255,.15); }
      .fact { font-size: 1.1rem; margin: 10px 0 0; }
    `;
    document.head.appendChild(style);
  };

  document.addEventListener('DOMContentLoaded', () => {
    injectDarkModeCSS();

    // ---- Greeting (persisted) ----
    const storedName = localStorage.getItem('visitorName');
    let name = storedName;
    if (!name) {
      name = prompt("What is your name, Explorer?")?.trim();
      if (name) localStorage.setItem('visitorName', name);
    }
    if (name) {
      const h1 = $('h1');
      if (h1) h1.textContent = `Hello, ${name}!`;
    }

    // ---- Toolbar (Theme + Rename) ----
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    const themeBtn = document.createElement('button');
    const setThemeBtnText = () => {
      themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
    };
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      setThemeBtnText();
    });

    const renameBtn = document.createElement('button');
    renameBtn.textContent = '📝 Change Name';
    renameBtn.addEventListener('click', () => {
      const newName = prompt("Update your display name:")?.trim();
      if (newName) {
        localStorage.setItem('visitorName', newName);
        const h1 = $('h1');
        if (h1) h1.textContent = `Hello, ${newName}!`;
      }
    });

    toolbar.append(themeBtn, renameBtn);
    document.body.appendChild(toolbar);

    // Apply saved theme on load
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    setThemeBtnText();

    // ---- Facts (global + by category) ----
    const factsByCategory = {
      Religion: [
        "The Bible is the most translated book in history.",
        "The word ‘Gospel’ means ‘Good News’."
      ],
      Cosmos: [
        "The observable universe spans ~93 billion light-years.",
        "Neutron stars can spin hundreds of times per second."
      ],
      Animal: [
        "Octopuses have three hearts.",
        "A group of flamingos is called a ‘flamboyance’."
      ],
      Love: [
        "Prolonged eye contact can sync heart rates.",
        "Oxytocin is nicknamed the ‘love hormone’."
      ],
      Cars: [
        "An average car has 30,000+ parts.",
        "The Bugatti Chiron uses ten radiators for cooling."
      ],
      Phones: [
        "Early mobile phones weighed over 1 kg.",
        "Modern smartphones outpower Apollo guidance computers."
      ],
      Innovations: [
        "3D printing was first invented in the 1980s.",
        "CRISPR enables precise gene editing."
      ]
    };

    // ---- Fact widget (always visible + top z-index) ----
    const factWidget = document.createElement('section');
    factWidget.id = 'fact-widget';
    factWidget.className = 'fact-widget';

    const factBtn = document.createElement('button');
    factBtn.textContent = '🎲 Random Fact';

    const factText = document.createElement('p');
    factText.className = 'fact';
    factText.textContent = 'Click the button to reveal a fun fact.';

    factWidget.append(factBtn, factText);

    // Place the widget right after the choices (so you see it immediately)
    const choiceContainer = $('.choicecontainer');
    if (choiceContainer && choiceContainer.parentNode) {
      choiceContainer.parentNode.insertBefore(factWidget, choiceContainer.nextSibling);
    } else {
      document.body.appendChild(factWidget);
    }

    // Random fact action
    factBtn.addEventListener("click", () => {
  const allFacts = Object.values(factsByCategory).flat();
  const newFact = allFacts[Math.floor(Math.random() * allFacts.length)];

  // Fade out old fact, then fade in new one
  factText.classList.add("fade-out");
  setTimeout(() => {
    factText.textContent = newFact;
    factText.classList.remove("fade-out");
  }, 400);

  // Trigger pop-in animation on widget
  factWidget.classList.remove("show");
  void factWidget.offsetWidth; // restart animation hack
  factWidget.classList.add("show");
});

    // ---- Menu link polish (hover + category preview on click) ----
    $$('.choice li a').forEach(a => {
      a.addEventListener('mouseenter', () => {
        a.style.color = 'gold';
        a.style.fontWeight = 'bold';
      });
      a.addEventListener('mouseleave', () => {
        a.style.color = '';
        a.style.fontWeight = '';
      });
      a.addEventListener('click', (e) => {
        // Allow normal navigation with Ctrl/Meta/Shift or middle-click
        if (e.ctrlKey, e.metaKey, e.shiftKey, e.button === 1) return;
        // e.preventDefault();

        let key = 'Innovations';
        const txt = a.textContent.trim();
        if (/Religion/i.test(txt)) key = 'Religion';
        else if (/Cosmos/i.test(txt)) key = 'Cosmos';
        else if (/Animal/i.test(txt)) key = 'Animal';
        else if (/Love/i.test(txt)) key = 'Love';
        else if (/Cars/i.test(txt)) key = 'Cars';
        else if (/Phones/i.test(txt)) key = 'Phones';
        else if (/Innovation/i.test(txt)) key = 'Innovations';

        const pool = factsByCategory[key] || [];
        factText.textContent = pool.length
          ? `(${key}) ${pool[Math.floor(Math.random() * pool.length)]}`
          : 'No facts found for that category yet.';
        factWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  });
})();
const images = [
  "images/stars.jpg",
  "images/space2.jpg",
  "images/city1.jpg",
  "images/lion3.jpg",
  "images/love2.jpg",
  "images/Tech.jpg",
  "images/Jupiter.jpg",
  "images/city2.jpg",
  "images/Niger4.jpg"
];

let current = 0;

setInterval(() => {
  document.body.style.backgroundImage = `url(${images[current]})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 2s ease-in-out";

  current = (current + 1) % images.length; // loop back
}, 5000); // change every 5 seconds

function makeImageSlider(imgId, images, interval) {
  const targetImg = document.getElementById(imgId);
  if (!targetImg) return;

  let index = 0;

  // wrap img in a div
  const wrapper = document.createElement("div");
  wrapper.classList.add("slide-wrapper");
  targetImg.parentNode.insertBefore(wrapper, targetImg);
  wrapper.appendChild(targetImg);

  // create clone
  const clone = targetImg.cloneNode(true);
  wrapper.appendChild(clone);

  // ✅ Fix: properly position both images
  targetImg.style.position = "absolute";
  targetImg.style.left = "0";
  targetImg.style.top = "0";
  targetImg.style.width = "100%";

  clone.style.position = "absolute";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = "100%";

  setInterval(() => {
    index = (index + 1) % images.length;

    // slide effect
    targetImg.style.transform = "translateX(-100%)";
    clone.src = images[index];
    clone.style.transform = "translateX(0)";

    setTimeout(() => {
      targetImg.src = images[index];
      targetImg.style.transform = "translateX(0)";
    }, 1000);
  }, interval);
}


// First slider
makeImageSlider(
  document.querySelectorAll("img")[8],
  ["images/food1.jpg", "images/food2.jpg", "images/food3.jpg"]
);

// Second slider
makeImageSlider(
  document.querySelectorAll("img")[7],
  ["images/city1.jpg", "images/city2.jpg", "images/city3.jpg","images/city4.jpg", "images/city5.jpg", "images/city6.jpg", "images/city7.jpg", "images/city8.jpg", "images/city9.jpg" ]
);
makeImageSlider(
  document.querySelectorAll("img")[4],
  ["images/car1.jpg", "images/car2.jpg", "images/car3.jpg"]
);
window.onload = function() {
  // Always show the modal on page load
  document.getElementById("welcomeModal").style.display = "flex";

  document.getElementById("laterBtn").onclick = function() {
    document.getElementById("welcomeModal").style.display = "none";
    // ✅ No saving — so it will come back again on refresh
  };

  document.getElementById("supportBtn").onclick = function() {
    document.getElementById("welcomeModal").style.display = "none";
    // ✅ Redirect to support page
    window.location.href = "Support Us.html";
  };
};

