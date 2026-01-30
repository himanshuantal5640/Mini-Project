const param = new URLSearchParams(window.location.search);
const query = param.get("q") || "";

const headingEl = document.getElementById("heading");
if (headingEl) {
  headingEl.textContent = query ? `Results for "${query}"` : "Results";
}
