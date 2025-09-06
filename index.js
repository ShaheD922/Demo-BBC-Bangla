const categoryContainer = document.getElementById("categoryContainer"); 
const newsContainer = document.getElementById("newsContainer");
const bookmarkContainer = document.getElementById("bookmarkContainer");
const bookmarkCount = document.getElementById("bookmarkCount");

let bookmarks = [];

// ---------------- Load Categories ----------------
const loadCategory = () => {
  fetch("https://news-api-fs.vercel.app/api/categories")
    .then(res => res.json())
    .then(data => {
      const categories = data.categories;
      showCategory(categories);

      // Load first category by default
      if (categories.length > 0) {
        loadNewsByCategory(categories[0].id);
      }
    })
    .catch(err => console.log(err));
};

// ---------------- Show Categories ----------------
const showCategory = (categories) => {
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.textContent = cat.title;
    li.className = "hover:border-b-4 hover:border-red-600 cursor-pointer";
    categoryContainer.appendChild(li);
  });

  // Category click event
  categoryContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const allLi = categoryContainer.querySelectorAll("li");
      allLi.forEach(li => li.classList.remove("border-b-4"));
      e.target.classList.add("border-b-4");

      loadNewsByCategory(e.target.id);
    }
  });
};

// ---------------- Load News ----------------
const loadNewsByCategory = (categoryId) => {
  showLoading();
  fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      showNewsByCategory(data.articles);
    })
    .catch(err => console.log(err));
};

// ---------------- Show News ----------------
const showNewsByCategory = (articles) => {
  newsContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = `<p class="text-gray-500 text-center p-4">🚫 No news available.</p>`;
    return;
  }

  articles.forEach(article => {
    const newsDiv = document.createElement("div");
    newsDiv.className = "p-4 border border-gray-300 rounded-lg flex flex-col";

    let imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
    if (article.image && article.image.srcset && article.image.srcset.length > 0) {
      imageUrl = article.image.srcset[article.image.srcset.length - 1].url;
    }

    newsDiv.innerHTML = `
      <div class="mb-2">
        <img src="${imageUrl}" class="w-full rounded-lg"/>
      </div>
      <div id="${article.id}" class="p-2 flex flex-col gap-2">
        <h1 class="text-xl font-bold">${article.title}</h1>
        <p class="text-sm">${article.time || ""}</p>
        <button class="btn btn-sm btn-outline bookmark-btn">Bookmark</button>
      </div>
    `;

    newsContainer.appendChild(newsDiv);
  });

  // Add bookmark button event
  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", handleBookmark);
  });
};

// ---------------- Handle Bookmark ----------------
const handleBookmark = (e) => {
  const parent = e.target.parentNode;
  const title = parent.querySelector("h1").textContent;
  const id = parent.id;

  if (!bookmarks.some(b => b.id === id)) {
    bookmarks.push({ id, title });
    showBookmarks();
  }
};

// ---------------- Show Bookmarks ----------------
const showBookmarks = () => {
  bookmarkContainer.innerHTML = "";

  bookmarks.forEach(bookmark => {
    const div = document.createElement("div");
    div.className = "border my-2 p-2 flex flex-col gap-2";

    div.innerHTML = `
      <h1 class="font-medium">${bookmark.title}</h1>
      <button class="btn btn-xs btn-error delete-btn bg-red-600 text-white" data-id="${bookmark.id}">Delete</button>
    `;

    bookmarkContainer.appendChild(div);
  });

  bookmarkCount.innerText = bookmarks.length;

  // Add delete event
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      handleDeleteBookmark(id);
    });
  });
};

// ---------------- Delete Bookmark ----------------
const handleDeleteBookmark = (bookmarkId) => {
  bookmarks = bookmarks.filter(b => b.id !== bookmarkId);
  showBookmarks();
};

// ---------------- Show Loading ----------------
const showLoading = () => {
  newsContainer.innerHTML = `<div class="bg-red-500 p-3 text-white ">Loading...</div>`;
};

// ---------------- Initialize ----------------
loadCategory();
