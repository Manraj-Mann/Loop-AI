// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Set the redirect timer
    var seconds = 15;
    var countdown = document.getElementById('timer');
    countdown.innerHTML = seconds;
  
    var timer = setInterval(function() {
      seconds--;
      countdown.innerHTML = seconds;
  
      if (seconds <= 0) {
        clearInterval(timer);
        window.location.href = '../index.html';
      }
    }, 1000);
  
    // Handle button click
    var returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', function() {
      clearInterval(timer);
      window.location.href = '../index.html';
    });
  });
  