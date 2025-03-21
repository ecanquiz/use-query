export function useEncryption() {
  const encryptMethodLength = 256;
  const encryptMethod = "AES-CBC";

  async function decrypt(encryptedString) {
    const json = JSON.parse(atob(encryptedString));

    const salt = hexStringToArrayBuffer(json.salt);
    const iv = hexStringToArrayBuffer(json.iv);

    const encrypted = base64StringToArrayBuffer(json.ciphertext);


    
   // const hashKey = await deriveKey(process.env.ENCKEY, salt);
   const hashKey = await deriveKey('13a176e557594ad81762c921f4dab38606967a624a372d035acb19967440bd3b', salt);



    const decrypted = await window.crypto.subtle.decrypt(
      { name: encryptMethod, iv },
      hashKey,
      encrypted
    );



    let outcome = new TextDecoder().decode(decrypted);

    return getObj(outcome);
  }

  function getObj(string) {
    var params = {};

    string.split("&").forEach(function (pair) {
        var parts = pair.split("=");
        var key = parts[0];
        var value = parts[1] || "";

        // Decodificar solo si es un URI component válido
        try {
            key = decodeURIComponent(key);
        } catch (e) {
            console.warn(`Skipping invalid URI component key: ${parts[0]}`);
        }

        try {
            value = decodeURIComponent(value);
        } catch (e) {
            console.warn(`Skipping invalid URI component value: ${parts[1]}`);
        }

        params[key] = value;
    });

    return params;
}


  async function encrypt(string) {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const salt = window.crypto.getRandomValues(new Uint8Array(32));

//    const hashKey = await deriveKey(process.env.ENCKEY, salt);
    const hashKey = await deriveKey('13a176e557594ad81762c921f4dab38606967a624a372d035acb19967440bd3b', salt);


    const encrypted = await window.crypto.subtle.encrypt(
      { name: encryptMethod, iv },
      hashKey,
      new TextEncoder().encode(string)
    );

    const output = {
      ciphertext: arrayBufferToBase64String(encrypted),
      iv: arrayBufferToHexString(iv),
      salt: arrayBufferToHexString(salt),
    };

    return btoa(JSON.stringify(output));
  }

  async function encryptFile(file) {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const salt = window.crypto.getRandomValues(new Uint8Array(32));

//    const hashKey = await deriveKey(process.env.ENCKEY, salt);
    const hashKey = await deriveKey('13a176e557594ad81762c921f4dab38606967a624a372d035acb19967440bd3b', salt);


    const arrayBuffer = await file.arrayBuffer();

    const encrypted = await window.crypto.subtle.encrypt(
      { name: encryptMethod, iv },
      hashKey,
      arrayBuffer
    );

    const output = {
      ciphertext: arrayBufferToBase64String(encrypted),
      iv: arrayBufferToHexString(iv),
      salt: arrayBufferToHexString(salt),
    };

    return btoa(JSON.stringify(output));
  }

  // Helper functions
  function hexStringToArrayBuffer(hexString) {
    const bytes = new Uint8Array(
      hexString.match(/[\da-f]{2}/gi).map((hex) => parseInt(hex, 16))
    );
    return bytes.buffer;
  }

  function arrayBufferToHexString(arrayBuffer) {
    return Array.prototype.map
      .call(new Uint8Array(arrayBuffer), (x) =>
        ("00" + x.toString(16)).slice(-2)
      )
      .join("");
  }

  function base64StringToArrayBuffer(base64String) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function arrayBufferToBase64String(arrayBuffer) {
    const binary = [];
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary.push(String.fromCharCode(bytes[i]));
    }
    return btoa(binary.join(""));
  }

  async function deriveKey(password, salt) {
    return await window.crypto.subtle
      .importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      )
      .then((baseKey) => {
        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: salt,
            iterations: 999,
            hash: "SHA-512",
          },
          baseKey,
          { name: "AES-CBC", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
      });
  }

  return { decrypt, encrypt, encryptFile };
}
