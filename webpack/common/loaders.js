
module.exports = [
    {
        test: /\.ts(x?)$/,
        loader: 'ts-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    },
    {
        test: /\.scss$/,
        loader: 'style!css!sass'
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html'
    },
    {
      test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      exclude: /node_modules/,
      loader: 'url-loader'
    },
];
