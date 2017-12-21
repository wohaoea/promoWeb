var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    //context: __dirname + '/public/js',
    entry: './public/js/app/app.js',
    output: {
        path: __dirname + '/public/',
        filename: 'js/app/bundle.js'
    },
    plugins: [
        /*new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super',$', d'exports', 'require']   
            }
        })*/
        new webpack.OldWatchingPlugin()
        
    ],
    externals: {
        'react': 'React',
        'react-router': 'ReactRouter',
        'jquery': 'jQuery',
        'reflux': 'Reflux'
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['jsx-loader?harmony']
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(jpg|png|svg)$/,
            loader: "url?limit=8192"
        }]
    }
};