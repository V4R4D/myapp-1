import CryptoJS from "crypto-js";
export default function decrypt(encryptedString) {
    var iv = CryptoJS.enc.Base64.parse("");
    var key = CryptoJS.enc.Utf8.parse("1234567890123456");

    var decrypteddata = decryptData(encryptedString, key);
    console.log(" decrypted data ="+decrypteddata);//genrated decryption string:  Example1

    // function decryptData(encrypted, iv, key) {
    //     var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    //         iv: iv,
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7
    //     });
    //     return decrypted.toString(CryptoJS.enc.Utf8)
    // }
    function decryptData(encryptedString, key) {
        var ciphertext = CryptoJS.enc.Base64.parse(encryptedString);
    
        // split IV and ciphertext
        var iv = ciphertext.clone();
        iv.sigBytes = 16;
        iv.clamp();
        ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
        ciphertext.sigBytes -= 16;
        
        // decryption
        var decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, {
            iv: iv
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return decrypteddata;
}

// function decryptMsg (data) {
//     master_key = '1234567890123456';

//     // Decode the base64 data so we can separate iv and crypt text.
//     var rawData = atob(data);
//     // Split by 16 because my IV size
//     var iv = rawData.substring(0, 16);
//     var crypttext = rawData.substring(16);

//     //Parsers
//     crypttext = CryptoJS.enc.Latin1.parse(crypttext);
//     iv = CryptoJS.enc.Latin1.parse(iv); 
//     key = CryptoJS.enc.Utf8.parse(master_key);

//     // Decrypt
//     var plaintextArray = CryptoJS.AES.decrypt(
//       { ciphertext:  crypttext},
//       key,
//       {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}
//     );

//     // Can be Utf8 too
//     output_plaintext = CryptoJS.enc.Latin1.stringify(plaintextArray);
//     console.log("plain text : " + output_plaintext);
// }