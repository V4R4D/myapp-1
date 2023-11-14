import CryptoJS from "crypto-js";
export  function encryptText(str) {
    var data = str;//Message to Encrypt
    var iv = CryptoJS.enc.Base64.parse("");//giving empty initialization vector
    console.log(" iv=" + iv, " typeof iv=" + typeof (iv));
    var key = CryptoJS.enc.Utf8.parse("1234567890123456");//hashing the key using SHA256
    // var key = "01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0"
    console.log(" key = " + key);
    var encryptedString = encryptText(data, key);
    console.log("encryptedstring = " + encryptedString);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==

    


    function encryptText(data, key) {
        // data is expected to be Utf8 encoded
        var iv = CryptoJS.lib.WordArray.random(16);
        var encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv
        });
        return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    }
    var obj = {
        str: encryptedString,
        key: key
    }
    console.log(" here data=   " + data + " encryptedstring=  " + encryptedString);
    return encryptedString;
}

export function encryptFile(file, encryptionKey) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const fileData = event.target.result;
        const iv = CryptoJS.lib.WordArray.random(16);
        const key = CryptoJS.enc.Utf8.parse(encryptionKey);
  
        const encryptedFile = encryptFileData(fileData, key, iv);
  
        resolve(encryptedFile);
      };
  
      reader.onerror = (event) => {
        reject(new Error("Failed to read the file."));
      };
  
      reader.readAsArrayBuffer(file);
    });
  }
  
  function encryptFileData(data, key, iv) {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
    });
  
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  }

// import CryptoJS from "crypto-js";

// // Function to encrypt text
// export function encryptText(str) {
//   const data = str;
//   const iv = CryptoJS.lib.WordArray.random(16);
// //   const key = CryptoJS.enc.Utf8.parse(encryptionKey);
// var key = CryptoJS.enc.Utf8.parse("1234567890123456");

//   const encryptedString = encryptData(data, key, iv);

//   return encryptedString;
// }

// // Function to encrypt a file
// export function encryptFile(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
  
//       reader.onload = async (event) => {
//         try {
//           const fileData = new Uint8Array(event.target.result); // Convert Blob to ArrayBuffer
//           const iv = CryptoJS.lib.WordArray.random(16);
//           var key = CryptoJS.enc.Utf8.parse("1234567890123456");
  
//           const encryptedFile = await encryptData(fileData, key, iv);
//           console.log("Encrypted File: ", encryptedFile); // Log the encrypted file data
//           resolve(encryptedFile);
//         } catch (error) {
//           console.error("Encryption Error: ", error); // Log any encryption errors
//           reject(error);
//         }
//       };
  
//       reader.onerror = (event) => {
//         console.error("File Read Error: ", event.target.error); // Log file read errors
//         reject(new Error("Failed to read the file."));
//       };
  
//       reader.readAsArrayBuffer(file);
//     });
//   }
  

// function encryptData(data, key, iv) {
//   try {
//     const encrypted = CryptoJS.AES.encrypt(data, key, {
//       iv: iv,
//     });

//     return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
//   } catch (error) {
//     console.error("Encryption Error: ", error); // Log any encryption errors
//     throw error;
//   }
// }


// import CryptoJS from "crypto-js";

// // Function to encrypt text
// export function encryptText(str) {
//   const data = str;
//   const iv = CryptoJS.lib.WordArray.random(16);
// //   const key = CryptoJS.enc.Utf8.parse(encryptionKey);
// var key = CryptoJS.enc.Utf8.parse("1234567890123456");

//   const encryptedString = encryptData(data, key, iv);

//   return encryptedString;
// }


// // Function to encrypt a file
// export function encryptFile(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const fileData = event.target.result;
//         const iv = CryptoJS.lib.WordArray.random(16);
//         const key = CryptoJS.enc.Utf8.parse("1234567890123456");

//         const encryptedFile = encryptData(fileData, key, iv);
//         console.log("Encrypted File: ", encryptedFile); // Log the encrypted file data
//         resolve(encryptedFile);
//       } catch (error) {
//         console.error("Encryption Error: ", error); // Log any encryption errors
//         reject(error);
//       }
//     };

//     reader.onerror = (event) => {
//       console.error("File Read Error: ", event.target.error); // Log file read errors
//       reject(new Error("Failed to read the file."));
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }

// function encryptData(data, key, iv) {
//   try {
//     const encrypted = CryptoJS.AES.encrypt(
//       CryptoJS.enc.Hex.parse(bytesToHex(data)), // Ensure data is correctly formatted
//       key,
//       {
//         iv: iv,
//       }
//     );

//     return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
//   } catch (error) {
//     console.error("Encryption Error: ", error); // Log any encryption errors
//     throw error;
//   }
// }

// function bytesToHex(byteArray) {
//   const hex = [];
//   for (let i = 0; i < byteArray.length; ++i) {
//     hex.push(byteArray[i].toString(16));
//   }
//   return hex.join("");
// }

