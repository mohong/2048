
//获得相应格子距离期盘顶部的距离
function get_pos_top(i, j) {
    return 20 + i * (20 +100);
}

//获得相应格子距离棋盘左边的距离
function get_pos_left(i, j) {
    return 20 + j * (20 +100);
}

//获得相应数字的背景色
function get_number_background_color(number) {
    switch (number) {
        case 2: return '#eee4da'; break;
        case 4: return '#ede0c8'; break;
        case 8: return '#f2b179'; break;
        case 16: return '#f59563'; break;
        case 32: return '#f67c5f'; break;
        case 64: return '#f65e3b'; break;
        case 128: return '#edcf72'; break;
        case 256: return '#edcc61'; break;
        case 512: return '#9c0'; break;
        case 1024: return '#33b5e5'; break;
        case 2048: return '#09c'; break;
        case 4096: return '#a6c'; break;
        case 8192: return '#93c'; break;
    }
    return 'black';
}

//获得相应数字的颜色
function get_number_color(number) {
    if (number <= 4)
        return '#776e65';
    return 'white';
}

//判断棋盘上是否还有空格子
function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

//判断能否左移
function can_move_left(board) {
    for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
            if(board[i][j] != 0){
                if(board[i][j-1] == 0 || board[i][j] == board[i][j-1]){
                    return true;
                }
            }
        }
    }
    return false;
}

//判断水平方向上时候是否有空格子
function no_block_horizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}

