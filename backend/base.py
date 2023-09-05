from flask import Flask , request , jsonify , make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import inspect



import base64
from Crypto.Hash import SHA256
from Crypto import Random
from Crypto.Cipher import AES
from pkcs7 import PKCS7Encoder
import pkcs7,threading, base64
import hashlib

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

# def decrypt(encrypted):
#     encrypted = base64.b64decode(encrypted)
#     IV = encrypted[:BLOCK_SIZE]
#     aes = AES.new(passphrase, AES.MODE_CBC, IV)
#     # return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))
#     return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]).decode())

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



app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:2001@127.0.0.1/employee_details'
app.config['SECRET_KEY'] = 'Any_random key works '
CORS(app)   
db = SQLAlchemy(app) 
 
class Basic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(80),nullable=False)
    # lname = db.Column(db.String(120),nullable=False)
    email = db.Column(db.String(120), unique=True , nullable=False)
    password = db.Column(db.String(120),nullable=False)
    type = db.Column(db.String(120),nullable=False)
    salary = db.Column(db.String(120), nullable=False)
    last_login= db.Column(db.DateTime,default = datetime.now) 
    
    
class EncryptedFile(db.Model):
    __tablename__ = 'encrypted_files'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text)  # You can adjust the data type as needed
    user_email = db.Column(db.String(255), db.ForeignKey('Basic.email'))
    
    print(" user_email for db session = " , user_email)

    def __init__(self, data, user_email):
        self.data = data
        self.user_email = user_email
    

with app.app_context():
    db_inspector = inspect(db.engine)
    if not db_inspector.has_table('employee_details'):
        # Create database tables
        db.create_all()
    

@app.route('/' , methods = ['GET' , 'POST'])
def my_profile():
    email = request.json['email']
    password = request.json['password']  
    
    print(request.json)
    
    user = Basic.query.filter_by(email = email).first() 
    print(" user in / = " , user)
    
    print(" decrypted db pass = " , decrypt(user.password))
    print(" decrypted cur pass = " , decrypt(password))
    
    if user : 
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
    fname = request.json['data']['fname']
    # lname = request.json['lname']
    password = request.json['data']['password']
    salary = 0 
    type=""
    
    # demail = decrypt(email)
    demail = email
    dfname = decrypt(fname)
    dpassword = decrypt(password)
    print(" demail = " , demail , " dfname = ", dfname  , " dpassword = ", dpassword)
    
    user = Basic.query.filter_by(email = email).first() 
    
    if user : 
        print(user.email , email)
        if user.email == email : 
            response = make_response({"status" : "Email is already registered!"})
            response.status_code = 201 
            return response
    
    entry = Basic(fname=fname,email=email,password=password,type=type,salary=salary)
    print(entry)
    db.session.add(entry)
    db.session.commit()
    print(email , fname , password )
    response = make_response({"status" : " Account Successfully Created"})
    response.status_code = 200
    return response

# @app.route('/userpage' , methods = ['GET','POST'])
# def userpage():
#     print("request.form =", request.form)
#     type = request.form['type']
#     salary = request.form['salary']
#     email = request.form['email']
    
    
#     # Access the uploaded files
#     encrypted_files = request.json['file']
#     for i in range(len(request.files)):
#         file_key = f'file{i}'
#         if file_key in request.files:
#             encrypted_file = request.files[file_key]
#             # Ensure the filename is safe
#             filename = secure_filename(encrypted_file.filename)
            
#             # Save the encrypted file
#             encrypted_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
#             encrypted_files.append(filename)
    
#     print(" enc file = " , encrypted_files)
    
#     user = Basic.query.filter_by(email=email).first()
#     print("\n\n\nuser =", str(user))
#     user.type = type
#     user.salary = salary
#     print("user.type =", user.type)
#     print(user)
#     db.session.commit()
#     print(type, salary, email)
#     response = make_response({"status": "Details recorded successfully"})
#     response.status_code = 200
#     return response

# @app.route('/userpage', methods=['POST'])
# def userpage():
#     type = request.form['type']
#     salary = request.form['salary']
#     email = request.form['email']
#     print(" am i reaching here ??/ ")
    
#     # Store encrypted files in the database
#     for base64_encoded_file in request.form.getlist('files[]'):
#         print(" am i reaching here ?? ")
#         encrypted_file_data = b64decode(base64_encoded_file)
#         print(" enc file data = " , encrypted_file_data)
#         encrypted_file = EncryptedFile(data=encrypted_file_data, user_email=email)
#         db.session.add(encrypted_file)

#     # Update user details
#     user = Basic.query.filter_by(email=email).first()
#     user.type = type
#     user.salary = salary
#     db.session.commit()
    
#     response = make_response({"status": "Details recorded successfully"})
#     response.status_code = 200
#     return response

from base64 import b64decode

@app.route('/userpage', methods=['POST'])
def userpage():
    try:
        # Retrieve form data
        type = request.form['type']
        salary = request.form['salary']
        email = request.form['email']

        # Store encrypted files in the database
        for base64_encoded_file in request.form.getlist('files[]'):
            # Decode the Base64-encoded file data
            encrypted_file_data = b64decode(base64_encoded_file)
            print(" enc file data = " , encrypted_file_data)
            # Create an EncryptedFile instance and add it to the database
            encrypted_file = EncryptedFile(data=encrypted_file_data, user_email=email)
            db.session.add(encrypted_file)

        # Update user details
        user = Basic.query.filter_by(email=email).first()
        user.type = type
        user.salary = salary
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


# @app.route('/userpage' , methods = ['GET','POST'])
# def userpage():
#     print("request.json = " , request.json)
#     type = request.json['type']
#     salary = request.json['salary']
#     email = request.json['email']
#     user = Basic.query.filter_by(email = email).first()
#     print(" \n\n\n user = " , str(user))
#     # print(" \n\n\n user = " , user.json())
#     user.type = type
#     user.salary = salary
#     print(" user.type = " , user.type) 
#     print(user)
#     db.session.commit()
#     print(type , salary ,email)
#     response = make_response({"status" : "Details recorded successfully"})
#     response.status_code = 200
#     return response



if __name__ == '__main__':
    app.run(debug=True)  # You can set debug=True for development

    