/* ============================================================
   SCRIPT.JS — Portfolio Obedi Basimise
   Version finale : tous les effets + formulaire Web3Forms corrigé
   ============================================================ */


/* ------------------------------------------------------------
   1. BARRE DE PROGRESSION AU SCROLL
   ------------------------------------------------------------ */
const progressBar = document.getElementById('progress');

window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ------------------------------------------------------------
   2. EFFET GRAIN (canvas)
   ------------------------------------------------------------ */
const grainCanvas = document.getElementById('grain');
if (grainCanvas) {
  const ctx = grainCanvas.getContext('2d', { alpha: true });
  const resize = () => {
    grainCanvas.width = window.innerWidth;
    grainCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  let last = 0;
  const loop = (t) => {
    if (t - last > 90) {
      const id = ctx.createImageData(grainCanvas.width, grainCanvas.height);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = Math.random() * 255;
        id.data[i]     = v;
        id.data[i + 1] = v;
        id.data[i + 2] = v;
        id.data[i + 3] = Math.random() * 22;
      }
      ctx.putImageData(id, 0, 0);
      last = t;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}


/* ------------------------------------------------------------
   3. CURSEUR PERSONNALISÉ
   ------------------------------------------------------------ */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');

if (window.matchMedia('(pointer: fine)').matches && ring && dot) {
  let tx = 0, ty = 0, sx = 0, sy = 0;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  });

  const anim = () => {
    sx += (tx - sx) * 0.16;
    sy += (ty - sy) * 0.16;
    ring.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(anim);
  };
  requestAnimationFrame(anim);
}


/* ------------------------------------------------------------
   4. TILT 3D DE LA PHOTO HERO
   ------------------------------------------------------------ */
const heroCard = document.getElementById('hero-card');
if (heroCard) {
  heroCard.addEventListener('mousemove', (e) => {
    const r = heroCard.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    heroCard.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
  });
}


/* ------------------------------------------------------------
   5. FENÊTRE DE CODE — extraits + onglets
   ------------------------------------------------------------ */
const snippets = {
  whonid: `import torch
import torch.nn as nn

class WhoNIDClassifier(nn.Module):
    def __init__(self, input_dim=128):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.LayerNorm(64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32)
        )
        self.classifier = nn.Linear(32, 3)

    def forward(self, x):
        return self.classifier(self.encoder(x))
`,

  edugest: `import sqlite3
from datetime import datetime

class EduGestDB:
    def __init__(self, path='edugest.db'):
        self.conn = sqlite3.connect(path)

    def add_payment(self, student_id, amount):
        pid = f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        self.conn.execute(
            "INSERT INTO payments VALUES (?,?,?,?)",
            (pid, student_id, amount, datetime.now().isoformat())
        )
        self.conn.commit()
        return pid
`,

  portfolio: `// Portfolio — Obedi Basimise
const config = {
  location: "Uvira, Sud-Kivu, RDC",
  age: 21,
  role: "Bac2 GL @ UTC",
  brevet: "Maitrise IA — PyTorch <5MB",
  offline: true,
  languages: ["Français", "Swahili", "English", "Fuliru"],
  logos: { drc: "gauche", utc: "droite" }
};
`
};

const codeBlock = document.getElementById('code-block');
const codeMeta  = document.getElementById('code-meta');

function renderCode(key) {
  if (!codeBlock) return;
  codeBlock.textContent = snippets[key];
  if (codeMeta) {
    codeMeta.textContent =
      key === 'whonid'   ? '4.2MB • CPU 1.2s • Uvira ready' :
      key === 'edugest'  ? 'SQLite offline • Reçus instantanés' :
                           '60fps • Glass 60px • V8';
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    renderCode(tab.dataset.tab);
  });
});

renderCode('whonid');


/* ------------------------------------------------------------
   6. PROJETS — avec tes vraies images
   ------------------------------------------------------------ */

/* ⚠️ Vérifie que ces noms correspondent EXACTEMENT à tes fichiers
   dans /home/obedi/portifolio/ */

const projects = [
  {
    id: 'whonid',
    title: 'WhoNID — IA Humanitaire',
    desc: "Classifier PyTorch < 5 Mo, inférence CPU en 1.2s sur du matériel bas de gamme. Identification humanitaire offline-first, entraîné et validé à Uvira. Brevet IA obtenu.",
    image: 'whonid.jpg',
    stack: ['PyTorch', 'Python', 'Brevet IA'],
    metrics: [
      { v: '4.2', unit: 'Mo', label: 'Modèle' },
      { v: '1.2', unit: 's',  label: 'Inférence' },
      { v: '94',  unit: '%',  label: 'Précision' }
    ],
    special: 'brevet'
  },
  {
    id: 'edugest',
    title: 'EduGest — Écoles Uvira',
    desc: "Plateforme intelligente de gestion scolaire et de paiement des frais. Application Flutter offline-first, SQLite local, reçus PDF instantanés, intégration API Vodacom M-Pesa.",
    image: 'edugest.png',
    stack: ['Flutter', 'Python', 'SQLite', 'M-Pesa API'],
    metrics: [
      { v: '12',   unit: '',  label: 'Écoles' },
      { v: '100',  unit: '%', label: 'Offline' },
      { v: '3400', unit: '+', label: 'Reçus / an' }
    ]
  },
  {
    id: 'mfia',
    title: 'MF IA — Assistant Éducatif',
    desc: "Assistant intelligent congolais pour apprendre, comprendre et réussir. Chat IA hors ligne, cours, exercices, résumés PDF. 100% local, fonctionne sans internet, conçu pour le Sud-Kivu.",
    image: 'mfia.png',
    stack: ['Flutter', 'IA / Chat', 'Hors ligne'],
    metrics: [
      { v: '100', unit: '%',  label: 'Hors ligne' },
      { v: '7',   unit: '+',  label: 'Matières' },
      { v: '24',  unit: '/7', label: 'Disponible' }
    ]
  }
];

const projectsEl = document.getElementById('projects');
if (projectsEl) {
  projectsEl.innerHTML = projects.map((p, i) => `
    <article class="project-card">
      <div class="project-visual">
        <span class="project-badge">
          <span class="project-badge-dot"></span>
          ${String(i + 1).padStart(2, '0')} — ${p.id.toUpperCase()}
        </span>
        ${p.special === 'brevet' ? `<span class="project-tag-ia">★ Brevet IA</span>` : ''}
        <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy" />
      </div>
      <div class="project-content">
        <span class="project-id">${p.id}.projet</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-stack">
          ${p.stack.map(s => `<span>${s}</span>`).join('')}
        </div>
        <div class="project-metrics">
          ${p.metrics.map(m => `
            <div class="project-metric">
              <span class="project-metric-value">${m.v}<span style="font-size:0.6em;opacity:.6">${m.unit}</span></span>
              <span class="project-metric-label">${m.label}</span>
            </div>
          `).join('')}
        </div>
        <a href="mailto:obedidev@gmail.com?subject=Projet ${p.title}" class="project-cta">
          Discuter du projet <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');
}


/* ------------------------------------------------------------
   7. SECTION LANGUES — cartes visuelles premium
   ------------------------------------------------------------ */
const langs = [
  {
    flag: '🇫🇷',
    name: 'Français',
    pct: 100,
    level: 'Natif',
    levelClass: 'natif',
    desc: 'Langue administrative et académique. Utilisée à l\'UTC et dans tous mes projets.'
  },
  {
    flag: '🇨🇩',
    name: 'Fuliru',
    pct: 100,
    level: 'Maternelle',
    levelClass: 'natif',
    desc: 'Langue maternelle du territoire de Fizi et Uvira. Racines et identité.'
  },
  {
    flag: '🌍',
    name: 'Swahili',
    pct: 88,
    level: 'Courant',
    levelClass: 'courant',
    desc: 'Langue véhiculaire de l\'Est du Congo. Utilisée au quotidien à Uvira et au Sud-Kivu.'
  },
  {
    flag: '🇬🇧',
    name: 'English',
    pct: 62,
    level: 'Professionnel',
    levelClass: 'pro',
    desc: 'Langue technique pour la documentation, les outils de développement et la recherche IA.'
  }
];

const langsEl = document.getElementById('langs');
if (langsEl) {
  langsEl.innerHTML = langs.map(l => `
    <div class="lang-card" data-pct="${l.pct}%" style="--pct: ${l.pct}%">
      <div class="lang-card-header">
        <span class="lang-flag">${l.flag}</span>
        <span class="lang-level ${l.levelClass}">${l.level}</span>
      </div>
      <div class="lang-card-body">
        <div class="lang-card-name">${l.name}</div>
        <div class="lang-card-pct">${l.pct}<span>%</span></div>
      </div>
      <p class="lang-card-desc">${l.desc}</p>
      <div class="lang-card-bar">
        <div class="lang-card-fill"></div>
      </div>
    </div>
  `).join('');

  // Animation des barres au scroll
  const langCards = document.querySelectorAll('.lang-card');
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        langObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  langCards.forEach((card) => langObserver.observe(card));
}


/* ------------------------------------------------------------
   8. CODE RAIN — mots français qui défilent
   ------------------------------------------------------------ */
const codeRainCanvas = document.getElementById('code-rain');

if (codeRainCanvas) {
  const ctx = codeRainCanvas.getContext('2d');
  const MOTS = [
    'CODE', 'IMPACT', 'UVIRA', 'OFFLINE', 'PYTHON', 'PYTORCH',
    'FLUTTER', 'SQLITE', 'BREVET', 'INTELLIGENCE', 'DATA',
    'RÉSEAU', 'DEMAIN', 'ÉDUQUER', 'CONSTRUIRE', 'RÉSOUDRE',
    'AFRIQUE', 'CONGO', 'KIVU', 'LUMIÈRE', 'AVENIR', 'MÉTIER',
    'LOGICIEL', 'MODÈLE', 'RECHERCHE', 'HUMANITAIRE', 'ÉDUCATION',
    'JEUNESSE', 'TECHNOLOGIE', 'SOUTENABLE', 'LOCAL', 'LIBRE'
  ];

  const fontSize = 13;
  let columns = [];

  const resizeRain = () => {
    codeRainCanvas.width  = window.innerWidth;
    codeRainCanvas.height = window.innerHeight;
    const columnCount = Math.floor(codeRainCanvas.width / 140);
    columns = new Array(columnCount).fill(0).map(() => Math.random() * -50);
  };
  resizeRain();
  window.addEventListener('resize', resizeRain);

  let lastRainTime = 0;
  const drawRain = (time) => {
    if (time - lastRainTime > 50) {
      ctx.fillStyle = 'rgba(5, 5, 7, 0.06)';
      ctx.fillRect(0, 0, codeRainCanvas.width, codeRainCanvas.height);
      ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns.length; i++) {
        const mot = MOTS[Math.floor(Math.random() * MOTS.length)];
        const x = i * 140 + 40;
        const y = columns[i] * 26;
        const isHead = Math.random() > 0.9;
        ctx.fillStyle = isHead
          ? 'rgba(0, 217, 255, 0.35)'
          : 'rgba(139, 92, 246, 0.18)';
        ctx.fillText(mot, x, y);

        if (y > codeRainCanvas.height + 40 && Math.random() > 0.95) {
          columns[i] = 0;
        }
        columns[i]++;
      }
      lastRainTime = time;
    }
    requestAnimationFrame(drawRain);
  };
  requestAnimationFrame(drawRain);
}


/* ------------------------------------------------------------
   9. PARTICULES FLOTTANTES
   ------------------------------------------------------------ */
const particlesCanvas = document.getElementById('particles');

if (particlesCanvas) {
  const ctx = particlesCanvas.getContext('2d');
  const COLORS = ['#00D9FF', '#8B5CF6', '#FF5A5F'];

  let particles = [];
  let width = 0;
  let height = 0;

  const resizeParticles = () => {
    width  = particlesCanvas.width  = window.innerWidth;
    height = particlesCanvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((width * height) / 22000));
    particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.35 + 0.1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }));
  };
  resizeParticles();
  window.addEventListener('resize', resizeParticles);

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  const drawParticles = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      gradient.addColorStop(0, hexToRgba(p.color, pulseAlpha));
      gradient.addColorStop(1, hexToRgba(p.color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = hexToRgba(p.color, pulseAlpha * 1.3);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  };
  requestAnimationFrame(drawParticles);
}


/* ------------------------------------------------------------
   10. FORMULAIRE DE CONTACT (Web3Forms)
   ------------------------------------------------------------
   ⚠️ IMPORTANT : l'ID du formulaire dans le HTML doit être
   "contact-form" (et non "form") pour que ça fonctionne.
   ------------------------------------------------------------ */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupère les valeurs
    const nameEl    = contactForm.querySelector('[name="name"]');
    const emailEl   = contactForm.querySelector('[name="email"]');
    const messageEl = contactForm.querySelector('[name="message"]');

    const name    = nameEl    ? nameEl.value.trim()    : '';
    const email   = emailEl   ? emailEl.value.trim()   : '';
    const message = messageEl ? messageEl.value.trim() : '';

    // Reset visuel
    contactForm.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    // Validation
    let hasError = false;
    if (!name && nameEl) {
      nameEl.classList.add('error');
      hasError = true;
    }
    if ((!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && emailEl) {
      emailEl.classList.add('error');
      hasError = true;
    }
    if ((!message || message.length < 5) && messageEl) {
      messageEl.classList.add('error');
      hasError = true;
    }
    if (hasError) {
      if (formStatus) {
        formStatus.textContent = '⚠ Vérifie les champs surlignés';
        formStatus.classList.add('error');
      }
      return;
    }

    // Envoi
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.disabled = true;
    }

    // Prépare les données
    const formData = new FormData(contactForm);
    // Au cas où la clé n'est pas dans le HTML, on l'ajoute ici
    if (!formData.get('access_key')) {
      formData.append('access_key', '39624244-2e39-4e9b-8a93-945b1861cb37');
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (formStatus) {
          formStatus.textContent = '✓ Message envoyé ! Je te réponds sous 24h.';
          formStatus.classList.add('success');
        }
        contactForm.reset();
      } else {
        if (formStatus) {
          formStatus.textContent = '✗ Erreur : ' + (data.message || 'inconnue');
          formStatus.classList.add('error');
        }
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = '✗ Erreur réseau. Réessaie ou écris-moi directement.';
        formStatus.classList.add('error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
} else {
  console.warn('⚠️ Formulaire de contact introuvable. Vérifie que index.html contient bien <form id="contact-form">');
}


/* ------------------------------------------------------------
   11. ANNÉE AUTOMATIQUE DANS LE FOOTER
   ------------------------------------------------------------ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ------------------------------------------------------------
   12. BOUTON "RETOUR EN HAUT"
   ------------------------------------------------------------ */
const backToTop = document.querySelector('.footer-legal a[href="#top"]');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}