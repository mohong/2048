//存储小格子数据
var board = new Array();
//得分
var score = 0;

$(document).ready(function () {
    //初始化游戏
    newGame();



})



function newGame() {
    //初始化棋盘格
    init();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}


function init(){
    //有数字的小方块
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css({
                "top":getPosTop(i,j),
                "left":getPosLeft(i,j)
            });
        }
    }
    //初始化board数组
    for(var i=0;i<4;i++){
        board[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;

        }
    }
    //有操作,更新界面
    updateBoardView();

    score=0;
    $("#score").text(score);
}
