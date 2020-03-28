
//Configuracoes do Jogo
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth-10,
    height: window.innerHeight-20,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

//Carrega o jogo
game = new Phaser.Game(config)

//Variaveis globais
var teclaPulo
var teclaEsc
var game
var map
var personagem
var plataforma
var chao
var cursors
var score  = 0
var vida   = 100
var nPulos = 0

/*
    Phaser conta com 3 functions padrões:
    preload -> Responsavel por definir carregar as imagens em 'constantes'
    create  -> Responsavel por criar a estrutura do jogo, como cenario, personagens etc
    update  -> Responsavel por ações durante o jogo, como movimentação, pontuação etc
*/

function preload(){
    this.load.image('fundoCenario', 'imagens/fundoCenario.png')
    this.load.image('chao', 'imagens/chao.png')
    this.load.image('plataforma', 'imagens/plataforma.png')
    this.load.image('plataformaPequeno', 'imagens/plataformaPequena.png')
    this.load.spritesheet('personagem', 'imagens/personagem.png', { frameWidth: 49, frameHeight: 137 })
}

function create(){
    //Background Cenario
    this.add.image(400, 400, 'fundoCenario').setScale(1.5)

    //adiciona fisica, posição e imagem ao elemento 'personagem'
    personagem = this.physics.add.sprite(100, 450, 'personagem')
    
    //Adiciona fisica
    chao       = this.physics.add.staticGroup()
    plataforma = this.physics.add.staticGroup()

    //Cria plataforma, posição e imagem
    plataforma.create(600, 545, 'plataforma')
    //Cria chão, posição, imagem e escala
    plataforma.create(400, 670, 'chao').setScale(2).refreshBody()

    personagem.setBounce(0)
    personagem.setCollideWorldBounds(true)

    this.cameras.main.setBounds(0,0,1920*2,700)
    this.physics.world.setBounds(0,0,1920*2,700)
    this.cameras.main.startFollow(personagem, true, 0.05, 0.05)
    this.physics.add.collider(personagem, plataforma)

    // Animações
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('personagem', { start: -1, end: 3 }),
        frameRate: 10,
        repeat: -1
    })
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('personagem', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'personagem', frame: 4 } ],
        frameRate: 20
    })

    //Define teclas
    teclaEsc  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    teclaPulo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    cursors   = this.input.keyboard.createCursorKeys()
}

function update(){

    if(personagem.body.touching.down){ 
        nPulos = 0
    }
    
    //Personagem caiu em buraco
    if(personagem.y > 630){
        morrer()
    }

    if(cursors.left.isDown){
        andarEsquerda()
    }else if (cursors.right.isDown){
        andarDireita()
    }else{
        parar()
    }
    
    //Pulo duplo
    if(Phaser.Input.Keyboard.JustDown(teclaPulo)){
        if(nPulos == 0 && personagem.body.touching.down){
            pular()
        }
        if(nPulos == 1 && !personagem.body.touching.down){
            pular()
        }
    }
}

function andarEsquerda(){
    personagem.setVelocityX(-160)
    personagem.anims.play('left', true)
}

function andarDireita(){
    personagem.setVelocityX(160)
    personagem.anims.play('right', true)
}

function parar(){
    personagem.setVelocityX(0)
	personagem.anims.play('turn')
}

function pular(){
    nPulos++
    personagem.setVelocityY(-330)
}

function morrer(){
    document.body.style.backgroundColor = '#900'

    document.getElementsByTagName('canvas')[0].style.display = 'none'
    document.getElementById('morte').style.display = ''
}
