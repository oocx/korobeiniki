const webpack = require('webpack');

module.exports = {
    plugins: [
      new webpack.EnvironmentPlugin([
        'FIREBASE_APIKEY',
        'FIREBASE_AUTHDOMAIN',
        'FIREBASE_DATABASEURL',
        'FIREBASE_PROJECTID',
        'FIREBASE_STORAGEBUCKETID',
        'FIREBASE_MESSAGINGSENDERID',
        'FIREBASE_APPID',
        'FIREBASE_COLLECTION'
      ])
    ]
}
