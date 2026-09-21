document.documentElement.classList.add("js");
const filters = document.querySelectorAll("[data-filter]");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const topic = button.dataset.filter;
    filters.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    let visible = 0;
    document.querySelectorAll("[data-topic]").forEach((card) => {
      card.hidden = topic !== "all" && card.dataset.topic !== topic;
      if (!card.hidden) visible++;
    });
    const status = document.querySelector("[data-filter-status]");
    if (status)
      status.textContent = `${visible} ${visible === 1 ? "post" : "posts"} shown`;
  }),
);
