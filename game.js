var socket = io();
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE
    },
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("logo", "https://spanishmenacingbuttons.throb.repl.co/164409847444737788-4415846913.png");
    this.load.image("grid", "https://spanishmenacingbuttons.throb.repl.co/Screen%20Shot%202022-02-05%20at%203.png");
}

function create() {
    screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    scene = this;
    cursors = scene.input.keyboard.createCursorKeys();
    keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    

    //Grid
    bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'grid').setOrigin(0);

    logo = scene.add.image(screenCenterX, screenCenterY - 150, "logo");

    loginBg = scene.add.rectangle(screenCenterX, screenCenterY + 60, 500, 250, 0xFFFFFF);

    //Move Text Field
    $("#uname").css("left", screenCenterX - (parseFloat($("#uname").css("width")) / 2) + "px")
    $("#uname").css("top", (screenCenterY - 40) + "px")
    //Start Game
    $("#enterGame").css("left", screenCenterX - (parseFloat($("#enterGame").css("width")) / 2) + "px")
    $("#enterGame").css("top", (screenCenterY + 20) + "px")
    $("#enterGame").click(function () {
      if ($("#uname").val() == "") {
            $("#uname").val("unnamed")
        }
        socket.emit('new player', $("#uname").val(), {
            x: screenCenterX,
            y: screenCenterY
        });
        $("#homescreen").remove();
        loginBg.destroy();
        logo.destroy()
        startGame()
    })

    //Set Bluring
    $("canvas").click(function () {
        $("#uname").blur()
    })

}

var speed = 2
function update() {
    if (cursors.left.isDown || keyA.isDown) {
        playerMovement.x = playerMovement.x - speed;
    } 
    if (cursors.right.isDown || keyD.isDown) {
        playerMovement.x = playerMovement.x + speed;
    } 
    if (cursors.up.isDown || keyW.isDown) {
        playerMovement.y = playerMovement.y - speed;
    }
     if (cursors.down.isDown || keyS.isDown) {
        playerMovement.y = playerMovement.y + speed;

    }
}

function startGame() {
    playerMovement = {
        x: screenCenterX,
        y: screenCenterY
    }
    updateDrawRoutine()
    setInterval(function() {
        socket.emit('movement', playerMovement);
      }, 1);
}

function updateDrawRoutine() {
    var currplayers = [];
    var currplayerstext = [];
    socket.on("state", function (players) {
        for (var i = 0; i < currplayers.length; i++) {
            currplayers[i].destroy();

        }
        for (var v = 0; v < currplayerstext.length; v++) {
            if (currplayerstext === []) {
            } else {
                currplayerstext[v].destroy();

            }

        }
        currplayers = [];
        currplayerstext = [];
        for (var id in players) {
            currplayers.push(scene.physics.add.existing(scene.add.circle(players[id].x, players[id].y, 30, 0x000)))
            currplayerstext.push(scene.add.text(players[id].x, players[id].y - 80, players[id].uname, { fontSize: '25px', fill: '#FFF' }).setOrigin(0.5))

        }
    })
}
