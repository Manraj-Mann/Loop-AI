setloader();

function setloader() {

    sessionStorage.setItem("request", JSON.stringify(retrieveData()));
    var data = retrieveData();
    console.log(data);

    if (data['type'] == 1) {
        console.log("create image");
        create_image(data);
    } else if (data['type'] == 2) {
        console.log("create image variant");

        create_image_variant(data);

    } else {
        console.log("create image edit");
        create_image_edit();
    }

}

function isAPIRequestMade() {
    return sessionStorage.getItem("apiRequestMade") === "true";
}

function setAPIRequestMade() {
    sessionStorage.setItem("apiRequestMade", "true");
}

function setloading() {

    var leftSection = document.querySelector('.left-section');
    var imageElement = document.querySelector('.generated_image');
    var newImageSource = '../assets/output-onlinegiftools.gif'; // Replace with the desired image source
    leftSection.style.backgroundColor = 'white';
    imageElement.style.width = '100%'; // Set the desired width
    imageElement.style.height = 'auto'; // Maintain aspect ratio
    imageElement.src = newImageSource;

}
async function hideresults() {

    var additional = document.querySelector('.additional-content');
    additional.style.display = 'none';

}

function showresults() {

    var additional = document.querySelector('.additional-content');
    additional.style.display = 'block';
}

function hideloader() {

    var loader = document.querySelector('.loader');
    loader.style.display = 'none';
}

function failure() {

    var icon = document.querySelector('.success-icon');
    icon.src = "../assets/fail.png";
    var text = document.querySelector('.success-text');
    text.innerHTML = "Failure !";
    var tagline = document.querySelector('.tag-line');
    tagline.innerHTML = "Please check your internet connection and try again";
    const download = document.getElementById('download');
    download.style.display = 'none';
    const post = document.getElementById('create-post');
    post.style.display = 'none';
    var social = document.querySelector('.social-media-icons');
    social.style.display = 'none';
    var hrule = document.getElementById('hrule');
    hrule.style.display = 'none';
    var tryagain = document.getElementById('try-again');
    tryagain.style.display = 'block';

    var imageElement = document.querySelector('.generated_image');
    var newImageSource = '../assets/error2.gif'; // Replace with the desired image source
    imageElement.style.width = 'auto'; // Set the desired width
    imageElement.style.height = 'auto'; // Maintain aspect ratio
    imageElement.src = newImageSource;

    hideloader();
    showresults();
}

function success(data) {

    var imageElement = document.querySelector('.generated_image');
    var newImageSource = data['url']; // Replace with the desired image source
    imageElement.style.borderRadius = "20px";
    imageElement.style.alt = data['prompt'];
    imageElement.style.width = '95%'; // Set the desired width
    imageElement.style.height = '95%'; // Maintain aspect ratio
    imageElement.src = newImageSource;

    hideloader();
    showresults();
}


function try_again() {

    window.location.href = "create.html";

}


function retrieveData() {

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var data = urlParams.get("data");
    // console.log(JSON.parse(data)); // Output: "Hello"
    return JSON.parse(data);

}

function create_image(data) {


    const formData = new FormData();
    formData.append("userID", sessionStorage.getItem("userID"));
    formData.append("prompt", data['prompt'])
    formData.append("keyword", data['keyword'])
    formData.append("tags", data['selectedTags'])
    formData.append("size", data['selectedOption'])
    formData.append("accesstoken", "123");
    const requestOptions = {
        method: "POST",
        body: formData,
    };


    fetch('http://127.0.0.1:5000/generate_image', requestOptions)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {

                throw new Error('Network response was not OK');

            }
        })
        .then(function (data) {
            // Handle the success response and print the result JSON
            sessionStorage.removeItem("request");
            success(data);
            sessionStorage.setItem("data", JSON.stringify(data));
            console.log(data);

        })
        .catch(function (error) {
            // Handle the failure
            sessionStorage.removeItem("request");
            failure();
        });
}

function create_image_variant(data) {

    var image = sessionStorage.getItem("image");
    const formData = new FormData();
    formData.append("userID", sessionStorage.getItem("userID"));
    formData.append("prompt", data['name'])
    formData.append("keyword", data['keyword'])
    formData.append("tags", data['selectedTags'])
    formData.append("size", data['selectedOption'])
    formData.append("accesstoken", "123");
    formData.append("image", image);
    const requestOptions = {
        method: "POST",
        body: formData,
    };



    fetch('http://127.0.0.1:5000/image_variant', requestOptions)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {

                throw new Error('Network response was not OK');

            }
        })
        .then(function (data) {
            // Handle the success response and print the result JSON
            sessionStorage.removeItem("request");
            success(data);
            sessionStorage.setItem("data", JSON.stringify(data));
            console.log(data);

        })
        .catch(function (error) {
            // Handle the failure
            sessionStorage.removeItem("request");
            failure();
        });
}

function create_image_edit() {

    fetch('http://127.0.0.1:5000/image_edit')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {

                throw new Error('Network response was not OK');

            }
        })
        .then(function (data) {
            // Handle the success response and print the result JSON
            success(data);
            sessionStorage.setItem("data", JSON.stringify(data));
            console.log(data);

        })
        .catch(function (error) {
            // Handle the failure
            failure();
        });

}


function download_register(){

    
    const formData = new FormData();
    var data = JSON.parse(sessionStorage.getItem("data"));

    formData.append("userID", sessionStorage.getItem("userID"));
    formData.append("accesstoken", "123");
    formData.append("prompt", data['prompt']);
    formData.append("keyword", data['keywords']);
    formData.append("tags", data['tags']);
    formData.append("size", data['size']);
    formData.append("url", data['url']);
    formData.append("type", "download");

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

        })
        .catch(function (error) {
            // Handle the failure
            sessionStorage.removeItem("request");
            failure();
        });

    
}
function downloadFile() {


    download_register();
}


function create_post() {

    console.log("create_post");
    window.location.href = "post.html";

}