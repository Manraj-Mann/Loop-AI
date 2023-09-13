
window.onload = function () {
    var data = sessionStorage.getItem("data");
    var jsondata = JSON.parse(data);
    console.log(jsondata);
    setimage(jsondata);

};

window.onload = function () {
    var data = sessionStorage.getItem("data");
    var jsondata = JSON.parse(data);
    console.log(jsondata);
    setimage(jsondata);
  };


  
  function setimage(data) {
    var imageElement = document.querySelector('.generated_image');
    var newImageSource = data['url']; // Replace with the desired image source
    var tags = data['tags']; 
    var title = data['prompt']; 
  
    imageElement.style.borderRadius = "20px";
    imageElement.alt = data['prompt']; // Use 'alt' instead of 'style.alt'
    imageElement.style.width = '95%'; // Set the desired width
    imageElement.style.height = '95%'; // Maintain aspect ratio
    imageElement.src = newImageSource;
  
    tags.split(",").forEach((tag) => {
        const event = { key: 'Enter', target: { value: tag } };
        addTag(event);
      });
    
    document.getElementById("selected-tags").value = tags;
    document.getElementById("title").value = title;
  }
  
  
function post(){


}


function create_post(){

    setloading();

    console.log("post created");
    
    var title = document.getElementById("title").value;
    var selectedtags = document.getElementById("selected-tags").innerText;
    var tags = convertAndRemoveX(selectedtags);
    var description = document.getElementById("description").value;
    
    const formData = new FormData();
    var data = JSON.parse(sessionStorage.getItem("data"));

    formData.append("userID", sessionStorage.getItem("userID"));
    formData.append("accesstoken", "123");
    formData.append("prompt", data['prompt']);
    formData.append("keyword", data['keywords']);
    formData.append("tags", data['tags']);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("size", data['size']);
    formData.append("url", data['url']);
    formData.append("type", "post");

    const requestOptions = {
        method: "POST",
        body: formData,
    };


    fetch('http://127.0.0.1:5000/add_database', requestOptions)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {

                throw new Error('Network response was not OK');

            }
        })
        .then(function (data) {
            // Handle the success response and print the result JSON
            // sessionStorage.removeItem("request");
            console.log(data);
            window.location.href  = "posted.html";

        })
        .catch(function (error) {
            // Handle the failure
            sessionStorage.removeItem("request");
            failure();
        });
    
}

function fetchData() {
    var prompt = document.getElementById("title").value;
    var selectedTags = document.getElementById("selected-tags").innerText;
    var tags = convertAndRemoveX(selectedTags);
    var description = document.getElementById("description").value

    console.log("Prompt:", prompt);
    console.log("Selected Tags:", tags);
    console.log("Description:", description);


    var jsonData = {
        
        "title": title,
        "tags": tags,
        "description": description,
        
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

function failure() {

  console.log("failure")


  var imageElement = document.querySelector('.generated_image');
    var newImageSource = '../assets/error2.gif'; // Replace with the desired image source
    imageElement.style.width = 'auto'; // Set the desired width
    imageElement.style.height = 'auto'; // Maintain aspect ratio
    imageElement.src = newImageSource;


    var imageElement2 = document.querySelector('.loading-gif');
    var newImage = '../assets/no-internet.gif'; // Replace with the desired image source
    imageElement2.src = newImage;
    imageElement2.style.marginTop = "20px";
    var loadertext = document.querySelector(".loader-text")
    loadertext.style.display = "none"

    

    var load = document.querySelector(".loader-tag-line");
    load.innerHTML = "There was some error!";
    load.style.fontSize = "24px";
    load.style.background = "linear-gradient(to right, #ff0000, #ff4500, #ff8c00)";
    load.style.webkitBackgroundClip = "text";
    load.style.webkitTextFillColor = "transparent";

    
}

function setloading() {

    console.log("inside loading")
    var leftSection = document.querySelector('.left-section');
    var imageElement = document.querySelector('.generated_image');
    var newImageSource = '../assets/output-onlinegiftools.gif'; // Replace with the desired image source
    leftSection.style.backgroundColor = 'white';
    imageElement.style.width = '100%'; // Set the desired width
    imageElement.style.height = 'auto'; // Maintain aspect ratio
    imageElement.src = newImageSource;
    var loader = document.querySelector(".loader")
    
    loader.style.display = "block";
    var loadertext = document.querySelector(".loader-text")
    loadertext.innerHTML = "Posting Your Art !"
    var load = document.querySelector(".loader-tag-line")
    load.innerHTML = "Thanks for showing your support to community !"
    

    var rightSection = document.querySelector('.right-section');
    var loader = document.querySelector('.loader');
  
    // Hide all content inside right-section except the loader
    var contentElements = rightSection.querySelectorAll(':scope > *:not(.loader)');
    contentElements.forEach(function(element) {
      element.style.display = 'none';
    });
  
    // Show the loader
    loader.style.display = 'block';

    
}

  
