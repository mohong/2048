var board = new Array();    //每个格子的数字
var score = 0;  //分数
var has_conflicted = new Array();   //解决连续消除的标记
var success_string = 'Success';
var gameover_string = 'GameOver';

//初始化棋局
$(document).ready(function() {
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
            grid_cell.css('top', get_pos_top(i, j));
            grid_cell.css('left', get_pos_left(i, j));
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
                    'width': '0px',
                    'height': '0px',
                    'top': get_pos_top(i, j) +50,
                    'left': get_pos_left(i, j) +50
                });

            } else {
                number_cell.css({
                    'width':100,
                    'height':100,
                    'top': get_pos_top(i, j),
                    'left': get_pos_left(i, j),
                    'background-color': get_number_background_color(board[i][j]),
                    'color': get_number_color(board[i][j]),
                });
                number_cell.text(board[i][j]);
            }
            has_conflicted[i][j] = false;
        }
    }
    $('.number_cell').css({
        'line-height': '100px',
        'font-size': '60px'
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
                setTimeout('generate_one_number()', 210);
                //setTimeout('is_gameover()', 300);
            }
            break;
        case 38: //up

            break;
        case 39: //right

            break;
        case 40: //down

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
                        board[i][k] += board[i][j]
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

