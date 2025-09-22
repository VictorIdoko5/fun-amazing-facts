// Add playful entrance animations for fact boxes
document.addEventListener("DOMContentLoaded", () => {
  const factBoxes = document.querySelectorAll(".forText");
  factBoxes.forEach((box, i) => {
    setTimeout(() => {
      box.style.animation = "bounceIn 0.6s ease";
    }, i * 200); // staggered entrance
  });

  // Fun interaction: click to highlight a fact
  factBoxes.forEach(box => {
    box.addEventListener("click", () => {
      box.classList.add("highlight");
      setTimeout(() => box.classList.remove("highlight"), 800);
    });
  });
});
let buttons = document.querySelectorAll(".learnMore");
let panel = document.getElementById("infoPanel");
let infoContent = document.getElementById("infoContent");
let infoTitle = document.getElementById("infoTitle");
let infoImage = document.getElementById("infoImage");
let closeBtn = document.getElementById("closeBtn");

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    let parent = e.target.closest(".forText");
    let content = parent.getAttribute("data-content");
    let title = parent.getAttribute("data-title");
    let image = parent.getAttribute("data-image");

    infoContent.innerText = content;
    infoTitle.innerText = title;
    infoImage.src = image;

    panel.classList.add("active");
  });
});

// Close button
closeBtn.addEventListener("click", () => {
  panel.classList.remove("active");
});

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
document.getElementsByClassName("forText").length
