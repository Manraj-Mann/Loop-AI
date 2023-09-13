import datetime
from flask import Flask, request, abort
from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, reqparse
import json
from loop_ai_db_operations import Images
import requests
import base64
from io import BytesIO
app = Flask(__name__)
api = Api(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# --------------------------------------------------------------------------- Loop AI Site --------------------------------------------------------------------------------


class Utility:
    def convert_dataurl_to_binary(dataurl):
        # Split the data URL into the MIME type and the base64-encoded data
        header, encoded = dataurl.split(",", 1)

        # Decode the base64-encoded data
        decoded = base64.b64decode(encoded)

        # Create a BytesIO object to hold the binary data in memory
        binary_data = BytesIO(decoded)

        # Return the binary data
        return binary_data.getvalue()

    def add_data(data):
        im = Images()
        url = im.upload_file_and_get_url(data)
        data = {

        }
        return url

    def make_registry(prompt, keywords, tags, size, url, userID):
        im = Images()
        data = {
            'prompt': prompt,
            'keywords': keywords,
            'tags': tags.split(','),
            'size': size,
            'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'url': url,
        }
        print(data)
        im.set_history(user_id=userID, generated=data)

    def download_data(prompt, keywords, tags, size, url, userID):
        im = Images()
        data = {
            'prompt': prompt,
            'keywords': keywords,
            'tags': tags.split(','),
            'size': size,
            'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'url': url,
        }
        im.set_download(user_id=userID, download=data)

    def post_data(prompt, keywords, tags, size, url, userID, title, description):
        im = Images()
        data = {
            'Description': description,
            'GeneratedBy': userID,
            'Likes': 0,
            'Saves': 0,
            'Tags': tags.split(','),
            'Title': title,
            'Views': 0,
            'image': url,
            'generated': {

                'prompt': prompt,
                'keywords': keywords,
                'tags': tags.split(','),
                'size': size,
                'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'url': url,
            }
        }
        post_id = im.create_post(data)
        im.add_to_collection(userID, post_id)



class Generate_Image(Resource):

    def get(self):

        return {
            'message': "access granted",
            'prompt': "prompt user",
            'url': "https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media"
        }

    def post(self):
        print("----------------------- Create Image ----------------------\n")
        images = Images()
        try:
            userID = request.form.get('userID')
            # Get the access token from the form data
            access_token = request.form.get('accesstoken')
            prompt = request.form.get('prompt')
            keywords = request.form.get('keyword')
            tags = request.form.get('tags')
            size = request.form.get('size')

            # Get the image data from the form data
            # image = request.form.get('image')

            print("Access token received: ", access_token)
            # Convert the data URL to a file
            # file= Utility.convert_dataurl_to_file(image, "image")
            # Convert the file to binary
            # binary_content = Utility.convert_file_to_binary(file)

            try:
                resp = images.get_images_urls( prompt, size)
                # resp = {
                #     "status": 200,
                #     "message": "success",
                #     "data": [{"url": "https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media"}]
                # }
                if resp['status'] == 400:
                    return {
                        "message": resp['message']
                    }, 400

                urls = resp['data']
                db_url = Utility.add_data(urls[0]['url'])
                Utility.make_registry(prompt, keywords, tags, size, db_url, userID)
            except Exception as e:
                print(e)
                return {
                    "message": str(e)
                }, 400

            
            print("---------------------------------------------------\n")

            return {
                'message': "access granted post",
                'prompt': prompt,
                'keywords': keywords,
                'tags': tags,
                'size': size,
                'url': db_url,
            }, 200
        except Exception as e:
            return {
                "message": str(e)
            }, 400


class Image_variant(Resource, Utility):

    def get(self):
        return {
            'message': "access granted",
            'prompt': "dummy image variant",
            'url': "https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media"
        }

    def post(self):
        print("------------------------Image Variant-----------------------\n")
        images = Images()   
        try:
            # Get the access token from the form data
            userID = request.form.get('userID')
            access_token = request.form.get('accesstoken')
            name = request.form.get('prompt')
            keywords = request.form.get('keyword')
            tags = request.form.get('tags')
            size = request.form.get('size')

            # Get the image data from the form data
            image = request.form.get('image')

            print("Access token received: ", access_token)
            # # Convert the data URL to a file
            # file= Utility.convert_dataurl_to_file(image, "image")
            # Convert the file to binary
            # binary_content = Utility.convert_file_to_binary(file)
            binary_content = Utility.convert_dataurl_to_binary(image)

            try:
                # resp = images.get_images_variation_urls(binary_content,size)
                resp = {
                    "status": 200,
                    "message": "success",
                    "data": [{"url": "https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media"}]
                }
                # TEMPORARY

                print("---------------------------------------------------\n")
                if resp['status'] == 400:
                    return {
                        "message": resp['message']
                    }, 400
                urls = resp['data']
                db_url = Utility.add_data(urls[0]['url'])
                Utility.make_registry(
                    name, keywords, tags, size, db_url, userID)

            except Exception as e:
                print(e)
                return {
                    "message": str(e)
                }, 400

            return {
                'message': "access granted post",
                'prompt': name,
                'keywords': keywords,
                'tags': tags,
                'size': size,
                'url': db_url,
            }, 200
        except Exception as e:
            return {
                "message": str(e)
            }, 400


class Image_edit(Resource):
    def get(self):
        return {
            'message': "access granted",
            'prompt': "temp name",
            'url': "https://firebasestorage.googleapis.com/v0/b/imagineai-416bd.appspot.com/o/images%2Fa3a1e909-2443-4f6f-9f10-fffa7fa066ed?alt=media"
        }


class Database(Resource, Utility):

    def post(self):
        try:
            userID = request.form.get('userID')
            access_token = request.form.get('accesstoken')
            prompt = request.form.get('prompt')
            keywords = request.form.get('keyword')
            tags = request.form.get('tags')
            size = request.form.get('size')
            url = request.form.get('url')
            type = request.form.get('type')

            title = request.form.get('title')
            description = request.form.get('description')

            print("Access token received: ", access_token)
            if type == 'download':
                Utility.download_data(
                    prompt, keywords, tags, size, url, userID)
                msg = "success download registred"
            elif type == 'post':
                Utility.post_data(prompt , keywords , tags , size , url , userID , title , description )
                msg = "success post registred"

            return{
                "message": msg,
            }, 200
        except Exception as e:
            return {
                "message": str(e)
            }, 400
    
    def get(self):
        try:
            im = Images()
            data = im.get_all_posts()
            for d in data.values():
                user_id = d['GeneratedBy']
                resp = im.get_user_details(int(user_id))
                d['GeneratedBy'] = {

                    "username": resp[0],
                    "image": resp[1],
                }
            
            return {
                "message": "success",
                "data": data,
            }, 200

        except Exception as e:
            return {
                "message": str(e)
            }, 400

class Securtiy(Resource):

    
    def post(self):
        try:
            im  = Images()
            userID = request.form.get('userID')
            password = request.form.get('password')
            access_token = request.form.get('accesstoken')
            type = request.form.get('type')
            
            print("Access token received: ", access_token)
            print("userID: ", (userID))
            print("password: ",(password))
            print("type: ", type)
            if access_token == im.get_access_token():
                print("access granted")
                if type == 'login':
                    resp = im.login(str(userID), str(password))
                    print(resp)
                    return resp
                elif type == 'signup':
                    resp = im.signup(userID, password)
                    print(resp)
                    return resp
                else:
                    resp = {
                        "message": "access denied"
                    }, 400
                    print(resp)
                    return resp
            else:
                return {
                    "message": "access denied"
                }, 400
        except Exception as e:
            print("error: ", e)
            return {
                "message": str(e)
            }, 400

class Chat(Resource):
    def get(self):
        im = Images()
        return {
            'data':im.get_all_messages()
        }  ,200  
    
    def post(self):
        userID = request.form.get('userID')
        access_token = request.form.get('accesstoken')
        message = request.form.get('message')
        try:
            im = Images()
            username , image = im.get_user_details(userID)
            data = {
                'message':message,
                'user':userID,
                'username': username,
                'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'image': image,

            }
            im.add_chat_message(message=data)
            print(data)
            return {
                'data':im.get_all_messages(), 
            },200
        except Exception as e:
            return {

                'messsage': str(e),
            },400

class Collection(Resource):

    def post(self):
        userID = request.form.get('userID')
        access_token = request.form.get('accesstoken')
        try:
            im = Images()
            collection = im.get_collection(userID)
            data = []
            for key in collection.keys():
                data.append(im.get_post(key))

            for d in data:
                user_id = d['GeneratedBy']
                resp = im.get_user_details(int(user_id))
                d['GeneratedBy'] = {

                    "username": resp[0],
                    "image": resp[1],
                }
            return {
                'user':userID,
                'data':data,
            },200
        except Exception as e:
            return {

                'messsage': str(e),
            },400
        
api.add_resource(Generate_Image, "/generate_image", methods=['GET', 'POST'])
api.add_resource(Image_variant, "/image_variant", methods=['GET', 'POST'])
api.add_resource(Image_edit, "/image_edit", methods=['GET', 'POST'])
api.add_resource(Database, "/add_database", methods=['GET', 'POST'])
api.add_resource(Securtiy , "/security" , methods=['GET' , 'POST'])
api.add_resource(Chat , '/chat' , methods=['GET' , 'POST'])
api.add_resource(Collection , '/collection' , methods=['GET' , 'POST'])

if __name__ == "__main__":
    app.run(debug=False)
