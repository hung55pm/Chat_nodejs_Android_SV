/**
 * Created by MR_HUNG on 2/28/2017.
 */
var admin = require("firebase-admin");
var path = require("path");

var defaultApp= admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "chat-nodejs-android",
        clientEmail: "firebase-adminsdk-96j3n@chat-nodejs-android.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6o3sR3x2zBnsR\nQeo3tN+9xISkqocyaxy1UV/tceVAnJ6bvwQZmlDxoam2Y31ah50ZDqbtYLffTPuz\nDPX7Hi/iODpbTSYIn6nFMIDOnwSsmmDh0QZcscrKFNkkHgZXUPwphYRMVfecMTc3\nw+fU+JEUkt6FNa9IC1FKk1HJm9rri56lTQ37Y4tmw5qdyCnPc0c0rzJvr54GXfWs\nYSDB/Bt3VZRQShiIX8QgZkKFJ4RQMXFEV4nlIQH0s0Uw0y8+GkLxrK1kNwESCSjY\n0lSLNu9SIS9K3xfVXQwbX0wGbWdJdIBN/1cKd2bQBVXcLl0k0Xs8kAfd63Xrw/ig\ncVztZTiBAgMBAAECggEAGBKf/BUgGog6dWZgFGFS/oILbcXE/F7ObCCb099951CM\nMKB5oefCivgEEM9SSsv1GldGdpWkAbxHNrf0PjiNiosgE8imoDQfzJxN8NiX3L9o\nwZeZT3lrI5d+zmbFAJwkeiKLhuELt+ytJ5cwHssUw2eSJfJfslYrXQgVY4Cjwv+d\nxyswON1PU99+EL0ITG0aR3D8KbKITZTAjOeiLCCvCBxQ0TZclLIWYtIpS2WMEEEG\nSl6dwkUWyftTOpwGlpbASWyPwvQjHLTSuOnhorSPMRqwOnCod61VNaWBWN7eaGID\nTZWo5zU/MUjMf8AqAN7NTIU6h4nfo+yYb4ABRVbtpQKBgQDfbMFZgSS0PnInHkDs\nJ3kDC9a6fYha2thEmHscoGqe6YJD+P36XiT5yY22WKdoz2SyucFx2gqxir31I/dl\nwQcPBf7kDW6/YgGc3f2BW8aIROrNQyMDaCBT/y27N8B2lOg2REBXwr+pwNcOI67X\naBKTGGu23wqTX3bK9MqxNd4FKwKBgQDV2bGcL/CjdI0dXD5Aq7iGtbGQbQd+SHke\nkZs9aFGUhAhn4wcDc6aaVxJT+mIkOzOyeddqPZO5E7use3t5dOsEq6klsWX6u/56\ng2Ydwn9lk+yZLO2hB8IB4qFZIcV2d4qDC/0BnbkPFeeCq03U/gvbK10wt//FNTmD\nMVixjS77AwKBgAZBekxyRD/Tu8iCnVi/ZjECpNmF6Ep69DE/f7r2duXKLf6POzVG\na4ye6xve8ZkKrYwfjV4Nt9zuwJDbl/K+a98s0M073wz2xorI4G89zZpFK7nhllpj\nEPypGXOzhO0NEE9sq8yJRGqRXrQjpaKcZGC//0wYhKhJtP7Lyd0aYAQPAoGAHZYH\nr48mYMbgOx6m8jWPyvtaPJwI/Fy0fRkx/BXxq3V04EKVltGqTBId1AaBC3gxV9Dp\nj6ZDSMjFH0DaPVyCo1vIhBF+BWl69KI3P4jILVqA0lRX7/5txer/3aABfLlfLXA8\nKbwTfVXPeNGQbBZVt5XRR8s9FKCfe1oZZj8dL9cCgYBPEkw+5Bzj5iczxCkM8ir2\nAVzdxiGtH0x2LJAfuUn225SNbRX2561/F0WsRDlEwh5BO+GVvVglkeLCugrZwb7a\nYkJtPFZrSYBydk/8VcGAwCxSzDbHtBCN3uF+t3DzYscoBdojz6LH1w2CUOCfSObj\nISQn2X5A5Bj01U9uSOdw6g==\n-----END PRIVATE KEY-----\n",

    }),
    // credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-nodejs-android.firebaseio.com"
});

console.log(defaultApp.name);  // "[DEFAULT]"

// Retrieve services via the defaultApp variable...
var defaultAuth = defaultApp.auth();
var defaultDatabase = defaultApp.database();
var message ={
    to : "",
        collapse_key : "",
        data : {
    key1 : "key1",
    key2 : "key2"
    },
    notification : {
        title : 'Title of the notification',
        body : 'Body of the notification'
    }
};
// ... or use the equivalent shorthand notation
defaultAuth = admin.auth();
defaultDatabase = admin.database();

defaultApp.send(message,function (err, result) {
    if(err){

    }else {

    }
    
})