import"./modulepreload-polyfill.b7f2da20.js";import{b as w}from"./basic.vert.9475eb7d.js";import{v as p,a as v}from"./cube.aa091a3d.js";import{b as P}from"./math.cb05c6db.js";var b=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_external;

@stage(fragment)
fn main(@location(0) fragUV: vec2<f32>,
        @location(1) fragPosition: vec4<f32>) -> @location(0) vec4<f32> {
  return textureSampleLevel(Texture, Sampler, fragUV) * fragPosition;
}
`,y="/orillusion-webgpu-samples/video.mp4";async function B(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const a=await navigator.gpu.requestAdapter();if(!a)throw new Error("No Adapter Found");const t=await a.requestDevice(),i=e.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():i.getPreferredFormat(a),o=window.devicePixelRatio||1;e.width=e.clientWidth*o,e.height=e.clientHeight*o;const r={width:e.width,height:e.height};return i.configure({device:t,format:n,compositingAlphaMode:"opaque"}),{device:t,context:i,format:n,size:r}}async function T(e,a,t){const i=await e.createRenderPipelineAsync({label:"Basic Pipline",layout:"auto",vertex:{module:e.createShaderModule({code:w}),entryPoint:"main",buffers:[{arrayStride:20,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:b}),entryPoint:"main",targets:[{format:a}]},primitive:{topology:"triangle-list",cullMode:"back",frontFace:"ccw"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}}),n=e.createTexture({size:t,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),o=e.createBuffer({label:"GPUBuffer store vertex",size:p.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(o,0,p);const r=e.createBuffer({label:"GPUBuffer store 4x4 matrix",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=e.createBindGroup({label:"Uniform Group with Matrix",layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}}]});return{pipeline:i,vertexBuffer:o,mvpBuffer:r,uniformGroup:u,depthTexture:n}}function U(e,a,t,i){const n=e.createCommandEncoder(),o={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:t.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},r=n.beginRenderPass(o);r.setPipeline(t.pipeline),r.setBindGroup(0,t.uniformGroup),r.setBindGroup(1,i),r.setVertexBuffer(0,t.vertexBuffer),r.draw(v),r.end(),e.queue.submit([n.finish()])}async function G(){const e=document.createElement("video");e.loop=!0,e.autoplay=!0,e.muted=!0,e.src=y,await e.play();const a=document.querySelector("canvas");if(!a)throw new Error("No Canvas");const{device:t,context:i,format:n,size:o}=await B(a),r=await T(t,n,o),u=t.createSampler({magFilter:"linear",minFilter:"linear"});let c=o.width/o.height;const l={x:0,y:0,z:-5},g={x:1,y:1,z:1},s={x:0,y:0,z:0};function d(){const m=t.importExternalTexture({source:e}),h=t.createBindGroup({layout:r.pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:u},{binding:1,resource:m}]}),f=Date.now()/1e3;s.x=Math.sin(f),s.y=Math.cos(f);const x=P(c,l,s,g);t.queue.writeBuffer(r.mvpBuffer,0,x.buffer),U(t,i,r,h),requestAnimationFrame(d)}d(),window.addEventListener("resize",()=>{o.width=a.width=a.clientWidth*devicePixelRatio,o.height=a.height=a.clientHeight*devicePixelRatio,r.depthTexture.destroy(),r.depthTexture=t.createTexture({size:o,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=o.width/o.height})}G();
