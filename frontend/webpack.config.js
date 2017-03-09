var config = {
   entry: './main.js',
	
   output: {
      path:'./../api/static',
      filename: 'index.js',
   },
	
   devServer: {
      inline: true,
      port: 8000
   },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
				
            query: {
               presets: ['es2015', 'react']
            }
         },
         {
            test: /\.less?$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader',

         }         
      ]
   }
};

module.exports = config;