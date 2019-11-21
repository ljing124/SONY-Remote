/**
 * 光圈设置
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
            document.getElementById("fsipanel").innerHTML += `<a href="javascript:void(0);" class="btn" style="display:inline-block;" onclick="camera_seti('`+ window.btoa(data.result[1][i]) +"\')\">"+data.result[1][i]+"</a>";
          }
        }
      })
    });
  }
function camera_setf(fnumber){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setFNumber", "params": [window.atob(fnumber)], "id": 1, "version": "1.0"})});
}
function camera_sets(shutter){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setShutterSpeed", "params": [window.atob(shutter)], "id": 1, "version": "1.0"})});
}
function camera_seti(isospeed){
    document.getElementById("setpanel").style.display="none"; 
    document.getElementById("fsipanel").innerHTML = "";
    fetch(apiurl,{method:'POST', credentials: 'include', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, 
    body: JSON.stringify({"method": "setIsoSpeedRate", "params": [window.atob(isospeed)], "id": 1, "version": "1.0"})});
}