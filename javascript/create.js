const selectedTags = document.getElementById("selected-tags");
const genresInput = document.getElementById("genres");
const genresInputContainer = document.querySelector(
    ".input-field-container"
);
const navstack = ["../index.html"];

function addTag(event) {
    if (event.key === "Enter" && event.target.value !== "") {
      const tagText = event.target.value.trim();
      const existingTags = Array.from(
        selectedTags.getElementsByClassName("tag-text")
      ).map((tag) => tag.innerText);
  
      if (!existingTags.includes(tagText)) {
        if (selectedTags.childElementCount < 5) {
          const tag = document.createElement("div");
          tag.classList.add("tag");
          const randomColor = getRandomColor(); // Generate a random color
          tag.style.backgroundColor = randomColor; // Set the background color
          tag.innerHTML = `
            <span class="tag-text">${tagText}</span>
            <span class="tag-remove" onclick="removeTag(event)">x</span>
          `;
          selectedTags.appendChild(tag);
          event.target.value = "";
          updateGenresInput();
        }
      }
    }
  }
  
  function getRandomColor() {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Create the CSS color string
    const color = `rgb(${r}, ${g}, ${b})`;
  
    return color;
  }
  

function removeTag(event) {
    const tag = event.target.parentNode;
    tag.parentNode.removeChild(tag);
    updateGenresInput();
}

function updateGenresInput() {
    const activeTags = Array.from(
        selectedTags.getElementsByClassName("tag")
    );
    const genres = activeTags.map(
        (tag) => tag.querySelector(".tag-text").innerText
    );
    // genresInput.value = genres.join(", ");
    if (selectedTags.childElementCount < 5) {
        //   genresInputContainer.style.boxShadow = "";
        //   genresInputContainer.style.border = "1px solid #ccc";
    }
    // else {
    //   genresInputContainer.style.boxShadow = "0 0 5px red"; // Change the box shadow color or style as needed
    //   genresInputContainer.style.border = "none";
    // }
}

function home() {
    window.location.href = "../index.html";

}
function create() {
    window.location.href = "create.html";
}

function generate_image() {
    window.location.href = "create.html";

}
function image_variant() {
    window.location.href = "image_variant.html";
}
function image_edit() {
    window.location.href = "image_edit.html";
}

function back() {
    window.location.href = "../index.html";


}
function forward() {

}

function create_image() {

    console.log("create_image");
    var jsonData= fetchData();
    window.location.href = "generated_post.html?data=" + encodeURIComponent(jsonData);
    
}

function fetchData() {
    var prompt = document.getElementById("prompt").value;
    var keyword = document.getElementById("keyword").value;
    var selectedTags = document.getElementById("selected-tags").innerText;
    var selectedOption = document.querySelector("#genres + select option:checked").text;
    var tags = convertAndRemoveX(selectedTags);


    console.log("Prompt:", prompt);
    console.log("Keyword:", keyword);
    console.log("Selected Tags:", tags);
    console.log("Selected Option:", selectedOption);


    var jsonData = {
        "type" : 1,
        "prompt": prompt,
        "keyword": keyword,
        "selectedTags": tags,
        "selectedOption": selectedOption,
    };
    
    return JSON.stringify(jsonData);
}


function convertAndRemoveX(dataString) {

    // Convert string to array
    var array = dataString.split('\n');

    // Remove all occurrences of "x" from the array
    var filteredArray = array.filter(function (element) {
        return element !== "x";
    });

    return filteredArray;
}