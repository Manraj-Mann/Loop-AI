import requests

# Define the API endpoint
url = 'https://api.openai.com/v1/images/variations'
headers = {
    'Authorization': 'Bearer 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'
}

# Define the request payload data
data = {
    'size': '256x256'
}

# Create a dictionary to hold the files
files = {
    'image': open("image.png", "rb")
}


# Send a POST request to the API endpoint with the payload data
response = requests.post(url, data=data, files=files, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # Extract the JSON response from the API
    result = response.json()
    print(result)
else:
    # Print the error message if the request was unsuccessful
    print(f'Error: {response.status_code} - {response.text}')
