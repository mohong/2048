
//20是格子之间的距离，100是一个小格子的宽度
function getPosTop(i,j){
    var top=20+i*(100+20);
    return top;
}
function getPosLeft(i,j){
    var left=20+j*(100+20);
    return left;
}


//更新棋盘上显示的方块
function updateBoardView() {
    //如果有number-cell,需要先删除
    $('.number-cell').remove();
    //遍历盒子，改变盒子的样式
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$("#number-cell-"+i+"-"+j);
            if(board[i][j] == 0){
                theNumberCell.css({
                   "width": "0px",
                    "height": "0px",
                    "top": getPosTop(i)+50,
                    "left": getPosLeft(j)+50
                });
            }else{
                theNumberCell.css({
                    "width": "100px",
                    "height": "100px",
                    "top": getPosTop(i),
                    "left": getPosLeft(j),
                    "background-color": getNumberBackgroundColor(board[i][j]),
                    "color": getNumberColor(board[i][j])
                })
            }
        }
        $('.number-cell').css({
           "line-height": "100px",
            "font-size": "30px"
        });
    }
}


//生成一个随机数字
function generateOneNumber() {
    if(nospace(board)){
        return false;
    }

    //随机生成一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    //看是不是空格,优化随机
    var times=0;
    while(times<50){
        if(board[randx][randy]==0){
            break;
        }
        //重复
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));

        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
        }
    }

    var randNumber=Math.random()<0.65?2:4;
    showNumberWithAnimation(randx,randy,randNumber);
    board[randx][randy]=randNumber;

}

//判断有没有空格
function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}


//添加背景颜色
function getNumberBackgroundColor(number){
    var color="black";
    switch(number){
        case 2:
            color='#eee4da';
            break;
        case 4:
            color="#ede0c8";
            break;
        case 8:
            color='#f2b179';
            break;
        case 16:
            color="#f59563";
            break;
        case 32:
            color='#f67c5f';
            break;
        case 64:
            color="#f65e3b";
            break;
        case 128:
            color='#edcf72';
            break;
        case 256:
            color="#edcc61";
            break;
        case 512:
            color='#9c0';
            break;
        case 1024:
            color="#33b5e5";
            break;
        case 2048:
            color='#09c';
            break;
    }
    return color;
}
function getNumberColor(number){
    if(number<=4){
        return "#776e50";
    }
    return "white";
}


//判断下方块能否移动,包括数字相等合并
function canMoveLeft(board) {
    for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
            if(board[i][j] != 0){
                if (board[i][j-1]==0 || board[i][j-1] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//检测行上有没有阻碍
function noBlockHorizontal(row,col1,col2,board) {
    for(var i=col1+1; i<col2; i++){
        if (board[row][i] != 0){
            return false;
        }
    }
    return true;
}


//移动动画函数
function showMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        left: getPosLeft(tox,toy),
        top: getPosTop(tox,toy)
    },200);
}