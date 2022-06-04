import"./modulepreload-polyfill.b7f2da20.js";import{t as d,r as s}from"./red.frag.553e6bc6.js";async function u(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),i=e.getContext("webgpu"),o=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():i.getPreferredFormat(t),a=window.devicePixelRatio||1;e.width=e.clientWidth*a,e.height=e.clientHeight*a;const n={width:e.width,height:e.height};return i.configure({device:r,format:o,compositingAlphaMode:"opaque"}),{device:r,context:i,format:o,size:n}}async function g(e,t){const r={layout:"auto",vertex:{module:e.createShaderModule({code:d}),entryPoint:"main"},primitive:{topology:"triangle-list"},fragment:{module:e.createShaderModule({code:s}),entryPoint:"main",targets:[{format:t}]}};return await e.createRenderPipelineAsync(r)}function c(e,t,r){const i=e.createCommandEncoder(),a={colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},n=i.beginRenderPass(a);n.setPipeline(r),n.draw(3),n.end(),e.queue.submit([i.finish()])}async function p(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:i}=await u(e),o=await g(t,i);c(t,r,o),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,c(t,r,o)})}p();
