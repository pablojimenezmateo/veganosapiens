// Original source: https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/

// Helper function to remove only áéíóú so we can search for "atun" and match "atún"
function removeAccents(str) {
  return str
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");
}

function search() {
  // Get all the recipes
  const recipes = document.querySelectorAll(".recipe-list li");

  // Get the search query
  let search_query = removeAccents(
    document.getElementById("search").value.toLowerCase()
  );

  // Loop through the recipes and hide those that don't match the search query
  for (var i = 0; i < recipes.length; i++) {
    let recipeText = removeAccents(recipes[i].innerText.toLowerCase());
    if (recipeText.includes(search_query)) {
      recipes[i].classList.remove("is-hidden");
    } else {
      recipes[i].classList.add("is-hidden");
    }
  }

  // Hide all the categories where all the recipes are hidden
  const categories = document.querySelectorAll(".recipe-list section");

  // If all li's are hidden, hide the section
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].querySelectorAll("li:not(.is-hidden)").length === 0) {
      categories[i].classList.add("is-hidden");
    } else {
      categories[i].classList.remove("is-hidden");
    }
  }
}

// When page loads, check if there's a search query and run the search function
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("search").value) {
    search();
  }

  // Clear button functionality
  document.getElementById("clearSearch").addEventListener("click", function () {
    document.getElementById("search").value = "";
    search();
  });
});
