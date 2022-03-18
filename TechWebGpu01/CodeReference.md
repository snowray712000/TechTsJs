# WebGPU 1 CodeReference 

安裝套件

```bash
npm i webpack webpack-cli karma karma-cli jasmine @types/jasmine karma-jasmine karma-webpack typescript ts-loader @types/jquery @types/jqueryui linq @webgpu/types -D
```

檔案結構

(mac)
```bash
mkdir dist src public
touch webpack.config.js karma.conf.js tsconfig.json src/index.ts 
touch src/index.spec.ts dist/index.html
```
(win)
```bash
mkdir dist
mkdir src
mkdir public
fsutil file createnew webpack.config.js 0
fsutil file createnew karma.conf.js 0
fsutil file createnew tsconfig.json 0
fsutil file createnew src/index.ts 0
fsutil file createnew dist/index.html 0

```

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "rootDir": "./src/",
    "outDir": "./dist/",
    "sourceMap": true,  
    "typeRoots": [ "./node_modules/@webgpu/types", "./node_modules/@types"],
    "esModuleInterop": true,          
    "forceConsistentCasingInFileNames": true,        
    "strict": true,             
    "skipLibCheck": true
  }
}
```

karma.conf.js

```javascript
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine'],
      files: ['./src/**/*.spec.ts'],
      preprocessors: {
        './src/**/*.spec.ts': ['webpack']
      },
      webpack: {
        resolve: {
            extensions: ['.ts','.js']
        },
        module: {
          rules: [
              {
                  test: /\.ts$/,
                  use: 'ts-loader',
                  exclude: /node_modules/
              }
          ]
        },
      }
    });
  };
```

webpack.config.js

```javascript
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

index.html

```html

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/theme.min.css">>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

    <title>Hello, world!</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
  </body>
    <script src="./bundle.js"></script>

    <h1 id="not-supported" style="display:none;">Not Support WebGPU</h1>
    <div id="canvas-container">
      <canvas width="300" height="300"></canvas>
    </div>

</html>
```

package.json 中的 scripts

```json
  "scripts": {
    "dev": "webpack --mode development -w",
    "test": "karma start"
  }
```

index.ts

```typescript

const wgslVertex = `[[stage(vertex)]]
fn main() -> [[builtin(position)]] vec4<f32> {
    return vec4<f32>(0.0, 0.0, 0.0, 1.0);
}`
const wgslFragment = `[[stage(fragment)]]
fn main() -> [[location(0)]] vec4<f32> {
    return vec4<f32>(0.4, 0.4, 0.8, 1.0);
}`
async function aaa(domCanvas: HTMLCanvasElement) {
    let device: GPUDevice = await initDevice() // 很重要的 Interface  (若不支援, 則會丟出例外)
    let commandBuf: GPUCommandBuffer[] = gCommand()
    device.queue.submit(commandBuf)
    return

    async function initDevice() {
        if (!navigator.gpu) {
            throw new Error("navigator.gpu is null. Browser maybe not support or setting error, try use Chrome Canary.")
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (adapter == null) {
            throw new Error("navigator.gpu.requestAdapter null. Browser maybe not support or setting error, try use Chrome Canary.");
        }

        return await adapter.requestDevice()
    }

    function gCommand() {
        let cmd = device.createCommandEncoder()

        // 1. 設定最終畫圖的目標 color buffer 與 depth buffer (作為 pass 的參數, 記得 pass 屬於 command)
        let conf = gRenderPassDescriptor()
        let pass = cmd.beginRenderPass(conf) // 在 beginPass 與 endPass 之間加入其它流程 (目前只有 pipeline 設定)

        // 2. 設定 pipeline (layout, Shader Code 之類的)
        let pipe: GPURenderPipeline = gPipeline()
        pass.setPipeline(pipe)
        pass.endPass()

        let cmdbuf = cmd.finish()
        return [cmdbuf]
        function gRenderPassDescriptor() {

            let context: GPUCanvasContext = gContextOfCanvas()
            let viewCanvas = context.getCurrentTexture().createView()
            let colorAttach: GPURenderPassColorAttachment = {
                view: viewCanvas,
                loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                storeOp: 'store'
            }

            let re: GPURenderPassDescriptor = {
                colorAttachments: [colorAttach]
            }
            // re.depthStencilAttachment // 一開始不要太複雜
            return re

            function gContextOfCanvas() {
                let r1 = domCanvas.getContext("webgpu")
                if (r1 == null) {
                    throw new Error("canvas.getContext webgpu null");
                }

                let confCanvas: GPUCanvasConfiguration = {
                    device: device,
                    format: "bgra8unorm",
                }
                confCanvas.usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
                r1.configure(confCanvas)

                return r1
            }
        }
        function gPipeline() {
            let pipeConf: GPURenderPipelineDescriptor = {
                vertex: gVertexState(),
                fragment: gFragmentState(),
            }

            let pipe = device.createRenderPipeline(pipeConf)
            return pipe

            function gFragmentState() {
                let module = device.createShaderModule({code: wgslFragment})
                let colorConf: GPUColorTargetState = {
                    format: "bgra8unorm"
                }
                let colorState: GPUFragmentState = {
                    module: module,
                    entryPoint: "main",
                    targets: [colorConf]
                }
                return colorState
            }
            function  gVertexState() {
                let module = device.createShaderModule({code: wgslVertex})

                let vstate: GPUVertexState = {
                    module: module,
                    entryPoint: 'main',
                }
                vstate.buffers = [gVStateBuffer()] // 因為 shader code 裡有用到 vertex buffer, 所以沒設時會 error 

                return vstate

                function gVStateBuffer() {
                    let posAttrConf: GPUVertexAttribute = {
                        shaderLocation: 0, // [[location(0)]]
                        offset: 0,
                        format: 'float32x3'
                    }
                    let posBuf: GPUVertexBufferLayout = {
                        attributes: [posAttrConf],
                        arrayStride: 4 * 3 // sizeof(float) * 3
                    }
                    posBuf.stepMode = 'vertex' // instance 是另一個，但還不知道差別 

                    return posBuf     
                }
            }
        }
    }
}

$(() => {
    try {
        let r1 = $('#canvas-container > canvas')
        let r2 = r1[0] as HTMLCanvasElement
        aaa(r2)
    } catch (error) {
        console.log(error);
        $('#not-supported').show()
    }
})


```
