const { environment } = require('@rails/webpacker')

const webpack = require('webpack')

// Enable the splitChunks config
environment.splitChunks((config) => Object.assign({}, config, { optimization: { splitChunks: { chunks: 'all', name: false } }}))

environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery/src/jquery',
    jQuery: 'jquery/src/jquery',
    truncatise: 'truncatise/index',
    Rails: ['@rails/ujs']
  })
)

module.exports = environment
