/* Data */

    let display = undefined;

    /* Physical Objects */

        const globalConstants = {

            gravitationalacceleration: -0.2,
            backgroundcolor: "white",
            display: { h: 150, w: 300 }

        }

        let physicalObjects = {

            /*square: {

                name: name,
                color: drawingColor,
                type: square,
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

            /*circle: {

                name: name,
                color: drawingColor,
                type: circle,
                x: XaxisPosition, 
                y: YaxisPosition, 
                r: radius,
                vx: velocityX,
                vy: velocityY, 
                ax: accelerationX,
                ay: accelerationY,
                gravity: T/F,
                collision: T/F

            }*/

            /*custom: {

                name: name,
                type: custom,
                drawing: function,
                x: XaxisPosition,
                y: YaxisPosition,
                collisionType: square/circle,
                collisionX: collisionXpoint,
                collisionY: collisionYpoint,
                collisionW: squareCollisionWidth,
                collisionH: squareCollisionHeight,
                collisionR: circularCollisionRadius,
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

        }

    /* Loop */

        const loopFunctions = [ detectcollisions, gravity, applyvectors, render ];

/* Define Area */
        
    function defineArea( canvasId, width, height ){

        canvas = document.getElementById(canvasId);
        display = canvas.getContext("2d");

        canvas.width = globalConstants.display.w = width;
        canvas.height = globalConstants.display.h = height;

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

    function createPhysicalObject( name, color, posX, posY, width, height, useGravity, useCollision ){

        if( name != undefined ){
            physicalObjects[name] = { name: name, type: 'square', color: "black", x: 0, y: 0, w: 0, h: 0, gravity: false, collision: false, vx: 0, vy: 0, ax: 0, ay: 0 };

            const values = [ color, posX, posY, width, height, useGravity, useCollision ];
            const variables = [ 'color', 'x', 'y', 'w', 'h', 'gravity', 'collision' ];

            for ( let i in values ){

                if ( values[i] != null && values[i] != undefined ){

                    physicalObjects[name][variables[i]] = values[i];

                }

            }
        }
        else console.log(" Erro na função createPhysicalObject(): nomeie o objeto ");

    }

    function createCircularPhysicalObject( name, color, posX, posY, radius, useGravity, useCollision ){

        if( name != undefined ){
            physicalObjects[name] = { name: name, type: 'circle', color: "black", x: 0, y: 0, r: 0, gravity: false, collision: false, vx: 0, vy: 0, ax: 0, ay: 0 };

            const values = [ color, posX, posY, radius, useGravity, useCollision ];
            const variables = [ 'color', 'x', 'y', 'r', 'gravity', 'collision' ];

            for ( let i in values ){

                if ( values[i] != null && values[i] != undefined ){

                    physicalObjects[name][variables[i]] = values[i];

                }

            }
        }
        else console.log(" Erro na função createPhysicalObject(): nomeie o objeto ");

    }

    function createCustomPhysicalObject( name, drawingFunction, posX, posY, useGravity, useCollision ){

        if( name != undefined ){
            physicalObjects[name] = { name: name, type: 'custom', drawing: drawingFunction, x: 0, y: 0, gravity: false, collision: false, vx: 0, vy: 0, ax: 0, ay: 0 };

            const values = [ posX, posY, useGravity, useCollision ];
            const variables = [ 'x', 'y', 'gravity', 'collision' ];

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
            physicalObjects[i].collisionX += physicalObjects[i].vx;
            physicalObjects[i].collisionY += -physicalObjects[i].vy;

        }

    }

    function applyvectors(){

        applycurrentaceleration(); applycurrentvelocity();

    }

/* collision */

    function applycollision( collision ){

        const id = collision.PhysicalObject1.name+collision.PhysicalObject2.name

        if ( collisionHandlers[ id ] != undefined ){

            collisionHandlers[id].function();

        }

    }

    function detectcollisions(){

        for ( let i in physicalObjects ){

            const obj = physicalObjects[i];
            const change = [ 'collisionX', 'collisionY', 'collisionW', 'collisionH', 'collisionR' ];

            if ( obj.collision == true ){

                let collision1 = '';
                const var1 = [ 'x', 'y', 'w', 'h', 'r' ];

                if ( obj.type == 'square' || obj.collisionType == 'square' ) collision1 = 's'
                else collision1 = 'c';
                if (obj.type == 'custom'){

                    for  ( let a in var1 ){

                        var1[a] = change[a];

                    }

                };

                for ( let j in physicalObjects ){

                    if ( physicalObjects[j].collision == true && i != j ){

                        const obj2 = physicalObjects[j];
                        let collision2 = '';
                        const var2 = [ 'x', 'y', 'w', 'h', 'r' ];

                        if ( obj2.type == 'square' || obj2.collisionType == 'square' ) collision2 = 's'
                        else collision2 = 'c';
                        if (obj.type == 'custom'){

                            for  ( let a in var1 ){

                                var1[a] = change[a];
        
                            }

                        };

                        const typeCollision = collision1+collision2;
                        const collision = { PhysicalObject1: physicalObjects[i], PhysicalObject2: physicalObjects[j] };

                        let testX = 0;
                        let testY = 0;
                        let distX = 0;
                        let distY = 0;
                        let distance = 0;

                        switch ( typeCollision ){

                            case 'ss':

                                if (obj[var1[0]] < obj2[var2[0]] + obj2[var2[2]] &&
                                    obj[var1[0]] + obj[var1[2]]  > obj2[var2[0]] &&
                                    obj[var1[1]] < obj2[var2[1]] + obj2[var2[3]] &&
                                    obj[var1[1]] + obj[var1[3]]  > obj2[var2[1]]){
            
                                    applycollision( collision );
                            
                                }

                            break;

                            case 'cc':

                                if (Math.abs( obj[var1[0]]+obj[var1[4]] ) >= (obj2[var2[0]]-obj2[var2[4]]) &&
                                    Math.abs( obj[var1[1]]+obj[var1[4]] ) >= (obj2[var2[1]]-obj2[var2[4]]) ){

                                    if ( Math.sqrt( Math.pow( obj2[var2[1]]-obj[var1[1]], 2) + Math.pow( obj2[var2[0]]-obj[var1[0]], 2 ) ) < obj[var1[4]]+obj2[var2[4]]  ){
                                        applycollision( collision );
                                    }

                                }

                            break;

                            case 'sc':

                                if (obj2[var2[0]]       < obj[var1[0]])                    testX = obj[var1[0]];     
                                else if (obj2[var2[0]]  > obj[var1[0]]+obj[var1[2]])       testX = obj[var1[0]]+obj[var1[2]];   
                                if (obj2[var2[1]]       < obj[var1[1]])                    testY = obj[var1[1]];
                                else if (obj2[var2[1]]  > obj[var1[1]]+obj[var1[3]])       testY = obj[var1[1]]+obj[var1[3]];  

                                distX = obj2[var2[0]]-testX;
                                distY = obj2[var2[1]]-testY;
                                distance = Math.sqrt( (distX*distX) + (distY*distY) );

                                if (distance <= obj2[var2[4]]) applycollision( collision );

                            break;

                            case 'cs':

                                if (obj[var1[0]]        < obj2[var2[0]])                    testX = obj2[var2[0]];     
                                else if (obj[var1[0]]   > obj2[var2[0]]+obj2[var2[2]])      testX = obj2[var2[0]]+obj2[var2[2]];   
                                if (obj[var1[1]]        < obj2[var2[1]])                    testY = obj2[var2[1]];
                                else if (obj[var1[1]]   > obj2[var2[1]]+obj2[var1[3]])      testY = obj2[var2[1]]+obj2[var1[3]];  

                                distX = obj[var1[0]]-testX;
                                distY = obj[var1[1]]-testY;
                                distance = Math.sqrt( (distX*distX) + (distY*distY) );

                                if (distance <= obj[var1[4]]) applycollision( collision );

                            break;

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

    function setCustomCollision( physicalObject, type, posX, posY, widthOrRadius, height ){

        if ( physicalObject.type == 'custom' ){
            if ( type == "square" ){

                physicalObject.collisionType = 'square';
                physicalObject.collisionX = posX;
                physicalObject.collisionY = posY;
                physicalObject.collisionW = widthOrRadius;
                physicalObject.collisionH = height;

            }
            else if ( type == "circle" ){

                physicalObject.collisionType = 'circle';
                physicalObject.collisionX = posX;
                physicalObject.collisionY = posY;
                physicalObject.collisionR = widthOrRadius;

            } else console.log( 'Erro na função setCustomCollision(): insira um tipo válido.' )
        } else console.log( 'Erro na função setCustomCollision(): colisões customizadas são utilizadas apenas em objetos do tipo "custom".' );

    }

/* Render */

    function render(){

        /* Cleaning display */

        display.fillStyle = globalConstants.backgroundcolor;
        display.fillRect( 0, 0, globalConstants.display.w, globalConstants.display.h );

        /* render objects */

        for ( let i in physicalObjects ){

            const obj = physicalObjects[i];

            if ( obj.type == 'square' ){

                display.fillStyle = obj.color;
                display.fillRect( obj.x, obj.y, obj.w, obj.h );

            }
            else if ( obj.type == 'circle' ){

                display.fillStyle = obj.color;
                display.beginPath();
                display.arc(obj.x, obj.y, obj.r, Math.PI, Math.PI*3);
                display.fill();

            }
            else if ( obj.type == 'custom' ){

                display.fillStyle = obj.color;
                obj.drawing();

            }

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