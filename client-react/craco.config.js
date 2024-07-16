require('dotenv').config()

module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: `${process.env.APP_URL}:${process.env.APP_PORT}`,
        secure: false
      }
    },
    host: 'localhost',
    https: false,
    openPage: `?page=invoice&invoice_id=${process.env.DEV_INVOICE_ID}`,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
}