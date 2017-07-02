module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine', 'sinon'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    { 
                        test: /\.js/, 
                        exclude: /node_modules/, 
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        } 
                    }
                ]
            },
            watch: true            
        },
        webpackServer: {
            noInfo: true
        }
    });
};






