function toggleTheme() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === "light" ? "dark" : "light";
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
    tab.setAttribute("aria-selected", "false");
  });
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
  const selectedTab = document.querySelector(`[onclick="