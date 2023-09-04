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

def unpad(data):
    return data[:-ord(data[-1])]

def encrypt(message):
    IV = Random.new().read(BLOCK_SIZE)
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    # return base64.b64encode(IV + aes.encrypt(pad(message)))
    return base64.b64encode(IV + aes.encrypt(pad(message))).decode()

def decrypt(encrypted):
    encrypted = base64.b64decode(encrypted)
    IV = encrypted[:BLOCK_SIZE]
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    # return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))
    return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]).decode())





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
    
    if user : 
        if (user.password == password) : 
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

@app.route('/userpage' , methods = ['GET','POST'])
def userpage():
    print("request.json = " , request.json)
    type = request.json['type']
    salary = request.json['salary']
    email = request.json['email']
    user = Basic.query.filter_by(email = email).first()
    print(" \n\n\n user = " , str(user))
    # print(" \n\n\n user = " , user.json())
    user.type = type
    user.salary = salary
    print(" user.type = " , user.type) 
    print(user)
    db.session.commit()
    print(type , salary ,email)
    response = make_response({"status" : "Details recorded successfully"})
    response.status_code = 200
    return response



if __name__ == '__main__':
    app.run(debug=True)  # You can set debug=True for development

    