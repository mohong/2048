var board = new Array();    //每个格子的数字
var score = 0;  //分数
var has_conflicted = new Array();   //解决连续消除的标记
var success_string = 'Success';
var back = new Array();

var startx = 0; //移动端触摸屏幕时开始点的x坐标
var starty = 0; //移动端触摸屏幕时开始点的y坐标
var endx = 0;   //移动端触摸屏幕时结束点的x坐标
var endy = 0;   //移动端触摸屏幕时结束点的y坐标

//初始化棋局
$(document).ready(function() {
    prepare_for_mobile();   //适配移动端
    new_game();
});

//开始新游戏
function new_game() {
    //初始化棋盘
    init();
    //在随机两个格子生成数字
    generate_one_number();
    generate_one_number();
}

//初始化
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var grid_cell = $('#grid_cell_' + i + '_' + j);
            grid_cell.css('top', get_pos_top(i, j) + 'rem');
            grid_cell.css('left', get_pos_left(i, j) + 'rem');
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        has_conflicted[i] = new Array();
        for (var j =0; j < 4; j++) {
            board[i][j] = 0;
            has_conflicted[i][j] = false;
        }
    }
    update_board_view();
    score = 0;
    update_score(score);
}

//更新棋局
function update_board_view() {
    $('.number_cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid_container').append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
            var number_cell = $('#number_cell_' + i + '_' + j);
            if (board[i][j] == 0) {
                number_cell.css({
                    'width': '0',
                    'height': '0',
                    'top': get_pos_top(i, j) + 2.5 + 'rem',
                    'left': get_pos_left(i, j) + 2.5 +'rem'
                });

            } else {
                number_cell.css({
                    'width': '5rem',
                    'height': '5rem',
                    'top': get_pos_top(i, j) + 'rem',
                    'left': get_pos_left(i, j) + 'rem',
                    'background-color': get_number_background_color(board[i][j]),
                    'color': get_number_color(board[i][j])
                });
                number_cell.text(board[i][j]);
            }
            has_conflicted[i][j] = false;
        }
    }
    $('.number_cell').css({
        'line-height': '5rem',
        'font-size': '3rem'
    });
}

//随机在一个格子生成数字
function generate_one_number() {
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var time = 0;
    while (time < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        time++;
    }
    if (time == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //随机一个数字
    var rand_number = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = rand_number;
    show_number_with_animation(randx, randy, rand_number);
    save_status(board); //保存快照
    return true;
}

//监听键盘的上下左右移动
$(document).keydown(function(event) {
    if ($('#score').text() == success_string) {
        new_game();
        return;
    }
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (move_left()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if(move_up()){
                setTimeout('generate_one_number()',200);
                setTimeout('is_gameover()', 300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if(move_right()){
                setTimeout('generate_one_number()',200);
                setTimeout('is_gameover()', 300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (move_down()){
                setTimeout('generate_one_number()',200);
                setTimeout('is_gameover()', 300);
            }
            break;
        default:
            break;
    }
});

//向左移动
function move_left() {
    if (!can_move_left(board)) {
        return false;
    }
    //move left
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && no_block_horizontal(i, k, j, board)) {
                        show_move_animation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && no_block_horizontal(i, k, j, board) && !has_conflicted[i][k]) {
                        show_move_animation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        update_score(score);
                        has_conflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

//向右移动
function move_right() {
    if (!can_move_right(board)) {
        return false;
    }
    //move right
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && no_block_horizontal(i, j, k, board)) {
                        show_move_animation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && no_block_horizontal(i, j, k, board) && !has_conflicted[i][k]) {
                        show_move_animation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        update_score(score);
                        has_conflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

//向上移动
function move_up() {
    if(!can_move_up(board)){
        return false;
    }
    //move up
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && no_block_vertical(j, k, i, board)) {
                        show_move_animation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && no_block_vertical(j, k, i, board) && !has_conflicted[k][j]) {
                        show_move_animation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        update_score(score);
                        has_conflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()',200);
    return true;
}

//向下移动
function move_down() {
    if (!can_move_down(board)) {
        return false;
    }
    //move down
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && no_block_vertical(j, i, k, board)) {
                        show_move_animation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && no_block_vertical(j, i, k, board) && !has_conflicted[k][j]) {
                        show_move_animation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        update_score(score);
                        has_conflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}


//判断游戏是否成功
function is_gameover() {
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            if (board[i][j] == 2048){
                update_score(success_string);
                return;
            }
        }
    }
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
   alert("走投无路啦");
}

//回退函数
function come_back() {
    if (back.length<=2){
        return;
    }
    var o = back[back.length-2];
    var n = 1;
    //o[n]遍历对象
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            board[i][j]  = parseInt(o[n].substr(o[n].lastIndexOf(',')+1));
            score = parseInt(o[n]);
            n++;
        }
    }
    console.log(score);
    update_score(score);
    back.pop();
    setTimeout('update_board_view()',200);
}

