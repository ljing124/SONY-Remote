function camera_connect(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"startRecMode","params":[]})});
}

function camera_disconn(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"stopRecMode","params":[]})});
}

function camera_liveon(){
    resized = false;
    infoon = true;
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"startLiveview","params":[]})})
    .then(()=>{
        fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
        body: JSON.stringify({"method": "setLiveviewFrameInfo", "params": [{"frameInfo": true}], "id": 1, "version": "1.0"})});
        camera_livestream();
        setTimeout(function(){ liveview_info();},500);
    });
}

function camera_liveoff(){
    resized = false;
    infoon = false;
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"stopLiveview","params":[]})})
    .then(()=>{
        fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
        body: JSON.stringify({"method": "setLiveviewFrameInfo", "params": [{"frameInfo": false}], "id": 1, "version": "1.0"})})
    })
}

function camera_acttake(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"actTakePicture","params":[]})})
    .then(()=>{ setTimeout(function(){ camera_livestream();},1000); })
}

function camera_shoot(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"actHalfPressShutter","params":[]})})
    .then(()=>{ camera_acttake(); })
}

function camera_recon(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"startMovieRec","params":[]})});
}

function camera_recoff(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"version":"1.0","id":1,"method":"stopMovieRec","params":[]})});
}

function camera_cancelaf(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "cancelTouchAFPosition", "params": [], "id": 1, "version": "1.0"})});
}

/**
 * canvas大小动态适应
 * @param {string} imgurl 
 */
function camera_resize(imgurl){
    var tmpimg = new Image();
    resized = true;
    tmpimg.src = imgurl;
    tmpimg.onload = function(){
      var tmpheight = tmpimg.height;
      var tmpwidth = tmpimg.width; 
      var scaleh = document.getElementById("liveview").clientHeight / tmpheight;
      var scalew = document.getElementById("liveview").clientWidth / tmpwidth;
      canvas.style.width = tmpwidth * ((scaleh>scalew) ? scalew : scaleh) + "px";
      canvas.style.height = tmpheight * ((scaleh>scalew) ? scalew : scaleh) + "px";
      canvas.style.top =  (document.getElementById("liveview").clientHeight - parseFloat(canvas.style.height))/2 + "px";
      fcanvas.style.width = canvas.style.width;
      fcanvas.style.height = canvas.style.height;
      fcanvas.style.left = (document.getElementById("liveview").clientWidth - parseFloat(canvas.style.width))/2 + "px";
      fcanvas.style.top = canvas.style.top;
    }
}

/**
 * 实时预览数据处理
 */
async function camera_livestream(){ 
    try{ 
        const res = await fetch(liveurl)
        let reader = res.body.getReader()
        let chunk = 0
        let offset = 0
        let rest = new Uint8Array
        while (true) {
            const result = await reader.read()
            if (result.done) break
            chunk += result.value.length
            if(chunk>16*1024*1024){reader.cancel(); setTimeout(function(){ camera_livestream();},10);}
            let buffer = new Uint8Array(offset+result.value.length)
            buffer.set(rest)
            buffer.set(result.value,offset)
            while(buffer.length>65536){
                let imgsize = buffer[12] * 65536 + buffer[13] * 256 + buffer[14]
                let padsize = buffer[15] + imgsize
                let imgbuffer = buffer.slice(136,136+padsize)
                if(buffer[1]==1){                                                     //0x01 JPEG数据
                    let imgblob = new Blob([imgbuffer],{ type: "image/jpeg" });        
                    let imgurl = URL.createObjectURL(imgblob);
                    if(!resized) camera_resize(imgurl);
                    initTexture(gl, program, n, imgurl);
                } else {                                                              //0x02 frame数据
                    fcanvas.width = 1000;
                    let framecnt = buffer[18] * 256 + buffer[19];
                    for(let i=0;i<framecnt;i++){
                        let frameleft = imgbuffer[i*16] * 256 + imgbuffer[i*16+1];
                        let frametop = imgbuffer[i*16+2] * 256 + imgbuffer[i*16+3];
                        let frameright = imgbuffer[i*16+4] * 256 + imgbuffer[i*16+5];
                        let framebottom = imgbuffer[i*16+6] * 256 + imgbuffer[i*16+7];
                        ctx.strokeStyle = "green"
                        ctx.lineWidth = 5
                        ctx.rect(frameleft/10,frametop/10,(frameright-frameleft)/10,(framebottom-frametop)/10);
                        ctx.stroke();
                    }
                }
                buffer = buffer.slice(padsize+136)
                offset = buffer.length
            }
            rest = buffer.slice(0)
            offset = rest.length
        }
    } catch(err){ 
        setTimeout(function(){ camera_livestream();},10);   //预览画面中断时尝试重连
    }
}


/**
 * 实时光圈、快门、ISO显示
 */
function liveview_info(){
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "getFNumber", "params": [], "id": 1, "version": "1.0"})})
    .then((response)=>{
        fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
        body: JSON.stringify({"method": "getShutterSpeed", "params": [], "id": 1, "version": "1.0"})})
        .then((response)=>{
            fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
            body: JSON.stringify({"method": "getIsoSpeedRate", "params": [], "id": 1, "version": "1.0"})})
            .then((response)=>{
                response.json().then((data)=>{ 
                    if(data.result) document.getElementById("i").innerHTML = data.result[0];
                })
            });
            response.json().then((data)=>{ if(data.result) document.getElementById("s").innerHTML = data.result[0]; })
        });
        response.json().then((data)=>{ if(data.result) document.getElementById("f").innerHTML = data.result[0]; })
    });
    if(infoon) setTimeout(function(){ liveview_info();},1000);
}

/**
 * 获取光圈设置范围
 */
function camera_getf(){
    if(document.getElementById("setpanel").style.display == "block"){
        document.getElementById("setpanel").style.display = "none";
        document.getElementById("fsipanel").innerHTML = "";
        return;
    }
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "getAvailableFNumber", "params": [], "id": 1, "version": "1.0"})})
    .then((response)=>{
        response.json().then((data)=>{
            if(data.result[1].length>0){
                document.getElementById("setpanel").style.display = "block";
                for(let i=0;i<data.result[1].length;i++){
                    document.getElementById("fsipanel").innerHTML += `<a href="javascript:void(0);" class="btn" style="display:inline-block;" onclick="camera_setf('`+ window.btoa(data.result[1][i]) +"\')\">F"+data.result[1][i]+"</a>";
                }
            }
        })
    });
}

/**
 * 获取快门设置范围
 */
function camera_gets(){
    if(document.getElementById("setpanel").style.display == "block"){
        document.getElementById("setpanel").style.display = "none";
        document.getElementById("fsipanel").innerHTML = "";
        return;
    }
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "getAvailableShutterSpeed", "params": [], "id": 1, "version": "1.0"})})
    .then((response)=>{
        response.json().then((data)=>{
            if(data.result[1].length>0){
                document.getElementById("setpanel").style.display = "block";
                for(let i=0;i<data.result[1].length;i++){
                    document.getElementById("fsipanel").innerHTML += `<a href="javascript:void(0);" class="btn" style="display:inline-block; margin:0.5vw 0.5vw 0.5vw 0.5vw; padding:1vw 1vw 1vw 1vw;" onclick="camera_sets('`+ window.btoa(data.result[1][i]) +"\')\">"+data.result[1][i]+"</a>";
                }
            }
        })
    });
}

/**
 * 获取ISO设置范围
 */
function camera_geti(){
    if(document.getElementById("setpanel").style.display == "block"){
        document.getElementById("setpanel").style.display = "none";
        document.getElementById("fsipanel").innerHTML = "";
        return;
    }
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "getAvailableIsoSpeedRate", "params": [], "id": 1, "version": "1.0"})})
    .then((response)=>{
        response.json().then((data)=>{
            if(data.result[1].length>0){
                document.getElementById("setpanel").style.display = "block";
                for(let i=0;i<data.result[1].length;i++){
                    document.getElementById("fsipanel").innerHTML += `<a href="javascript:void(0);" class="btn" style="display:inline-block; padding:1vw 1.5vw 1vw 1.5vw;" onclick="camera_seti('`+ window.btoa(data.result[1][i]) +"\')\">"+data.result[1][i]+"</a>";
                }
            }
        })
    });
}

/**
 * 设置光圈
 */
function camera_setf(fnumber){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setFNumber", "params": [window.atob(fnumber)], "id": 1, "version": "1.0"})});
}

/**
 * 设置快门
 */
function camera_sets(shutter){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setShutterSpeed", "params": [window.atob(shutter)], "id": 1, "version": "1.0"})});
}

/**
 * 设置ISO
 */
function camera_seti(isospeed){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setIsoSpeedRate", "params": [window.atob(isospeed)], "id": 1, "version": "1.0"})});
}

/**
 * 设置触摸点对焦
 * @param {event} e 
 */
function camera_touchaf(e){
    if(!cantouch) return;
    if(!infoon) return;
    let x = e.pageX - canvas.getBoundingClientRect().left;
    let y = e.pageY - canvas.getBoundingClientRect().top;
    x = Math.floor(x / parseFloat(canvas.style.width) * 1000) / 10 ;
    y = Math.floor(y / parseFloat(canvas.style.height) * 1000) / 10 ;
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setTouchAFPosition", "params": [x,y], "id": 1, "version": "1.0"})})
    .then((response)=>{
        response.json().then((data)=>{
            console.log(data.result[1].AFResult)
        })
    });
}