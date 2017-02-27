const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = (nodeEnv === 'production');

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './dist');

const extractCssToText = new ExtractTextPlugin({
    filename: 'style.css',
    allChunks: true
});

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(nodeEnv)
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js'
    }),
    new htmlWebpackPlugin({
        template: sourcePath + '/index.html',
        inject: true,
        hash: true
    })
];

if (isProd) {
    // Add production plugins to plugins array.
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false
            }
        }),
        new copyWebpackPlugin([
            { from: 'assets/images/*'}
        ]),
        extractCssToText
    );
} else {
    // Add developer plugins to plugins array.
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    );
}

module.exports = {
    devtool: isProd ? 'source-map' : 'cheap-module-source-map', // Source map config for debugging
    context: sourcePath,
    entry: {
        app: ['index'],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: isProd ? extractCssToText.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                }) : ['style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['es2015', 'react'],
                            plugins: ['transform-object-rest-spread', 'transform-runtime']
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            sourcePath,
            'node_modules'
        ]
    },
    devServer: {
        contentBase: sourcePath,
        inline: true, // Includes a small js in bundle which handles reloading on code change.
        historyApiFallback: true, // If HTML5 history API is used, then we have to serve index.html in place of 404.
        port: 3000,
        hot: true, // Enables hot reloading for react components
        compress: isProd, //GZip compression for assets
        stats: { colors: true }
    }
}
