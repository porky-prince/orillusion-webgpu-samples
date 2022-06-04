import"./modulepreload-polyfill.b7f2da20.js";import{p as m}from"./position.frag.0b35f8ff.js";import{v as g,a as x}from"./cube.aa091a3d.js";import{b as w}from"./math.cb05c6db.js";var v=`@binding(0) @group(0) var<storage> mvpMatrix : array<mat4x4<f32>>;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>
};

@stage(vertex)
fn main(
    @builtin(instance_index) index : u32,
    @location(0) position : vec4<f32>,
    @location(1) uv : vec2<f32>
) -> VertexOutput {
    var output : VertexOutput;
    output.Position = mvpMatrix[index] * position;
    output.fragUV = uv;
    output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
    return output;
}
`;async function P(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const o=await navigator.gpu.requestAdapter();if(!o)throw new Error("No Adapter Found");const n=await o.requestDevice(),i=e.getContext("webgpu"),r=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():i.getPreferredFormat(o),t=window.devicePixelRatio||1;e.width=e.clientWidth*t,e.height=e.clientHeight*t;const s={width:e.width,height:e.height};return i.configure({device:n,format:r,compositingAlphaMode:"opaque"}),{device:n,context:i,format:r,size:s}}async function b(e,o,n){const i=await e.createRenderPipelineAsync({label:"Basic Pipline",layout:"auto",vertex:{module:e.createShaderModule({code:v}),entryPoint:"main",buffers:[{arrayStride:20,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:m}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}}),r=e.createTexture({size:n,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),t=e.createBuffer({label:"GPUBuffer store vertex",size:g.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(t,0,g);const s=e.createBuffer({label:"GPUBuffer store n*4x4 matrix",size:4*4*4*p,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),c=e.createBindGroup({label:"Uniform Group with matrix",layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}}]});return{pipeline:i,vertexBuffer:t,mvpBuffer:s,group:c,depthTexture:r}}function y(e,o,n){const i=e.createCommandEncoder(),r={colorAttachments:[{view:o.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:n.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},t=i.beginRenderPass(r);t.setPipeline(n.pipeline),t.setVertexBuffer(0,n.vertexBuffer),t.setBindGroup(0,n.group),t.draw(x,p),t.end(),e.queue.submit([i.finish()])}const p=500;async function B(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:o,context:n,format:i,size:r}=await P(e),t=await b(o,i,r);let s=r.width/r.height;const c=[],l=new Float32Array(p*4*4);for(let a=0;a<p;a++){const u={x:Math.random()*40-20,y:Math.random()*40-20,z:-50-Math.random()*50},f={x:0,y:0,z:0},d={x:1,y:1,z:1};c.push({position:u,rotation:f,scale:d})}function h(){for(let a=0;a<c.length-1;a++){const u=c[a],f=Date.now()/1e3;u.rotation.x=Math.sin(f+a),u.rotation.y=Math.cos(f+a);const d=w(s,u.position,u.rotation,u.scale);l.set(d,a*4*4)}o.queue.writeBuffer(t.mvpBuffer,0,l),y(o,n,t),requestAnimationFrame(h)}h(),window.addEventListener("resize",()=>{r.width=e.width=e.clientWidth*devicePixelRatio,r.height=e.height=e.clientHeight*devicePixelRatio,t.depthTexture.destroy(),t.depthTexture=o.createTexture({size:r,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),s=r.width/r.height})}B();
