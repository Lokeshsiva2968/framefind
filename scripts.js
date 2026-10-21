
const images = [
  {
    title: "Misty forest",
    category: "Nature",
    tags: ["trees", "woods", "green"],
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    alt: "Sunlight filtering through a dense green forest"
  },
  {
    title: "Mountain mornings",
    category: "Nature",
    tags: ["mountains", "landscape", "morning"],
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    alt: "Mountain peaks rising above the clouds"
  },
  {
    title: "Desert light",
    category: "Nature",
    tags: ["desert", "sand", "landscape"],
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80",
    alt: "Warm light falling across desert dunes"
  },
  {
    title: "Modern lines",
    category: "Architecture",
    tags: ["building", "design", "city"],
    src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
    alt: "Geometric lines of a contemporary building"
  },
  {
    title: "Urban geometry",
    category: "Architecture",
    tags: ["building", "facade", "minimalism"],
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    alt: "Sculptural modern architecture against the sky"
  },
  {
    title: "City after dark",
    category: "Street life",
    tags: ["night", "city", "street"],
    src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    alt: "City lights glowing after sunset"
  },
  {
    title: "A quieter space",
    category: "Minimalism",
    tags: ["interior", "calm", "home"],
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    alt: "Simple, sunlit modern living room"
  },
  {
    title: "Soft simplicity",
    category: "Minimalism",
    tags: ["interior", "light", "design"],
    src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
    alt: "Minimal still life in soft natural light"
  }
];

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyDescription = document.querySelector("#empty-description");
const emptyCaption = document.querySelector("#empty-caption");

function renderResults(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = images.filter((image) => {
    const searchableText = [image.title, image.category, ...image.tags]
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  results.replaceChildren();

  matches.forEach((image) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const photo = document.createElement("img");
    photo.src = image.src;
    photo.alt = image.alt;
    photo.loading = "lazy";
    photo.decoding = "async";

    const caption = document.createElement("div");
    caption.className = "result-card-copy";

    const title = document.createElement("h3");
    title.textContent = image.title;

    const category = document.createElement("p");
    category.textContent = image.category;

    caption.append(title, category);
    card.append(photo, caption);
    results.append(card);
  });

  const hasResults = matches.length > 0;
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "image" : "images"} found`;
  emptyState.hidden = hasResults;

  if (!hasResults) {
    emptyTitle.textContent = "No images found.";
    emptyDescription.textContent = "Try another topic, or choose one of the quick searches above.";
    emptyCaption.textContent = "YOUR NEXT IDEA IS JUST A SEARCH AWAY";
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults(searchInput.value);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    searchInput.value = chip.textContent.trim();
    renderResults(searchInput.value);
  });
});
