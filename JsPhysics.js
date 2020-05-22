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

                color: drawingColor,
                x: XaxisPosition, 
                y: YaxisPosition, 
                w: drawingWidth, 
                h: drawingHeight, 
                vx: velocityX,
                vy: velocityY, 
                ax: accelerationX,
                ay: accelerationY,
                m: mass,
                bp: bouncingPercentage, (porcentagem de velocidade conservada depois de colisão )
                gravity: T/F,
                colision: T/F

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

    /* colision */

        let colisionHandlers = {

            /*obj1IdObj2Id: {

                PhysicalObject1: objectName,
                PhysicalObject2: objectName,
                colisionHandler: function

            }*/

            nothing: function(){},

            default: undefined

        }

    /* Loop */

        const loopFunctions = [ detectColisions, gravity, applyvectors, render ];

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

    function createPhysicalObject( name, color, posX, posY, width, height, useGravity, useColision, bouncing, mass ){

        if( name != undefined ){
            physicalObjects[name] = { name: name, color: "black", x: 0, y: 0, w: 0, h: 0, gravity: false, colision: false, bp: 0, m: 0, vx: 0, vy: 0, ax: 0, ay: 0 };

            const values = [ color, posX, posY, width, height, useGravity, useColision, bouncing, mass ];
            const variables = [ 'color', 'x', 'y', 'w', 'h', 'gravity', 'colision', 'bp', 'm' ];

            for ( let i in values ){

                if ( values[i] != null && values[i] != undefined ){

                    physicalObjects[name][variables[i]] = values[i];

                }

            }
        }
        else console.log(" Erro na função createPhysicalObject(): nomeie o objeto ");

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

/* Colision */

    function apllyColision( colision ){

        /*let i = 0;
        let handler = undefined;*/
        const id = colision.PhysicalObject1.object.name+colision.PhysicalObject2.object.name

        /*for ( i in colisionHandlers ){

            if ( colision.PhysicalObject1.object == colisionHandlers[i].PhysicalObject1 && colision.PhysicalObject2.object == colisionHandlers[i].PhysicalObject2 )
                handler = colisionHandlers[i];

        }*/

        /*if ( handler != undefined )
            handler["function"](colision);
        else colisionHandlers.default;*/

        if ( colisionHandlers.indexOf(id) != -1 ){

            colisionHandlers[id].function();

        }

    }

    function detectColisions(){

        for ( let i in physicalObjects ){

            if ( physicalObjects[i].colision == true ){

                for ( let j in physicalObjects ){

                    if ( physicalObjects[j].colision == true && i != j ){

                        const obj1 = physicalObjects[i], obj2 = physicalObjects[j];

                        const posXobj1 = [ ];

                        for ( let x1 = obj1.x; x1 <= obj1.x+obj1.w; x1++ ){

                            posXobj1.push(x1);

                        }

                        const posXobj2 = [ ];

                        for ( let x2 = obj2.x; x2 <= obj2.x+obj2.w; x2++ ){

                            posXobj2.push(x2);

                        }

                        const posYobj1 = [ ];

                        for ( let y1 = obj1.y+obj1.h; y1 >= obj1.y; y1-- ){

                            posYobj1.push(y1);

                        }

                        const posYobj2 = [ ];

                        for ( let y2 = obj2.y+obj2.h; y2 >= obj2.y; y2-- ){

                            posYobj2.push(y2);

                        }
  
                        let Xhp = 0;
                        let Yhp = 0;

                        for ( let p in posXobj1 ){

                            for ( let q in posXobj2 ){

                                if ( posXobj1[p] == posXobj2[q] ) Xhp++;

                            }

                        }
                        for ( let p in posYobj1 ){

                            for ( let q in posYobj2 ){

                                if ( posYobj1[p] == posYobj2[q] ) Yhp++;

                            }

                        }

                        if ( Yhp > 0 && Xhp > 0 ){
                            const colision = { PhysicalObject1: { object: obj1, Xpoints: posXobj1, Ypoints: posYobj1 }, PhysicalObject2: { object: obj2, Xpoints: posXobj2, Ypoints: posYobj2 }, HittingPointsX: Xhp, HittingPointsY: Yhp };

                            apllyColision( colision );
                        }

                    }

                }

            }

        }

    }

    function createColisionHandler( PhysicalObject1, PhysicalObject2, colisionHandlerFunction ){

        let id = PhysicalObject1.name+PhysicalObject2.name;

        colisionHandlers[ id ] = { PhysicalObject1: PhysicalObject1, PhysicalObject2: PhysicalObject2, function: colisionHandlerFunction };

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