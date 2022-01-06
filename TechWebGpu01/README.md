# WebGPU 1 (typescript webpack karam jasmine 架構下)

## 找對 browser, 並設定好

- 首先, 測試 browser
  - https://alain.xyz/blog/raw-webgpu
  - 經歷: 以為是程式寫錯(在 safari 測，gpu成功，但 canvas.getContext 失敗)，後來用現成的去測，發現 chrome canary 才行用.

## 實驗1 規畫

- 預期畫面
  - 按 TDD 精神, 所想個最終面畫吧
  - 全紅, 沒有三角形 (glClearColor 的概念)
  - 目的: 確認環境可運行, 能執行 shader code
  - Future work: 有個三角形
  - [參考資料 alaingalvan](https://github.com/alaingalvan/webgpu-seed/blob/master/src/renderer.ts)
  - [參考資料 yyc-git](https://github.com/yyc-git/webgpu-samples)
    - 有些過期，甚至會錯唷

## 基本環境 (typescript webpack karma jasmine bootstrap jquery linq)

- 初始環境 - 到可以看到 html
  - 按 [ts webpack karam jasmine 架構](https://github.com/snowray712000/TechTsJs/blob/main/tech03TsWebpackKarmaJasmine/CodeReference.md)
  - 執行 npx webpack --mode development     
  - 執行 npx karma start
  - 已成 scripts 也行 (非必要)
  - 建立 html5, 然後 incude script

寫成 scripts

```bash
  "scripts": {
    "dev": "webpack --mode development -w",
    "test": "karma start"
  }
```

- 常用套件 jquery linq bootstrap
  - 從 bootstrap 官網取得 template
  - jquery jqueryui 相關的 script src 與 css link
  - index.ts 加入測試

```bash
npm i @types/jquery @types/jqueryui linq -D
```

測試

```ts
$(()=>{
    console.log($('body'));
})
```

html

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
    <h1>Hello, world!</h1>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
  </body>
    <script src="./bundle.js"></script>
</html>
```

## WebGPU 核心測試 歷程

- 如何知道 支援嗎 ?
- 程式流程為何 ? (一定會與 canvas 有連在一起)

### html 測試架構

```html
<canvas width="600" height="600"></canvas>
```

### @webgpu/types

要安裝 webgpu 的 types, 在 typescript 才能寫程式  
- 因為它不是 @types/webgpu, 所以要另外設定 tsconfig.json
- 設 typeRoots
  - 注意! 當設 typeRoots 時，預設的位置會失效, 所以預設中的 node_modules/@tyeps 也要設

安裝:

```bash
npm i @webgpu/types -D
```

tsconfig.json

```json
{
  "compilerOptions": {
      "typeRoots": [ "./node_modules/@webgpu/types", "./node_modules/@types"],
  }
}
```

### is support

- support 判斷  
- navigator.gpu ?
  - 這其實不準確, 因為我 safari 非 undefined, 但實際不支援.
- navigator.gpu.requestAdapter() == null
  - adapter 真的有取出來, 表示有支援
  - 但它是 async 函式
  - 下面一招可以唷!!
- canvas.getContext("webgpu") == null
  - 表示不支援
  - 注意! 有的網路資訊較舊, 會看到 getContext("gpupresent"). 這2個結果會不一樣. webgpu != null, but gpupresent == null.
- 我最終會用第3種, 但第1, 第2還是會用 throw error 作保護
- 我是 Mac mini M1 2021
- 實驗
  - 你可以試看看，當 browser 設定沒正確開啟時，真的會是 null.

### 主流程

- 與 openGL 類比
  - glFlush() 大概就是 queue.submit([command buffers])
  - queue 很簡單, 只要取得 device.queue 就得到
  - command buffer 很複雜.
    - 先記得幾個問題
      - shader code 什麼時候傳進去 ?
      - canvas 的畫布怎麼結合到流程中 ?
    - 流程
      - device 產生一個 commandEncoder
      - 準備一個設定值給 commandEncoder 的 beginPass 
        - 這設定值, 就是指最終要畫的 colorAttachment
        - 也可以包含 depthAttachment (此例不需要)
      - 呼叫 beginPass. 開始設定(加入流程). endPass
      - commandEncoder 呼叫 finish, 就會得到 command buffer
  - 接下來...
    1. 了解 command 的初始設定值 configure
    2. 了解 pipe line (shader code 在這裡)

### 主流程 程式碼

```typescript
async function startWebGpuAsync(domCanvas: HTMLCanvasElement) {
    let device: GPUDevice = await initDevice() // 很重要的 Interface  (若不支援, 則會丟出例外)
    let commandBuf: GPUCommandBuffer[] = await gCommand()
    device.queue.submit(commandBuf)
    return
}

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

async function gCommand() {
    let cmd = device.createCommandEncoder()

    // 1. 設定最終畫圖的目標 color buffer 與 depth buffer (作為 pass 的參數, 記得 pass 屬於 command)
    let conf = gRenderPassDescriptor()

    // 在 begin 與 end 之間加入其它流程 (目前只有 pipeline 設定)
    let pass = cmd.beginRenderPass(conf)
    // 2. 設定 pipeline (layout, Shader Code 之類的)
    let pipe: GPURenderPipeline = gPipeline()
    pass.setPipeline(pipe)
    pass.endPass()

    let cmdbuf = cmd.finish()
    return [cmdbuf]
}
```

### context: canvas 與 初始 command pass 時的設定值

(看著下程式)

- context = domCanvas.getContext("webgpu")
- viewCanvas = context.getCurrentTexture().createView()
- Render Pass 設定值的 colorAttachments, 就是與 viewCanvas 相關起來了
  - 其中的 loadValue 就是 glClearColor 的概念!
  - loadValue 若寫 "load" 表示, 不 clear.
  - 其中的 storeOp 以後再查, 它可以是 discard

```typescript
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
        let context = domCanvas.getContext("webgpu")
        if (r1 == null) {
            throw new Error("canvas.getContext webgpu null");
        }

        let confCanvas: GPUCanvasConfiguration = {
            device: device,
            format: "bgra8unorm",
        }
        confCanvas.usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        context.configure(confCanvas)

        return r1
    }
}
```

### pipeline: command begin pass 後的第1個東西

- 準備設定值, 然後產生
- 一定的是 vertex, 但我還是設了 fragment 的 shader code
  - 因為不設會出現問題
    - > Attachment state of [RenderPipeline] is not compatible with the attachment state of [RenderPassEncoder]
- 其它的(注解中), 以後再更深入研究

```typescript
function gPipeline() {
    let pipeConf: GPURenderPipelineDescriptor = {
        vertex: gVertexState(),
        fragment: gFragmentState(),
    }

    let pipe = device.createRenderPipeline(pipeConf)
}

// pipeConf.layout
// pipeConf.label
// pipeConf.depthStencil
// pipeConf.multisample
// pipeConf.primitive
```

#### vertex shader

- 請看下 code, 有 3 種 vertex shader code
  - main 的參數, 空的, 1個, 2個.
  - state 設定值要正確對應
    - 在 shader code 設定值 (VertexState) 有一個 buffers 參數
    - 否則會出問錯誤訊息
      - > Pipeline vertex stage uses vertex buffers not in the vertex state
    - 就我目前理解, vertex state 中的 buffer 不並是真正有資料, 而是只是描述它的 資料長相, 就像我們在程式中的 class define.

```typescript

let vstate: GPUVertexState = {
    module: module,
    entryPoint: 'main',
}
vstate.buffers = [posBuf] // 因為 shader code 裡有用到 vertex buffer, 所以沒設時會 error 

// 1
const wgslVertex1 = `[[stage(vertex)]]
fn main() -> [[builtin(position)]] vec4<f32> {
    return vec4<f32>(0.0, 0.0, 0.0, 1.0);
}`

// 2
const wgslVertex2 = `struct VSOut {
    [[builtin(position)]] Position: vec4<f32>;
};

[[stage(vertex)]]
fn main([[location(0)]] inPos: vec3<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4<f32>(inPos, 1.0);
    return vsOut;
}`

// 3
const wgslVertex2 = `struct VSOut {
    [[builtin(position)]] Position: vec4<f32>;
    [[location(0)]] color: vec3<f32>;
};

[[stage(vertex)]]
fn main([[location(0)]] inPos: vec3<f32>,
        [[location(1)]] inColor: vec3<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4<f32>(inPos, 1.0);
    vsOut.color = inColor;
    return vsOut;
}`
```

線上範例的 vertex buffer layout 設定

```typescript
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
```

#### fragment shader

```typescript
const wgslFragment = `[[stage(fragment)]]
fn main() -> [[location(0)]] vec4<f32> {
    return vec4<f32>(0.4, 0.4, 0.8, 1.0);
}`
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
```
