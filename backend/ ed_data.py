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

def encrypt(message, passphrase):
    IV = Random.new().read(BLOCK_SIZE)
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    # return base64.b64encode(IV + aes.encrypt(pad(message)))
    return base64.b64encode(IV + aes.encrypt(pad(message))).decode()

def decrypt(encrypted, passphrase):
    encrypted = base64.b64decode(encrypted)
    IV = encrypted[:BLOCK_SIZE]
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    # return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))
    return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]).decode())


enc = encrypt( textToEncrypt, key )
print(enc)
dec = decrypt(enc,key)
print(dec)
# enc = "47VFkNa8iQnGHORqpZUvP9VH6BDyZdf7WPeZQXCE31pVCWWJJIIJSs9p2T2J+Z15"
enc = "VmZPEojkbq8nwMMoeVd7SCuT6KnrckosXToec1dP+Uo="
dec = decrypt(enc,key)
print(" this time it is ",dec)
enc = "XjAH2IzR+xtcPS2hlK6wGm88UGSaRZY8CBsJg63apoc="
dec  = decrypt(enc,key)
print(" dec here_1 = " , dec)
