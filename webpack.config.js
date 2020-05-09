const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = webpackEnv => {
  const isDevelopment = webpackEnv.NODE_ENV !== 'production';
  const shouldUseSourceMap = webpackEnv.GENERATE_SOURCEMAP !== 'false';

  const isEnvProductionProfile =
    !isDevelopment && process.argv.includes('--profile');

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
      path: path.join(__dirname, "build"),
      pathinfo: isDevelopment,  
      chunkFilename: !isDevelopment
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isDevelopment && 'static/js/[name].chunk.js',
      filename: "bundle.js"
    },
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      }
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
            options: {
              sync: true
            }
          },
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, 'public/index.html')
      }),
    ].filter(Boolean)
  }
};