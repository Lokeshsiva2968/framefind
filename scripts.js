// FrameFind — Part 2: fetch and display real images.

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

const emptyTitle = emptyState.querySelector("h3");
const emptyDescription = emptyState.querySelector("p");
const originalEmptyTitle = emptyTitle.textContent;
const originalEmptyDescription = emptyDescription.textContent;

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchInput.focus();
    return;
  }

  results.innerHTML = "";
  emptyState.classList.add("hidden");
  resultCount.textContent = `Searching for "${query}"...`;

  emptyTitle.textContent = originalEmptyTitle;
  emptyDescription.textContent = originalEmptyDescription;

  const url =
    "https://commons.wikimedia.org/w/api.php" +
    "?action=query" +
    "&generator=search" +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    "&gsrnamespace=6" +
    "&gsrlimit=24" +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=600" +
    "&format=json" +
    "&origin=*";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    let renderedCount = 0;

    pages.forEach(function (page) {
      const imageInfo = page.imageinfo?.[0];

      if (!imageInfo || !imageInfo.url) {
        return;
      }

      const card = document.createElement("a");
      card.className = "result-card";
      card.href = imageInfo.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `Open image: ${page.title}`);

      const image = document.createElement("img");
      image.src = imageInfo.thumburl || imageInfo.url;
      image.alt = page.title.replace(/^File:/, "").replace(/_/g, " ");
      image.loading = "lazy";

      const caption = document.createElement("div");
      caption.className = "result-caption";

      const title = document.createElement("p");
      title.className = "result-title";
      title.textContent = page.title
        .replace(/^File:/, "")
        .replace(/_/g, " ");

      caption.appendChild(title);
      card.appendChild(image);
      card.appendChild(caption);
      results.appendChild(card);
      renderedCount++;
    });

    if (renderedCount > 0) {
      resultCount.textContent =
        `Showing ${renderedCount} results for "${query}"`;
      emptyState.classList.add("hidden");
    } else {
      resultCount.textContent = `No results found for "${query}"`;
      emptyTitle.textContent = "No images found.";
      emptyDescription.textContent =
        "Try another topic to discover something new.";
      emptyState.classList.remove("hidden");
    }
  } catch (error) {
    console.error("FrameFind search failed:", error);

    resultCount.textContent = "Search unavailable";
    emptyTitle.textContent = "Couldn't load images.";
    emptyDescription.textContent =
      "Check your internet connection and try another search.";
    emptyState.classList.remove("hidden");
  }
});

document.querySelectorAll(".chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    searchInput.value = chip.textContent.trim();
    searchForm.requestSubmit();
  });
});
