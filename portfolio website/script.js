emailjs.init({
  publicKey: "1pNrqO-KlnUrVLuvn",
});

const canvas = document.querySelector("#heroCanvas");
const ctx = canvas.getContext("2d");
const dots = [];


function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedDots() {
  dots.length = 0;
  const count = Math.max(40, Math.floor(window.innerWidth / 22));
  for (let index = 0; index < count; index += 1) {
    dots.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.4 + 1.2
    });
  }
}

function drawHero() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  gradient.addColorStop(0, "#12352e");
  gradient.addColorStop(0.45, "#1f3d46");
  gradient.addColorStop(1, "#794034");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  dots.forEach((dot, dotIndex) => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > canvas.offsetWidth) dot.vx *= -1;
    if (dot.y < 0 || dot.y > canvas.offsetHeight) dot.vy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.fill();

    for (let nextIndex = dotIndex + 1; nextIndex < dots.length; nextIndex += 1) {
      const next = dots[nextIndex];
      const distance = Math.hypot(dot.x - next.x, dot.y - next.y);
      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.16 - distance / 900})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawHero);
}

resizeCanvas();
seedDots();
drawHero();

window.addEventListener("resize", () => {
  resizeCanvas();
  seedDots();
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const message = data.get("message").trim();

  const status = document.querySelector("#formStatus");

  if (!name || !email || !message) {
    status.textContent = "Please complete all fields before sending.";
    return;
  }

  emailjs.send(
    "service_ko45maa",
    "template_f8suv1j",
    {
      name: name,
      email: email,
      message: message
    }
  )
  .then(() => {
    status.textContent = "Message sent successfully!";
    form.reset();
  })
  .catch((error) => {
    status.textContent = "Failed to send message.";
    console.error(error);
  });
});
