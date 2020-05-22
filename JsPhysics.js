/* Data */

    let display = undefined;

    /* Physical Objects */

        const globalConstants = {

            gravitationalacceleration: -0.2,
            backgroundcolor: "white",
            display: { h: 150, w: 300 }

        }

        let physicalObjects = {

            /*name: {

                name: name,
                color: drawingColor,
                x: XaxisPosition, 
                y: YaxisPosition, 
                w: drawingWidth, 
                h: drawingHeight, 
                vx: velocityX,
                vy: velocityY, 
                ax: accelerationX,
                ay: accelerationY,
                gravity: T/F,
                collision: T/F

            }*/

        }

    /* inputs */

        let inputs = {

            /*keyCode: {

                press: pressFunction,
                release: releaseFunction,
                identifier: (optional)

            }*/

        }

        let keysbeingpressed = [ ];

    /* collision */

        let collisionHandlers = {

            /*obj1IdObj2Id: {

                PhysicalObject1: objectName,
                PhysicalObject2: objectName,
                collisionHandler: function

            }*/

            nothing: function(){},

            default: undefined

        }

    /* Loop */

        const loopFunctions = [ detectcollisions, gravity, applyvectors, render ];

/* Define Area */
        
    function defineArea( canvasId ){

        display = document.getElementById(canvasId).getContext("2d");

    }

/* Input Functions */

    function addInput( keyCode, pressFunction, releaseFunction, identifier ){

        if ( inputs[ keyCode ] == undefined )
            inputs[parseInt(keyCode)] = { press: pressFunction, release: releaseFunction, identifier: identifier }
        else console.log( "Erro na função addInput: KeyCode já declarado. Remova o keyCode ou use outro" );

    }

    document.addEventListener( 'keydown', pressingkey );
    document.addEventListener( 'keyup', releasingkey );

    function pressingkey(event){

        key = parseInt(event.keyCode);

        if ( keysbeingpressed.indexOf(key) == -1 && key in inputs ){

            keysbeingpressed.push(key);
            (inputs[ key ].press)();

        }

    }

    function releasingkey(event){

        key = parseInt(event.keyCode);
        if ( keysbeingpressed.indexOf(key) != -1 ){

            if ( inputs[ key ].release != undefined) (inputs[ key ].release)();
            keysbeingpressed.splice(keysbeingpressed.indexOf( key ), 1);

        }

    }

/* Create Physical Object */

    function createPhysicalObject( name, color, posX, posY, width, height, useGravity, usecollision, bouncing, mass ){

        if( name != undefined ){
            physicalObjects[name] = { name: name, color: "black", x: 0, y: 0, w: 0, h: 0, gravity: false, collision: false, vx: 0, vy: 0, ax: 0, ay: 0 };

            const values = [ color, posX, posY, width, height, useGravity, usecollision ];
            const variables = [ 'color', 'x', 'y', 'w', 'h', 'gravity', 'collision' ];

            for ( let i in values ){

                if ( values[i] != null && values[i] != undefined ){

                    physicalObjects[name][variables[i]] = values[i];

                }

            }
        }
        else console.log(" Erro na função createPhysicalObject(): nomeie o objeto ");

    }

    function  deletePhysicalObject( physicalObjectName ) {

        delete physicalObjects[ physicalObjectName ];
        
    }

/* Gravity */

    function gravity(){

        for ( let i in physicalObjects ){

            if ( physicalObjects[i].gravity )
                physicalObjects[i].vy -= -(globalConstants.gravitationalacceleration);

        }

    }

/* Aplly Vectors */

    function applycurrentaceleration(){

        for ( let i in physicalObjects ){

            physicalObjects[i].vx += physicalObjects[i].ax;
            physicalObjects[i].vy += -physicalObjects[i].ay;

        }

    }

    function applycurrentvelocity(){

        for ( let i in physicalObjects ){

            physicalObjects[i].x += physicalObjects[i].vx;
            physicalObjects[i].y += -physicalObjects[i].vy;

        }

    }

    function applyvectors(){

        applycurrentaceleration(); applycurrentvelocity();

    }

/* collision */

    function apllycollision( collision ){

        const id = collision.PhysicalObject1.name+collision.PhysicalObject2.name

        if ( collisionHandlers[ id ] != undefined ){

            collisionHandlers[id].function();

        }

    }

    function detectcollisions(){

        for ( let i in physicalObjects ){

            if ( physicalObjects[i].collision == true ){

                for ( let j in physicalObjects ){

                    if ( physicalObjects[j].collision == true && i != j ){

                        const obj1 = physicalObjects[i], obj2 = physicalObjects[j];

                        if (obj1.x < obj2.x + obj2.w &&
                        obj1.x + obj1.w > obj2.x &&
                        obj1.y < obj2.y + obj2.h &&
                        obj1.y + obj1.h > obj2.y){

                            const collision = { PhysicalObject1: obj1, PhysicalObject2: obj2 };

                            apllycollision( collision );
                
                        }

                    }

                }

            }

        }

    }

    function createCollisionHandler( PhysicalObject1, PhysicalObject2, collisionHandlerFunction ){

        let id = PhysicalObject1.name+PhysicalObject2.name;

        collisionHandlers[ id ] = { PhysicalObject1: PhysicalObject1, PhysicalObject2: PhysicalObject2, function: collisionHandlerFunction };

    }

/* Render */

    function render(){

        /* Cleaning display */

        display.fillStyle = globalConstants.backgroundcolor;
        display.fillRect( 0, 0, globalConstants.display.w, globalConstants.display.h );

        /* render objects */

        for ( let i in physicalObjects ){

            display.fillStyle = physicalObjects[i].color;
            display.fillRect( physicalObjects[i].x, physicalObjects[i].y, physicalObjects[i].w, physicalObjects[i].h );

        }


    }

/* Loop */

    function addToLoop( newFunctionName, priority ){

        if ( priority == 'high' ) loopFunctions.unshift( newFunctionName )
        else loopFunctions.push( newFunctionName );

    }

    function Loop(){

        for ( let i in loopFunctions ){

            loopFunctions[i]();

        }

        requestAnimationFrame(Loop);

    }