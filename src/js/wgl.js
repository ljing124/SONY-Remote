/**
 * 默认顶点着色器
 */
const vertexShaderSource = `
attribute vec4 a_Position;
attribute vec2 a_TextCoord;
varying vec2 v_TexCoord;
void main(){
    gl_Position = a_Position;
    v_TexCoord = a_TextCoord;
}
`

/**
 * 默认着色器
 */
const fragmentShader_raw = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}
`

/**
 * 伪彩色
 */
const fragmentShader_psdc = `
precision mediump float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    if(originalColor[0]<0.25) {
        gl_FragColor = vec4(0.0, originalColor[0]*4.0, 1.0, 1.0);
    } else if(originalColor[0]>0.25 && originalColor[0]<=0.5) {
        gl_FragColor = vec4(0.0, 1.0, 2.0-originalColor[0]*4.0, 1.0);
    } else if(originalColor[0]>0.5 && originalColor[0]<=0.75) {
        gl_FragColor = vec4(originalColor[0]*4.0-2.0, 1.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 4.0-originalColor[0]*4.0, 0.0, 1.0);
    }
}
`

/**
 * 斑马70%
 */
const fragmentShader_zeba = `
precision highp float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    vec2 screenPos = v_TexCoord * vec2(500.0,500.0);
    int length = int(screenPos[0]-screenPos[1])-6*int((screenPos[0]-screenPos[1])/6.0);
    if(originalColor[0]+originalColor[1]+originalColor[2] > 2.1) {
        if(length<4&&length>0 || length>-6&&length<-2){
            gl_FragColor = originalColor;
        } else {
           gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    } else {
        gl_FragColor = originalColor;
    }
}
`

/**
 * 斑马90%
 */
const fragmentShader_zeba2 = `
precision highp float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    vec2 screenPos = v_TexCoord * vec2(500.0,500.0);
    int length = int(screenPos[0]-screenPos[1])-6*int((screenPos[0]-screenPos[1])/6.0);
    if(originalColor[0]+originalColor[1]+originalColor[2] > 2.7) {
        if(length<4&&length>0 || length>-6&&length<-2){
            gl_FragColor = originalColor;
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    } else {
        gl_FragColor = originalColor;
    }
}
`

/**
 * 峰值low
 */
const fragmentShader_peak = `
precision mediump float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    if(v_TexCoord.x>0.005 && v_TexCoord.x<0.995 && v_TexCoord.y>0.005 && v_TexCoord.y<0.995) {
        vec4 laColor = texture2D(u_Sampler,v_TexCoord-vec2(0.005,0.0))
                     + texture2D(u_Sampler,v_TexCoord-vec2(0.0,0.005))
                     + texture2D(u_Sampler,v_TexCoord+vec2(0.005,0.0))
                     + texture2D(u_Sampler,v_TexCoord+vec2(0.0,0.005))
                     - 4.0 * originalColor;
        if(laColor[0]+laColor[1]+laColor[2]>2.0) {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        } else {
            gl_FragColor = originalColor;
        }
    } else {
        gl_FragColor = originalColor;
    }
}
`

/**
 * 峰值high
 */
const fragmentShader_peak2 = `
precision mediump float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    if(v_TexCoord.x>0.005 && v_TexCoord.x<0.995 && v_TexCoord.y>0.005 && v_TexCoord.y<0.995) {
        vec4 laColor = texture2D(u_Sampler,v_TexCoord-vec2(0.005,0.0))
                     + texture2D(u_Sampler,v_TexCoord-vec2(0.0,0.005))
                     + texture2D(u_Sampler,v_TexCoord+vec2(0.005,0.0))
                     + texture2D(u_Sampler,v_TexCoord+vec2(0.0,0.005))
                     - 4.0 * originalColor;
        if(laColor[0]+laColor[1]+laColor[2]>1.5) {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        } else {
            gl_FragColor = originalColor;
        }
    } else {
        gl_FragColor = originalColor;
    }
}
`

/**
 * 波形全屏
 */
const fragmentShader_wave = `
precision highp float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    vec4 originalColor = texture2D(u_Sampler, v_TexCoord);
    vec4 waveColor = vec4(0.0,0.0,0.0,1.0);
    for(float i = 0.0; i<1.0; i+=0.01) {
        vec4 tmpColor = texture2D(u_Sampler,vec2(v_TexCoord.x,i));
        float tmpGray = (tmpColor[0] + tmpColor[1] + tmpColor[2]) / 3.0;
        if(tmpGray>v_TexCoord.y-0.01 && tmpGray<v_TexCoord.y+0.01) {
            waveColor += vec4(0.04,0.04,0.04,1.0);
        }
    }
    gl_FragColor = originalColor*0.3 + waveColor*0.7;
}
`

/**
 * 波形分屏
 */
const fragmentShader_wave2 = `
precision highp float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler;
void main() {
    if(v_TexCoord.x<0.75 && v_TexCoord.y<0.25) {   //gray
        vec4 waveColor = vec4(0.0,0.0,0.0,1.0);
        for(float i = 0.0; i<1.0; i+=0.025) {
            vec4 tmpColor = texture2D(u_Sampler,vec2(v_TexCoord.x*1.33333333,i));
            float tmpGray = (tmpColor[0] + tmpColor[1] + tmpColor[2]) / 3.0;
            if(tmpGray>v_TexCoord.y*4.0-0.01 && tmpGray<v_TexCoord.y*4.0+0.01) {
                waveColor += vec4(0.04,0.04,0.04,1.0);
            }
        }
        gl_FragColor = waveColor;
    } else if(v_TexCoord.x>0.75 && v_TexCoord.y>0.66666667) {  //red
        vec4 waveColor = vec4(0.0,0.0,0.0,1.0);
        for(float i = 0.0; i<1.0; i+=0.025) {
            vec4 tmpColor = texture2D(u_Sampler,vec2((v_TexCoord.x-0.75)*4.0,i));
            if(tmpColor[0]>(v_TexCoord.y-0.66666667)*3.0-0.02 && tmpColor[0]<(v_TexCoord.y-0.66666667)*3.0+0.02) {
                waveColor += vec4(0.04,0.0,0.0,1.0);
            }
        }
        gl_FragColor = waveColor;
    } else if(v_TexCoord.x>0.75 && v_TexCoord.y<0.66666667 && v_TexCoord.y>0.33333333) {  //green
        vec4 waveColor = vec4(0.0,0.0,0.0,1.0);
        for(float i = 0.0; i<1.0; i+=0.025) {
            vec4 tmpColor = texture2D(u_Sampler,vec2((v_TexCoord.x-0.75)*4.0,i));
            if(tmpColor[0]>(v_TexCoord.y-0.33333333)*3.0-0.02 && tmpColor[0]<(v_TexCoord.y-0.33333333)*3.0+0.02) {
                waveColor += vec4(0.0,0.04,0.0,1.0);
            }
        }
        gl_FragColor = waveColor;
    } else if(v_TexCoord.x>0.75 && v_TexCoord.y<0.33333333) {  //blue
        vec4 waveColor = vec4(0.0,0.0,0.0,1.0);
        for(float i = 0.0; i<1.0; i+=0.025) {
            vec4 tmpColor = texture2D(u_Sampler,vec2((v_TexCoord.x-0.75)*4.0,i));
            if(tmpColor[0]>v_TexCoord.y*3.0-0.02 && tmpColor[0]<v_TexCoord.y*3.0+0.02) {
                waveColor += vec4(0.0,0.0,0.04,1.0);
            }
        }
        gl_FragColor = waveColor;
    } else {
        gl_FragColor = texture2D(u_Sampler, vec2(v_TexCoord.x*1.33333333,(v_TexCoord.y-0.25)*1.33333333));
    }
}
`

/**
 * webgl初始化
 * @param {*} gl 
 * @param {*} shaderProgram 
 */
function initBuffers(gl, shaderProgram) {
    var vertices = new Float32Array([
        -1.0,  1.0,   0.0, 1.0,
        -1.0, -1.0,   0.0, 0.0,
        1.0,  1.0,   1.0, 1.0,
        1.0, -1.0,   1.0, 0.0
    ]);
    var n = 4;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
    gl.enableVertexAttribArray(a_Position);
    var a_TextCoord = gl.getAttribLocation(shaderProgram, "a_TextCoord");
    gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
    gl.enableVertexAttribArray(a_TextCoord);
    return n;
}

/**
 * 纹理初始化
 * @param {*} gl 
 * @param {*} shaderProgram 
 * @param {*} n 
 * @param {*} imgsrc 
 */
function initTexture(gl, shaderProgram, n, imgsrc){
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');
    var image = new Image();
    image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
    image.src = imgsrc;
    return true;
}

/**
 * 载入纹理
 * @param {*} gl 
 * @param {*} n 
 * @param {*} texture 
 * @param {*} u_Sampler 
 * @param {*} image 
 */
function loadTexture(gl, n, texture, u_Sampler,image){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    window.URL.revokeObjectURL(image.src);
}

/**
 * 显示切换处理函数
 * @param {int} func 
 */
function liveview_handler(func){
    gl = canvas.getContext("webgl");
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    switch(func){
        case 0: fragmentShaderSource = fragmentShader_raw; break;  //原始
        case 1: fragmentShaderSource = fragmentShader_psdc; break;  //伪色
        case 3: fragmentShaderSource = fragmentShader_zeba; break;  //斑马70%
        case 4: fragmentShaderSource = fragmentShader_zeba2; break;  //斑马90%
        case 5: fragmentShaderSource = fragmentShader_peak; break;  //峰值low
        case 6: fragmentShaderSource = fragmentShader_peak2; break;  //峰值high
        case 7: fragmentShaderSource = fragmentShader_wave; break;  //波形全屏
        case 8: fragmentShaderSource = fragmentShader_wave2; break;  //波形分屏
        default: fragmentShaderSource = fragmentShader_raw; break;  //原始
    }
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function liveview_psdc(){
    livefunc = (livefunc==0) ? 1 : 0;
    liveview_handler(livefunc);
}

function liveview_zeba(){
    if(livefunc==0) livefunc = 3;
    else if(livefunc==3) livefunc = 4;
    else livefunc = 0;
    liveview_handler(livefunc);
}

function liveview_peak(){
    if(livefunc==0) livefunc = 5;
    else if(livefunc==5) livefunc = 6;
    else livefunc = 0;
    liveview_handler(livefunc);
}

function liveview_wave(){
    if(livefunc==0) livefunc = 7;
    else if(livefunc==7) livefunc = 8;
    else livefunc = 0;
    liveview_handler(livefunc);
}

function liveview_luts(){
    livefunc = 0;
    liveview_handler(0);
}