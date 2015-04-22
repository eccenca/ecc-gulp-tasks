# Eccenca common gulp tasks

Provides basic tasks for all your component needs.  
Currently includes:  
- `build` - compiles optimized (minified, deduped) commonjs version of your component with webpack. Uses `config.webpackConfig.production` as basic configuration.
- `debug` - compiles debug version of your component with webpack, watches for changes and re-compiles when needed (until interrupted). Uses `config.webpackConfig.debug` as basic configuration.
- `server` - uses express.js to statically serve folder specified in `config.path` at `localhost:8080`. Servers `index.html` for all non-existent requests to allow client-side routing testing. Allows access to express.js app via `config.serverOverrides(app)` function.
- `test` - runs mocha tests starting from file specified at `config.testEntryPoint`.
- `cover` - runs istanbul to generate test coverage from file specified at `config.testEntryPoint`.
