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


# enc = encrypt( textToEncrypt, key )
# print(enc)
# dec = decrypt(enc,key)
# print(dec)
# enc = "47VFkNa8iQnGHORqpZUvP9VH6BDyZdf7WPeZQXCE31pVCWWJJIIJSs9p2T2J+Z15"
# dec = decrypt(enc,key)
# print(" this time it is ",dec)











# def pad(data):
#     length = 16 - (len(data) % 16)
#     return data + chr(length)*length

# def unpad(data):
#     return data[:-ord(data[-1])]


# # key = 'Y0/JSgAAw23z9aiYAIDzhQ=='
# keystr = "Message"
# key = hashlib.sha256(keystr.encode('utf-8')).hexdigest()

# print("key = "+ key)



# # s = ""
# # s = hashlib.md5(s.encode())
# # s = s.digest()
# # s1 = base64.b64encode(s)
# # print(" s1 = " , s1)

# # encoder = PKCS7Encoder()


# str = "puoe8P4BuGBZtJV+6/0Kpw=="


# # decodetxt = base64.b64decode(str)
# # iv = decodetxt[:,16]
# # aes = AES.new(key , AES.MODE_CBC , iv) 
# # cypher = aes.decrypt(decodetxt)
# # pad_text = encoder.decode(cypher)

# # print(pad_text) 

# import base64
# import hashlib
# from Crypto import Random
# from Crypto.Cipher import AES

# class AESCipher(object):

#     def __init__(self, key): 
#         self.bs = AES.block_size
#         # print("key = "+ key)
#         # keyenc = key.encode('utf-8')
#         # self.key = hashlib.md5(key).digest()
#         # self.key = hashlib.sha256(key.encode('utf-8')).hexdigest()
#         self.key = key
#         print(" self.key = ", self.key)

#     def encrypt(self, raw):
#         raw = self._pad(raw)
#         iv = Random.new().read(AES.block_size)
#         cipher = AES.new(self.key, AES.MODE_CBC, iv)
#         return base64.b64encode(iv + cipher.encrypt(raw.encode()))

#     def decrypt(self, enc):
#         enc = base64.b64decode(enc)
#         iv = enc[:AES.block_size]
#         cipher = AES.new(self.key, AES.MODE_CBC, iv)
#         return self._unpad(cipher.decrypt(enc[AES.block_size:])).decode('utf-8')

#     def _pad(self, s):
#         return s + (self.bs - len(s) % self.bs) * chr(self.bs - len(s) % self.bs)

#     @staticmethod
#     def _unpad(s):
#         return s[:-ord(s[len(s)-1:])]
    
# obj = AESCipher("1234567890123456")
# enc = obj.encrypt("varad")
# dec = obj.decrypt(enc)

# print(" enc=" , enc , " dec=" , dec)

# from Crypto import Random
# from Crypto.Cipher import AES
# import base64

# BLOCK_SIZE = 16
# key = "1234567890123456" # want to be 16 chars
# textToEncrypt = "This is text to encrypt"

# def pad(data):
#     length = 16 - (len(data) % 16)
#     return data + chr(length)*length

# def unpad(data):
#     return data[:-ord(data[-1])]

# def encrypt(message, passphrase):
#     IV = Random.new().read(BLOCK_SIZE)
#     aes = AES.new(passphrase, AES.MODE_CFB, IV, segment_size=128)
#     return base64.b64encode(IV + aes.encrypt(pad(message)))

# def decrypt(encrypted, passphrase):
#     encrypted = base64.b64decode(encrypted)
#     IV = encrypted[:BLOCK_SIZE]
#     aes = AES.new(passphrase, AES.MODE_CFB, IV, segment_size=128)
#     return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))

# print(encrypt( textToEncrypt, key ))

# master_key = '1234567890123456' 

# def encrypt_val(clear_text):
#     encoder = PKCS7Encoder()
#     raw = encoder.encode(clear_text)
#     iv = Random.new().read( 16 )
#     cipher = AES.new( master_key, AES.MODE_CBC, iv, segment_size=128 )
#     return base64.b64encode( iv + cipher.encrypt( raw ) ) 

# def decrypt_val(clear_text):
#     encoder = PKCS7Encoder()
#     raw = encoder.decode(clear_text)
#     iv = raw[:16]
#     cipher = AES.new( master_key, AES.MODE_CBC, iv, segment_size=128 )
#     return base64.b64decode( cipher.decrypt( raw ) ) 

# enc = encrypt_val("varad")
# dec = decrypt_val(enc)
# print(" enc=" , enc , " dec= " . dec)

# BLOCK_SIZE = 16
# key = b'1234567890123456' # want to be 16 chars
# print(" key=" , key , " len(key)=" , len(key))
# textToEncrypt = "This is text to encrypt"
# # key = base64.b64encode(key)

# def pad(data):
#     length = 16 - (len(data) % 16)
#     return data + bytes(length)*length  #  bytes(length)*length in python 3 and chr(length)*length in python 2 . 

# def unpad(data):
#     return data[:-ord(data[-1])]

# def encrypt(message, passphrase):
#     # passphrase MUST be 16, 24 or 32 bytes long, how can I do that ?
#     encoder = PKCS7Encoder()
#     passphrase = encoder.encode(passphrase)
#     IV = b'\0'*16
#     aes = AES.new(passphrase, AES.MODE_CFB, IV)
#     return base64.b64encode(aes.encrypt(message))

# def decrypt(encrypted, passphrase):
#     encoder = PKCS7Encoder()
#     encrypted = encoder.decode(encrypted)
#     IV = encrypted[:16]
#     aes = AES.new(passphrase, AES.MODE_CFB, IV)
#     return aes.decrypt(base64.b64decode(encrypted))

# enc = encrypt( textToEncrypt, key )
# print(enc)
# dec = decrypt(enc,key)
# print(dec)

# AES 256 encryption/decryption using pycrypto library
 
# from hashlib import md5

# from Crypto.Cipher import AES
# from Crypto.Random import get_random_bytes
# from Crypto.Util.Padding import pad, unpad


# class AESCipher:
#     def __init__(self, key):
#         password = key.encode('utf-8')
#         self.key = md5(password).digest()

#     def encrypt(self, data):
#         vector = get_random_bytes(AES.block_size)
#         encryption_cipher = AES.new(self.key, AES.MODE_CBC, vector)
#         return vector + encryption_cipher.encrypt(pad(data,  AES.block_size))

#     def decrypt(self, data):
#         file_vector = data[:AES.block_size]
#         decryption_cipher = AES.new(self.key, AES.MODE_CBC, file_vector)
#         return unpad(decryption_cipher.decrypt(data[AES.block_size:]), AES.block_size)


# if __name__ == '__main__':
#     print('TESTING ENCRYPTION')
#     msg = "helloWorld".encode('utf-8')
#     pwd = "password"
    
#     encrypted = AESCipher(pwd).encrypt(msg)
#     print('Ciphertext:', encrypted)
    
#     # print(" \n decoded encrypted = " , encrypted.decode('ascii'))
#     print('\nTESTING DECRYPTION')
#     decrypted = AESCipher(pwd).decrypt(encrypted).decode('utf-8')
#     print("Original data: ", msg.decode('utf-8'))
#     print("Decripted data:", decrypted)
#     assert msg.decode('utf-8') == decrypted 


# import os, json
# import binascii

# from cgi import parse_header, parse_multipart
# from urllib.parse import urlparse
# from urllib.parse import parse_qs
# from http.server import BaseHTTPRequestHandler, HTTPServer

# from Crypto import Random
# from Crypto.Cipher import AES

# class Cryptor(object):
# 	'''
# 	Provide encryption and decryption function that works with crypto-js.
# 	https://code.google.com/p/crypto-js/
	
# 	Padding implemented as per RFC 2315: PKCS#7 page 21
# 	http://www.ietf.org/rfc/rfc2315.txt
	
# 	The key to make pycrypto work with crypto-js are:
# 	1. Use MODE_CFB.  For some reason, crypto-js decrypted result from MODE_CBC
# 	   gets truncated
# 	2. Use Pkcs7 padding as per RFC 2315, the default padding used by CryptoJS
# 	3. On the JS side, make sure to wrap ciphertext with CryptoJS.lib.CipherParams.create()
# 	'''
	
# 	# AES-256 key (32 bytes)
# 	KEY = "01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0"
# 	BLOCK_SIZE = 16
	
# 	@classmethod
# 	def _pad_string(cls, in_string):
# 		'''Pad an input string according to PKCS#7'''
# 		in_len = len(in_string)
# 		print(" instring=" , in_string)
# 		pad_size = cls.BLOCK_SIZE - (in_len % cls.BLOCK_SIZE)
# 		return in_string.ljust(in_len + pad_size, chr(pad_size))
	
# 	@classmethod
# 	def _unpad_string(cls, in_string):
# 		'''Remove the PKCS#7 padding from a text string'''
# 		in_len = len(in_string)
# 		pad_size = ord(in_string[-1])
# 		if pad_size > cls.BLOCK_SIZE:
# 			raise ValueError('Input is not padded or padding is corrupt')
# 		return in_string[:in_len - pad_size]
	
# 	@classmethod
# 	def generate_iv(cls, size=16):
# 		return Random.get_random_bytes(size)
	
# 	@classmethod
# 	def encrypt(cls, in_string, in_key, in_iv=None):
# 		'''
# 		Return encrypted string.
# 		@in_string: Simple str to be encrypted
# 		@key: hexified key
# 		@iv: hexified iv
# 		'''
# 		key = binascii.a2b_hex(in_key)
		
# 		if in_iv is None:
# 			iv = cls.generate_iv()
# 			in_iv = binascii.b2a_hex(iv)
# 		else:
# 			iv = binascii.a2b_hex(in_iv)
		
# 		aes = AES.new(key, AES.MODE_CFB, iv, segment_size=128)
# 		return in_iv, aes.encrypt(cls._pad_string(in_string.decode()).encode())
	
# 	@classmethod
# 	def decrypt(cls, in_encrypted, in_key, in_iv):
# 		'''
# 		Return encrypted string.
# 		@in_encrypted: Base64 encoded 
# 		@key: hexified key
# 		@iv: hexified iv
# 		'''
# 		key = binascii.a2b_hex(in_key)
# 		iv = binascii.a2b_hex(in_iv)
# 		aes = AES.new(key, AES.MODE_CFB, iv, segment_size=128)		
		
# 		decrypted = aes.decrypt(binascii.a2b_base64(in_encrypted).rstrip())
# 		return cls._unpad_string(decrypted)