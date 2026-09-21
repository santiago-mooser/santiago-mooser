document.querySelector("[data-theme]").addEventListener("click", () => {
  const b = document.body;
  const dark =
    b.classList.contains("dark") ||
    (!b.classList.contains("light") && b.classList.contains("archive"));
  b.classList.toggle("dark", !dark);
  b.classList.toggle("light", dark);
  document
    .querySelector("[data-theme]")
    .setAttribute("aria-pressed", String(!dark));
});
