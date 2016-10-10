//动画显示数字格子
function show_number_with_animation(i, j, rand_number) {
    var number_cell = $('#number_cell_' + i + '_' + j);
    number_cell.css('background-color', get_number_background_color(rand_number));
    number_cell.css('color', get_number_color(rand_number));
    number_cell.text(rand_number);
    number_cell.animate({
        width:100,
        height:100,
        top: get_pos_top(i, j),
        left: get_pos_left(i, j)
    }, 50);
}

//更新分数
function update_score(score) {
    $('#score').text(score);
}