//By: Carson Sharp

var canvas;
var gl;
var program;

var numTimesToSubdivide = 4;
 
var index = 0;

var pointsArray = [];
var normalsArray = [];


var near = -10;
var far = 10;

//init eye on z-axis
var radius = 1.5;
var theta  = 0.0;
var phi    = Math.PI / 2.0;
var dr = 10.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

// initialize for sphere created by repeated subdivision of tetrahedron
var va = vec3(0.0, 0.0, -1.0);
var vb = vec3(0.0, 0.942809, 0.333333);
var vc = vec3(-0.816497, -0.471405, 0.333333);
var vd = vec3(0.816497, -0.471405, 0.333333);
    
// light position in eye coordinates
//var lightPosition = vec4(5.0, 0.0, -1.0, 1.0 );
var lightPosition = vec4(0.0, 0.0, 0.0, 1.0 );
//var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );

//var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
//var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );

//var lightDiffuse = vec4( 0.0, 0.0, 0.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

//var lightSpecular = vec4(  0.0, 0.0, 0.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

//OG
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

// silver (and set shini to 1000
//var materialAmbient = vec4( 0.19225,0.19225,0.19225, 1.0 );
//var materialDiffuse = vec4( 0.5754, 0.5754, 0.5754, 1.0 );
//var materialSpecular = vec4( 0.0508273, 0.0508273, 0.0508273, 1.0 );
//var materialShininess = 1000.0;

// red material; try changing light color
//var materialAmbient = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialDiffuse = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialSpecular = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialShininess = 1000.0;

//jade
//var materialAmbient = vec4( 0.0215, 0.2225, 0.1575, 1.0 );
//var materialDiffuse = vec4( 0.54, 0.89, 0.63, 1.0 );
//var materialSpecular = vec4( 0.316228, 0.316228, 0.316228, 1.0 );
//var materialShininess = 1.1

//green plastic
//var materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
//var materialDiffuse = vec4( 0.1, 0.35, 0.1, 1.0 );
//var materialSpecular = vec4( 0.45, 0.55, 0.45, 1.0 );
//var materialShininess = 0.25;

//obsidian
//var materialAmbient = vec4( 0.05375, 0.05, 0.06625, 1.0 );
//var materialDiffuse = vec4( 0.18275, 0.17, 0.22525, 1.0 );
//var materialSpecular = vec4( 0.332741, 0.328634, 0.346435, 1.0 );
//var materialShininess = 0.3;

//off-white
//var materialAmbient = vec4( 0.329412, 0.223529, 0.227451, 1.0 );
//var materialDiffuse = vec4( 0.780392, 0.568627, 0.113725, 1.0 );
//var materialSpecular = vec4( 0.72157, 0.71176, 0.807843, 1.0 );
//var materialShininess = 3.5;

var viewer = 
{
	eye: vec3(0.0, 0.0, 3.0),
	at:  vec3(0.0, 0.0, 0.0),  
	up:  vec3(0.0, 1.0, 0.0),
	
	// for moving around object; set vals so at origin
	radius: null,
    theta: 0,
    phi: 0
};

// Create better params that suit your geometry
var perspProj = 
 {
	fov: 60,
	aspect: 1,
	near: 0.1,
	far:  10
 }


var mouse =
{
    prevX: 0,
    prevY: 0,

    leftDown: false,
    rightDown: false,
};


var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

//var numOfSides = 36;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    var messageLookEye = document.getElementById( "lookEye" );
	var messageLookAt  = document.getElementById( "lookAt" );
	var messageLookUp  = document.getElementById( "lookUp" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;

    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	
    gl.enable(gl.DEPTH_TEST);
	
	// play with turning culling on/off (sphere is open)
	//gl.enable(gl.CULL_FACE);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	console.log("Ambient products = ",ambientProduct);
	console.log("Diffuse products = ",diffuseProduct);
	console.log("Specular products = ",specularProduct);
    
	// create sphere
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	console.log("computed sphere  index = ",index);
	
	// load the light
	pointsArray.push(lightPosition[0]);
	pointsArray.push(lightPosition[1]);
	pointsArray.push(lightPosition[2]);
	// not used, but size should match points
	normalsArray.push(1.0);
	normalsArray.push(0.0);
	normalsArray.push(0.0);



    // init radius of sphere to move around object
	var diff = subtract(viewer.eye,viewer.at);
	viewer.radius = length(diff);

    //slider to control FOV
	document.getElementById("fovSlider").onchange = function(){
		perspProj.fov = event.srcElement.value;
		console.log("FOV TEST = " , perspProj);
	}

    //choose cylinder SOR
	document.getElementById("Cylinder").onclick = function(){
		hornShape = false;
        init();
	};
    //choose horn SOR
	document.getElementById("Horn").onclick = function(){
		hornShape = true;
        init();
	};
    //choose between high and low resolutions for the SOR
	document.getElementById("HighResolution").onclick = function(){
		numOfSides = 36;
        numOfSubdivisions = 8;
        console.log("TEST1: " , tri , normals, vert );
        init();
		console.log("High Resolution selected. Number of Sides: ", numOfSides);
	};
    document.getElementById("LowResolution").onclick = function(){
		numOfSides = 12;
        numOfSubdivisions = 4;
        console.log("TEST2: " , tri , normals, vert );
        init();
		console.log("Low Resolution selected. Number of Sides: ", numOfSides);
        
	};
    document.getElementById("Original").onclick = function(){
		//OG
        materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
        materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
        materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
        materialShininess = 100.0;
        init();
        
	};
    document.getElementById("Jade").onclick = function(){
		//jade
        materialAmbient = vec4( 0.0215, 0.2225, 0.1575, 1.0 );
        materialDiffuse = vec4( 0.54, 0.89, 0.63, 1.0 );
        materialSpecular = vec4( 0.316228, 0.316228, 0.316228, 1.0 );
        materialShininess = 1.1
        init();
	};
    document.getElementById("GreenPlastic").onclick = function(){
		//green plastic
        materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
        materialDiffuse = vec4( 0.1, 0.35, 0.1, 1.0 );
        materialSpecular = vec4( 0.45, 0.55, 0.45, 1.0 );
        materialShininess = 0.25;
        init();
	};
    document.getElementById("Obsidian").onclick = function(){
		//obsidian
        materialAmbient = vec4( 0.05375, 0.05, 0.06625, 1.0 );
        materialDiffuse = vec4( 0.18275, 0.17, 0.22525, 1.0 );
        materialSpecular = vec4( 0.332741, 0.328634, 0.346435, 1.0 );
        materialShininess = 0.3;
        init();
	};
    document.getElementById("OffWhite").onclick = function(){
		//off-white
        materialAmbient = vec4( 0.329412, 0.223529, 0.227451, 1.0 );
        materialDiffuse = vec4( 0.780392, 0.568627, 0.113725, 1.0 );
        materialSpecular = vec4( 0.72157, 0.71176, 0.807843, 1.0 );
        materialShininess = 3.5;
        init();
	};
	
	console.log("init radius = ",viewer.radius);
	console.log("viewer eye =",viewer.eye);
	console.log("viewer at =",viewer.at);
	console.log("viewer up =",viewer.up);
	console.log("perspective fov = ",perspProj.fov);
	console.log("perspective fov = ",perspProj.aspect);
	console.log("perspective fov = ",perspProj.near);
	console.log("perspective fov = ",perspProj.far);
	
	
	messageLookEye.innerHTML = "eye = " + formatOut(viewer.eye[0],2) + ",  " + formatOut(viewer.eye[1],2)  + ",  " + formatOut(viewer.eye[2],2);
			messageLookAt.innerHTML = "at = " + viewer.at;
			messageLookUp.innerHTML = "up = " +viewer.up;
	
	
	//creates cylinder from geometry file
    createVerts();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    //try using other normals from cylinder
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW ); 
    
    //TEST
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(tri)), gl.STATIC_DRAW); //use once indices/triangulation are implemented


    //TEST
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vert), gl.STATIC_DRAW );

    //var aBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, aBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );


    var vNormal = gl.getAttribLocation( program, "vNormal" );
	console.log("vNormal = ",vNormal);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    //var vBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);



    // init modelview and projection
    //mvMatrix = lookAt(viewer.eye, viewer.at , viewer.up);
    modelViewMatrix = lookAt(viewer.eye, viewer.at , viewer.up);
	projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );




    // ========================== Camera control via mouse ============================================
	// There are 4 event listeners: onmouse down, up, leave, move
	//
	// on onmousedown event
	// check if left/right button not already down
	// if just pressed, flag event with mouse.leftdown/rightdown and stores current mouse location
    document.getElementById("gl-canvas").onmousedown = function (event)
    {
        if(event.button == 0 && !mouse.leftDown)
        {
            mouse.leftDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
        else if (event.button == 2 && !mouse.rightDown)
        {
            mouse.rightDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
    };

	// onmouseup event
	// set flag for left or right mouse button to indicate that mouse is now up
    document.getElementById("gl-canvas").onmouseup = function (event)
    {
        // Mouse is now up
        if (event.button == 0)
        {
            mouse.leftDown = false;
        }
        else if(event.button == 2)
        {
            mouse.rightDown = false;
        }

    };

	// onmouseleave event
	// if mouse leaves canvas, then set flags to indicate that mouse button no longer down.
	// This might not actually be the case, but it keeps input from the mouse when outside of app
	// from being recorded/used.
	// (When re-entering canvas, must re-click mouse button.)
    document.getElementById("gl-canvas").onmouseleave = function ()
    {
        // Mouse is now up
        mouse.leftDown = false;
        mouse.rightDown = false;
    };

	// onmousemove event
	// Move the camera based on mouse movement.
	// Record the change in the mouse location
	// If left mouse down, move the eye around the object based on this change
	// If right mouse down, move the eye closer/farther to zoom
	// If changes to eye made, then update modelview matrix

    document.getElementById("gl-canvas").onmousemove = function (event)
    {
		// only record changes if mouse button down
		if (mouse.leftDown || mouse.rightDown) {
			
			// Get changes in x and y at this point in time
			var currentX = event.clientX;
			var currentY = event.clientY;
			
			// calculate change since last record
			var deltaX = event.clientX - mouse.prevX;
			var deltaY = event.clientY - mouse.prevY;
			
			console.log("enter onmousemove with left/right button down");
			console.log("viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
			console.log("event clientX = ",currentX,"  clientY = ",currentY);
			console.log("mouse.prevX = ",mouse.prevX,"  prevY = ",mouse.prevY);
			console.log("change in mouse location deltaX = ",deltaX,"  deltaY = ",deltaY);

			// Compute camera rotation on left click and drag
			if (mouse.leftDown)
			{
				console.log("onmousemove and leftDown is true");
				console.log("theta=",viewer.theta,"  phi=",viewer.phi);
				
				// Perform rotation of the camera
				//
				if (viewer.up[1] > 0)
				{
					viewer.theta -= 0.01 * deltaX;
					viewer.phi -= 0.01 * deltaY;
				}
				else
				{
					viewer.theta += 0.01 * deltaX;
					viewer.phi -= 0.01 * deltaY;
				}
				console.log("incremented theta=",viewer.theta,"  phi=",viewer.phi);
				
				// Wrap the angles
				var twoPi = 6.28318530718;
				if (viewer.theta > twoPi)
				{
					viewer.theta -= twoPi;
				}
				else if (viewer.theta < 0)
				{
					viewer.theta += twoPi;
				}

				if (viewer.phi > twoPi)
				{
					viewer.phi -= twoPi;
				}
				else if (viewer.phi < 0)
				{
					viewer.phi += twoPi;
				}
				console.log("wrapped  theta=",viewer.theta,"  phi=",viewer.phi);

			} // end mouse.leftdown
			else if(mouse.rightDown)
			{
				console.log("onmousemove and rightDown is true");
				
				// Perform zooming; don't get too close           
				viewer.radius -= 0.01 * deltaX;
				viewer.radius = Math.max(0.1, viewer.radius);
			}
			
			//console.log("onmousemove make changes to viewer");
			
			// Recompute eye and up for camera
			var threePiOver2 = 4.71238898;
			var piOver2 = 1.57079632679;		
			var pi = 3.14159265359;
			
			//console.log("viewer.radius = ",viewer.radius);
			
			// pre-compute this value
			var r = viewer.radius * Math.sin(viewer.phi + piOver2);
			
			// eye on sphere with north pole at (0,1,0)
			// assume user init theta = phi = 0, so initialize to pi/2 for "better" view
			
			viewer.eye = vec3(r * Math.cos(viewer.theta + piOver2), viewer.radius * Math.cos(viewer.phi + piOver2), r * Math.sin(viewer.theta + piOver2));
			
			//add vector (at - origin) to move 
			for(k=0; k<3; k++)
				viewer.eye[k] = viewer.eye[k] + viewer.at[k];
			
			//console.log("theta=",viewer.theta,"  phi=",viewer.phi);
			//console.log("eye = ",viewer.eye[0],viewer.eye[1],viewer.eye[2]);
			//console.log("at = ",viewer.at[0],viewer.at[1],viewer.at[2]);
			//console.log(" ");
			
			// modify the up vector
			// flip the up vector to maintain line of sight cross product up to be to the right
			// true angle is phi + pi/2, so condition is if angle < 0 or > pi
			
			if (viewer.phi < piOver2 || viewer.phi > threePiOver2) {
				viewer.up = vec3(0.0, 1.0, 0.0);
			}
			else {
				viewer.up = vec3(0.0, -1.0, 0.0);
			}
			//console.log("up = ",viewer.up[0],viewer.up[1],viewer.up[2]);
			//console.log("update viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
			
			// Recompute the view
			//mvMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
			modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);

			//console.log("mvMatrix = ",mvMatrix);
            console.log("modelViewMatrix = ",modelViewMatrix);
			 

			mouse.prevX = currentX;
			mouse.prevY = currentY;
			
			messageLookEye.innerHTML = "eye = " + formatOut(viewer.eye[0],2) + ",  " + formatOut(viewer.eye[1],2)  + ",  " + formatOut(viewer.eye[2],2);
			messageLookAt.innerHTML = "at = " + viewer.at;
			messageLookUp.innerHTML = "up = " +viewer.up;
			
			console.log("onmousemove: made change");
			console.log("viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
		
		} // end if button down

    };

    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess ); 
	   
	
	   
	console.log("light position = ",lightPosition);

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
		
		 

    //modelViewMatrix = lookAt(eye, at , up);
    //projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    modelViewMatrix = lookAt(viewer.eye, viewer.at , viewer.up);
	projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);



            
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	
	gl.uniform1i(gl.getUniformLocation(program,"colorFlag"), 1);


    //FROM CUBEV.js
    gl.drawElements( gl.TRIANGLES, tri.length, gl.UNSIGNED_SHORT, 0 ); //<---- Fills in the cube color in cubev SHORT for Uint16Array
      
 	  
    //for( var i=0; i<index; i+=3) 
        //gl.drawArrays( gl.TRIANGLES, i, 3 );
	 
	// draw the light -- not hooked up to shader -- see "shadedSphereLight" program
	gl.uniform1i( gl.getUniformLocation(program, "colorFlag"),0 );
	gl.drawArrays( gl.POINTS, index, 1);

    window.requestAnimFrame(render);
}

// input is the number to format
// decimals is the number of decimals to print
function formatOut (input, decimals) {
    return Math.floor(input * Math.pow(10, decimals)) / Math.pow(10, decimals) }
