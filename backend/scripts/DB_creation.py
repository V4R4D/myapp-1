from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:2001@127.0.0.1/myappDB'
app.config['SECRET_KEY'] = 'Any_random key works '
CORS(app)

db = SQLAlchemy(app)

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

# Create the tables in the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True,port=5001)
