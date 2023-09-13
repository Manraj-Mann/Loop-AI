function saveFileFromURL(url, filename) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result;
          const a = document.createElement('a');
          a.href = fileData;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Usage example
  const fileURL = 'https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media';
  const fileName = 'file.png';
  saveFileFromURL(fileURL, fileName);
  