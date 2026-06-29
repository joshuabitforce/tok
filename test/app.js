/* ===================== TOK /test — lógica SPA ===================== */
/*
 * - Navegación entre vistas sin scroll, con View Transitions API (fallback animado).
 * - Hash routing (#conjuntos, #sponsor, #marca) para back-button y deep-link.
 * - Cambio de "pintura" del conjunto vía glTF material variants.
 * - Carousel de modelos de la marca.
 *
 * Todos los modelos 3D son PLACEHOLDERS remotos. Reemplazar las URLs por los
 * .glb reales de TOK cuando estén listos.
 */

const views = new Map(
    [...document.querySelectorAll('[data-view-id]')].map(v => [v.dataset.viewId, v])
);
const VALID = new Set(views.keys());
const body = document.body;

/* ---------- Navegación entre vistas ---------- */
function render(id) {
    const target = VALID.has(id) ? id : 'home';
    for (const [vid, el] of views) el.hidden = vid !== target;
    body.dataset.view = target;
    // foco accesible al entrar
    const focusable = views.get(target).querySelector('[data-back], .panel');
    if (focusable) focusable.focus({ preventScroll: true });
}

function navigate(id) {
    const target = VALID.has(id) ? id : 'home';
    if (body.dataset.view === target) return;

    // View Transitions API si está disponible; si no, render directo (CSS anima la entrada)
    if (document.startViewTransition) {
        document.startViewTransition(() => render(target));
    } else {
        render(target);
    }
}

// Click en paneles del home
document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => { location.hash = btn.dataset.goto; });
});
// Botones "volver"
document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => { location.hash = ''; });
});
// Escape vuelve al home
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.dataset.view !== 'home') location.hash = '';
});

// Routing por hash
function fromHash() {
    const id = location.hash.replace(/^#/, '');
    navigate(id || 'home');
}
window.addEventListener('hashchange', fromHash);

/* ---------- "Diseñá tu propio conjunto" → coming soon ---------- */
const designBtn = document.querySelector('[data-coming-soon]');
const soonNote = document.querySelector('[data-soon-note]');
if (designBtn) {
    designBtn.addEventListener('click', e => {
        e.preventDefault();
        // TODO: reemplazar por la URL de la herramienta de diseño (otro repo).
        if (soonNote) soonNote.hidden = false;
    });
}

/* ---------- Cambio de pintura (material variants) ---------- */
const conjunto = document.querySelector('[data-conjunto-model]');
const pills = document.querySelector('[data-variant-pills]');

if (conjunto && pills) {
    conjunto.addEventListener('load', () => {
        const variants = conjunto.availableVariants || [];
        pills.innerHTML = '';

        if (!variants.length) return; // el modelo real puede no tener variants aún

        variants.forEach((name, i) => {
            const pill = document.createElement('button');
            pill.className = 'variant-pill';
            pill.type = 'button';
            pill.textContent = name;
            pill.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
            pill.addEventListener('click', () => {
                conjunto.variantName = name;
                pills.querySelectorAll('.variant-pill')
                    .forEach(p => p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'));
            });
            pills.appendChild(pill);
        });
    }, { once: true });
}

/* ---------- Carousel de la marca ---------- */
/* PLACEHOLDERS: cada item es un modelo distinto representando una prenda.
   Reemplazar `src` por los .glb reales (camiseta, short, musculosa, etc.). */
const PRODUCTS = [
    { name: 'Camiseta de fútbol', tag: 'Línea TOK', src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' },
    { name: 'Short',              tag: 'Línea TOK', src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb' },
    { name: 'Musculosa básquet',  tag: 'Línea TOK', src: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb' },
    { name: 'Camiseta retro',     tag: 'Línea TOK', src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' },
];

const track = document.querySelector('[data-carousel-track]');
const dotsWrap = document.querySelector('[data-carousel-dots]');

if (track) {
    PRODUCTS.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = 'carousel__item';
        item.innerHTML = `
            <model-viewer src="${p.src}" alt="${p.name} (placeholder)"
                auto-rotate auto-rotate-delay="0" rotation-per-second="28deg"
                camera-controls touch-action="pan-y" interaction-prompt="none"
                shadow-intensity="0.8" exposure="1.1" loading="lazy"></model-viewer>
            <div class="carousel__caption">
                <strong>${p.name}</strong>
                <span>${p.tag}</span>
            </div>`;
        track.appendChild(item);

        const dot = document.createElement('span');
        dot.className = 'carousel__dot';
        dot.dataset.active = i === 0 ? 'true' : 'false';
        dotsWrap.appendChild(dot);
    });

    const items = [...track.children];
    const prev = document.querySelector('[data-carousel-prev]');
    const next = document.querySelector('[data-carousel-next]');
    let index = 0;

    function go(i) {
        index = Math.max(0, Math.min(items.length - 1, i));
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        [...dotsWrap.children].forEach((d, di) => d.dataset.active = di === index ? 'true' : 'false');
    }
    prev?.addEventListener('click', () => go(index - 1));
    next?.addEventListener('click', () => go(index + 1));

    // sincroniza los dots al deslizar manualmente
    track.addEventListener('scroll', () => {
        const i = Math.round(track.scrollLeft / (items[0].offsetWidth + 16));
        if (i !== index) {
            index = i;
            [...dotsWrap.children].forEach((d, di) => d.dataset.active = di === index ? 'true' : 'false');
        }
    }, { passive: true });
}

/* ---------- Init ---------- */
fromHash();
