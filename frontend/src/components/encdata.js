import CryptoJS from "crypto-js";
export default function encrypt(str) {
    var data = str;//Message to Encrypt
    var iv = CryptoJS.enc.Base64.parse("");//giving empty initialization vector
    console.log(" iv=" + iv, " typeof iv=" + typeof (iv));
    var key = CryptoJS.enc.Utf8.parse("1234567890123456");//hashing the key using SHA256
    // var key = "01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0"
    console.log(" key = " + key);
    var encryptedString = encryptData(data, key);
    console.log("encryptedstring = " + encryptedString);//genrated encryption String:  swBX2r1Av2tKpdN7CYisMg==

    // function encryptData(data, iv, key) {
    //     if (typeof data == "string") {
    //         data = data.slice();
    //         console.log(" data = "+data , " typeofdata = "+typeof(data) , " iv=" + iv);
    //         encryptedString = CryptoJS.AES.encrypt(data, key, {
    //             iv: iv,
    //             mode: CryptoJS.mode.CBC,
    //             padding: CryptoJS.pad.Pkcs7
    //         });
    //     }
    //     else {
    //         encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    //             iv: iv,
    //             mode: CryptoJS.mode.CBC,
    //             padding: CryptoJS.pad.Pkcs7
    //         });
    //     }
    //     console.log(" encryptedString.ciphertext = " + encryptedString.ciphertext);
    //     console.log(" encrypted = " , encryptedString)
    //     console.log(" encryptedString = " , encryptedString.toString())
    //     return encryptedString.toString();
    // }


    function encryptData(data, key) {
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

// export default function encrypt(str,ivt){
//     var key1 = "01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0"
//     str = str.slice()
//     var key = CryptoJS.enc.Hex.parse(key1);
//         iv = CryptoJS.enc.Hex.parse(ivt);
//         cipher = CryptoJS.lib.CipherParams.create({
//             ciphertest : CryptoJS.enc.Base64.parse(encrypted.ciphertest)
//         }),
//         result = CryptoJS.AES.encrypt(str, key, {iv: iv, mode: CryptoJS.mode.CFB});

//     print(" result.tostring = ",result.toString(CryptoJS.enc.Utf8));
// }