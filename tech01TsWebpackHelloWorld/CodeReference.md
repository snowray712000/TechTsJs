# Code Copy
 
安裝全域 (此電腦只要裝一次就好)

```bash
# 先安裝 Node.Js, 接著
sudo npm i -g typescript
```

新專案 

```bash
npm init -y
tsc --init
```

安裝 webpack typescript 相關套件

```bash
npm i webpack webpack-cli -D
npm i typescript ts-loader -D
```

修改 tsconfig.json

```json
{
  "rootDir": "./src/", 
  "outDir": "./dist/",
}
```

建立基本常見 檔案的結構

```bash
mkdir dist src public
touch ./src/index.ts ./public/index.html
```

webpack.config.js

```js
const path = require('path')

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

修改 package.json 中的 scripts 

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "webpack -w --mode development",
    "build" : "webpack --mode production"
  },
}
```