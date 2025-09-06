// promise -> pending, resolve(success), rejected(error)

const categoryContainer = document.getElementById("categoryContainer");
const newsContainer = document.getElementById("newsContainer");

// Load Categories
const loadCategory = () => {
  fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.categories);
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};
loadCategory();

// Show Categories
const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <li id="${cat.id}" class="hover:border-b-4 hover:border-red-600 cursor-pointer">
        ${cat.title}
      </li>
    `;
  });

  // Add click event on container (event delegation)
  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => li.classList.remove("border-b-4"));

    if (e.target.localName === "li") {
      console.log("Clicked:", e.target.id);
      e.target.classList.add("border-b-4");
      loadNewsByCategory(e.target.id);
    }
  });
};

// Load News by Category
const loadNewsByCategory = (categoryId) => {
  fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      showNewsByCategory(data.articles);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Show News
const showNewsByCategory = (articles) => {
  newsContainer.innerHTML = ""; 
  articles.forEach((article) => {
    newsContainer.innerHTML += `
      <div class="p-4 border-b">
      <div>
      <img src="${article.image.srcset[5].url}"/>
      </div>
        <h1 class="text-xl font-bold">${article.title}</h1>
       
      </div>        
    `;
  });
};
