// Переключение темы
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// Логика управления вкладками
const tabs = document.querySelectorAll("#tabs button");
const tabContent = document.getElementById("tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        switch (tab.dataset.tab) {
            case "constructor":
                tabContent.innerHTML = "<p>Здесь будет конструктор.</p>";
                break;
            case "simulation":
                tabContent.innerHTML = "<p>Здесь будет симуляция.</p>";
                break;
            case "export":
                tabContent.innerHTML = "<p>Здесь будет экспорт данных.</p>";
                break;
            case "examples":
                loadExamples();
                break;
        }
    });
});

// Перетаскивание компонентов
const components = document.querySelectorAll("#components button");
const canvas = document.getElementById("design-canvas");
const ctx = canvas.getContext("2d");

components.forEach(component => {
    component.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("type", component.dataset.type);
    });
});

canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(x - 10, y - 10, 20, 20);
    ctx.fillStyle = "#000";
    ctx.fillText(type, x - 10, y + 20);
});

// Загрузка примеров
async function loadExamples() {
    const response = await fetch('examples.json');
    const examples = await response.json();
    tabContent.innerHTML = examples.map(example => `<button>${example.name}</button>`).join('');
}