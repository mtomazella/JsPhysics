/* Data */

    let display = null;

    /* Physical Objects */

        const globalConstants = {

            gravitationalacceleration: -2,
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

        let inputs = {

            /*keyCode: {

                press: pressFunction,
                release: releaseFunction

            }*/

        }

        let keysbeingpressed = [ ];

/* Define Area */
        
    function defineArea( canvasId ){

        display = document.getElementById(canvasId).getContext("2d", { alpha: false } );

    }

/* Input Functions */

    function addInput( keyCode, pressFunction, releaseFunction ){

        if ( inputs[ keyCode ] == undefined )
            inputs[parseInt(keyCode)] = { press: pressFunction, release: releaseFunction }
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
        console.log("teste")
        if ( keysbeingpressed.indexOf(key) != -1 && key in inputs ){

            (inputs[ key ].release)();
            keysbeingpressed.splice(keysbeingpressed.indexOf( key ), 1);

        }

    }

/* Create Physical Object */

    function createPhysicalObject( name, color, posX, posY, width, height, useGravity, useColision, bouncing, mass ){

        if( name != undefined ){
            physicalObjects[name] = { color: "black", x: 0, y: 0, w: 0, h: 0, gravity: false, colision: false, bp: 0, m: 0, vx: 0, vy: 0, ax: 0, ay: 0 };

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

    function Loop(){

        gravity(); applyvectors(); render();

        requestAnimationFrame(Loop);

    }