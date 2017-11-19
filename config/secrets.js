/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {
    
    // testing database server
    db: process.env.MONGODB || 'mongodb://127.0.0.1:27017/serialport',
    // db: process.env.MONGODB || 'mongodb://pareshb30:rashmib30P@ds029446.mlab.com:29446/excel',
    
    
    //Firebase config
    // firebaseConfig:{
    //     apiKey: process.env.FIREBASEAPIKEY || "AIzaSyDc9dWEQNqAAZDYxuAxg1EOLfZius8FDsc",//UI
    //     authDomain: process.env.FIREBASEAUTHDOMAIN || "excel-f18aa.firebaseapp.com",//UI
    //     firebaseDBURL: process.env.FIREBASEDBURL || "https://excel-f18aa.firebaseio.com", //API,UI
    //     storageBucket: process.env.FIREBASESTORAGEBUCKET || "excel-f18aa.appspot.com",//UI
    //     firebaseSA: process.env.FIREBASESA || "excel-0b641f5cc7c8.json" //API
    // }
};
