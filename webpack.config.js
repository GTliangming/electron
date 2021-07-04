const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawn = require('child_process').spawn;
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    port: 3000,
    after() {
      spawn('npm', ['run', 'start-electron-with-nodemon']),
        spawn('npm', ['run', 'start-electron'], {
          shell: true,
          env: process.env,
          stdio: 'inherit'
        })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError))
      },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@components": path.resolve(__dirname, 'src/components/')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}