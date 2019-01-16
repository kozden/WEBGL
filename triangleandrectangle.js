var gl;
var uygulama;
var rPosition;
var vbuffer;
var vPosition;
var index=0;
var w;
var h;
var fx;
var fy;
var clicked = false;
var ucgen;


var renk2=[0.0,0.0,0.0,1.0];
var renk = [0.0, 0.0, 1.0, 1];

window.onload = function init() {
    ucgen = new Float32Array(
        [ 0.4 , -0.4,
          0.8,  -0.4,
          0.6,   0.4, 
           
		-0.4 , 0.1,
        -0.1, 0.1,
		-0.1,-0.1,
		-0.4,-0.1,
          ]);
	
   

    var canvas = document.getElementById("surface");
    w = canvas.width;
    h = canvas.height;
    gl = canvas.getContext( "webgl" );
    if (!gl) { alert("Ooopss.. There's Error"); }


    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    uygulama = initShaders(gl, "vertex-shader", "fragment-shader"); 
        gl.useProgram(uygulama);

    rPosition = gl.getUniformLocation(uygulama, "u_color");
        gl.uniform4fv(rPosition, renk);

    vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
        gl.bufferData( gl.ARRAY_BUFFER, ucgen, gl.STATIC_DRAW );
		

    vPosition = gl.getAttribLocation(uygulama, "vPosition"); 
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
        gl.enableVertexAttribArray(vPosition);

    


   


    window.addEventListener("keydown", checkKeyPressed);
    canvas.addEventListener("mousedown",mouseDown);
    canvas.addEventListener("mousemove",mouseMove);
    canvas.addEventListener("mouseup",mouseUp);


    
    requestAnimationFrame( draw );
}

function draw(time_ms) {
    
    gl.clear(gl.COLOR_BUFFER_BIT); 

    rPosition = gl.getUniformLocation(uygulama, "u_color");
    gl.uniform4fv(rPosition, renk);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
	
    gl.bufferData( gl.ARRAY_BUFFER, ucgen, gl.STATIC_DRAW );
	
	gl.uniform4fv(rPosition,renk2);
	
	gl.drawArrays(gl.LINE_LOOP,3,4);
    requestAnimationFrame( draw );
}





function checkKeyPressed(e) {

    if (e.keyCode == "84") {
        renk = [Math.random(), Math.random(), Math.random(), 1];
    }
}

function initShaders(gl, vertexShaderId, fragmentShaderId) {
        var vShader;
        var fShader;

        var vElem = document.getElementById(vertexShaderId);
      
                vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vElem.text);
                gl.compileShader(vShader);
                if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
                        var mesaj = "Vertex shader eroor." + "<pre>" + gl.getShaderInfoLog(vShader) + "</pre>";
                        alert(mesaj);
                        console.log(mesaj);
                        return -1;
                
        }

        var fElem = document.getElementById(fragmentShaderId);
        if (!fElem) {
                alert("error " + fragmentShaderId);
                return -1;
        } else {
                fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fElem.text);
                gl.compileShader(fShader);
                if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
                        var mesaj = "Fragment shader compile error" + "<pre>" + gl.getShaderInfoLog(fShader) + "</pre>";
                        alert(mesaj);
                        console.log(mesaj);
                        return -1;
                }
        }

        uygulama = gl.createProgram();
        gl.attachShader(uygulama, vShader);
        gl.attachShader(uygulama, fShader);
        gl.linkProgram(uygulama);

        if (!gl.getProgramParameter(uygulama, gl.LINK_STATUS)) {
                var mesaj = "The error is:" + "<pre>" + gl.getProgramInfoLog(uygulama) + "</pre>";
                alert(mesaj);
                console.log(mesaj);
                return -1;
        }

        return uygulama;
}

function mouseDown(e){
	
	
    var c = convertMousePosition(e);
if(c.x>=ucgen[6] && c.x<=ucgen[10] && c.y<=ucgen[7] && c.y>=ucgen[11])
{   var f = fixMousePosition(c);
    fx = f.x;
    fy = f.y;
clicked = true;
}
}

function mouseMove(e){
    if(clicked){
        var c = convertMousePosition(e);
        ucgen[6] = c.x - fx;
        ucgen[7] = c.y - fy;
        ucgen[8] = ucgen[6] + 0.3;
        ucgen[9] = ucgen[7];
        ucgen[10] = ucgen[8];
        ucgen[11] = ucgen[7]-0.2;
        ucgen[12] = ucgen[6];
        ucgen[13] = ucgen[11];
    }
}

function mouseUp(){
    clicked = false;
}

function convertMousePosition(e){
    var c = {};
    c.x = (e.x-(w/2))/(w/2);
    c.y = -(e.y-(h/2))/(h/2);
    return c;
}

function fixMousePosition(c){
    var f = {};
    f.x = c.x - ucgen[6];
    f.y = c.y - ucgen[7];
    return f;
}

