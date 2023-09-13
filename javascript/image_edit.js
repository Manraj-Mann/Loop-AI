function create_image_edit(){

    console.log("create_image_edit");
    var jsonData = fetchData();

    var image = document.querySelector('.generated_image');
    var src = image.src;
    sessionStorage.setItem("image", src);

    var image2 = document.querySelector('.second_image');
    var src2 = image2.src;
    sessionStorage.setItem("mask", src2);
    
    window.location.href = "generated_post.html?data=" + encodeURIComponent(jsonData) ;
    
}


function handleDrop(event) {
    event.preventDefault();
    const imageElement = document.querySelector('.generated_image');
    const file = event.dataTransfer.files[0];

    // Check file type
    if (file.type !== 'image/png') {
        alert('Please drop a PNG image file.');
        return;
    }

    // Check file size
    if (file.size > 4 * 1024 * 1024) {
        alert('Please drop a PNG image file with a size less than 4 MB.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        imageElement.src = event.target.result;
        // Call fetchData with the image data
        fetchData(event.target.result);
    };

    reader.readAsDataURL(file);
}

function uploadImage1() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';
    input.onchange = function (event) {
        const imageElement = document.querySelector('.generated_image');
        const file = event.target.files[0];

        // Check file type
        if (file.type !== 'image/png') {
            alert('Please choose a PNG image file.');
            return;
        }

        // Check file size
        if (file.size > 4 * 1024 * 1024) {
            alert('Please choose a PNG image file with a size less than 4 MB.');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            imageElement.src = event.target.result;
            // Call fetchData with the image data
            fetchData(event.target.result);
        };

        reader.readAsDataURL(file);
    };

    input.click();
}
function uploadImage2() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';
    input.onchange = function (event) {
        const imageElement = document.querySelector('.second_image');
        const file = event.target.files[0];

        // Check file type
        if (file.type !== 'image/png') {
            alert('Please choose a PNG image file.');
            return;
        }

        // Check file size
        if (file.size > 4 * 1024 * 1024) {
            alert('Please choose a PNG image file with a size less than 4 MB.');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            imageElement.src = event.target.result;
            // Call fetchData with the image data
            fetchData(event.target.result);
        };

        reader.readAsDataURL(file);
    };

    input.click();
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
        "type": 3,
        "prompt" : prompt,
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