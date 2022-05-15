let img = new Image();
img.src = "images/npc.gif";

let player2img = new Image();
player2img.src = "images/npc.gif";

window.onload = () => {
    var conn = new WebSocket('ws://localhost:8082');

    conn.onopen = function(e) {
        console.log("Connection established!");
    };

    conn.onmessage = function(e) {
        let data = JSON.parse(e.data);

        player2posX = data.player2posX;
        player2posY = data.player2posY;
        imgPlayer2 = data.playerImg;
    };

    setTimeout(() => {document.getElementById('audio').play();}, 300);

    //PLAYER 1
    let pageSize = getPageSize()

    var playerHeight = 300;
    var playerWidth = 150;

    var originalPlayerPosY = pageSize[1] - playerHeight - (pageSize[1]*0.1);

    var playerPosX = 100;
    var playerPosY = originalPlayerPosY;
    var playerImg = "images/npc.gif";

    var speedMoving = 5;
    var speedJumping = 12;

    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;
    var jumping = "none";

    var jumpingHeight = 500;


    //PLAYER 2
    var player2posX = 0;
    var player2posY = 0;
    var imgPlayer2 = "images/npc.gif";

    //Recibimos el elemento canvas
    var canvas = document.getElementById('canvas');

    setCanvasSize();

    //Comprobación sobre si encontramos un elemento
    //y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
    if (canvas && canvas.getContext) {
        //Accedo al contexto de '2d' de este canvas, necesario para dibujar
        var ctx = canvas.getContext('2d');

        if (ctx) setInterval(draw, 5);
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.code == "KeyD" || e.code == "ArrowRight") rightPressed = true;
        else if(e.code == "KeyA" || e.code == "ArrowLeft") leftPressed = true;
        else if(e.code == "KeyW" || e.code == "ArrowUp") upPressed = true;
    }

    function keyUpHandler(e) {
        if(e.code == "KeyD" || e.code == "ArrowRight") rightPressed = false;
        else if(e.code == "KeyA" || e.code == "ArrowLeft") leftPressed = false;
        else if(e.code == "KeyW" || e.code == "ArrowUp") upPressed = false;
    }

    window.addEventListener("resize", setCanvasSize);

    function setCanvasSize() {
        let pageSize = getPageSize();

        canvas.setAttribute("height", pageSize[1]);
        canvas.setAttribute("width", pageSize[0]);
    }

    function getPageSize() {
        let pageWidth = document.body.clientWidth;
        let pageHeight = document.body.clientHeight;

        return [pageWidth, pageHeight];
    }


    // DRAW CANVAS
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawNPC();

        conn.send(JSON.stringify(
            {
                "player2posX": playerPosX,
                "player2posY": playerPosY,
                "playerImg": playerImg,
            }
        ));

        drawPlayer2();
    }

    function drawNPC() {
        ctx.beginPath();

        if(rightPressed && playerPosX < getPageSize()[0] - playerWidth) {
            playerPosX += speedMoving;
            playerImg = "images/npc.gif";
            img.src = playerImg;
        }
        else if(leftPressed && playerPosX > 0) { 
            playerPosX -= speedMoving;
            playerImg = "images/npc2.gif";
            img.src = playerImg;
        }
        
        if(upPressed && jumping == "none") {
            if (playerPosY == originalPlayerPosY) playerPosY -= 15;
            else jumping = "jumping";
        }

        if(jumping == "jumping") {
            if (playerPosY > (originalPlayerPosY - jumpingHeight)) {
                playerPosY -= speedJumping;
            } else {
                setTimeout(() => {
                    jumping = "falling";
                }, 30);
            }
        }

        if (jumping == "falling") {
            if (playerPosY < originalPlayerPosY) {
                playerPosY += speedJumping;
            } else {
                jumping = "notAllowed";

                setTimeout(() => {
                    jumping = "none";
                }, 100);
            }
        }

        ctx.drawImage(img, playerPosX, playerPosY, playerWidth, playerHeight);

        ctx.closePath();
    }



    function drawPlayer2() {
        ctx.beginPath();

        player2img.src = imgPlayer2;
        ctx.drawImage(player2img, player2posX, player2posY, playerWidth, playerHeight);

        ctx.closePath();
    }

}