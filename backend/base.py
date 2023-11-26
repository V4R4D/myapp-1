from flask import Flask , request , jsonify , make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import inspect
from werkzeug.utils import secure_filename




import base64
from Crypto.Hash import SHA256
from Crypto import Random
from Crypto.Cipher import AES
from pkcs7 import PKCS7Encoder
import pkcs7,threading, base64
import hashlib

import os


BLOCK_SIZE = 16
key = "1234567890123456".encode('utf8') # want to be 16 chars
passphrase = key
textToEncrypt = "This is text to encrypt".encode('utf8')

def pad(data):
    length = 16 - (len(data) % 16)
    return data+ (chr(length)*length).encode('utf8')

# def unpad(data):
#     return data[:-ord(data[-1])]
def unpad(data):
    if isinstance(data, str):
        data = data.encode('utf-8')
    return data[:-data[-1]]


def encrypt(message):
    IV = Random.new().read(BLOCK_SIZE)
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    # return base64.b64encode(IV + aes.encrypt(pad(message)))
    return base64.b64encode(IV + aes.encrypt(pad(message))).decode()

def decrypt(encrypted):
    encrypted = base64.b64decode(encrypted)
    IV = encrypted[:BLOCK_SIZE]
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    decrypted_data = aes.decrypt(encrypted[BLOCK_SIZE:])
    return unpad(decrypted_data)


def decryptFile(encrypted_data, key):
    encrypted_data = base64.b64decode(encrypted_data)
    # key = key.encode('utf-8')
    iv = encrypted_data[:16]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = cipher.decrypt(encrypted_data[16:])
    return decrypted_data

def get_file_type(file_name):
    # Split the file name and get the part after the last dot
    parts = file_name.split('.')
    return parts[-1] if len(parts) > 1 else ''

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:2001@127.0.0.1/myappDB'
app.config['SECRET_KEY'] = 'Any_random key works '

app.config['UPLOAD_FOLDER'] = 'user_files'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB file size limit


CORS(app)   
db = SQLAlchemy(app) 
 
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     fname = db.Column(db.String(80),nullable=False)
#     # lname = db.Column(db.String(120),nullable=False)
#     email = db.Column(db.String(120), unique=True , nullable=False)
#     password = db.Column(db.String(120),nullable=False)
#     type = db.Column(db.String(120),nullable=False)
#     salary = db.Column(db.String(120), nullable=False)
#     last_login= db.Column(db.DateTime,default = datetime.now) 
    
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    last_login = db.Column(db.TIMESTAMP)
    
class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    file_data = db.Column(db.LargeBinary)

class FileShare(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shared_by_email = db.Column(db.String(255), nullable=False)
    shared_with_email = db.Column(db.String(255), nullable=False)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'), nullable=False)
    shared_at = db.Column(db.DateTime, default=datetime.utcnow)
    
# class EncryptedFile(db.Model):
#     __tablename__ = 'encrypted_files'

#     id = db.Column(db.Integer, primary_key=True)
#     data = db.Column(db.Text)  # You can adjust the data type as needed
#     user_email = db.Column(db.String(255), db.ForeignKey('User.email'))
    
#     print(" user_email for db session = " , user_email)

#     def __init__(self, data, user_email):
#         self.data = data
#         self.user_email = user_email
    

# with app.app_context():
#     db_inspector = inspect(db.engine)
#     if not db_inspector.has_table('employee_details'):
#         # Create database tables
#         db.create_all()
    

@app.route('/' , methods = ['GET' , 'POST'])
def my_profile():
    email = request.json['email']
    password = request.json['password']  
    
    print(" password received = " , password)
    print(request.json)
    
    user = User.query.filter_by(email = email).first() 
    print(" user in / = " , user)
    
    
    
    if user : 
        print(" decrypted db pass = " , decrypt(user.password))
        print(" decrypted cur pass = " , decrypt(password))
        if (decrypt(user.password) == decrypt(password)) : 
            print(user.id)
            
        else :
            response = make_response({"status" : "Incorrect Password try again!"}) 
            response.status_code = 200
            return response
        
    else : 
        response = make_response({"status" : "Email does not exist ,  Register first !"}) 
        response.status_code = 200
        return response     
        
    
    response = make_response({"status" : "Successfully Logged in!"}) 
    response.status_code = 200
    return response
 
@app.route('/signup', methods = ['GET','POST'])
def signup():
    email = request.json['data']['email']
    first_name = request.json['data']['first_name']
    # lname = request.json['lname']
    password = request.json['data']['password']
    salary = 0 
    type=""
    
    # demail = decrypt(email)
    demail = email
    dfname = decrypt(first_name)
    dpassword = decrypt(password)
    print(" demail = " , demail , " dfname = ", dfname  , " dpassword = ", dpassword)
    
    user = User.query.filter_by(email = email).first() 
    
    if user : 
        print(user.email , email)
        if user.email == email : 
            response = make_response({"status" : "Email is already registered!"})
            response.status_code = 201 
            return response
    
    entry = User(first_name=first_name,email=email,password=password)
    print(entry)
    db.session.add(entry)
    db.session.commit()
    print(email , first_name , password )
    response = make_response({"status" : " Account Successfully Created"})
    response.status_code = 200
    return response

@app.route('/userpage', methods=['POST'])
def userpage():
    try:
        # Retrieve form data
        # type = request.form['type']
        # salary = request.form['salary']
        email = request.form['email']
        
        # files = request.files.getlist('file')
        # print(" files = " , files)
        # print(" request = " , request.form)
        

        # Update user details
        user = User.query.filter_by(email=email).first()
        # user.type = type
        # user.salary = salary
        db.session.commit()
        
        response = make_response({"status": "Details recorded successfully"})
        response.status_code = 200
        return response

    except Exception as e:
        # Handle any exceptions or errors that may occur
        print("Error:", str(e))
        response = make_response({"status": "Error occurred"})
        response.status_code = 500
        return response

from flask import jsonify

@app.route('/api/upload', methods=['GET', 'POST'])
def upload_file():
    print("Received a request to /api/upload")
    print("formData =", request.form)

    try:
        user_email = request.form.get('email')

        if 'file' not in request.files:
            return jsonify({"error": "No file part"})

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"})

        if file:
            filename = secure_filename(file.filename)
            directory_path = os.path.join(app.config['UPLOAD_FOLDER'], user_email)

            if not os.path.exists(directory_path):
                os.makedirs(directory_path)

            filepath = os.path.join(directory_path, filename)

            # Check if the file with the same name already exists in the database
            existing_file = File.query.filter_by(email=user_email, file_name=filename).first()

            if existing_file:
                return jsonify({"message": "File with the same name already exists"})

            file.save(filepath)
            print(f"File saved temporarily at: {filepath}")

            with open(filepath, 'rb') as file:
                file_data = file.read()

            print(f"File Name: {filename}")
            print(f"File Size: {len(file_data)} bytes")

            user_email = request.form.get('email', '')

            file_type = get_file_type(filename)
            new_file = File(email=user_email, file_name=filename, file_type=file_type, file_data=file_data)
            db.session.add(new_file)
            db.session.commit()

            os.remove(filepath)

            return jsonify({"message": "File uploaded successfully"})

    except Exception as e:
        db.session.rollback()
        print(f"Error uploading file to the database: {str(e)}")
        return jsonify({"error": "Error uploading file to the database"})
  
  
from flask import jsonify
@app.route('/api/delete', methods=['POST'])
def delete_files():
    try:
        user_email = request.json.get('email')
        filenames = request.json.get('filenames')

        if not user_email or not filenames:
            return jsonify({"error": "Missing required parameters"})

        files_to_delete = File.query.filter(File.email == user_email, File.file_name.in_(filenames)).all()

        for file_to_delete in files_to_delete:
            # Retrieve and delete associated FileShare records
            shared_files = FileShare.query.filter(FileShare.file_id == file_to_delete.id).all()
            for shared_file in shared_files:
                db.session.delete(shared_file)

            db.session.commit()  # Commit deletions in FileShare table

            # Delete the file from the File table
            db.session.delete(file_to_delete)

        db.session.commit()  # Commit deletions in File table
        return jsonify({"message": "Files deleted successfully"})

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting files from the database: {str(e)}")
        return jsonify({"error": "Error deleting files from the database"})





from datetime import datetime

@app.route('/api/share', methods=['POST'])
def share_file():
    try:
        shared_by_email = request.form.get('shared_by_email')
        shared_with_email = request.form.get('shared_with_email')
        file_id = int(request.form.get('file_id'))
        
        print(" shared_by_email = " , shared_by_email , " shared_with = " , shared_with_email , " file_id = ",file_id)

        file_to_share = File.query.filter_by(id=file_id, email=shared_by_email).first()
        if not file_to_share:
            print("File not found or does not belong to the user.")
            return jsonify({"error": "File not found or does not belong to the user."}), 404

        existing_share = FileShare.query.filter_by(
            shared_by_email=shared_by_email,
            shared_with_email=shared_with_email,
            file_id=file_id
        ).first()

        print(" existing share = ", existing_share)

        if not existing_share:
            print(" new_share == ")
            shared_at = datetime.utcnow()  # Current timestamp
            new_share = FileShare(
                shared_by_email=shared_by_email,
                shared_with_email=shared_with_email,
                file_id=file_id,
                shared_at=shared_at  # Setting shared_at attribute
            )
            db.session.add(new_share)
            db.session.commit()

            return jsonify({"message": "File shared successfully!"}), 200
        else:
            print("File is already shared with the user.")
            return jsonify({"error": "File is already shared with the user."}), 200

    except ValueError as ve:
        print(f"Invalid file ID provided: {ve}")
        return jsonify({"error": "Invalid file ID provided."}), 400
    except Exception as e:
        print(f"Error sharing file: {str(e)}")
        return jsonify({"error": f"Error sharing file: {str(e)}"}), 500


@app.route('/api/shared_files/<user_email>', methods=['GET'])
def get_shared_files(user_email):
    try:
        # Get the files shared with the user
        shared_files = FileShare.query.filter_by(shared_with_email=user_email).all()

        # Extract file information for each shared file
        shared_files_info = []
        for shared_file in shared_files:
            file_info = {
                'file_name': shared_file.file.file_name,
                'file_type': shared_file.file.file_type,
                'shared_by_email': shared_file.shared_by_email,
                'shared_at': shared_file.shared_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            shared_files_info.append(file_info)

        return jsonify(shared_files_info)

    except Exception as e:
        return f'Error getting shared files: {str(e)}'
    
@app.route('/api/my_files', methods=['GET'])
def my_files():
    try:
        user_email = request.args.get('user_email')  # Assuming you get the user's email as a parameter

        # Fetch files owned by the user and avoid duplicates
        user_files = (
            db.session.query(File)
            .filter_by(email=user_email)
            .distinct(File.file_name)  # Consider the file name to avoid duplicates
            .all()
        )

        # Serialize fetched files into a JSON response
        files_data = [
            {
                'file_id': file.id,
                'file_name': file.file_name,
                'file_type': file.file_type,
                # Add other necessary file data...
            }
            for file in user_files
        ]

        return jsonify(files_data)  # Return files owned by the user as JSON
    except Exception as e:
        return jsonify({'error': str(e)})  # Handle any exceptions or errors




if __name__ == '__main__':
    app.run(debug=True)  # You can set debug=True for development

    