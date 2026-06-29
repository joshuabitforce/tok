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

/* ---------- Cambio de pintura (repinta el material base de la prenda) ---------- */
// Paleta de "pinturas". rgb en 0..1 para la API de model-viewer.
const PAINTS = [
    { name: 'Blanco', css: '#f2f2f2', rgb: [0.95, 0.95, 0.95] },
    { name: 'Negro',  css: '#1c1c1c', rgb: [0.11, 0.11, 0.11] },
    { name: 'Rojo',   css: '#c0392b', rgb: [0.75, 0.16, 0.13] },
    { name: 'Azul',   css: '#2d6cdf', rgb: [0.18, 0.42, 0.87] },
];

// Repinta el primer material del modelo. Funciona con el .glb real cuando tenga
// el conjunto; si el modelo trae varios materiales, ajustar el índice/selección.
function paint(mv, rgb) {
    const mat = mv.model && mv.model.materials && mv.model.materials[0];
    if (mat) mat.pbrMetallicRoughness.setBaseColorFactor([...rgb, 1]);
}

const conjunto = document.querySelector('[data-conjunto-model]');
const pills = document.querySelector('[data-variant-pills]');

if (conjunto && pills) {
    pills.innerHTML = '<span class="variant-pills-label">Pintura</span>';
    PAINTS.forEach((p, i) => {
        const pill = document.createElement('button');
        pill.className = 'variant-pill';
        pill.type = 'button';
        pill.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        pill.innerHTML = `<span class="swatch" style="background:${p.css}"></span>${p.name}`;
        pill.addEventListener('click', () => {
            paint(conjunto, p.rgb);
            pills.querySelectorAll('.variant-pill')
                .forEach(b => b.setAttribute('aria-pressed', b === pill ? 'true' : 'false'));
        });
        pills.appendChild(pill);
    });
    // pintura inicial al cargar el modelo
    conjunto.addEventListener('load', () => paint(conjunto, PAINTS[0].rgb), { once: true });
}

/* ---------- Carousel de la marca ---------- */
/* La camiseta es un modelo real (repintado por color). Short y musculosa quedan
   como "próximamente" hasta tener los .glb reales de esas prendas. */
const SHIRT = 'https://cdn.jsdelivr.net/gh/Starklord17/threejs-t-shirt@main/public/shirt_baked.glb';
const PRODUCTS = [
    { type: 'model', name: 'Camiseta de fútbol', tag: 'Línea TOK', src: SHIRT, rgb: [0.11, 0.11, 0.11] },
    { type: 'model', name: 'Camiseta — Roja',    tag: 'Línea TOK', src: SHIRT, rgb: [0.75, 0.16, 0.13] },
    { type: 'model', name: 'Camiseta — Azul',    tag: 'Línea TOK', src: SHIRT, rgb: [0.18, 0.42, 0.87] },
    { type: 'soon',  name: 'Short',              tag: 'Línea TOK' },
    { type: 'soon',  name: 'Musculosa básquet',  tag: 'Línea TOK' },
];

const track = document.querySelector('[data-carousel-track]');
const dotsWrap = document.querySelector('[data-carousel-dots]');

if (track) {
    PRODUCTS.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = 'carousel__item';

        if (p.type === 'model') {
            item.innerHTML = `
                <model-viewer src="${p.src}" alt="${p.name}"
                    auto-rotate auto-rotate-delay="0" rotation-per-second="30deg"
                    camera-controls touch-action="pan-y" interaction-prompt="none"
                    camera-orbit="0deg 80deg 2.6m"
                    shadow-intensity="0.8" exposure="1.15" loading="lazy"></model-viewer>
                <div class="carousel__caption"><strong>${p.name}</strong><span>${p.tag}</span></div>`;
            const mv = item.querySelector('model-viewer');
            mv.addEventListener('load', () => paint(mv, p.rgb), { once: true });
        } else {
            item.innerHTML = `
                <div class="carousel__soon">
                    <svg viewBox="0 0 24 24" stroke="currentColor"><path d="M4 7l5-3 3 2 3-2 5 3-3 3v9H7v-9z"/></svg>
                    <span>Modelo próximamente</span>
                </div>
                <div class="carousel__caption"><strong>${p.name}</strong><span>${p.tag}</span></div>`;
        }
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
