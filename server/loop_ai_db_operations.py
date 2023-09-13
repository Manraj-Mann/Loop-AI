import pickle
import json
import pyrebase
import urllib
import random
import uuid
import io
import requests
import base64
from werkzeug.datastructures import FileStorage
import datetime


class Images:

    # return json template

    def return_json(self, data, status, message):

        msg = {
            'status': status,
            'message': message,
            'data': data
        }

        return json.loads(json.dumps(msg))

    # make connection

    def makeconnection(self):
        config = {

            "apiKey": "AIzaSyBh8YdQNFMT0lF1YY2u923XZauoG-XXS3Y",
            "authDomain": "loop-ai-238f7.firebaseapp.com",
            "projectId": "loop-ai-238f7",
            "storageBucket": "loop-ai-238f7.appspot.com",
            "messagingSenderId": "715375330474",
            "appId": "1:715375330474:web:61fc341b5f717364b87cd3",
            "measurementId": "G-T2RBW0JSPR",
            "databaseURL": "https://loop-ai-238f7-default-rtdb.firebaseio.com",
        }
        firebase = pyrebase.initialize_app(config)
        return firebase

    # create realtime database instance
    def create_realtime_instance(self):

        fb = self.makeconnection()
        db = fb.database()
        return db

    # create storeage database instance

    def create_storage_instance(self):

        fb = self.makeconnection()
        st = fb.storage()

        return st

    # put questions to database

    def put_image(self, imageUrl, prompt):

        try:
            rt = self.create_realtime_instance()
            qno = rt.child(f'ImageID').get().val()['ImageID']
            print(qno)
            data = {
                "imageUrl": imageUrl,
                "prompt": prompt,
            }
            questions = rt.child(f'GeneratedImages/{qno}').update(data)
            qno += 1
            qno = rt.child(f'ImageID').update({"ImageID": qno})
            print(questions)
            return {

                "link": questions['imageUrl']
            }

        except Exception as e:
            return {
                "message": str(e)
            }

    # get all images
    def get_images_(self):
        rt = self.create_realtime_instance()
        imageSrc = rt.child(f'GeneratedImages').get().val()
        return imageSrc

    def get_images_urls(self, prompt, size):

        # Define the URL for the POST request
        # Replace with your API endpoint URL
        url = 'https://api.openai.com/v1/images/generations'
        # Create a JSON object with the data to be sent in the request body
        jsonData = {
            "prompt": prompt,
            "n": 1,
            "size": size,
        }
        # Define the headers for the request
        headers = {
            'Content-Type': 'application/json',  # Set the content type to JSON
            'Authorization': 'Bearer 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'
        }

        # Send the POST request using requests library
        response = requests.post(url, json=jsonData, headers=headers)

        if response.ok:
            # Parse the response body as JSON
            data = response.json()
            # Use the fetched data
            return self.return_json(data['data'], 200, 'Success')
            # Store the fetched data in session storage or process it as needed
            # postDatabase(data["data"][index]['url'], search)
        else:
            print('Error fetching data:', response.text)
            return self.return_json(None, 400, 'Error fetching data')

    def get_prompt(self):

        storage = self.create_storage_instance()
        # blob = storage.bucket().blob('prompts/prompts.txt')
        # file_content = blob.download_as_string()
        # data = file_content.decode('utf-8').split("\n")
        # print(data)
        url = storage.child('prompts/prompts.txt').get_url(None)
        response = requests.get(url)
        if response.status_code == 200:
            file_content = response.text.split('\n')
            r = random.randint(0, len(file_content)-1)
            prompt = file_content[r]
            return self.return_json(prompt, 200, 'Success')
        else:
            print(f'Error: {response.status_code}')
            return self.return_json(None, 400, 'Error fetching data')

    def deserialize_file(self, serialized_data):
        # Decode the base64-encoded data
        file_data = base64.b64decode(serialized_data)
        # Create a new FileStorage object with the file data
        file = FileStorage(stream=file_data)
        return file

    def serialize_file(self, file):
        serialized_data = base64.b64encode(file).decode(
            'utf-8')  # Base64 encode the file data
        return serialized_data

# ---------------------------------------------------------------------------------------

    def get_access_token(self):
        rt = self.create_realtime_instance()
        token = rt.child(f'access_token').get().val()
        return token

    def get_next_post_id(self):
        rt = self.create_realtime_instance()
        token = rt.child(f'PostID').get().val()['PostID']
        return token

    def get_next_user_id(self):
        rt = self.create_realtime_instance()
        token = rt.child(f'UserID').get().val()['UserID']
        return token

    def get_next_chat_id(self):
        rt = self.create_realtime_instance()
        token = rt.child(f'ChatID').get().val()['ChatID']
        return token

    def get_next_image_id(self):
        rt = self.create_realtime_instance()
        token = rt.child(f'ImageID').get().val()['ImageID']
        return token

    def get_all_messages(self):
        rt = self.create_realtime_instance()
        chat = rt.child(f'Chat').get().val()
        return chat

    def get_all_posts(self):
        rt = self.create_realtime_instance()
        posts = rt.child(f'Posts').get().val()
        return posts

    def get_all_users(self):
        rt = self.create_realtime_instance()
        users = rt.child(f'Users').get().val()
        return users

    def get_user(self, user_id):
        rt = self.create_realtime_instance()
        user = rt.child(f'Users/{user_id}').get().val()
        return user

    def get_user_details(self, user_id):
        rt = self.create_realtime_instance()
        user_detials = rt.child(f'Users/{user_id}').get().val()
        return user_detials['username'], user_detials['userimage']

    def update_post_id(self, current):
        rt = self.create_realtime_instance()
        rt.child(f'PostID').update({'PostID': current+1})

    def update_chat_id(self, current):
        rt = self.create_realtime_instance()
        rt.child(f'ChatID').update({'ChatID': current+1})

    def upload_file_and_get_url(self, image_url):
        storage = self.create_storage_instance()

        # Download the image from the URL
        image_data = urllib.request.urlopen(image_url).read()
        # Upload the file to Firebase Storage
        unique_filename = str(uuid.uuid4())
        destination_path = f"images/{unique_filename}"
        blob = storage.child(destination_path).put(image_data)
        return storage.child(destination_path).get_url(None)

    def set_history(self, user_id, generated):
        rt = self.create_realtime_instance()
        rt.child(f'Users/{user_id}/History').push(generated)

    def get_history(self, user_id):
        rt = self.create_realtime_instance()
        history = rt.child(f'Users/{user_id}/History').get().val()
        return history

    def add_chat_message(self, message):
        rt = self.create_realtime_instance()
        chat_id = self.get_next_chat_id()
        self.update_chat_id(chat_id)
        rt.child(f'Chat/{chat_id}').set(message)

    def get_chat_messages(self):
        rt = self.create_realtime_instance()
        chat = rt.child(f'Chat').get().val()
        return chat

    def set_download(self, user_id, download):
        rt = self.create_realtime_instance()
        rt.child(f'Users/{user_id}/Downloads').push(download)

    def get_download(self, user_id):
        rt = self.create_realtime_instance()
        dow = rt.child(f'Users/{user_id}/Downloads').get().val()
        return dow

    def create_post(self, post):
        rt = self.create_realtime_instance()
        post_id = self.get_next_post_id()
        self.update_post_id(post_id)
        # Use square brackets to assign the 'PostID' key
        post['PostID'] = post_id
        rt.child(f'Posts/{post_id}').set(post)
        return post_id

    def get_all_posts(self):
        rt = self.create_realtime_instance()
        posts = rt.child(f'Posts').get().val()
        return posts

    def add_to_collection(self, user_id, post_id):
        rt = self.create_realtime_instance()
        if (rt.child(f'Users/{user_id}/Collection/').get().val() is None):
            rt.child(f'Users/{user_id}/Collection/').child(post_id).set(True)
            return True
        elif (type(rt.child(f'Users/{user_id}/Collection/').get().val()) is str):
            rt.child(f'Users/{user_id}/Collection/').child(post_id).set(True)
            print("String type")
            return True
        elif (str(post_id) not in rt.child(f'Users/{user_id}/Collection/').get().val().keys()):
            rt.child(f'Users/{user_id}/Collection/').child(post_id).set(True)
            return True
        else:
            rt.child(f'Users/{user_id}/Collection').child(post_id).remove()
            return False

    def get_collection(self, user_id):
        rt = self.create_realtime_instance()
        collection = rt.child(f'Users/{user_id}/Collection').get().val()
        return collection

    def get_post(self, post_id):
        rt = self.create_realtime_instance()
        post = rt.child(f'Posts/{post_id}').get().val()
        return post

    def get_images_variation_urls(self, imagedata, size):
        print("inside get_images_variation_urls")
        # Define the API endpoint
        url = 'https://api.openai.com/v1/images/variations'
        headers = {
            'Authorization': 'Bearer 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'
        }

        # Define the request payload data
        data = {
            'size': size,
        }

        # Create a dictionary to hold the files
        files = {
            'image': imagedata,
        }

        # Send a POST request to the API endpoint with the payload data
        response = requests.post(url, data=data, files=files, headers=headers)

        print(response)
        if response.ok:
            # Parse the response body as JSON
            data = response.json()
            # Use the fetched data
            # print(data)
            # print(data['data'])
            return self.return_json(data['data'], 200, 'Success')
            # Store the fetched data in session storage or process it as needed
            # postDatabase(data["data"][index]['url'], search)
        else:
            print('Error fetching data:', response.text)
            return self.return_json(None, 400, 'Error fetching data')

    def get_all_user(self):
        rt = self.create_realtime_instance()
        users = rt.child(f'Users').get().val()
        return users

    def get_user(self, user_id):
        rt = self.create_realtime_instance()
        user = rt.child(f'Users/{user_id}').get().val()
        return user
    
    def login(self, user_id , password):
        if user_id in self.get_all_user():
            if password == self.get_user(user_id)['password']:
                return self.return_json(self.get_user(user_id), 200, 'Successfully logged In')
            else:
                return self.return_json(None, 401, 'Incorrect Password')
        else:
            return self.return_json(None, 404, 'User not found')
    
    def signup(self, user_id, password):
        if user_id in self.get_all_user():
            return self.return_json(None, 409, 'User already exists')
        else:
            rt = self.create_realtime_instance()
            rt.child(f'Users/{user_id}').set({
                'username': user_id,
                'password': password,
                'userimage':"https://firebasestorage.googleapis.com/v0/b/loop-ai-238f7.appspot.com/o/profile_images%2Fpexels-nataliya-vaitkevich-4450359.jpg?alt=media&token=9b4ae777-7c96-4aa9-b588-8e611ccb0548&_gl=1*dh9dsf*_ga*ODQ3MTQwNDIuMTY2ODE3NjkyNw..*_ga_CW55HF8NVT*MTY4NjIwMzg2My4yMS4xLjE2ODYyMTk2MTQuMC4wLjA."
            })

            return self.return_json(self.get_user(user_id), 200, 'Successfully Registered')

# im = Images()
# ---------------------------------------- history test ----------------------------------------

# print(im.set_history(100000,
#     {
#         'prompt': 'A cute baby wolf',
#         'keywords': 'cute',
#         'tags': ['cute', 'baby'],
#         'size':'256x256',
#         'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#         'url': "https://firebasestorage.googleapis.com/v0/b/loop-ai-238f7.appspot.com/o/images%2Fpexels-willsantt-2026960.jpg?alt=media&token=7d65ee33-b233-4ff9-9884-b9833d2eba95&_gl=1*1i8nzrg*_ga*ODQ3MTQwNDIuMTY2ODE3NjkyNw..*_ga_CW55HF8NVT*MTY4NjIwMzg2My4yMS4xLjE2ODYyMTQyNjguMC4wLjA.",

#     }
# ))

# print(im.get_history(100000))

# ---------------------------------------- chat test ----------------------------------------

# print(im.add_chat_message(
#     {'message': 'Hello Loop AI',
#      'user':100000,
#       'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#         }
#     )
#     )

# print(im.get_chat_messages())

# ---------------------------------------- downloads test ----------------------------------------

# print(im.set_download(100000, {

#     'prompt': 'A cute baby wolf',
#     'keywords': 'cute',
#     'tags': ['cute', 'baby'],
#     'size': '256x256',
#     'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#     'url': "https://firebasestorage.googleapis.com/v0/b/loop-ai-238f7.appspot.com/o/images%2Fpexels-willsantt-2026960.jpg?alt=media&token=7d65ee33-b233-4ff9-9884-b9833d2eba95&_gl=1*1i8nzrg*_ga*ODQ3MTQwNDIuMTY2ODE3NjkyNw..*_ga_CW55HF8NVT*MTY4NjIwMzg2My4yMS4xLjE2ODYyMTQyNjguMC4wLjA.",

# }))

# print(im.get_download(100000))
 
# ---------------------------------------- post test ----------------------------------------

# print(im.create_post(

#     {'Description': 'The wolf is a majestic and highly adaptable carnivorous mammal belonging to the Canidae family. It is renowned for its intelligence, social behavior, and distinctive howling vocalizations. Wolves are skilled hunters with sharp teeth, powerful jaws, and incredible endurance. ',
#         'GeneratedBy': 1000000,
#         'Likes': 0,
#         'Saves': 0,
#         'Tags':['cute' , 'baby'],
#         'Title': 'cute baby image',
#         'Views': 0,
#         'image': "https://firebasestorage.googleapis.com/v0/b/loop-ai-238f7.appspot.com/o/images%2Fpexels-willsantt-2026960.jpg?alt=media&token=7d65ee33-b233-4ff9-9884-b9833d2eba95&_gl=1*pq3fd6*_ga*ODQ3MTQwNDIuMTY2ODE3NjkyNw..*_ga_CW55HF8NVT*MTY4NjIwMzg2My4yMS4xLjE2ODYyMDkxODQuMC4wLjA.",

#         }

# ))

# print(im.get_all_posts())

# ---------------------------------------- collection test ----------------------------------------

# print(im.add_to_collection(100000, 1000))
# print(im.get_collection(100000))
# print(im.add_to_collection(100000, 1000))

# ---------------------------------------- user test ----------------------------------------

# for u in im.get_all_user():
#     print(im.get_user(u)['password'])
# 'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

# n , d = im.get_user_details(100000)
# print(n,d)

