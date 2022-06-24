//By: Carson Sharp


/*
//index array for 6 sides currently
var tri = [
    0, 2, 1, //point to vertex 0, then 2, then, 1 to form a triangle
    2, 3, 1,
    2, 4, 3,
    4, 5, 3,
    4, 6, 5,
    6, 7, 5,
    6, 8, 7,
    8, 9, 7,
    8, 10, 9,
    10, 11, 9,
    10, 0, 11, //wrap back to beginning triangle (0,2,1)
    0, 1 , 11  //wrap back to beginning triangle (0,2,1)
];
*/

var numOfSides = 36; //changes the number of sides for cylinder, more sides means more "smooth" cylinder surface
var numOfSubdivisions = 16;
var hornShape = true;

//fill vert array with correct vertice positions for cylinder
function createVerts(){

    if(hornShape){
        var arraySize = numOfSides * 2 * numOfSubdivisions;
        tri = new Array(arraySize);
        tri = [];
        var indexer = 0;
        var k = 0;
        var wrapIndex = 0;
        var connect = 0;
        var connect2 = 0;
        
        for(var i = 0; i < (numOfSubdivisions); i++){

            wrapIndex = indexer;

            for(var j = 0; j < (numOfSides * 2); j+=2){
                
                tri[indexer] = connect; //connect vertically
                tri[indexer + 1] = connect2 + 2; //connect vertically 
                tri[indexer + 2] = k + 1;
                tri[indexer + 3] = connect2 + 2; //connect vertically
                tri[indexer + 4] = k + 3;
                tri[indexer + 5] = k + 1;
                indexer = indexer + 6;
                
                k = k + 2;
                connect = connect + 2;
                connect2 = connect2 + 2;

            }
            connect = tri[wrapIndex + 2];
            connect2 = tri[wrapIndex + 4] - 2;

            //connect last triangle back to beginning triangle for the corresponding row
            tri[indexer - 2] = tri[wrapIndex + 2];
            tri[indexer - 3] = tri[wrapIndex];
            tri[indexer - 5] = tri[wrapIndex]; 
        }
        
        console.log(tri);



        vert = new Array(arraySize); //create vertex array 
        vert = [];
        normals = new Array(arraySize); //create normals array
        normals = [];

        var xVert;
        var zVert;
        var angle = 0.0;
        var increment = Math.PI * 2.0 / numOfSides;
        var test = 0;
        var height2 = 0;

        for(var j = 1; j <= (numOfSubdivisions); j++){

            angle = 0.0;
            var height = (j/numOfSubdivisions);
            
            
            for(var i = 0; i < (numOfSides*2); i+=2){
                //multiplying y-rotation matrix by the curve function [(t^2 + 0.25), t, 0] (for special curved shape)
                //[cos*f(t) , t , -sin*f(t)]

                xVert = Math.cos(angle) * (Math.pow((height) , 2) + 0.25);
                zVert = -Math.sin(angle) * (Math.pow((height) , 2) + 0.25);

                //bowl shape
                //xVert = Math.cos(angle) * (Math.sqrt((height + 0.25)));
                //zVert = -Math.sin(angle) * (Math.sqrt((height + 0.25)));

                //normals for cylinder, curved surface will be different as you 
                //will need to find the actual derivative of f(t)
                //derivatives for cylinder are easy because we only have numbers or t (nothing like t^2 + 1 for curved)

                dsdt = vec3( (Math.cos(angle) * (2*height)) , 1 , (-Math.sin(angle) * (2 * height)) ); //derivative with respect to 't' ... f(t) for cylinder is a number so its derivative will just be 0
                dsdtheta = vec3( (-Math.sin(angle) * (Math.pow((height) , 2) + 0.25)) , 0 , (-Math.cos(angle) * (Math.pow((height) , 2) + 0.25)) ); //derivative with respect to 'theta'
                normals[test] = normalize( cross( dsdt , dsdtheta ) );
                normals[test + 1] = normalize( cross( dsdt , dsdtheta ) );

                vert[test] = vec3(xVert, height2-0.5, zVert);
                vert[test + 1] = vec3(xVert, height-0.5, zVert);
                
                test = test + 2;

                angle = angle + increment;
            }
            
            height2 = height;
            
        }

        console.log(normals);
        console.log(vert);



    }
    else{

        var arraySize = numOfSides * 2 * numOfSubdivisions;
        tri = new Array(arraySize);
        tri = [];
        var indexer = 0;
        var k = 0;
        var wrapIndex = 0;
        
        for(var i = 0; i < (numOfSubdivisions); i++){

            wrapIndex = indexer;

            for(var j = 0; j < (numOfSides * 2); j+=2){
                
                tri[indexer] = k;
                tri[indexer + 1] = k + 2;
                tri[indexer + 2] = k + 1;
                tri[indexer + 3] = k + 2;
                tri[indexer + 4] = k + 3;
                tri[indexer + 5] = k + 1;
                indexer = indexer + 6;
                
                k = k + 2;

            }

            //connect last triangle back to beginning triangle for the corresponding row
            tri[indexer - 2] = tri[wrapIndex + 2];
            tri[indexer - 3] = tri[wrapIndex];
            tri[indexer - 5] = tri[wrapIndex]; 
        }
        
        console.log(tri);



        vert = new Array(arraySize); //create vertex array 
        vert = [];
        normals = new Array(arraySize); //create normals array
        normals = [];

        var xVert;
        var zVert;
        var angle = 0.0;
        var increment = Math.PI * 2.0 / numOfSides;
        //var height = numOfSides / numOfSubdivisions;
        var test = 0;
        var height2 = 0;

        for(var j = 1; j <= (numOfSubdivisions); j++){

            angle = 0.0;
            var height = (j/numOfSubdivisions);
            
            
            for(var i = 0; i < (numOfSides*2); i+=2){
                //multiplying y-rotation matrix by the curve function [1, t, 0] (for cylinder)
                //[cos*f , t , -sin*f]
                xVert = 0.5 * Math.cos(angle);
                zVert = 0.5 * -Math.sin(angle);

                //normals for cylinder, curved surface will be different as you 
                //will need to find the actual derivative of f(t)
                //derivatives for cylinder are easy because we only have numbers or t (nothing like t^2 + 1 for curved)

                dsdt = vec3( (Math.cos(angle) * 0) , 1 , (-Math.sin(angle) * 0) ); //derivative with respect to 't' ... f(t) for cylinder is a number so its derivative will just be 0
                dsdtheta = vec3( (-Math.sin(angle) * 0.5) , 0 , (-Math.cos(angle) * 0.5) ); //derivative with respect to 'theta'
                normals[test] = normalize( cross( dsdt , dsdtheta ) );
                normals[test + 1] = normalize( cross( dsdt , dsdtheta ) );

                vert[test] = vec3(xVert, height2-0.5, zVert);
                vert[test + 1] = vec3(xVert, height-0.5, zVert);
                
                test = test + 2;

                angle = angle + increment;
            }
            
            height2 = height;
            
        }

        console.log(normals);
        console.log(vert);


    }
}

function triangle(a, b, c) {

    normalsArray.push(a);
    normalsArray.push(b);
    normalsArray.push(c);
    // play: create an incorrect normal vector to see what happens
    //normalsArray.push(c + Math.random());
    
    pointsArray.push(a);
    pointsArray.push(b);      
    pointsArray.push(c);

    index += 3;
}


function divideTriangle(a, b, c, count) {
   if ( count > 0 ) {
               
       var ab = mix( a, b, 0.5);
       var ac = mix( a, c, 0.5);
       var bc = mix( b, c, 0.5);
               
       // normalize 3d vector
       ab = normalize(ab, false);
       ac = normalize(ac, false);
       bc = normalize(bc, false);
                               
       divideTriangle( a, ab, ac, count - 1 );
       divideTriangle( ab, b, bc, count - 1 );
       divideTriangle( bc, c, ac, count - 1 );
       divideTriangle( ab, bc, ac, count - 1 );
   }
   else { 
       triangle( a, b, c );
   }
}


function tetrahedron(a, b, c, d, n) {
   divideTriangle(a, b, c, n);
   divideTriangle(d, c, b, n);
   divideTriangle(a, d, b, n);
   // comment out next line to create an open object
   //divideTriangle(a, c, d, n);
}