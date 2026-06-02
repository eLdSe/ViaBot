const langCodes = {
    es: "es",
    en: "en",
    de: "de",
    fr: "fr",
    zh: "zh-CN",
    ar: "ar",
    ja: "ja",
    ko: "ko",
    it: "it",
    pt: "pt",
    tr: "tr",
    hi: "hi",
};
const modeTexts = {
    literal:
        "<strong>Дословный</strong> — точная передача смысла и структуры оригинала без отступлений.",
    adapted:
        "<strong>Адаптированный</strong> — естественное звучание с учётом культурного контекста страны.",
    advertising:
        "<strong>Рекламный</strong> — яркий и эмоциональный, максимально привлекательный для туристов.",
};
let selLang = "es",
    selMode = "literal";

document.getElementById("langHeader").addEventListener("click", () => {
    const grid = document.getElementById("langGrid");
    const chev = document.getElementById("chevron");
    const open = grid.classList.contains("open");
    grid.classList.toggle("open", !open);
    chev.classList.toggle("open", !open);
});

document.querySelectorAll(".lang-btn").forEach((b) =>
    b.addEventListener("click", (e) => {
        e.stopPropagation();
        document
            .querySelectorAll(".lang-btn")
            .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        selLang = b.dataset.lang;
        document.getElementById("langBadge").textContent = b.dataset.flag;
        document.getElementById("langName").textContent = b.dataset.name;
        document.getElementById("langGrid").classList.remove("open");
        document.getElementById("chevron").classList.remove("open");
    }),
);

document.querySelectorAll(".mode-btn").forEach((b) =>
    b.addEventListener("click", () => {
        document
            .querySelectorAll(".mode-btn")
            .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        selMode = b.dataset.mode;
        document.getElementById("modeDetail").innerHTML = modeTexts[selMode];
    }),
);

document
    .getElementById("sourceText")
    .addEventListener("input", function () {
        document.getElementById("charCount").textContent =
            this.value.length + " / 2000";
    });

document.getElementById("copyBtn").addEventListener("click", () => {
    const text = document.getElementById("resultText").textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("copyBtn");
        btn.textContent = "✓ Скопировано!";
        setTimeout(() => (btn.textContent = "⎘ Копировать"), 2000);
    });
});

async function googleTranslate(text, tl) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("err");
    const d = await r.json();
    return d[0].map((s) => s[0]).join("");
}

document
    .getElementById("translateBtn")
    .addEventListener("click", async () => {
        const text = document.getElementById("sourceText").value.trim();
        const resultText = document.getElementById("resultText");
        const copyBtn = document.getElementById("copyBtn");
        const btn = document.getElementById("translateBtn");

        if (!text) {
            resultText.textContent = "Пожалуйста, введите текст.";
            resultText.classList.remove("translated");
            copyBtn.style.display = "none";
            return;
        }

        resultText.textContent = "Переводим...";
        resultText.classList.remove("translated");
        copyBtn.style.display = "none";
        btn.disabled = true;

        try {
            const tr = await googleTranslate(text, langCodes[selLang]);
            resultText.textContent = tr || "Перевод не получен.";
            resultText.classList.add("translated");
            copyBtn.style.display = "block";
        } catch (e) {
            resultText.textContent = "Ошибка. Проверьте соединение.";
            resultText.classList.remove("translated");
            copyBtn.style.display = "none";
        }

        btn.disabled = false;
    });
