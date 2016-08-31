let path = require('path');

module.exports = {
    entry: path.join(__dirname, 'app/main.jsx'),
    output: {
        path: path.join(__dirname, 'app/static'),
        filename: 'bundle.js'
    },
    module: {
        loaders:[
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                include: [
                    path.join(__dirname, 'app')
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};