const autoprefixer = require('autoprefixer');

const styleLoader = (insertAt) => {
  return   {
      loader: 'style-loader',
      options: {
          insertAt: insertAt,
      }
  }
};

const cssLoader = () => {
    return {
        loader: 'css-loader',
        options: {
            minimize: false
        }
    };
};

const postCssLoader = () => {
    return {
        loader: 'postcss-loader',
        options: {
            plugins: function() {
                return [autoprefixer({add: false, browsers: []})]
            }
        }
    };
};



module.exports = {
    cssLoader,
    postCssLoader,
    styleLoader,
};
