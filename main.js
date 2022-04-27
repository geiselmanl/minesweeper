
class Tile { 
    
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isBomb = false;
        this.isFlagged = false;
        this.bombCount = 0;
        this.hidden = true;
    }
}


let GRID_SIZE = 9;
let BOMB_COUNT = 16;
let bombLoc = [];
const pos = [{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: -1, y: -1 },{ x: 1, y: 0 },{ x: 1, y: 1 },{ x: 1, y: -1 }, {x: 0, y: -1},{x: 0, y: 1}];
let gameBoard = Array.from(Array(GRID_SIZE), () => new Array(GRID_SIZE));
let secondElasped;
let time;
let gameOver = false;
let seconds = 0;




generateBoard();
drawBoard();
clickSquare();



function generateBoard(){
    for(let col = 0; col<GRID_SIZE; col++){
        for(let row = 0; row<GRID_SIZE; row++){
            let id = col+"-"+row;
            gameBoard[row][col] = new Tile(row,col);
            $(document).ready(function() {
                jQuery("<div>", {
                    id: id,
                    class: "square",
                }).appendTo("#game-board");
            });
            
        }
    }

    generateBombs();
    generateTileNum();
}


function generateBombs(){
    let i = 0;
    let row, col, bombspot;

    while(i < BOMB_COUNT){
        bombSpot = Math.floor(Math.random() * ((GRID_SIZE*GRID_SIZE)-1));

        if(!bombLoc.includes(bombSpot)){
            bombLoc.push(bombSpot);
            i++;
        }
    }

    for(let x = 0; x<BOMB_COUNT; x++){
       row = Math.floor(bombLoc[x]/GRID_SIZE)
       col = bombLoc[x]%GRID_SIZE;
       gameBoard[row][col].isBomb = true;
    }
}



function generateTileNum(){
    for(let row = 0; row < GRID_SIZE; row++){
        for(let col = 0; col < GRID_SIZE; col++){
           for(let i = 0; i<pos.length; i++){
               if(validSpot(row+pos[i].x, col+pos[i].y) && gameBoard[row+pos[i].x][col+pos[i].y].isBomb){
                    gameBoard[row][col].bombCount += 1;
               }
           }
        }
    }
}


function validSpot(x,y){
    if(x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE){
        return true
    }
    return false;
}



function clickSquare(){
    $(document).ready(function(){
        $('.square').on('click', function(){
            if(!gameOver){
                let selected = $(this).attr('id');
                let spot = selected.split("-");
                let col = parseInt(spot[0]);
                let row = parseInt(spot[1]);
                if(seconds === 0){
                    seconds = 1;
                    secondElasped = document.getElementById('userTime');
                    time = setInterval(incrementSeconds, 1000);
                } 
                
                if(gameBoard[row][col].isBomb && !(gameBoard[row][col].isFlagged)) {
                drawLose(row,col);
                stop();
                gameOver = true;
                }else{
                    if(!gameBoard[row][col].isFlagged){
                        updateBoard(row,col);
                        if(checkWin()){
                            drawWin();
                            stop();
                            gameOver = true;
                        }else{
                            drawBoard();
                        }
                    }
                
                }
            }
            
        
        });

        $('.square').mousedown(function(e){ 
            let selected = $(this).attr('id');
            let spot = selected.split("-");
            let col = parseInt(spot[0]);
            let row = parseInt(spot[1]);
            $('.square').contextmenu(function() {
                return false;
            });
            if( e.button == 2 ) { 
                if(gameBoard[row][col].hidden){
                    if(!gameBoard[row][col].isFlagged){
                        gameBoard[row][col].isFlagged = true;
                    }else if(gameBoard[row][col].isFlagged){
                        gameBoard[row][col].isFlagged = false;
                    }
                }
                drawBoard();
            } 
            
        }); 
    
    });
}


function updateBoard(row,col){
    gameBoard[row][col].hidden = false;
    if(gameBoard[row][col].bombCount === 0 && !(gameBoard[row][col].isBomb)){
        for(let i = 0; i<pos.length; i++){
            let newRow = row+pos[i].x;
            let newCol = col+pos[i].y;
            if(validSpot(newRow, newCol)){
                if(!gameBoard[newRow][newCol].isFlagged){
                    if(gameBoard[newRow][newCol].bombCount > 0){
                        gameBoard[newRow][newCol].hidden = false;
                    }
                     if(gameBoard[newRow][newCol].bombCount === 0 && gameBoard[newRow][newCol].hidden){
                        updateBoard(newRow,newCol);
                     }
                }    

            }   
        }
    }
}

function checkWin(){
    for(let row = 0; row < GRID_SIZE; row++){
        for(let col = 0; col < GRID_SIZE; col++){
            if(!(gameBoard[row][col].isBomb) && gameBoard[row][col].hidden){
                return false;
            }
        }
    }
    return true;
}



function drawWin(){
    for(let row = 0; row<GRID_SIZE; row++){
        for(let col = 0; col<GRID_SIZE; col++){  
            $(document).ready(function(){
                if(gameBoard[row][col].isBomb){
                    $('#' + col + '-' + row).html("🚩");
                }else{
                    $('#' + col + '-' + row).addClass('square-pressed');
                    if(gameBoard[row][col].bombCount != 0){
                        $('#' + col + '-' + row).html(gameBoard[row][col].bombCount);
                    }
                }
            });    
            
        }
    } 
    stop();
    alert("Congrats You've Won");
}


function drawLose(x,y){
    for(let row = 0; row<GRID_SIZE; row++){
        for(let col = 0; col<GRID_SIZE; col++){  
            $(document).ready(function(){
                $('#' + y + '-' + x).addClass("red-square");
                if(gameBoard[row][col].hidden){
                    if(gameBoard[row][col].isFlagged){
                        if(!gameBoard[row][col].isBomb){
                            $('#' + col + '-' + row).addClass("red-square");
                        }
                        $('#' + col + '-' + row).html("🚩");
                    }else if(gameBoard[row][col].isBomb){
                        $('#' + col + '-' + row).html("💣");
                    }else{
                        $('#' + col + '-' + row).html("");
                    }

                }else if(!gameBoard[row][col].isBomb){
                    if(gameBoard[row][col].bombCount != 0){
                        $('#' + col + '-' + row).html(gameBoard[row][col].bombCount);
                    }
                }

                
            });    
            
        }
    } 
    stop();
}


function drawBoard(){
    for(let row = 0; row<GRID_SIZE; row++){
        for(let col = 0; col<GRID_SIZE; col++){  
            
            $(document).ready(function(){
                if(gameBoard[row][col].hidden){
                    if(gameBoard[row][col].isFlagged){
                        $('#' + col + '-' + row).html("🚩");
                    }else{
                        $('#' + col + '-' + row).html("");
                    }

                }else if(!gameBoard[row][col].isBomb){
                    $('#' + col + '-' + row).addClass('square-pressed');
                    if(gameBoard[row][col].bombCount != 0){
                        $('#' + col + '-' + row).html(gameBoard[row][col].bombCount);
                        
                    }
                }  
            });    
            
        }
    }        
}

function resetGame(){
    gameOver = false;
    bombLoc = [];
    gameBoard = null;
    gameBoard = Array.from(Array(GRID_SIZE), () => new Array(GRID_SIZE));
    resetTime();
    resetBoard();
    generateBoard();
    drawBoard();
    clickSquare();
}

function resetBoard(){
    for(let row = 0; row<GRID_SIZE; row++){
        for(let col = 0; col<GRID_SIZE; col++){  
            $(document).ready(function(){
                $('#' + col + '-' + row).remove();
            });    
            
        }
    }        
}

function resetTime(){
    if(seconds != 0){
        clearInterval(time);
        seconds = 0;
        secondElasped.innerHTML = seconds 
    }
}

function stop(){
    clearInterval(time);
    seonds = 0;
}

function incrementSeconds() {
    if(seconds === 0) {
        clearInterval(time);
    }else{
        secondElasped.innerHTML = seconds ;
        seconds += 1;
        
    }    
   
}



function setToBeginner(){
    resetBoard();
    stop();
    GRID_SIZE = 9;
    BOMB_COUNT = 9;
    $(document).ready(function(){
        $("#game-board").removeClass();
        $("#game-board").addClass('board');
    }); 
    resetGame();
}

function setToIntermediate(){
    resetBoard();
    stop();
    GRID_SIZE = 16;
    BOMB_COUNT = 40;
    $(document).ready(function(){
        $("#game-board").removeClass();
        $("#game-board").addClass('board-medium');
    }); 
    resetGame();
}

function setToAdvanced(){
    resetBoard();
    stop();
    GRID_SIZE = 22;
    BOMB_COUNT = 99;
    $(document).ready(function(){
        $("#game-board").removeClass();
        $("#game-board").addClass('board-advanced');
    }); 
    resetGame();
}











