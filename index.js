function create() {

  window.location.href = "/html/create.html";

}

function home() {

  window.location.href = "index.html";
  // getPosts();

}

function openCollection() {

  const gallery = document.querySelector(".card-gallery");
  gallery.innerHTML = "";
  // const loader = document.querySelector(".loader");
  // loader.style.display = "block";

  const formData = new FormData();

  formData.append('userID', sessionStorage.getItem('userID'))
  formData.append('accesstoken',"123" )
  const requestOptions = {
    method: "POST",
    body: formData,
  };
  
  fetch('http://127.0.0.1:5000/collection', requestOptions)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Some Error Occured");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      console.log(data);
      const loader = document.querySelector(".loader");
      // loader.style.display = "none";
      setPost(data['data']);
      

    })
    .catch(function (error) {

      console.log(error);
    });
  
}
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
function login() {

  const uid = document.getElementById("username-login").value;
  const formData = new FormData();
  formData.append("userID", uid);
  formData.append("password", document.getElementById("password").value)
  formData.append("accesstoken", "123");
  formData.append("type", "login");
  const requestOptions = {
    method: "POST",
    body: formData,
  };
  var toast = document.getElementById('toast-container');

  fetch('http://127.0.0.1:5000/security', requestOptions)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Invalid Credentials");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      console.log(data);
      if (data['status'] == 200) {

        toast.style.backgroundColor = '#4caf50';
        var userimage = document.getElementById('profile-img');
        userimage.src = data['data']['userimage'];
        var username = document.getElementById('username');
        username.innerHTML = data['data']['username'];
        sessionStorage.setItem('userID', uid);
        sessionStorage.setItem('username', data['data']['username']);
        sessionStorage.setItem('userimage', data['data']['userimage']);
        sessionStorage.setItem('login', true);
        setTimeout(hidePopup, 3000);
      }
      else if (data['status'] == 401) {

        toast.style.backgroundColor = 'orange';
      }
      else if (data['status'] == 404) {
        toast.style.backgroundColor = 'rgb(223, 43, 43)';

      }
      showToast(data['message'], 3000);


      // popupContainer.style.display = 'none'; // Commented out to prevent closing the popup container
    })
    .catch(function (error) {
      // Handle the failure
      // showToast(data['message'], 5000);
      toast.style.backgroundColor = 'rgb(208, 16, 16)';
      console.log(error);
    });
}
function signup() {

  const formData = new FormData();
  var uid = document.getElementById("userID").value;
  formData.append("userID", uid);
  formData.append("password", document.getElementById("password").value)
  formData.append("accesstoken", "123");
  formData.append("type", "signup");
  const requestOptions = {
    method: "POST",
    body: formData,
  };

  fetch('http://127.0.0.1:5000/security', requestOptions)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Invalid Credentials");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      console.log(data);
      var toast = document.getElementById('toast-container');
      if (data['status'] == 200) {

        toast.style.backgroundColor = '#4caf50';
        var userimage = document.getElementById('profile-img');
        userimage.src = data['data']['userimage'];
        var username = document.getElementById('username');
        username.innerHTML = data['data']['username'];
        sessionStorage.setItem('userID', uid);
        sessionStorage.setItem('username', data['data']['username']);
        sessionStorage.setItem('userimage', data['data']['userimage']);
        sessionStorage.setItem('login', true);
        setTimeout(hidePopup, 3000);
      }
      else if (data['status'] == 409) {

        toast.style.backgroundColor = 'orange';
      }

      showToast(data['message'], 3000);


      // popupContainer.style.display = 'none'; // Commented out to prevent closing the popup container
    })
    .catch(function (error) {
      // Handle the failure
      // showToast(data['message'], 5000);
      toast.style.backgroundColor = 'rgb(208, 16, 16)';
      console.log(error);
    });
}

function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');

    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}


function showPopup() {
  // if (sessionStorage.getItem('login') == 'true') {
  //   return;
  // }
  // else {

  const popupContainer = document.querySelector('.popup-container');
  popupContainer.style.display = 'flex';
  // }
}

function hidePopup() {
  const popupContainer = document.querySelector('.popup-container');
  popupContainer.style.display = 'none';
}


function checkcreds() {

  if (sessionStorage.getItem('userID') != null) {
    var userimage = document.getElementById('profile-img');
    userimage.src = sessionStorage.getItem('userimage');
    var username = document.getElementById('username');
    username.innerHTML = sessionStorage.getItem('username');

  }

}

checkcreds();

function openchat() {

  var cardgallery = document.querySelector(".card-gallery");
  var tags = document.querySelector(".tags-section");

  var chat = document.querySelector(".chat-container");

  cardgallery.style.display = "none";
  tags.style.display = "none";

  chat.style.display = "flex";

  var textbox = document.querySelector(".text-box");
  textbox.style.height = "100%";

  fetch_chat();

}

function add_messages_chatbox(data) {


  var chatbox = document.querySelector(".chat-box");
  var userID = sessionStorage.getItem('userID');

  chatbox.innerHTML = "";

  data.forEach((element) => {
    console.log({ element });
    var user = element['user'];
    var username = element['username'];
    var message = element['message'];
    var time = element['time'];
    var src = element['image']
    var str = "";
    if (userID.toString() == user.toString()) {
      str = `<div class="chat-info user-chat-box"><span class="chat-text-box user-chat">${message}</span><img class="chat-profile-img-user" src="${src}" alt="Profile Image" id="profile-img" /><span class="chat-other-user-info"><span class="other-user-name">${username}</span><span class="time-user">${time}</span></span></div>`;
    } else {
      str = `<div class="chat-info other-user-chat-box"><span class="chat-other-user-info"><span class="other-user-name">${username}</span><span class="time-other-user">${time}</span></span><span></span><img class="chat-profile-img-other" src="${src}" alt="Profile Image" id="profile-img" /><span class="chat-text-box other-user-chat">${message}</span></div>`;
    }
    chatbox.innerHTML += str;
  });

  var lastChatMessage = chatbox.lastElementChild;
  lastChatMessage.scrollIntoView({ behavior: 'smooth' });
}

function fetch_chat() {

  fetch('http://127.0.0.1:5000/chat')
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Some Error Occured");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      console.log(data);
      add_messages_chatbox(data['data']);


    })
    .catch(function (error) {

      console.log(error);
    });
}

function send_message() {

  const formData = new FormData();

  formData.append('message', document.querySelector(".text-box").value)
  formData.append('userID', sessionStorage.getItem('userID'))
  const requestOptions = {
    method: "POST",
    body: formData,
  };

  chat_type_reset();

  fetch('http://127.0.0.1:5000/chat', requestOptions)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Some Error Occured");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      console.log(data);
      add_messages_chatbox(data['data']);

    })
    .catch(function (error) {

      console.log(error);
    });

}

// resize message-box and textarea accoding to word length
const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);

}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";

  const box = document.getElementById("message-box");
  box.style.height = 0;
  box.style.height = (this.scrollHeight) + "px";
}
function openHome() {
  // document.location.href = "index.html"
  console.log("home is executed");
  getPosts();
}


function chat_type_reset() {

  const textBox = document.getElementById("text-box");

  // Reset the text area to its default state
  textBox.value = "";

  // Rest of your code...

  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
    tx[i].addEventListener("input", OnInput, false);
  }

}

const textBox = document.querySelector(".text-box");
textBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent textarea from creating a new line

    // Call the send_message function
    send_message();
    chat_type_reset();
  }
});



// Get all anchor tags inside the side navigation
const sidenavLinks = document.querySelectorAll('.sidenav a');

// Add event listeners to each anchor tag
sidenavLinks.forEach(link => {
  link.addEventListener('mouseover', handleMouseOver);
  link.addEventListener('mouseout', handleMouseOut);
  link.addEventListener('click', handleClick);
});

// Make the "Home" link active by default
const homeLink = document.querySelector('.home-nav');
makeLinkActive(homeLink);
// home();

function handleMouseOver() {
  const link = this;
  if (!link.classList.contains('active')) {
    link.style.color = '#2563eb';
    link.style.fontWeight = 'bolder';
    link.style.backgroundColor = '#e3e3e7';
  }
}

function handleMouseOut() {
  const link = this;
  if (!link.classList.contains('active')) {
    link.style.color = '';
    link.style.fontWeight = '';
    link.style.backgroundColor = '';
  }
}

function handleClick(event) {
  event.preventDefault();
  const link = this;
  resetStyles();
  makeLinkActive(link);
  executeFunction(link.textContent.trim().toLowerCase());
}

function resetStyles() {
  sidenavLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    link.style.backgroundColor = '';
    link.classList.remove('active');
  });
}

function makeLinkActive(link) {
  link.style.color = '#2563eb';
  link.style.fontWeight = 'bolder';
  link.style.backgroundColor = '#e3e3e7';
  link.classList.add('active');
  if(link.textContent.trim().toLowerCase() === 'home'){
    openHome();
  }
}

function executeFunction(functionName) {
  if (functionName === 'home') {
    openHome();
  } else if (functionName === 'collection') {
    openCollection();
  } else if (functionName === 'downloads') {
    openDownloads();
  } else if (functionName === 'chat') {
    openchat();
  }
   else if (functionName === 'history') {
    openHistory();
  }
   else if (functionName === 'log out') {
    logout();
  }
  else{
    alert("Something went wrong " + functionName);
  }
}

function openDownloads() {
  // Code for the services function goes here
  console.log("openDownloads function executed.");
}

function openHistory() {
  // Code for the contact function goes here
  console.log("openHistory function executed.");
}



function getPosts() {

  fetch('http://127.0.0.1:5000/add_database')
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Some Error Occured");
        throw new Error('Network response was not OK');
      }
    })
    .then(function (data) {
      // Handle the success response and print the result JSON
      // console.log(data);

      var gallery = document.querySelector(".card-gallery");
      gallery.style.overflow = "auto";
    
      var loader = document.getElementById("loader");
      console.log(loader);
      
      setPost(data['data']);



    })
    .catch(function (error) {

      console.log(error);
    });

}


function setPost(data) {

  const gallery = document.querySelector(".card-gallery");
  gallery.innerHTML = "";
  var temp = []
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const obj = data[key];
      var html = `<div class="card">
      <div class="card-image">
        <img src="${obj.image}" alt="Dummy Image">
      </div>
      <div class="card-details">
        <div class="profile">
          <img src="${obj.GeneratedBy.image}" alt="Dummy Profile Image" class="profile-image">
          <span class="username">${obj.GeneratedBy.username}</span>
        </div>
        <div class="likes">
          <i class="fa-regular fa-heart"></i>
          <span class="like-count">${obj.Likes}</span>
        </div>
        <div class="views">
          <i class="fa-regular fa-eye"></i>
          <span class="view-count">${obj.Views}</span>
        </div>
      </div>
    </div>`;
      temp.push(html);

    }

  }

  temp.reverse();
  temp.forEach(element => {
    gallery.innerHTML += element;
  });

}

function filter(type) {

  

}