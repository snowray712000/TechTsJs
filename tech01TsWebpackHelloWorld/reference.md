# Reference

## ts + webpack

### 安裝 webpack 、 typescript 相關

要先 npm init -y 後，再安裝其它套件，這樣 packeage.json 才會完整

```bash
npm init -y
tsc --init
```

雖然有 -g 裝過 typescript, 但 webpack 會去看 local 的, 所以仍然要再裝一次 typescript.

```bash
npm i webpack webpack-cli -D
npm i typescript ts-loader -D
```

### 檔案架構 dist src public

早期最基本的網頁，就是 index.html index.js index.css 三個檔案放著, 然後再丟到一個資料夾下. 現在, index.js 要變成 compile 出來的.

有 compile 的過程, 通常人還是把它放在不變資料夾 (compile 出來的可以隨便刪除，而若放在一起，刪到 source code 後果就嚴重了).

步驟

- 建立 dist 資料夾
- 建立 src 資料夾
  - 新增一個 index.ts 在裡面
- 建立 public 資料夾 (那種不用 compile 的資料)
  - 新增一個 index.html 在裡面
- 改變 tsconfig.json 中的 rootDir 從 './' 變為 './src/'
  - :warning: 注意! 有一個叫 rootDirs, 別設錯個.
- 改變  tsconfig.json 中的 rootDir 從 './' 變為 './dist/'

若此時, 執行 tsc 進行 compile, dist 中會有 index.js 被 compile 出來. 若再把 index.html 中再引用 index.js, 就可以用在 es5 網頁中了. (但我們現在要繼續完成 '用 wepback 取代 tsc', 或說, 用 webpack 藉著 ts-loader 自動執行 tsc)

### 使 webpack 完成任務 (將 index.ts 產出在 dist 資料夾中)

步驟

- 建立 webpack.config.js 檔, 將下面程式貼在
  - webpack 預設是 ./src/index.js, 但我們不是, 所以要設 entry
  - webpack 預設是對 .js 處理, 但我們現在要對 .ts 所以要設定 .ts 的處理方式, 就是透過 ts-loader.

```js
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
    }
}
```

常見錯誤  

執行 webpack -w, 會發現錯誤, 如下訊息. 你必然會感到困惑, 因為你明明已經裝了 webpack-cli. 要用另外的方法執行 webpack -w 就會正確.

```bash
littlesnow@mini-2021 tech04 % webpack -w
CLI for webpack must be installed.
  webpack-cli (https://github.com/webpack/webpack-cli)

We will use "npm" to install the CLI via "npm install -D webpack-cli".
Do you want to install 'webpack-cli' (yes/no): no
You need to install 'webpack-cli' to use webpack via CLI.
You can also install the CLI manually.
```

- 打開 package.json
  - 裡面應該有個 scripts 的, 還有一個 "test": "echo \"Error: no test specified\" && exit 1"
  - 這 scripts 就是說, 你可以用 npm run test
- 新增一個在 scripts
  - "dev" : "webpack -w"
- 執行 npm run dev

結果如下, 在 dist 資料夾下, 產出一個 main.js

```bash
littlesnow@mini-2021 tech04 % npm run dev

> tech04@1.0.0 dev
> webpack -w

asset main.js 44 bytes [emitted] [minimized] (name: main)
./src/index.ts 36 bytes [built] [code generated]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

webpack 5.65.0 compiled with 1 warning in 694 ms
```

package.json 內容大概如下

```json
{
  "name": "tech04",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "webpack -w"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-loader": "^9.2.6",
    "typescript": "^4.5.4",
    "webpack": "^5.65.0",
    "webpack-cli": "^4.9.1"
  }
}
```

### webpack 中的 resolve

到目前為止, 只要改 src 資料夾, 就會自動 compile. 接著, 我們在 src 中將會有很多的檔案, 甚至彼此 import. 考慮下情境

```ts
// aaa.ts 檔案內容
export function aaa(){
    console.log('aaa');
}

// index.ts 檔案內容
import { aaa } from "./aaa";

console.log('index');
aaa()
```

將會出現錯誤如下

```bash
ERROR in ./src/index.ts 3:14-30
Module not found: Error: Can't resolve './aaa' in '/Users/Shared/coding/TechWebpack/tech04/src'
resolve './aaa' in '/Users/Shared/coding/TechWebpack/tech04/src'
  using description file: /Users/Shared/coding/TechWebpack/tech04/package.json (relative path: ./src)
    Field 'browser' doesn't contain a valid alias configuration
    using description file: /Users/Shared/coding/TechWebpack/tech04/package.json (relative path: ./src/aaa)
      no extension
        Field 'browser' doesn't contain a valid alias configuration
        /Users/Shared/coding/TechWebpack/tech04/src/aaa doesn't exist
      .js
        Field 'browser' doesn't contain a valid alias configuration
        /Users/Shared/coding/TechWebpack/tech04/src/aaa.js doesn't exist
      .json
        Field 'browser' doesn't contain a valid alias configuration
        /Users/Shared/coding/TechWebpack/tech04/src/aaa.json doesn't exist
      .wasm
        Field 'browser' doesn't contain a valid alias configuration
        /Users/Shared/coding/TechWebpack/tech04/src/aaa.wasm doesn't exist
      as directory
        /Users/Shared/coding/TechWebpack/tech04/src/aaa doesn't exist

webpack 5.65.0 compiled with 1 error and 1 warning in 145 ms
```

說明  

簡單來說, 它不認識 import 指令中的 './aaa', 它嘗試去找 aaa 資料夾 aaa.js aaa.json aaa.wasm 都沒有. (如上面的錯訊訊息內容寫的).

要處理這個問題, 修改 webpack.config.js, 新增 resolve. 大致如下.

```js
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
    }
}
```

修改後, 儲存 webpack.config.js 後, 用 ctrl+c 中斷 webpack -w 指令, 再重新執行一次 npm run dev 即可成功.

resolve 與 import 中的指令有相關, 若 import 出現奇怪的錯誤, 大概會與此相關, 關鍵字為 #resolve #alias

### WARNING development production

到目前為止, 其實你應該會看到一個 WARNING 

```bash
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

可以將 dev 從 "webpack -w" ， 改為 "webpack -w --mode development"

### compile 後的名稱

dist 中, 現在是 main.js, 可以改成自訂的名稱嗎? 可, 設定 webpack.config.js 中的 output filename 屬性. 同時, 資料夾也可以設, 不過我們與 webpack 預設的資料夾名稱 dist 一樣, 所以有沒有設都沒差.

```js
const path = require('path')

module.exports = {
    entry: './src/index.ts',
    module: { /*../略...*/ },
    resolve: { /*../略...*/ },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

