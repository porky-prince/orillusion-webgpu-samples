import"./modulepreload-polyfill.b7f2da20.js";import{v as G,i as M,a as T,b as V,c as C,d as z}from"./box.fffb8d82.js";import{g as B,c as S,f as b,l as D,o as R,m as A,a as N}from"./math.cb05c6db.js";var F=`@group(0) @binding(0) var<storage> modelViews : array<mat4x4<f32>>;
@group(0) @binding(1) var<uniform> cameraProjection : mat4x4<f32>;
@group(0) @binding(2) var<uniform> lightProjection : mat4x4<f32>;
@group(0) @binding(3) var<storage> colors : array<vec4<f32>>;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) fragPosition: vec3<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) shadowPos: vec3<f32>,
    @location(4) fragColor: vec4<f32>
};

@stage(vertex)
fn main(
    @builtin(instance_index) index : u32,
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>
) -> VertexOutput {
    let modelview = modelViews[index];
    let mvp = cameraProjection * modelview;
    let pos = vec4<f32>(position, 1.0);
    let posFromLight: vec4<f32> = lightProjection * modelview * pos;
    let posFromCamera: vec4<f32> = mvp * pos;
    
    var output : VertexOutput;
    output.Position = posFromCamera;
    // Convert shadowPos XY to (0, 1) to fit texture UV
    output.shadowPos = vec3<f32>(posFromLight.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5, 0.5), posFromLight.z);
    output.fragPosition = (modelview * pos).xyz;
    output.fragNormal =  (modelview * vec4<f32>(normal, 0.0)).xyz;
    output.fragUV = uv;
    output.fragColor = colors[index];
    return output;
}
`,_=`@group(1) @binding(0) var<uniform> lightPosition : vec4<f32>;
@group(1) @binding(1) var shadowMap: texture_depth_2d;
@group(1) @binding(2) var shadowSampler: sampler_comparison;

@stage(fragment)
fn main(
    @location(0) fragPosition : vec3<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) shadowPos: vec3<f32>,
    @location(4) fragColor: vec4<f32>
) -> @location(0) vec4<f32> {
    let objectColor = fragColor.rgb;
    // Directional Light
    let diffuse: f32 = max(dot(normalize(lightPosition.xyz), fragNormal), 0.0);
    // add shadow
    var visibility : f32 = 0.0;
    // apply Percentage-closer filtering (PCF)
    // sample nearest 9 texels to smooth result
    let size = f32(textureDimensions(shadowMap).x);
    let oneOverSize = 1.0 / size;
    for (var y : i32 = -1 ; y <= 1 ; y = y + 1) {
        for (var x : i32 = -1 ; x <= 1 ; x = x + 1) {
            let offset : vec2<f32> = vec2<f32>(
            f32(x) * oneOverSize,
            f32(y) * oneOverSize);

            visibility = visibility + textureSampleCompare(
            shadowMap, shadowSampler,
            shadowPos.xy + offset, shadowPos.z - 0.005); // apply a small bias to avoid acne
        }
    }
    visibility = visibility / 9.0;
    // ambient + diffuse * shadow
    let lightFactor = min(0.3 + visibility * diffuse, 1.0);
    return vec4<f32>(objectColor * lightFactor, 1.0);
}`,I=`@group(0) @binding(0) var<storage> modelViews : array<mat4x4<f32>>;
@group(0) @binding(1) var<uniform> lightProjection : mat4x4<f32>;

@stage(vertex)
fn main(
    @builtin(instance_index) index : u32,
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>,
) -> @builtin(position) vec4<f32> {
    let modelview = modelViews[index];
    let pos = vec4(position, 1.0);
    return lightProjection * modelview * pos;
}
`;async function L(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const i=await navigator.gpu.requestAdapter();if(!i)throw new Error("No Adapter Found");const o=await i.requestDevice(),u=e.getContext("webgpu"),f=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():u.getPreferredFormat(i),s=window.devicePixelRatio||1;e.width=e.clientWidth*s,e.height=e.clientHeight*s;const t={width:e.width,height:e.height};return u.configure({device:o,format:f,compositingAlphaMode:"opaque"}),{device:o,context:u,format:f,size:t}}async function q(e,i,o){const u=[{arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]}],f={topology:"triangle-list",cullMode:"back"},s={depthWriteEnabled:!0,depthCompare:"less",format:"depth32float"},t=await e.createRenderPipelineAsync({label:"Basic Pipline",layout:"auto",vertex:{module:e.createShaderModule({code:F}),entryPoint:"main",buffers:u},fragment:{module:e.createShaderModule({code:_}),entryPoint:"main",targets:[{format:i}]},primitive:f,depthStencil:s}),d=await e.createRenderPipelineAsync({layout:"auto",vertex:{module:e.createShaderModule({code:I}),entryPoint:"main",buffers:u},primitive:f,depthStencil:s}),p=e.createTexture({size:o,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),h=e.createTexture({size:[2048,2048,1],usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,format:"depth32float"}).createView(),g={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:G.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:M.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})},x={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:T.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:V.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})};e.queue.writeBuffer(g.vertex,0,G),e.queue.writeBuffer(g.index,0,M),e.queue.writeBuffer(x.vertex,0,T),e.queue.writeBuffer(x.index,0,V);const P=e.createBuffer({label:"GPUBuffer store n*4x4 matrix",size:4*4*4*l,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),w=e.createBuffer({label:"GPUBuffer for camera projection",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=e.createBuffer({label:"GPUBuffer for light projection",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=e.createBuffer({label:"GPUBuffer store n*4 color",size:4*4*l,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),n=e.createBuffer({label:"GPUBuffer store 4x4 matrix",size:4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),r=e.createBindGroup({label:"Group for renderPass",layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:P}},{binding:1,resource:{buffer:w}},{binding:2,resource:{buffer:m}},{binding:3,resource:{buffer:a}}]}),c=e.createBindGroup({label:"Group for fragment",layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:h},{binding:2,resource:e.createSampler({compare:"less"})}]}),v=e.createBindGroup({label:"Group for shadowPass",layout:d.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:P}},{binding:1,resource:{buffer:m}}]});return{renderPipeline:t,shadowPipeline:d,boxBuffer:g,sphereBuffer:x,modelViewBuffer:P,cameraProjectionBuffer:w,lightProjectionBuffer:m,colorBuffer:a,lightBuffer:n,vsGroup:r,fsGroup:c,shadowGroup:v,depthTexture:p,shadowDepthView:h}}function O(e,i,o){const u=e.createCommandEncoder(),f={colorAttachments:[],depthStencilAttachment:{view:o.shadowDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},s={colorAttachments:[{view:i.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:o.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}};{const t=u.beginRenderPass(f);t.setPipeline(o.shadowPipeline),t.setBindGroup(0,o.shadowGroup),t.setVertexBuffer(0,o.boxBuffer.vertex),t.setIndexBuffer(o.boxBuffer.index,"uint16"),t.drawIndexed(C,2,0,0,0),t.setVertexBuffer(0,o.sphereBuffer.vertex),t.setIndexBuffer(o.sphereBuffer.index,"uint16"),t.drawIndexed(z,l-2,0,0,l/2),t.end()}{const t=u.beginRenderPass(s);t.setPipeline(o.renderPipeline),t.setBindGroup(0,o.vsGroup),t.setBindGroup(1,o.fsGroup),t.setVertexBuffer(0,o.boxBuffer.vertex),t.setIndexBuffer(o.boxBuffer.index,"uint16"),t.drawIndexed(C,2,0,0,0),t.setVertexBuffer(0,o.sphereBuffer.vertex),t.setIndexBuffer(o.sphereBuffer.index,"uint16"),t.drawIndexed(z,l-2,0,0,l/2),t.end()}e.queue.submit([u.finish()])}const l=30;async function Y(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:i,context:o,format:u,size:f}=await L(e),s=await q(i,u,f),t=[],d=new Float32Array(l*4*4),p=new Float32Array(l*4);{const a={x:0,y:0,z:-20},n={x:0,y:Math.PI/4,z:0},r={x:2,y:20,z:2},c=B(a,n,r);d.set(c,0*4*4),p.set([.5,.5,.5,1],0*4),t.push({position:a,rotation:n,scale:r})}{const a={x:0,y:-10,z:-20},n={x:0,y:0,z:0},r={x:50,y:.5,z:40},c=B(a,n,r);d.set(c,1*4*4),p.set([1,1,1,1],1*4),t.push({position:a,rotation:n,scale:r})}for(let a=2;a<l;a++){const n=Math.random()>.5?1:-1,r={x:(1+Math.random()*12)*n,y:-8+Math.random()*15,z:-20+(1+Math.random()*12)*n},c={x:Math.random(),y:Math.random(),z:Math.random()},v=Math.max(.5,Math.random()),y={x:v,y:v,z:v},E=B(r,c,y);d.set(E,a*4*4),p.set([Math.random(),Math.random(),Math.random(),1],a*4),t.push({position:r,rotation:c,scale:y,y:r.y,v:Math.max(.09,Math.random()/10)*n})}i.queue.writeBuffer(s.colorBuffer,0,p);const U=S(),h=S(),g=b(0,100,0),x=b(0,1,0),P=b(0,0,0);function w(){const a=performance.now();g[0]=Math.sin(a/1500)*50,g[2]=Math.cos(a/1500)*50,D(U,g,P,x),R(h,-80,80,-80,80,-100,200),A(h,h,U),i.queue.writeBuffer(s.lightProjectionBuffer,0,h),i.queue.writeBuffer(s.lightBuffer,0,g);for(let n=2;n<l;n++){const r=t[n];r.position.y+=r.v,(r.position.y<-9||r.position.y>9)&&(r.v*=-1);const c=B(r.position,r.rotation,r.scale);d.set(c,n*4*4)}i.queue.writeBuffer(s.modelViewBuffer,0,d),O(i,o,s),requestAnimationFrame(w)}w();function m(){const a=f.width/f.height,n=N(a,60/180*Math.PI,.1,1e3,{x:0,y:10,z:20});i.queue.writeBuffer(s.cameraProjectionBuffer,0,n)}m(),window.addEventListener("resize",()=>{f.width=e.width=e.clientWidth*devicePixelRatio,f.height=e.height=e.clientHeight*devicePixelRatio,s.depthTexture.destroy(),s.depthTexture=i.createTexture({size:f,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),m()})}Y();
