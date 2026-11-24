let toastTimer = null;
let measureCanvas = null;
let zoomPercent = 100;
const fontStylesheetPromises = new Map();
const exportFontCssPromises = new Map();
let gifEncoderPromise = null;
let animationsPaused = false;
const PROFESSIONAL_DEFAULTS = Object.freeze({
    name: 'Nama Anda',
    subtitle: 'Jabatan',
    nameFont: 'montserrat',
    subtitleFont: 'montserrat',
    template: 'corporate',
    computerModel: 'laptop',
    background: 'checker',
    speed: '3.5',
    zoom: 100
});

const TEXT_FONT_OPTIONS = [
    { value: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
    { value: 'helvetica', label: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
    { value: 'verdana', label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
    { value: 'tahoma', label: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
    { value: 'trebuchet', label: 'Trebuchet MS', family: "'Trebuchet MS', sans-serif" },
    { value: 'segoe', label: 'Segoe UI', family: "'Segoe UI', sans-serif" },
    { value: 'times', label: 'Times New Roman', family: "'Times New Roman', Times, serif" },
    { value: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
    { value: 'palatino', label: 'Palatino Linotype', family: "'Palatino Linotype', 'Book Antiqua', serif" },
    { value: 'garamond', label: 'Garamond', family: 'Garamond, serif' },
    { value: 'courier', label: 'Courier New', family: "'Courier New', monospace" },
    { value: 'impact', label: 'Impact', family: 'Impact, Haettenschweiler, sans-serif' },
    { value: 'comic', label: 'Comic Sans MS', family: "'Comic Sans MS', cursive" },
    { value: 'calibri', label: 'Calibri', family: 'Calibri, Arial, sans-serif' },
    { value: 'cambria', label: 'Cambria', family: 'Cambria, Georgia, serif' },
    { value: 'century-gothic', label: 'Century Gothic', family: "'Century Gothic', Futura, sans-serif" },
    { value: 'franklin', label: 'Franklin Gothic', family: "'Franklin Gothic Medium', 'Arial Narrow', sans-serif" },
    { value: 'lucida-sans', label: 'Lucida Sans', family: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
    { value: 'lucida-console', label: 'Lucida Console', family: "'Lucida Console', Monaco, monospace" },
    { value: 'consolas', label: 'Consolas', family: "Consolas, 'Courier New', monospace" },
    { value: 'book-antiqua', label: 'Book Antiqua', family: "'Book Antiqua', Palatino, serif" },
    { value: 'monaco', label: 'Monaco', family: 'Monaco, Consolas, monospace' },
    { value: 'system-ui', label: 'System UI', family: 'system-ui, sans-serif' },
    { value: 'inter', label: 'Inter', family: "'Inter', sans-serif", googleFamily: 'Inter' },
    { value: 'montserrat', label: 'Montserrat', family: "'Montserrat', sans-serif", googleFamily: 'Montserrat' },
    { value: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif", googleFamily: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans', family: "'Open Sans', sans-serif", googleFamily: 'Open Sans' },
    { value: 'lato', label: 'Lato', family: "'Lato', sans-serif", googleFamily: 'Lato', googleWeight: 900 },
    { value: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif", googleFamily: 'Poppins' },
    { value: 'playfair', label: 'Playfair Display', family: "'Playfair Display', serif", googleFamily: 'Playfair Display' },
    { value: 'nunito', label: 'Nunito', family: "'Nunito', sans-serif", googleFamily: 'Nunito' },
    { value: 'raleway', label: 'Raleway', family: "'Raleway', sans-serif", googleFamily: 'Raleway' },
    { value: 'source-sans', label: 'Source Sans 3', family: "'Source Sans 3', sans-serif", googleFamily: 'Source Sans 3' },
    { value: 'ubuntu', label: 'Ubuntu', family: "'Ubuntu', sans-serif", googleFamily: 'Ubuntu', googleWeight: 700 },
    { value: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif", googleFamily: 'DM Sans' },
    { value: 'manrope', label: 'Manrope', family: "'Manrope', sans-serif", googleFamily: 'Manrope', googleItalic: false },
    { value: 'rubik', label: 'Rubik', family: 'Rubik, sans-serif', googleFamily: 'Rubik' },
    { value: 'nunito-sans', label: 'Nunito Sans', family: "'Nunito Sans', sans-serif", googleFamily: 'Nunito Sans' },
    { value: 'work-sans', label: 'Work Sans', family: "'Work Sans', sans-serif", googleFamily: 'Work Sans' },
    { value: 'fira-sans', label: 'Fira Sans', family: "'Fira Sans', sans-serif", googleFamily: 'Fira Sans' },
    { value: 'quicksand', label: 'Quicksand', family: 'Quicksand, sans-serif', googleFamily: 'Quicksand', googleWeight: 700, googleItalic: false },
    { value: 'mulish', label: 'Mulish', family: 'Mulish, sans-serif', googleFamily: 'Mulish' },
    { value: 'karla', label: 'Karla', family: 'Karla, sans-serif', googleFamily: 'Karla', googleWeight: 700 },
    { value: 'cabin', label: 'Cabin', family: 'Cabin, sans-serif', googleFamily: 'Cabin', googleWeight: 700 },
    { value: 'assistant', label: 'Assistant', family: 'Assistant, sans-serif', googleFamily: 'Assistant', googleWeight: 700, googleItalic: false },
    { value: 'josefin-sans', label: 'Josefin Sans', family: "'Josefin Sans', sans-serif", googleFamily: 'Josefin Sans', googleWeight: 700 },
    { value: 'hind', label: 'Hind', family: 'Hind, sans-serif', googleFamily: 'Hind', googleWeight: 700, googleItalic: false },
    { value: 'heebo', label: 'Heebo', family: 'Heebo, sans-serif', googleFamily: 'Heebo', googleItalic: false },
    { value: 'source-serif', label: 'Source Serif 4', family: "'Source Serif 4', serif", googleFamily: 'Source Serif 4' },
    { value: 'lora', label: 'Lora', family: 'Lora, serif', googleFamily: 'Lora', googleWeight: 700 },
    { value: 'libre-baskerville', label: 'Libre Baskerville', family: "'Libre Baskerville', serif", googleFamily: 'Libre Baskerville', googleWeight: 700 },
    { value: 'roboto-slab', label: 'Roboto Slab', family: "'Roboto Slab', serif", googleFamily: 'Roboto Slab', googleItalic: false },
    { value: 'cormorant', label: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", googleFamily: 'Cormorant Garamond', googleWeight: 700 },
    { value: 'eb-garamond', label: 'EB Garamond', family: "'EB Garamond', serif", googleFamily: 'EB Garamond' },
    { value: 'archivo', label: 'Archivo', family: 'Archivo, sans-serif', googleFamily: 'Archivo' },
    { value: 'exo-2', label: 'Exo 2', family: "'Exo 2', sans-serif", googleFamily: 'Exo 2' },
    { value: 'barlow', label: 'Barlow', family: 'Barlow, sans-serif', googleFamily: 'Barlow' },
    { value: 'asap', label: 'Asap', family: 'Asap, sans-serif', googleFamily: 'Asap' },
    { value: 'merriweather', label: 'Merriweather', family: 'Merriweather, serif', googleFamily: 'Merriweather', googleWeight: 900 }
];
const TEXT_FONT_OPTIONS_BY_VALUE = new Map(TEXT_FONT_OPTIONS.map(option => [option.value, option]));
const TEMPLATE_LABELS = {
    ocean: 'Biru Samudra',
    silver: 'Perak',
    midnight: 'Tengah Malam',
    cyan: 'Sian',
    corporate: 'Navy Korporat',
    charcoal: 'Perak Arang',
    emerald: 'Hijau Zamrud',
    burgundy: 'Burgundi Eksekutif',
    royal: 'Biru Kerajaan',
    graphiteGold: 'Grafit dan Emas',
    arctic: 'Arktik Profesional',
    violet: 'Ungu Eksekutif',
    teal: 'Toska Profesional',
    copper: 'Tembaga Klasik',
    crimson: 'Merah Karmesi',
    sunset: 'Senja Amber',
    sapphire: 'Safir Neon',
    lavender: 'Lavender Elegan',
    rose: 'Rosé Modern',
    forest: 'Hutan Zamrud',
    aqua: 'Aqua Gelap',
    onyx: 'Oniks Emas',
    glacier: 'Glacier Biru',
    monochrome: 'Monokrom',
    indigo: 'Indigo Elektrik',
    roseGold: 'Rose Gold',
    limeTech: 'Lime Teknologi',
    orangeBlaze: 'Oranye Dinamis',
    twilight: 'Senja Ungu',
    skyline: 'Biru Skyline',
    emeraldGold: 'Zamrud Emas',
    cherry: 'Cherry Merah',
    oceanMint: 'Ocean Mint',
    royalPurple: 'Ungu Royal',
    sandstone: 'Pasir Klasik',
    neonGreen: 'Neon Hijau',
    pearl: 'Mutiara Perak',
    coral: 'Coral Modern',
    galaxy: 'Galaksi',
    iceBlue: 'Es Biru'
};
const ADDITIONAL_TEMPLATE_THEMES = {
    sunset: {
        base: 'copper',
        colors: { mainFill: '#431407', mainOuter: '#fdba74', mainNeonOne: '#fb923c', mainNeonTwo: '#f97316', subFill: '#ffedd5', subFrame: '#c2410c', subText: '#7c2d12', subNeon: '#fdba74', leftAccentOne: '#fdba74', leftAccentTwo: '#7c2d12', rightAccentOne: '#7c2d12', rightAccentTwo: '#f97316' }
    },
    sapphire: {
        base: 'royal',
        colors: { mainFill: '#0c1e49', mainOuter: '#60a5fa', mainNeonOne: '#38bdf8', mainNeonTwo: '#2563eb', subFill: '#dbeafe', subFrame: '#1d4ed8', subText: '#172554', subNeon: '#38bdf8', leftAccentOne: '#38bdf8', leftAccentTwo: '#172554', rightAccentOne: '#172554', rightAccentTwo: '#60a5fa' }
    },
    lavender: {
        base: 'violet',
        colors: { mainFill: '#4c1d95', mainOuter: '#d8b4fe', mainNeonOne: '#c4b5fd', mainNeonTwo: '#a78bfa', subFill: '#f5f3ff', subFrame: '#8b5cf6', subText: '#3b0764', subNeon: '#c4b5fd', leftAccentOne: '#d8b4fe', leftAccentTwo: '#4c1d95', rightAccentOne: '#4c1d95', rightAccentTwo: '#a78bfa' }
    },
    rose: {
        base: 'burgundy',
        colors: { mainFill: '#881337', mainOuter: '#fda4af', mainNeonOne: '#fb7185', mainNeonTwo: '#e11d48', subFill: '#fff1f2', subFrame: '#fb7185', subText: '#881337', subNeon: '#fda4af', leftAccentOne: '#fda4af', leftAccentTwo: '#881337', rightAccentOne: '#881337', rightAccentTwo: '#fb7185' }
    },
    forest: {
        base: 'emerald',
        colors: { mainFill: '#052e16', mainOuter: '#86efac', mainNeonOne: '#4ade80', mainNeonTwo: '#16a34a', subFill: '#f0fdf4', subFrame: '#15803d', subText: '#14532d', subNeon: '#86efac', leftAccentOne: '#86efac', leftAccentTwo: '#14532d', rightAccentOne: '#14532d', rightAccentTwo: '#22c55e' }
    },
    aqua: {
        base: 'teal',
        colors: { mainFill: '#083344', mainOuter: '#5eead4', mainNeonOne: '#2dd4bf', mainNeonTwo: '#0891b2', subFill: '#ecfeff', subFrame: '#0e7490', subText: '#164e63', subNeon: '#67e8f9', leftAccentOne: '#5eead4', leftAccentTwo: '#164e63', rightAccentOne: '#164e63', rightAccentTwo: '#06b6d4' }
    },
    onyx: {
        base: 'graphiteGold',
        colors: { mainFill: '#09090b', mainOuter: '#facc15', mainNeonOne: '#fde047', mainNeonTwo: '#d4a72c', subFill: '#fefce8', subFrame: '#a16207', subText: '#422006', subNeon: '#facc15', leftAccentOne: '#facc15', leftAccentTwo: '#27272a', rightAccentOne: '#27272a', rightAccentTwo: '#eab308' }
    },
    glacier: {
        base: 'arctic',
        colors: { mainFill: '#164e63', mainOuter: '#a5f3fc', mainNeonOne: '#67e8f9', mainNeonTwo: '#38bdf8', subFill: '#ecfeff', subFrame: '#0891b2', subText: '#164e63', subNeon: '#a5f3fc', leftAccentOne: '#a5f3fc', leftAccentTwo: '#155e75', rightAccentOne: '#155e75', rightAccentTwo: '#38bdf8' }
    },
    monochrome: {
        base: 'silver',
        colors: { mainFill: '#27272a', mainOuter: '#e4e4e7', mainNeonOne: '#fafafa', mainNeonTwo: '#a1a1aa', subFill: '#f4f4f5', subFrame: '#52525b', subText: '#18181b', subNeon: '#d4d4d8', leftAccentOne: '#e4e4e7', leftAccentTwo: '#3f3f46', rightAccentOne: '#3f3f46', rightAccentTwo: '#a1a1aa' }
    },
    indigo: {
        base: 'midnight',
        colors: { mainFill: '#1e1b4b', mainOuter: '#818cf8', mainNeonOne: '#a5b4fc', mainNeonTwo: '#6366f1', subFill: '#eef2ff', subFrame: '#4f46e5', subText: '#1e1b4b', subNeon: '#818cf8', leftAccentOne: '#818cf8', leftAccentTwo: '#312e81', rightAccentOne: '#312e81', rightAccentTwo: '#6366f1' }
    },
    roseGold: {
        base: 'graphiteGold',
        colors: { mainFill: '#3b1f2b', mainOuter: '#f9a8d4', mainNeonOne: '#fbcfe8', mainNeonTwo: '#db2777', subFill: '#fff1f2', subFrame: '#be185d', subText: '#500724', subNeon: '#f9a8d4', leftAccentOne: '#f9a8d4', leftAccentTwo: '#500724', rightAccentOne: '#500724', rightAccentTwo: '#db2777' }
    },
    limeTech: {
        base: 'midnight',
        colors: { mainFill: '#17220a', mainOuter: '#a3e635', mainNeonOne: '#d9f99d', mainNeonTwo: '#84cc16', subFill: '#f7fee7', subFrame: '#4d7c0f', subText: '#1a2e05', subNeon: '#a3e635', leftAccentOne: '#a3e635', leftAccentTwo: '#1a2e05', rightAccentOne: '#1a2e05', rightAccentTwo: '#84cc16' }
    },
    orangeBlaze: {
        base: 'crimson',
        colors: { mainFill: '#431407', mainOuter: '#fdba74', mainNeonOne: '#fed7aa', mainNeonTwo: '#f97316', subFill: '#fff7ed', subFrame: '#c2410c', subText: '#7c2d12', subNeon: '#fdba74', leftAccentOne: '#fdba74', leftAccentTwo: '#7c2d12', rightAccentOne: '#7c2d12', rightAccentTwo: '#ea580c' }
    },
    twilight: {
        base: 'violet',
        colors: { mainFill: '#240b3b', mainOuter: '#e879f9', mainNeonOne: '#f5d0fe', mainNeonTwo: '#c026d3', subFill: '#fdf4ff', subFrame: '#a21caf', subText: '#4a044e', subNeon: '#e879f9', leftAccentOne: '#e879f9', leftAccentTwo: '#4a044e', rightAccentOne: '#4a044e', rightAccentTwo: '#c026d3' }
    },
    skyline: {
        base: 'arctic',
        colors: { mainFill: '#082f49', mainOuter: '#7dd3fc', mainNeonOne: '#bae6fd', mainNeonTwo: '#0284c7', subFill: '#f0f9ff', subFrame: '#0369a1', subText: '#0c4a6e', subNeon: '#7dd3fc', leftAccentOne: '#7dd3fc', leftAccentTwo: '#0c4a6e', rightAccentOne: '#0c4a6e', rightAccentTwo: '#0284c7' }
    },
    emeraldGold: {
        base: 'emerald',
        colors: { mainFill: '#064e3b', mainOuter: '#facc15', mainNeonOne: '#fef08a', mainNeonTwo: '#34d399', subFill: '#fefce8', subFrame: '#a16207', subText: '#14532d', subNeon: '#facc15', leftAccentOne: '#facc15', leftAccentTwo: '#14532d', rightAccentOne: '#14532d', rightAccentTwo: '#d4a72c' }
    },
    cherry: {
        base: 'burgundy',
        colors: { mainFill: '#450a0a', mainOuter: '#fca5a5', mainNeonOne: '#fecaca', mainNeonTwo: '#dc2626', subFill: '#fef2f2', subFrame: '#b91c1c', subText: '#450a0a', subNeon: '#f87171', leftAccentOne: '#fca5a5', leftAccentTwo: '#450a0a', rightAccentOne: '#450a0a', rightAccentTwo: '#dc2626' }
    },
    oceanMint: {
        base: 'teal',
        colors: { mainFill: '#042f2e', mainOuter: '#99f6e4', mainNeonOne: '#ccfbf1', mainNeonTwo: '#2dd4bf', subFill: '#f0fdfa', subFrame: '#0f766e', subText: '#134e4a', subNeon: '#5eead4', leftAccentOne: '#99f6e4', leftAccentTwo: '#134e4a', rightAccentOne: '#134e4a', rightAccentTwo: '#14b8a6' }
    },
    royalPurple: {
        base: 'violet',
        colors: { mainFill: '#2e1065', mainOuter: '#c4b5fd', mainNeonOne: '#ede9fe', mainNeonTwo: '#7c3aed', subFill: '#f5f3ff', subFrame: '#6d28d9', subText: '#2e1065', subNeon: '#a78bfa', leftAccentOne: '#c4b5fd', leftAccentTwo: '#2e1065', rightAccentOne: '#2e1065', rightAccentTwo: '#7c3aed' }
    },
    sandstone: {
        base: 'copper',
        colors: { mainFill: '#44403c', mainOuter: '#d6a86a', mainNeonOne: '#f5deb3', mainNeonTwo: '#c08457', subFill: '#faf5ef', subFrame: '#a16207', subText: '#422006', subNeon: '#d6a86a', leftAccentOne: '#d6a86a', leftAccentTwo: '#44403c', rightAccentOne: '#44403c', rightAccentTwo: '#c08457' }
    },
    neonGreen: {
        base: 'midnight',
        colors: { mainFill: '#052e16', mainOuter: '#4ade80', mainNeonOne: '#86efac', mainNeonTwo: '#22c55e', subFill: '#dcfce7', subFrame: '#15803d', subText: '#14532d', subNeon: '#4ade80', leftAccentOne: '#4ade80', leftAccentTwo: '#14532d', rightAccentOne: '#14532d', rightAccentTwo: '#16a34a' }
    },
    pearl: {
        base: 'silver',
        colors: { mainFill: '#475569', mainOuter: '#f8fafc', mainNeonOne: '#ffffff', mainNeonTwo: '#cbd5e1', subFill: '#ffffff', subFrame: '#94a3b8', subText: '#334155', subNeon: '#e2e8f0', leftAccentOne: '#f8fafc', leftAccentTwo: '#64748b', rightAccentOne: '#64748b', rightAccentTwo: '#cbd5e1' }
    },
    coral: {
        base: 'burgundy',
        colors: { mainFill: '#7c2d12', mainOuter: '#fb7185', mainNeonOne: '#fecdd3', mainNeonTwo: '#f97316', subFill: '#fff7ed', subFrame: '#ea580c', subText: '#7c2d12', subNeon: '#fb7185', leftAccentOne: '#fb7185', leftAccentTwo: '#7c2d12', rightAccentOne: '#7c2d12', rightAccentTwo: '#f97316' }
    },
    galaxy: {
        base: 'midnight',
        colors: { mainFill: '#1e1b4b', mainOuter: '#c084fc', mainNeonOne: '#e9d5ff', mainNeonTwo: '#8b5cf6', subFill: '#f5f3ff', subFrame: '#7c3aed', subText: '#312e81', subNeon: '#c084fc', leftAccentOne: '#c084fc', leftAccentTwo: '#312e81', rightAccentOne: '#312e81', rightAccentTwo: '#8b5cf6' }
    },
    iceBlue: {
        base: 'arctic',
        colors: { mainFill: '#164e63', mainOuter: '#e0f2fe', mainNeonOne: '#ffffff', mainNeonTwo: '#7dd3fc', subFill: '#f8fafc', subFrame: '#38bdf8', subText: '#0c4a6e', subNeon: '#bae6fd', leftAccentOne: '#e0f2fe', leftAccentTwo: '#0c4a6e', rightAccentOne: '#0c4a6e', rightAccentTwo: '#38bdf8' }
    }
};

const animatedSvgIds = [
    'lightMain', 'lightMainSec', 'lightMainCore', 'lightMainSecCore',
    'lightSub', 'lightSubCore',
    'shimmerMain', 'shimmerText', 'shimmerSub',
    'flare1', 'flare2', 'flare3', 'textGlowGroup'
];

async function loadGoogleFontStylesheet(option) {
    if (!option.googleFamily) return null;
    if (!fontStylesheetPromises.has(option.value)) {
        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link');
            const fontStyle = option.googleItalic === false ? 'normal' : 'italic';
            const query = new URLSearchParams({
                family: fontStyle === 'italic'
                    ? `${option.googleFamily}:ital,wght@1,${option.googleWeight || 800}`
                    : `${option.googleFamily}:wght@${option.googleWeight || 800}`,
                display: 'swap'
            });
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?${query}`;
            link.dataset.editorFont = option.value;
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Stylesheet font ${option.label} tidak dapat dimuat`));
            document.head.appendChild(link);
        }).catch(error => {
            fontStylesheetPromises.delete(option.value);
            throw error;
        });
        fontStylesheetPromises.set(option.value, promise);
    }
    return fontStylesheetPromises.get(option.value);
}

async function getExportFontFaceCss(option) {
    if (!option.googleFamily) return '';
    if (!exportFontCssPromises.has(option.value)) {
        const promise = (async () => {
            const fontStylesheet = await loadGoogleFontStylesheet(option);
            const stylesheetResponse = await fetch(fontStylesheet.href);
            if (!stylesheetResponse.ok) throw new Error(`Font ${option.label} tidak dapat dimuat`);
            const stylesheetText = await stylesheetResponse.text();
            const familyPattern = new RegExp(`font-family:\\s*['"]${option.googleFamily.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'i');
            const fontStyle = option.googleItalic === false ? 'normal' : 'italic';
            const fontFaceRule = (stylesheetText.match(/@font-face\s*\{[^}]+\}/g) || []).find(rule =>
                familyPattern.test(rule) &&
                new RegExp(`font-style:\\s*${fontStyle}`).test(rule) &&
                new RegExp(`font-weight:\\s*${option.googleWeight || 800}`).test(rule) &&
                /unicode-range:\s*U\+0000-00FF/i.test(rule)
            );
            const fontUrl = fontFaceRule && /src:\s*url\(([^)]+)\)/.exec(fontFaceRule)?.[1];
            if (!fontUrl) throw new Error(`Font ${option.label} italic tidak ditemukan`);

            const fontResponse = await fetch(fontUrl);
            if (!fontResponse.ok) throw new Error(`File font ${option.label} tidak dapat dimuat`);
            const bytes = new Uint8Array(await fontResponse.arrayBuffer());
            let binary = '';
            for (let offset = 0; offset < bytes.length; offset += 0x8000) {
                binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
            }
            return `@font-face{font-family:'${option.googleFamily}';font-style:${fontStyle};font-weight:800;src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');}`;
        })().catch(error => {
            exportFontCssPromises.delete(option.value);
            throw error;
        });
        exportFontCssPromises.set(option.value, promise);
    }
    return exportFontCssPromises.get(option.value);
}

async function getExportFontCss() {
    const fontKeys = ['nameFont', 'subTitleFont'].map(id => document.getElementById(id)?.value || 'montserrat');
    const options = [...new Set(fontKeys)].map(key => TEXT_FONT_OPTIONS_BY_VALUE.get(key)).filter(Boolean);
    return (await Promise.all(options.map(getExportFontFaceCss))).join('');
}

async function setTextFont(target, fontKey) {
    const option = TEXT_FONT_OPTIONS_BY_VALUE.get(fontKey);
    const textId = target === 'name' ? 'nameText' : target === 'subTitle' ? 'subTitleText' : null;
    const selectId = target === 'name' ? 'nameFont' : target === 'subTitle' ? 'subTitleFont' : null;
    const textElement = textId && document.getElementById(textId);
    const select = selectId && document.getElementById(selectId);
    if (!option || !textElement || !select) return;

    try {
        if (option.googleFamily) {
            await loadGoogleFontStylesheet(option);
            const fontStyle = option.googleItalic === false ? 'normal' : 'italic';
            const loadedFonts = await document.fonts.load(`${fontStyle} ${option.googleWeight || 800} 24px "${option.googleFamily}"`);
            if (!loadedFonts.length) throw new Error(`Font ${option.label} tidak tersedia`);
        }
        textElement.setAttribute('font-family', option.family);
        textElement.dataset.fontOption = option.value;
        updateBannerLayout();
    } catch (error) {
        select.value = textElement.dataset.fontOption || 'montserrat';
        showToast(`Font ${option.label} gagal dimuat. ${error.message}`);
    }
}

function populateFontSelectors() {
    ['nameFont', 'subTitleFont'].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.replaceChildren();

        [
            { label: 'Font sistem', options: TEXT_FONT_OPTIONS.filter(option => !option.googleFamily) },
            { label: 'Google Fonts', options: TEXT_FONT_OPTIONS.filter(option => option.googleFamily) }
        ].forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.label;
            const defaultFont = id === 'nameFont' ? PROFESSIONAL_DEFAULTS.nameFont : PROFESSIONAL_DEFAULTS.subtitleFont;
            group.options.forEach(font => {
                const option = document.createElement('option');
                option.value = font.value;
                option.textContent = font.label;
                option.selected = font.value === defaultFont;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        });
    });
    const note = document.getElementById('fontOptionsNote');
    if (note) note.textContent = `${TEXT_FONT_OPTIONS.length} pilihan font. Google Fonts memerlukan koneksi internet.`;
}

function loadGifEncoder() {
    if (!gifEncoderPromise) {
        gifEncoderPromise = import('https://unpkg.com/gifenc@1.0.3/dist/gifenc.esm.js').catch(error => {
            gifEncoderPromise = null;
            throw new Error(`Encoder GIF tidak dapat dimuat: ${error.message}`);
        });
    }

    return gifEncoderPromise;
}

function createExportSvgFrameBuilder(svgElement, width, height, fontCss) {
    const clonedSvg = svgElement.cloneNode(true);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('width', String(width));
    clonedSvg.setAttribute('height', String(height));
    const fontStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    fontStyle.textContent = fontCss;
    clonedSvg.insertBefore(fontStyle, clonedSvg.firstChild);

    const animatedElements = animatedSvgIds.map(id => ({
        live: document.getElementById(id),
        clone: clonedSvg.getElementById(id)
    })).filter(item => item.live && item.clone);

    animatedElements.forEach(({ clone }) => {
        clone.removeAttribute('class');
        clone.style.animation = 'none';
    });

    return () => {
        animatedElements.forEach(({ live, clone }) => {
            const style = window.getComputedStyle(live);
            clone.style.strokeDasharray = style.strokeDasharray === 'none' ? '' : style.strokeDasharray;
            clone.style.strokeDashoffset = style.strokeDashoffset;
            clone.style.transform = style.transform === 'none' ? '' : style.transform;
            clone.style.transformOrigin = style.transformOrigin;
            clone.style.opacity = style.opacity;
            clone.style.filter = style.filter === 'none' ? '' : style.filter;
        });
        return new XMLSerializer().serializeToString(clonedSvg);
    };
}

function createAnimationTimeline() {
    const animations = animatedSvgIds.flatMap(id => {
        const element = document.getElementById(id);
        return element ? element.getAnimations() : [];
    });
    const states = animations.map(animation => {
        const currentTime = Number(animation.currentTime);
        return {
            animation,
            currentTime: Number.isFinite(currentTime) ? currentTime : 0,
            playbackRate: animation.playbackRate,
            wasRunning: animation.playState === 'running'
        };
    });
    states.forEach(({ animation }) => animation.pause());
    let elapsedMs = 0;

    return {
        seek(timeMs) {
            elapsedMs = timeMs;
            states.forEach(({ animation, currentTime, playbackRate }) => {
                animation.currentTime = currentTime + elapsedMs * playbackRate;
            });
        },
        restore() {
            states.forEach(({ animation, currentTime, playbackRate, wasRunning }) => {
                animation.currentTime = currentTime + elapsedMs * playbackRate;
                if (wasRunning) animation.play();
            });
        }
    };
}

function toggleAnimationPlayback() {
    const animations = Array.from(new Set(animatedSvgIds.flatMap(id => {
        const element = document.getElementById(id);
        return element ? element.getAnimations() : [];
    })));
    const shouldPause = !animationsPaused;
    if (shouldPause) {
        const currentTimes = animations.map(animation => Number(animation.currentTime));
        animations.forEach((animation, index) => {
            animation.pause();
            if (Number.isFinite(currentTimes[index])) animation.currentTime = currentTimes[index];
        });
    } else {
        animations.forEach(animation => animation.play());
    }
    animationsPaused = shouldPause;

    const button = document.getElementById('pauseAnimationBtn');
    if (button) {
        button.textContent = animationsPaused ? 'Putar pratinjau' : 'Jeda pratinjau';
        button.setAttribute('aria-pressed', String(animationsPaused));
    }
}

function setZoom(value) {
    zoomPercent = Math.max(50, Math.min(200, value));
    const stage = document.getElementById('graphicStage');
    const label = document.getElementById('zoomLabel');
    if (stage) stage.style.transform = `scale(${zoomPercent / 100})`;
    if (label) label.textContent = `${zoomPercent}%`;
}

function zoomView(amount) {
    setZoom(zoomPercent + amount);
}

function setComputerModel(model) {
    const models = ['laptop', 'monitor', 'desktop', 'tablet', 'server'];
    const selected = models.includes(model) ? model : 'laptop';
    document.querySelectorAll('.computer-icon').forEach(icon => {
        icon.setAttribute('display', icon.id === `icon-${selected}` ? 'inline' : 'none');
    });
}

function updateName(value) {
    const nameText = document.getElementById('nameText');
    if (!nameText) return;

    const cleanName = (value || '').trim() || PROFESSIONAL_DEFAULTS.name;
    nameText.textContent = cleanName;
    updateBannerLayout();
}

function updateSubTitle(value) {
    const subTitle = document.getElementById('subTitleText');
    if (!subTitle) return;
    subTitle.textContent = (value || '').trim() || 'Jabatan';
    updateBannerLayout();
}

function measureLabelWidth(textElement, fontSize, letterSpacing) {
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('letter-spacing', letterSpacing);

    if (typeof textElement.getComputedTextLength === 'function') {
        const svgWidth = textElement.getComputedTextLength();
        if (Number.isFinite(svgWidth) && svgWidth > 0) return svgWidth;
    }

    if (!measureCanvas) measureCanvas = document.createElement('canvas');
    const context = measureCanvas.getContext('2d');
    const text = textElement.textContent || '';
    if (!context) return text.length * fontSize * 0.58;
    const fontStyle = textElement.getAttribute('font-style') || 'normal';
    const fontWeight = textElement.getAttribute('font-weight') || '400';
    const fontFamily = textElement.getAttribute('font-family') || 'sans-serif';
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const characters = Array.from(text);
    return context.measureText(text).width + Math.max(0, characters.length - 1) * letterSpacing;
}

function fitLabelFont(textElement, baseFontSize, minFontSize, maxWidth, letterSpacing) {
    let low = minFontSize;
    let high = baseFontSize;
    let best = minFontSize;

    while (low <= high) {
        const fontSize = Math.floor((low + high) / 2);
        const textWidth = measureLabelWidth(textElement, fontSize, letterSpacing);
        if (textWidth <= maxWidth) {
            best = fontSize;
            low = fontSize + 1;
        } else {
            high = fontSize - 1;
        }
    }

    return {
        fontSize: best,
        width: measureLabelWidth(textElement, best, letterSpacing)
    };
}

function centerTextWithinShape(textId, shapeId) {
    const text = document.getElementById(textId);
    const shape = document.getElementById(shapeId);
    if (!text || !shape) return;

    const bounds = shape.getBBox();
    text.setAttribute('x', bounds.x + bounds.width / 2);

    const textBounds = text.getBBox();
    const currentY = Number(text.getAttribute('y'));
    const shapeCenterY = bounds.y + bounds.height / 2;
    const textCenterY = textBounds.y + textBounds.height / 2;
    text.setAttribute('y', currentY + shapeCenterY - textCenterY);
}

function updateBannerLayout() {
    const nameText = document.getElementById('nameText');
    const subTitle = document.getElementById('subTitleText');
    if (!nameText || !subTitle) return;

    fitLabelFont(nameText, 90, 12, 780, -1.5);
    const mainWidth = 950;
    const lowerTextAvailable = Math.max(120, mainWidth - 500);
    fitLabelFont(subTitle, 37, 12, lowerTextAvailable, 0.2);

    const centerX = 692;
    updateMainBannerSize(centerX - mainWidth / 2, centerX + mainWidth / 2);
}

function updateMainBannerSize(leftX, rightX) {
    const innerLeft = leftX + 5;
    const innerRight = rightX - 6;
    const outerPath = `M ${leftX} 154 L ${rightX} 154 C ${rightX + 18} 154 ${rightX + 27} 168 ${rightX + 17} 184 L ${rightX - 43} 271 C ${rightX - 51} 282 ${rightX - 63} 288 ${rightX - 77} 288 L ${leftX - 79} 288 L ${leftX - 14} 168 C ${leftX - 9} 159 ${leftX - 5} 154 ${leftX} 154 Z`;
    const innerPath = `M ${innerLeft} 161 L ${innerRight} 161 C ${innerRight + 14} 161 ${innerRight + 21} 171 ${innerRight + 14} 184 L ${innerRight - 44} 267 C ${innerRight - 50} 276 ${innerRight - 60} 281 ${innerRight - 72} 281 L ${innerLeft - 71} 281 L ${innerLeft - 12} 173 C ${innerLeft - 8} 165 ${innerLeft - 4} 161 ${innerLeft} 161 Z`;

    document.getElementById('mainOuterPath')?.setAttribute('d', outerPath);
    document.getElementById('mainInnerPath')?.setAttribute('d', innerPath);
    document.getElementById('mainInnerClipPath')?.setAttribute('d', innerPath);
    centerTextWithinShape('nameText', 'mainInnerPath');

    ['lightMain', 'lightMainSec', 'lightMainCore', 'lightMainSecCore'].forEach(id => {
        document.getElementById(id)?.setAttribute('d', innerPath);
    });

    const leftAccent = document.getElementById('left-accents');
    if (leftAccent) {
        leftAccent.setAttribute('transform', `translate(${Math.round(leftX - 239)} 0)`);
    }

    updateSubBannerSize(leftX, rightX);
}

function updateSubBannerSize(leftX, rightX) {
    const subLeft = leftX + 55;
    const subRight = rightX - 50;

    const outerPath = `M ${subLeft + 42} 270 L ${subRight + 28} 270 C ${subRight + 38} 270 ${subRight + 43} 279 ${subRight + 36} 288 L ${subRight - 7} 329 C ${subRight - 13} 335 ${subRight - 22} 338 ${subRight - 32} 338 L ${subLeft - 39} 338 C ${subLeft - 51} 338 ${subLeft - 56} 329 ${subLeft - 49} 320 L ${subLeft - 16} 279 C ${subLeft - 11} 273 ${subLeft - 6} 270 ${subLeft + 42} 270 Z`;
    const innerPath = `M ${subLeft + 46} 273 L ${subRight + 23} 273 C ${subRight + 31} 273 ${subRight + 35} 280 ${subRight + 30} 287 L ${subRight - 11} 325 C ${subRight - 16} 330 ${subRight - 23} 333 ${subRight - 31} 333 L ${subLeft - 32} 333 C ${subLeft - 41} 333 ${subLeft - 45} 326 ${subLeft - 40} 319 L ${subLeft - 10} 281 C ${subLeft - 6} 276 ${subLeft - 1} 273 ${subLeft + 46} 273 Z`;

    document.getElementById('subOuterPath')?.setAttribute('d', outerPath);
    document.getElementById('subInnerPath')?.setAttribute('d', innerPath);
    document.getElementById('subInnerClipPath')?.setAttribute('d', innerPath);

    ['lightSub', 'lightSubCore'].forEach(id => {
        document.getElementById(id)?.setAttribute('d', innerPath);
    });

    centerTextWithinShape('subTitleText', 'subInnerPath');

    const divider = document.getElementById('subDivider');
    if (divider) {
        divider.setAttribute('x1', subLeft + 145);
        divider.setAttribute('x2', subLeft + 135);
    }

    const computer = document.getElementById('computerIconArea');
    if (computer) computer.setAttribute('transform', `translate(${subLeft + 20} 281)`);

    const accentOne = document.getElementById('subAccentOne');
    const accentTwo = document.getElementById('subAccentTwo');
    if (accentOne) {
        accentOne.setAttribute('points', `${subRight - 126},280 ${subRight - 92},280 ${subRight - 128},326 ${subRight - 162},326`);
    }
    if (accentTwo) {
        accentTwo.setAttribute('points', `${subRight - 78},280 ${subRight - 44},280 ${subRight - 80},326 ${subRight - 114},326`);
    }
}

function appendTemplatePreviewNode(svg, tagName, attributes, textContent) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (textContent) element.textContent = textContent;
    svg.appendChild(element);
}

function createTemplatePreview(colors) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 220 84');
    svg.setAttribute('aria-hidden', 'true');
    appendTemplatePreviewNode(svg, 'rect', { x: 0, y: 0, width: 220, height: 84, rx: 9, fill: '#111827' });
    appendTemplatePreviewNode(svg, 'path', {
        d: 'M 34 12 H 198 L 178 47 H 17 Z',
        fill: colors.mainFill,
        stroke: colors.mainOuter,
        'stroke-width': 3
    });
    appendTemplatePreviewNode(svg, 'path', {
        d: 'M 39 18 H 188',
        stroke: colors.mainNeonOne,
        'stroke-width': 2,
        'stroke-linecap': 'round',
        opacity: 0.85
    });
    appendTemplatePreviewNode(svg, 'text', {
        x: 112,
        y: 39,
        'text-anchor': 'middle',
        fill: colors.nameText,
        'font-family': "'Montserrat', sans-serif",
        'font-size': 16,
        'font-weight': 800
    }, 'NAMA ANDA');
    appendTemplatePreviewNode(svg, 'path', {
        d: 'M 48 48 H 182 L 167 73 H 31 Z',
        fill: colors.subFill,
        stroke: colors.subFrame,
        'stroke-width': 2
    });
    appendTemplatePreviewNode(svg, 'circle', { cx: 53, cy: 60, r: 5, fill: colors.icon });
    appendTemplatePreviewNode(svg, 'text', {
        x: 111,
        y: 64,
        'text-anchor': 'middle',
        fill: colors.subText,
        'font-family': "'Montserrat', sans-serif",
        'font-size': 8,
        'font-weight': 700
    }, 'JABATAN');
    return svg;
}

function renderTemplateGallery(templates, selectedTemplate) {
    const gallery = document.getElementById('templateGallery');
    if (!gallery) return;

    if (gallery.dataset.initialized !== 'true') {
        Object.keys(TEMPLATE_LABELS).forEach(template => {
            if (!templates[template]) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'template-card';
            button.dataset.template = template;
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('aria-label', `Pilih tema ${TEMPLATE_LABELS[template]}`);
            button.title = TEMPLATE_LABELS[template];
            button.appendChild(createTemplatePreview(templates[template]));

            const label = document.createElement('span');
            label.className = 'template-card-label';
            label.textContent = TEMPLATE_LABELS[template];
            button.appendChild(label);
            button.addEventListener('click', () => setNameTemplate(template));
            gallery.appendChild(button);
        });
        gallery.dataset.initialized = 'true';
    }

    gallery.querySelectorAll('.template-card').forEach(button => {
        const isSelected = button.dataset.template === selectedTemplate;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
    });
}

function setNameTemplate(template) {
    const templates = {
        ocean: {
            mainFill: '#0353a4', mainOuter: '#38bdf8', mainRim: '#e0f2fe', nameText: '#ffffff',
            mainNeonOne: '#00f0ff', mainNeonTwo: '#38bdf8', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#e0f2fe',
            subFill: '#e0f2fe', subFrame: '#0552c2', subText: '#00235b',
            subNeon: '#00f0ff', subNeonCore: '#ffffff', icon: '#00235b', laptopScreen: '#e0f2fe', laptopBase: '#cbd5e1', subDivider: '#00235b',
            leftAccentOne: '#0ea5e9', leftAccentTwo: '#0245a3', leftAccentThree: '#ffffff', leftAccentFour: '#0ea5e9',
            rightAccentOne: '#0245a3', rightAccentTwo: '#0284c7'
        },
        silver: {
            mainFill: '#64748b', mainOuter: '#cbd5e1', mainRim: '#f8fafc', nameText: '#ffffff',
            mainNeonOne: '#e2e8f0', mainNeonTwo: '#94a3b8', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#cbd5e1',
            subFill: '#f1f5f9', subFrame: '#475569', subText: '#0f172a',
            subNeon: '#94a3b8', subNeonCore: '#ffffff', icon: '#334155', laptopScreen: '#f1f5f9', laptopBase: '#cbd5e1', subDivider: '#334155',
            leftAccentOne: '#94a3b8', leftAccentTwo: '#475569', leftAccentThree: '#ffffff', leftAccentFour: '#cbd5e1',
            rightAccentOne: '#475569', rightAccentTwo: '#94a3b8'
        },
        midnight: {
            mainFill: '#020617', mainOuter: '#1d4ed8', mainRim: '#60a5fa', nameText: '#ffffff',
            mainNeonOne: '#38bdf8', mainNeonTwo: '#1d4ed8', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#bfdbfe',
            subFill: '#1e293b', subFrame: '#1d4ed8', subText: '#e2e8f0',
            subNeon: '#60a5fa', subNeonCore: '#ffffff', icon: '#bfdbfe', laptopScreen: '#cbd5e1', laptopBase: '#64748b', subDivider: '#bfdbfe',
            leftAccentOne: '#1d4ed8', leftAccentTwo: '#020617', leftAccentThree: '#ffffff', leftAccentFour: '#3b82f6',
            rightAccentOne: '#1d4ed8', rightAccentTwo: '#3b82f6'
        },
        cyan: {
            mainFill: '#0891b2', mainOuter: '#67e8f9', mainRim: '#cffafe', nameText: '#ffffff',
            mainNeonOne: '#a5f3fc', mainNeonTwo: '#22d3ee', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#cffafe',
            subFill: '#cffafe', subFrame: '#0891b2', subText: '#164e63',
            subNeon: '#22d3ee', subNeonCore: '#ffffff', icon: '#155e75', laptopScreen: '#cffafe', laptopBase: '#67e8f9', subDivider: '#155e75',
            leftAccentOne: '#06b6d4', leftAccentTwo: '#0891b2', leftAccentThree: '#ffffff', leftAccentFour: '#22d3ee',
            rightAccentOne: '#0891b2', rightAccentTwo: '#06b6d4'
        },
        corporate: {
            mainFill: '#0b1f3a', mainOuter: '#c5a15d', mainRim: '#f8fafc', nameText: '#ffffff',
            mainNeonOne: '#c5a15d', mainNeonTwo: '#e6c980', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#f8e9be',
            subFill: '#f8fafc', subFrame: '#203a5b', subText: '#102a43',
            subNeon: '#c5a15d', subNeonCore: '#fff8e7', icon: '#102a43', laptopScreen: '#e0f2fe', laptopBase: '#cbd5e1', subDivider: '#102a43',
            leftAccentOne: '#c5a15d', leftAccentTwo: '#102a43', leftAccentThree: '#ffffff', leftAccentFour: '#1e3a8a',
            rightAccentOne: '#102a43', rightAccentTwo: '#c5a15d'
        },
        charcoal: {
            mainFill: '#1f2937', mainOuter: '#94a3b8', mainRim: '#f8fafc', nameText: '#ffffff',
            mainNeonOne: '#cbd5e1', mainNeonTwo: '#64748b', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#e2e8f0',
            subFill: '#f1f5f9', subFrame: '#475569', subText: '#1e293b',
            subNeon: '#94a3b8', subNeonCore: '#ffffff', icon: '#334155', laptopScreen: '#e2e8f0', laptopBase: '#cbd5e1', subDivider: '#334155',
            leftAccentOne: '#94a3b8', leftAccentTwo: '#334155', leftAccentThree: '#ffffff', leftAccentFour: '#64748b',
            rightAccentOne: '#334155', rightAccentTwo: '#94a3b8'
        },
        emerald: {
            mainFill: '#064e3b', mainOuter: '#34d399', mainRim: '#ecfdf5', nameText: '#ffffff',
            mainNeonOne: '#34d399', mainNeonTwo: '#10b981', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#d1fae5',
            subFill: '#ecfdf5', subFrame: '#047857', subText: '#064e3b',
            subNeon: '#34d399', subNeonCore: '#ffffff', icon: '#065f46', laptopScreen: '#d1fae5', laptopBase: '#a7f3d0', subDivider: '#065f46',
            leftAccentOne: '#34d399', leftAccentTwo: '#065f46', leftAccentThree: '#ffffff', leftAccentFour: '#059669',
            rightAccentOne: '#065f46', rightAccentTwo: '#10b981'
        },
        burgundy: {
            mainFill: '#4c0519', mainOuter: '#fb7185', mainRim: '#fff1f2', nameText: '#ffffff',
            mainNeonOne: '#fb7185', mainNeonTwo: '#e11d48', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#ffe4e6',
            subFill: '#fff1f2', subFrame: '#9f1239', subText: '#4c0519',
            subNeon: '#fb7185', subNeonCore: '#ffffff', icon: '#881337', laptopScreen: '#ffe4e6', laptopBase: '#fecdd3', subDivider: '#881337',
            leftAccentOne: '#fb7185', leftAccentTwo: '#4c0519', leftAccentThree: '#ffffff', leftAccentFour: '#be123c',
            rightAccentOne: '#4c0519', rightAccentTwo: '#e11d48'
        },
        royal: {
            mainFill: '#172554', mainOuter: '#fbbf24', mainRim: '#eff6ff', nameText: '#ffffff',
            mainNeonOne: '#fbbf24', mainNeonTwo: '#60a5fa', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#dbeafe',
            subFill: '#eff6ff', subFrame: '#1e40af', subText: '#172554',
            subNeon: '#fbbf24', subNeonCore: '#ffffff', icon: '#1e3a8a', laptopScreen: '#dbeafe', laptopBase: '#bfdbfe', subDivider: '#1e3a8a',
            leftAccentOne: '#60a5fa', leftAccentTwo: '#172554', leftAccentThree: '#ffffff', leftAccentFour: '#fbbf24',
            rightAccentOne: '#172554', rightAccentTwo: '#fbbf24'
        },
        graphiteGold: {
            mainFill: '#111827', mainOuter: '#d6ad60', mainRim: '#fffbeb', nameText: '#ffffff',
            mainNeonOne: '#d6ad60', mainNeonTwo: '#f0d48b', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#fff3d4',
            subFill: '#f8fafc', subFrame: '#374151', subText: '#111827',
            subNeon: '#d6ad60', subNeonCore: '#fff8e7', icon: '#1f2937', laptopScreen: '#e5e7eb', laptopBase: '#9ca3af', subDivider: '#1f2937',
            leftAccentOne: '#d6ad60', leftAccentTwo: '#1f2937', leftAccentThree: '#ffffff', leftAccentFour: '#4b5563',
            rightAccentOne: '#1f2937', rightAccentTwo: '#d6ad60'
        },
        arctic: {
            mainFill: '#0c4a6e', mainOuter: '#38bdf8', mainRim: '#ecfeff', nameText: '#ffffff',
            mainNeonOne: '#67e8f9', mainNeonTwo: '#38bdf8', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#cffafe',
            subFill: '#f0f9ff', subFrame: '#0284c7', subText: '#0c4a6e',
            subNeon: '#22d3ee', subNeonCore: '#ffffff', icon: '#075985', laptopScreen: '#e0f2fe', laptopBase: '#bae6fd', subDivider: '#075985',
            leftAccentOne: '#38bdf8', leftAccentTwo: '#075985', leftAccentThree: '#ffffff', leftAccentFour: '#0284c7',
            rightAccentOne: '#075985', rightAccentTwo: '#38bdf8'
        },
        violet: {
            mainFill: '#2e1065', mainOuter: '#a78bfa', mainRim: '#f5f3ff', nameText: '#ffffff',
            mainNeonOne: '#c4b5fd', mainNeonTwo: '#8b5cf6', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#ede9fe',
            subFill: '#faf5ff', subFrame: '#6d28d9', subText: '#2e1065',
            subNeon: '#a78bfa', subNeonCore: '#ffffff', icon: '#4c1d95', laptopScreen: '#ede9fe', laptopBase: '#ddd6fe', subDivider: '#4c1d95',
            leftAccentOne: '#a78bfa', leftAccentTwo: '#4c1d95', leftAccentThree: '#ffffff', leftAccentFour: '#7c3aed',
            rightAccentOne: '#4c1d95', rightAccentTwo: '#a78bfa'
        },
        teal: {
            mainFill: '#042f2e', mainOuter: '#2dd4bf', mainRim: '#ccfbf1', nameText: '#ffffff',
            mainNeonOne: '#5eead4', mainNeonTwo: '#14b8a6', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#ccfbf1',
            subFill: '#f0fdfa', subFrame: '#0f766e', subText: '#134e4a',
            subNeon: '#2dd4bf', subNeonCore: '#ffffff', icon: '#115e59', laptopScreen: '#ccfbf1', laptopBase: '#99f6e4', subDivider: '#115e59',
            leftAccentOne: '#2dd4bf', leftAccentTwo: '#115e59', leftAccentThree: '#ffffff', leftAccentFour: '#0f766e',
            rightAccentOne: '#115e59', rightAccentTwo: '#14b8a6'
        },
        copper: {
            mainFill: '#431407', mainOuter: '#fb923c', mainRim: '#fff7ed', nameText: '#ffffff',
            mainNeonOne: '#fb923c', mainNeonTwo: '#f97316', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#ffedd5',
            subFill: '#fff7ed', subFrame: '#9a3412', subText: '#431407',
            subNeon: '#fb923c', subNeonCore: '#ffffff', icon: '#7c2d12', laptopScreen: '#ffedd5', laptopBase: '#fed7aa', subDivider: '#7c2d12',
            leftAccentOne: '#fb923c', leftAccentTwo: '#7c2d12', leftAccentThree: '#ffffff', leftAccentFour: '#c2410c',
            rightAccentOne: '#7c2d12', rightAccentTwo: '#f97316'
        },
        crimson: {
            mainFill: '#1f2937', mainOuter: '#f87171', mainRim: '#fff1f2', nameText: '#ffffff',
            mainNeonOne: '#f87171', mainNeonTwo: '#ef4444', mainNeonCore: '#ffffff', mainNeonCoreTwo: '#ffe4e6',
            subFill: '#fff1f2', subFrame: '#b91c1c', subText: '#7f1d1d',
            subNeon: '#f87171', subNeonCore: '#ffffff', icon: '#7f1d1d', laptopScreen: '#ffe4e6', laptopBase: '#fecaca', subDivider: '#7f1d1d',
            leftAccentOne: '#f87171', leftAccentTwo: '#1f2937', leftAccentThree: '#ffffff', leftAccentFour: '#b91c1c',
            rightAccentOne: '#1f2937', rightAccentTwo: '#ef4444'
        }
    };
    Object.entries(ADDITIONAL_TEMPLATE_THEMES).forEach(([key, variant]) => {
        templates[key] = { ...templates[variant.base], ...variant.colors };
    });
    const selectedTemplate = Object.prototype.hasOwnProperty.call(templates, template) ? template : 'ocean';
    const selected = templates[selectedTemplate];
    renderTemplateGallery(templates, selectedTemplate);
    Object.keys(selected).forEach(key => {
        const input = document.getElementById(`${key}Color`);
        if (input) input.value = selected[key];
        applyDesignColor(key, selected[key]);
    });
    const effectColors = {
        mainHighlight: selected.mainNeonOne,
        mainShimmer: selected.mainNeonTwo,
        textShimmer: selected.nameText,
        subShimmer: selected.subNeonCore,
        textGlow: selected.mainNeonOne,
        textShadow: selected.mainFill,
        flareCore: selected.mainRim,
        flareTint: selected.mainNeonOne,
        stageShadow: '#000000'
    };
    Object.keys(effectColors).forEach(key => {
        const input = document.getElementById(`${key}Color`);
        if (input) input.value = effectColors[key];
        applyEffectColor(key, effectColors[key]);
    });
    if (template === 'ocean') {
        document.getElementById('mainOuterPath')?.setAttribute('fill', 'url(#outerFrameBlue)');
        document.getElementById('mainInnerPath')?.setAttribute('fill', 'url(#mainBlueBg)');
        document.getElementById('subInnerPath')?.setAttribute('fill', 'url(#subSilverBg)');
        document.getElementById('leftAccentOne')?.setAttribute('fill', 'url(#leftStripeBlue)');
        document.getElementById('leftAccentTwo')?.setAttribute('fill', 'url(#leftStripeDark)');
        document.getElementById('leftAccentFour')?.setAttribute('fill', 'url(#leftStripeBlue)');
    }
}

function applyDesignColor(element, color) {
    const setFill = id => document.getElementById(id)?.setAttribute('fill', color);
    const setStroke = id => document.getElementById(id)?.setAttribute('stroke', color);
    const fillTargets = {
        mainFill: ['mainInnerPath'],
        mainOuter: ['mainOuterPath'],
        nameText: ['nameText'],
        subFill: ['subInnerPath'],
        subFrame: ['subOuterPath'],
        subText: ['subTitleText'],
        laptopScreen: ['subLaptopScreen', 'icon-monitor-screen', 'icon-desktop-screen', 'icon-tablet-screen', 'icon-server-screen-one', 'icon-server-screen-two'],
        laptopBase: ['subLaptopBase', 'icon-desktop-tower', 'icon-tablet-body', 'icon-server-body'],
        leftAccentOne: ['leftAccentOne'],
        leftAccentTwo: ['leftAccentTwo'],
        leftAccentThree: ['leftAccentThree'],
        leftAccentFour: ['leftAccentFour'],
        rightAccentOne: ['subAccentOne'],
        rightAccentTwo: ['subAccentTwo']
    };
    const strokeTargets = {
        mainRim: ['mainInnerPath'],
        mainNeonOne: ['lightMain'],
        mainNeonTwo: ['lightMainSec'],
        mainNeonCore: ['lightMainCore'],
        mainNeonCoreTwo: ['lightMainSecCore'],
        subNeon: ['lightSub'],
        subNeonCore: ['lightSubCore'],
        subDivider: ['subDivider']
    };

    if (element === 'icon') {
        const icon = document.getElementById('computerIconArea');
        icon?.setAttribute('stroke', color);
        ['subGearCenter', 'icon-desktop-led', 'icon-tablet-button', 'icon-server-led-one', 'icon-server-led-two'].forEach(id => {
            document.getElementById(id)?.setAttribute('fill', color);
        });
        return;
    }

    (fillTargets[element] || []).forEach(setFill);
    (strokeTargets[element] || []).forEach(setStroke);
}

function colorToRgba(color, alpha) {
    const match = /^#([0-9a-f]{6})$/i.exec(color);
    if (!match) throw new Error(`Warna tidak valid: ${color}`);
    const value = match[1];
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function applyEffectColor(effect, color) {
    const setStopColor = (id, value) => document.getElementById(id)?.setAttribute('stop-color', value);

    if (effect === 'mainHighlight') {
        document.getElementById('mainHighlight')?.setAttribute('fill', color);
    } else if (effect === 'mainShimmer') {
        setStopColor('mainShimmerStop', color);
    } else if (effect === 'textShimmer') {
        setStopColor('textShimmerStop', color);
    } else if (effect === 'subShimmer') {
        setStopColor('subShimmerStop', color);
    } else if (effect === 'textGlow') {
        document.documentElement.style.setProperty('--name-glow-color', colorToRgba(color, 0.65));
    } else if (effect === 'textShadow') {
        document.documentElement.style.setProperty('--name-shadow-color', colorToRgba(color, 0.75));
    } else if (effect === 'flareCore') {
        setStopColor('flareCoreStop', color);
    } else if (effect === 'flareTint') {
        ['flareTintInnerStop', 'flareTintOuterStop', 'flareTintEdgeStop'].forEach(id => setStopColor(id, color));
    } else if (effect === 'stageShadow') {
        document.documentElement.style.setProperty('--stage-shadow-color', colorToRgba(color, 0.45));
    }
}

function showToast(message) {
    const toast = document.getElementById('toastBox');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3400);
}

function setBg(mode) {
    const body = document.body;
    body.classList.remove('bg-checkerboard', 'bg-dark-studio', 'bg-greenscreen');
    const activeButtonId = mode === 'dark' ? 'btn-dark' : mode === 'green' ? 'btn-green' : 'btn-checker';

    document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.classList.remove('bg-sky-600', 'bg-slate-800', 'text-white', 'text-slate-300', 'text-emerald-400');
        btn.classList.add('bg-slate-800', btn.id === 'btn-green' ? 'text-emerald-400' : 'text-slate-300');
        btn.setAttribute('aria-pressed', String(btn.id === activeButtonId));
    });

    if (mode === 'dark') {
        body.classList.add('bg-dark-studio');
        const active = document.getElementById('btn-dark');
        active.classList.remove('bg-slate-800', 'text-slate-300');
        active.classList.add('bg-sky-600', 'text-white');
    } else if (mode === 'green') {
        body.classList.add('bg-greenscreen');
        const active = document.getElementById('btn-green');
        active.classList.remove('bg-slate-800', 'text-emerald-400');
        active.classList.add('bg-sky-600', 'text-white');
    } else {
        body.classList.add('bg-checkerboard');
        const active = document.getElementById('btn-checker');
        active.classList.remove('bg-slate-800', 'text-slate-300');
        active.classList.add('bg-sky-600', 'text-white');
    }
}

function updateSpeed(val) {
    const num = parseFloat(val) || 3.5;
    document.documentElement.style.setProperty('--speed', `${num}s`);
    const label = document.getElementById('speedLabel');
    if (label) label.textContent = `${num.toFixed(1).replace('.', ',')} dtk`;
}

function applyProfessionalDefaults(showNotification) {
    const exportButtons = ['recordBtn', 'recordGifBtn', 'exportPngBtn']
        .map(id => document.getElementById(id));
    if (exportButtons.some(button => button && button.disabled)) {
        showToast('Tunggu hingga proses ekspor selesai sebelum memulihkan setelan.');
        return;
    }

    const nameInput = document.getElementById('nameInput');
    const subtitleInput = document.getElementById('subTitleInput');
    const nameFont = document.getElementById('nameFont');
    const subtitleFont = document.getElementById('subTitleFont');
    const nameText = document.getElementById('nameText');
    const subtitleText = document.getElementById('subTitleText');
    const nameFontOption = TEXT_FONT_OPTIONS_BY_VALUE.get(PROFESSIONAL_DEFAULTS.nameFont);
    const subtitleFontOption = TEXT_FONT_OPTIONS_BY_VALUE.get(PROFESSIONAL_DEFAULTS.subtitleFont);

    nameInput.value = PROFESSIONAL_DEFAULTS.name;
    subtitleInput.value = PROFESSIONAL_DEFAULTS.subtitle;
    nameFont.value = PROFESSIONAL_DEFAULTS.nameFont;
    subtitleFont.value = PROFESSIONAL_DEFAULTS.subtitleFont;
    nameText.setAttribute('font-family', nameFontOption.family);
    nameText.dataset.fontOption = PROFESSIONAL_DEFAULTS.nameFont;
    subtitleText.setAttribute('font-family', subtitleFontOption.family);
    subtitleText.dataset.fontOption = PROFESSIONAL_DEFAULTS.subtitleFont;
    updateName(PROFESSIONAL_DEFAULTS.name);
    updateSubTitle(PROFESSIONAL_DEFAULTS.subtitle);

    document.getElementById('computerModel').value = PROFESSIONAL_DEFAULTS.computerModel;
    setComputerModel(PROFESSIONAL_DEFAULTS.computerModel);
    setNameTemplate(PROFESSIONAL_DEFAULTS.template);
    setBg(PROFESSIONAL_DEFAULTS.background);

    const speedRange = document.getElementById('speedRange');
    speedRange.value = PROFESSIONAL_DEFAULTS.speed;
    updateSpeed(PROFESSIONAL_DEFAULTS.speed);
    setZoom(PROFESSIONAL_DEFAULTS.zoom);
    if (animationsPaused) toggleAnimationPlayback();

    document.querySelectorAll('.editor-accordion').forEach(accordion => {
        accordion.open = false;
    });
    const gallery = document.getElementById('templateGallery');
    if (gallery) gallery.scrollTop = 0;
    const sidebar = document.getElementById('controlBar');
    if (sidebar) sidebar.scrollTop = 0;

    if (showNotification !== false) showToast('Semua fitur dikembalikan ke preset profesional.');
}

function toggleControls(e) {
    if (e) e.stopPropagation();
    const bar = document.getElementById('controlBar');
    if (!bar) return;
    bar.classList.add('panel-hidden');
    document.body.classList.add('editor-hidden');
    showToast('Panel editor disembunyikan. Klik area pratinjau untuk menampilkannya kembali.');
}

document.addEventListener('click', (e) => {
    const bar = document.getElementById('controlBar');
    if (bar && bar.classList.contains('panel-hidden') && !bar.contains(e.target)) {
        bar.classList.remove('panel-hidden');
        document.body.classList.remove('editor-hidden');
    }
});

async function recordVideo() {
    const btn = document.getElementById('recordBtn');
    const gifBtn = document.getElementById('recordGifBtn');
    const pauseBtn = document.getElementById('pauseAnimationBtn');
    const dot = document.getElementById('recordDot');
    const text = document.getElementById('recordText');
    const svgElement = document.getElementById('lowerThirdSvg');

    if (!btn || btn.disabled) return;

    if (document.visibilityState !== 'visible') {
        showToast('Aktifkan halaman ini agar proses ekspor video berjalan stabil.');
        return;
    }

    if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
        showToast('Browser ini belum mendukung perekaman video.');
        return;
    }

    const isGreenScreen = document.body.classList.contains('bg-greenscreen');
    const isDark = document.body.classList.contains('bg-dark-studio');
    const isTransparentBackground = !isGreenScreen && !isDark;
    const speedControl = document.getElementById('speedRange');
    const speedControlWasDisabled = Boolean(speedControl?.disabled);
    let visibilityHandler = null;
    const resetButton = () => {
        btn.disabled = false;
        if (gifBtn) gifBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = false;
        dot?.classList.remove('bg-red-500', 'animate-ping');
        dot?.classList.add('bg-white');
        if (text) text.textContent = 'Ekspor video (10 detik)';
        if (speedControl) speedControl.disabled = speedControlWasDisabled;
        if (animationTimeline) {
            animationTimeline.restore();
            animationTimeline = null;
        }
        if (visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler);
            visibilityHandler = null;
        }
    };

    let stream = null;
    let recording = false;
    let recorderStarted = false;
    let frameTimer = null;
    let stopTimer = null;
    let hardStopTimer = null;
    let stopRequested = false;
    let recordingStartedAt = 0;
    let recordingError = null;
    let animationTimeline = null;

    const stopTracks = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
    };

    const clearTimers = () => {
        if (frameTimer !== null) clearTimeout(frameTimer);
        if (stopTimer !== null) clearTimeout(stopTimer);
        if (hardStopTimer !== null) clearTimeout(hardStopTimer);
    };

    try {
        btn.disabled = true;
        if (gifBtn) gifBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;
        if (speedControl) speedControl.disabled = true;
        dot?.classList.remove('bg-white');
        dot?.classList.add('bg-red-500', 'animate-ping');
        if (text) text.textContent = 'Menyiapkan video...';

        const canvas = document.createElement('canvas');
        canvas.width = 2560;
        canvas.height = 920;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context tidak tersedia');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const supportedTypes = isTransparentBackground
            ? ['video/webm;codecs=vp9', 'video/webm;codecs=vp8']
            : [
                'video/mp4;codecs=avc1.640033',
                'video/mp4',
                'video/webm;codecs=vp8',
                'video/webm;codecs=vp9',
                'video/webm'
            ];
        const mimeType = typeof MediaRecorder.isTypeSupported === 'function'
            ? supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || ''
            : '';
        if (isTransparentBackground && !mimeType) {
            resetButton();
            showToast('Browser ini tidak mendukung WebM transparan. Pilih Layar Hijau atau ekspor PNG transparan.');
            return;
        }

        const targetFps = 60;
        let manualFrameCapture = false;
        try {
            stream = canvas.captureStream(0);
            const captureTrack = stream.getVideoTracks()[0];
            manualFrameCapture = Boolean(captureTrack && typeof captureTrack.requestFrame === 'function');
            if (!manualFrameCapture) {
                stopTracks();
                stream = canvas.captureStream(targetFps);
            }
        } catch (err) {
            manualFrameCapture = false;
            stream = canvas.captureStream(targetFps);
        }
        if (!stream.getVideoTracks().length) throw new Error('Track video canvas tidak tersedia');

        const recorderOptions = {
            videoBitsPerSecond: 50000000,
            ...(mimeType ? { mimeType } : {})
        };
        const recorder = new MediaRecorder(stream, recorderOptions);
        const outputMimeType = recorder.mimeType || mimeType || 'video/webm';
        const fileExt = outputMimeType.includes('mp4') ? 'mp4' : 'webm';
        const codecTag = outputMimeType.includes('vp9')
            ? 'VP9'
            : outputMimeType.includes('vp8')
                ? 'VP8'
                : fileExt === 'mp4' ? 'H264' : 'WEBM';
        const chunks = [];

        const stopRecording = () => {
            if (!recording) return;
            recording = false;
            clearTimers();
            if (recorder.state !== 'inactive') recorder.stop();
            else {
                stopTracks();
                resetButton();
                if (recordingError) showToast(`Perekaman gagal: ${recordingError.message}`);
            }
        };

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            stopTracks();
            resetButton();
            if (recordingError) {
                showToast(`Perekaman gagal: ${recordingError.message}`);
                return;
            }

            try {
                if (chunks.length === 0) throw new Error('Data video kosong');
                const blob = new Blob(chunks, { type: outputMimeType });
                if (blob.size === 0) throw new Error('Data video kosong');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const safeName = (document.getElementById('nameText')?.textContent || 'Lower_Third')
                    .trim()
                    .replace(/[^a-z0-9]+/gi, '_')
                    .replace(/^_+|_+$/g, '') || 'Lower_Third';
                const backgroundTag = isTransparentBackground ? 'ALPHA' : isGreenScreen ? 'GREEN' : 'DARK';
                a.download = `${safeName}_HD_2K_${backgroundTag}_${codecTag}.${fileExt}`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 1000);

                const transparencyNote = isTransparentBackground
                    ? ' Gunakan pemutar/editor yang mendukung alpha untuk melihat transparansi.'
                    : '';
                showToast(`Video berhasil diekspor (${fileExt.toUpperCase()}, 2560 × 920, hingga ${targetFps} FPS, 10 detik).${transparencyNote}`);
            } catch (err) {
                showToast(`Gagal menyimpan video: ${err.message || 'kesalahan tidak diketahui'}`);
            }
        };

        recorder.onerror = (event) => {
            recordingError = event.error || new Error('Kesalahan MediaRecorder');
            recording = false;
            clearTimers();
            stopTracks();
            resetButton();
            showToast(`Perekaman gagal: ${recordingError.message}`);
        };

        const buildFrameSvgString = createExportSvgFrameBuilder(
            svgElement,
            canvas.width,
            canvas.height,
            await getMontserratExportFontCss()
        );

        const recordDurationMs = 10000;
        const frameIntervalMs = 1000 / targetFps;
        const image = new Image();
        image.decoding = 'async';
        if (document.fonts?.ready) await document.fonts.ready;

        const drawFrame = async elapsedMs => {
            animationTimeline?.seek(elapsedMs);
            const frameBlob = new Blob([buildFrameSvgString()], { type: 'image/svg+xml;charset=utf-8' });
            const frameUrl = URL.createObjectURL(frameBlob);
            try {
                await new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = () => reject(new Error('Gagal merender frame SVG'));
                    image.src = frameUrl;
                });
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (isGreenScreen) {
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (isDark) {
                    ctx.fillStyle = '#020617';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            } finally {
                URL.revokeObjectURL(frameUrl);
            }
        };

        const captureNextFrame = async () => {
            if (!recording) return;
            const frameStartedAt = performance.now();
            try {
                await drawFrame(recordingStartedAt ? performance.now() - recordingStartedAt : 0);
                if (!recording) return;
                if (!recorderStarted) {
                    recorder.start();
                    recorderStarted = true;
                    recordingStartedAt = performance.now();
                    stopTimer = setTimeout(() => { stopRequested = true; }, recordDurationMs);
                    hardStopTimer = setTimeout(stopRecording, recordDurationMs + 1000);
                    showToast(`Merekam video, target ${targetFps} FPS...`);
                }
                if (manualFrameCapture) stream.getVideoTracks()[0].requestFrame();
                if (stopRequested || performance.now() - recordingStartedAt >= recordDurationMs) {
                    stopRecording();
                    return;
                }
                const renderTimeMs = performance.now() - frameStartedAt;
                frameTimer = setTimeout(captureNextFrame, Math.max(0, frameIntervalMs - renderTimeMs));
            } catch (err) {
                recordingError = err;
                stopRecording();
            }
        };

        visibilityHandler = () => {
            if (document.visibilityState === 'hidden' && recording) {
                recordingError = new Error('Halaman tidak aktif; rekaman dihentikan agar hasil tidak patah-patah.');
                stopRecording();
            }
        };
        document.addEventListener('visibilitychange', visibilityHandler);
        animationTimeline = createAnimationTimeline();
        recording = true;
        captureNextFrame();

    } catch (err) {
        recording = false;
        clearTimers();
        stopTracks();
        resetButton();
        showToast(`Gagal merekam otomatis: ${err.message || 'kesalahan tidak diketahui'}`);
    }
}

async function recordGif() {
    const btn = document.getElementById('recordGifBtn');
    const videoBtn = document.getElementById('recordBtn');
    const pauseBtn = document.getElementById('pauseAnimationBtn');
    const text = document.getElementById('recordGifText');
    const svgElement = document.getElementById('lowerThirdSvg');
    const speedControl = document.getElementById('speedRange');

    if (!btn || btn.disabled || !svgElement) return;
    if (document.visibilityState !== 'visible') {
        showToast('Aktifkan halaman ini agar animasi pada GIF sesuai dengan pratinjau.');
        return;
    }

    const isGreenScreen = document.body.classList.contains('bg-greenscreen');
    const isDark = document.body.classList.contains('bg-dark-studio');
    const isTransparentBackground = !isGreenScreen && !isDark;
    const speedControlWasDisabled = Boolean(speedControl?.disabled);
    let visibilityHandler = null;
    let recordingError = null;
    let animationTimeline = null;
    const resetButtons = () => {
        btn.disabled = false;
        if (videoBtn) videoBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = false;
        if (speedControl) speedControl.disabled = speedControlWasDisabled;
        if (text) text.textContent = 'Ekspor GIF (10 detik)';
        if (animationTimeline) {
            animationTimeline.restore();
            animationTimeline = null;
        }
        if (visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler);
            visibilityHandler = null;
        }
    };

    try {
        btn.disabled = true;
        if (videoBtn) videoBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;
        if (speedControl) speedControl.disabled = true;
        if (text) text.textContent = 'Menyiapkan GIF...';

        const { GIFEncoder, quantize, applyPalette } = await loadGifEncoder();
        if (!GIFEncoder || !quantize || !applyPalette) throw new Error('Encoder GIF tidak lengkap');
        const width = 1920;
        const height = 690;
        const frameRate = 20;
        const frameDelay = 1000 / frameRate;
        const durationMs = 10000;
        const frameCount = Math.round(durationMs / frameDelay);
        const pixelFormat = isTransparentBackground ? 'rgba4444' : 'rgb565';
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas GIF tidak tersedia');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const buildFrameSvgString = createExportSvgFrameBuilder(
            svgElement,
            width,
            height,
            await getMontserratExportFontCss()
        );
        const image = new Image();
        image.decoding = 'async';
        if (document.fonts?.ready) await document.fonts.ready;

        const drawFrame = async elapsedMs => {
            animationTimeline?.seek(elapsedMs);
            const frameBlob = new Blob([buildFrameSvgString()], { type: 'image/svg+xml;charset=utf-8' });
            const frameUrl = URL.createObjectURL(frameBlob);
            try {
                await new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = () => reject(new Error('Gagal merender frame GIF'));
                    image.src = frameUrl;
                });
                ctx.clearRect(0, 0, width, height);
                if (isGreenScreen) {
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(0, 0, width, height);
                } else if (isDark) {
                    ctx.fillStyle = '#020617';
                    ctx.fillRect(0, 0, width, height);
                }
                ctx.drawImage(image, 0, 0, width, height);
                return ctx.getImageData(0, 0, width, height).data;
            } finally {
                URL.revokeObjectURL(frameUrl);
            }
        };

        visibilityHandler = () => {
            if (document.visibilityState === 'hidden') {
                recordingError = new Error('Halaman tidak aktif; proses GIF dihentikan agar animasi tidak berubah.');
            }
        };
        document.addEventListener('visibilitychange', visibilityHandler);

        animationTimeline = createAnimationTimeline();
        const gif = GIFEncoder();
        const captureStartedAt = performance.now();
        let palette = null;
        let rgbPalette = null;
        let transparentIndex = -1;

        for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
            if (recordingError) throw recordingError;
            if (frameIndex > 0) {
                const nextFrameAt = captureStartedAt + frameIndex * frameDelay;
                await new Promise(resolve => setTimeout(resolve, Math.max(0, nextFrameAt - performance.now())));
            }
            if (recordingError) throw recordingError;

            const pixels = await drawFrame(frameIndex * frameDelay);
            if (!palette) {
                const quantizedPalette = quantize(pixels, 256, {
                    format: pixelFormat,
                    oneBitAlpha: isTransparentBackground,
                    clearAlpha: isTransparentBackground,
                    clearAlphaThreshold: 0,
                    clearAlphaColor: 0
                });
                transparentIndex = isTransparentBackground
                    ? quantizedPalette.findIndex(color => color[3] === 0)
                    : -1;
                if (isTransparentBackground && transparentIndex < 0) {
                    throw new Error('Palet GIF tidak dapat mempertahankan transparansi');
                }
                palette = isTransparentBackground && transparentIndex !== 0
                    ? [quantizedPalette[transparentIndex], ...quantizedPalette.filter((_, index) => index !== transparentIndex)]
                    : quantizedPalette;
                transparentIndex = isTransparentBackground ? 0 : -1;
                rgbPalette = palette.map(color => color.slice(0, 3));
            }

            const indexedPixels = applyPalette(pixels, palette, pixelFormat);
            gif.writeFrame(indexedPixels, width, height, {
                ...(frameIndex === 0 ? { palette: rgbPalette, repeat: 0 } : {}),
                delay: frameDelay,
                transparent: isTransparentBackground,
                ...(isTransparentBackground ? { transparentIndex, dispose: 2 } : {})
            });
            if (frameIndex % 10 === 0 && text) {
                text.textContent = `Menyusun GIF ${Math.round((frameIndex + 1) / frameCount * 100)}%`;
            }
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (recordingError) throw recordingError;
        if (text) text.textContent = 'Menyimpan GIF...';
        gif.finish();
        const blob = new Blob([gif.bytes()], { type: 'image/gif' });
        if (!blob.size) throw new Error('Data GIF kosong');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const safeName = (document.getElementById('nameText')?.textContent || 'Lower_Third')
            .trim()
            .replace(/[^a-z0-9]+/gi, '_')
            .replace(/^_+|_+$/g, '') || 'Lower_Third';
        const backgroundTag = isTransparentBackground ? 'ALPHA' : isGreenScreen ? 'GREEN' : 'DARK';
        a.download = `${safeName}_GIF_10S_1920x690_${backgroundTag}.gif`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1000);

        const transparencyNote = isTransparentBackground
            ? ' GIF hanya mendukung transparansi 1-bit; untuk glow halus gunakan video WebM VP9.'
            : '';
        showToast(`GIF berhasil diekspor (1920 × 690, 20 FPS, 10 detik, 256 warna).${transparencyNote}`);
    } catch (error) {
        showToast(`Gagal membuat GIF: ${error.message || 'kesalahan tidak diketahui'}`);
    } finally {
        resetButtons();
    }
}

async function exportPng() {
    const btn = document.getElementById('exportPngBtn');
    const videoBtn = document.getElementById('recordBtn');
    const gifBtn = document.getElementById('recordGifBtn');
    const pauseBtn = document.getElementById('pauseAnimationBtn');
    const svgElement = document.getElementById('lowerThirdSvg');
    const speedControl = document.getElementById('speedRange');

    if (!btn || btn.disabled || !svgElement) return;

    const isGreenScreen = document.body.classList.contains('bg-greenscreen');
    const isDark = document.body.classList.contains('bg-dark-studio');
    const isTransparentBackground = !isGreenScreen && !isDark;
    const speedControlWasDisabled = Boolean(speedControl?.disabled);
    const originalLabel = btn.textContent;
    let animationTimeline = null;
    const resetButtons = () => {
        btn.disabled = false;
        if (videoBtn) videoBtn.disabled = false;
        if (gifBtn) gifBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = false;
        if (speedControl) speedControl.disabled = speedControlWasDisabled;
        btn.textContent = originalLabel;
        if (animationTimeline) {
            animationTimeline.restore();
            animationTimeline = null;
        }
    };

    try {
        btn.disabled = true;
        if (videoBtn) videoBtn.disabled = true;
        if (gifBtn) gifBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;
        if (speedControl) speedControl.disabled = true;
        btn.textContent = 'Menyiapkan PNG...';

        const width = 2560;
        const height = 920;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas PNG tidak tersedia');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const fontCss = await getMontserratExportFontCss();
        if (document.fonts?.ready) await document.fonts.ready;
        animationTimeline = createAnimationTimeline();
        const buildFrameSvgString = createExportSvgFrameBuilder(svgElement, width, height, fontCss);
        const frameBlob = new Blob([buildFrameSvgString()], { type: 'image/svg+xml;charset=utf-8' });
        const frameUrl = URL.createObjectURL(frameBlob);
        const image = new Image();
        image.decoding = 'async';

        try {
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = () => reject(new Error('Gagal merender gambar PNG'));
                image.src = frameUrl;
            });
        } finally {
            URL.revokeObjectURL(frameUrl);
        }

        ctx.clearRect(0, 0, width, height);
        if (isGreenScreen) {
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(0, 0, width, height);
        } else if (isDark) {
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(image, 0, 0, width, height);

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(result => {
                if (result) resolve(result);
                else reject(new Error('PNG tidak dapat dibuat'));
            }, 'image/png');
        });
        if (!blob.size) throw new Error('Data PNG kosong');

        const safeName = (document.getElementById('nameText')?.textContent || 'Lower_Third')
            .trim()
            .replace(/[^a-z0-9]+/gi, '_')
            .replace(/^_+|_+$/g, '') || 'Lower_Third';
        const backgroundTag = isTransparentBackground ? 'ALPHA' : isGreenScreen ? 'GREEN' : 'DARK';
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = `${safeName}_PNG_2K_${backgroundTag}.png`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);

        showToast(`PNG 2560 × 920 berhasil diekspor.${isTransparentBackground ? ' Transparansi latar dipertahankan.' : ''}`);
    } catch (error) {
        showToast(`Gagal membuat PNG: ${error.message || 'kesalahan tidak diketahui'}`);
    } finally {
        resetButtons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateFontSelectors();
    applyProfessionalDefaults(false);
    if (document.fonts?.ready) {
        document.fonts.ready.then(() => updateBannerLayout());
    }
});