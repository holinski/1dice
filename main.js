
var house_edge = 1;
var reset_amount = $('.bet_input').val();


$('.bet_input').keyup(function () {
	reset_amount = $('.bet_input').val();
});




$(document).ready(function () {
	$.ajax({
		type: "POST",
		data: {
		},

		dataType: "html",
		url: "ajax/start.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			changeBalance(result.balance);
			$('#client_seed').val(result.client_seed);
			$('#hash_server_seed').html(result.hash_server_seed);

			$('.total_bet').html(result.total_bet);
			$('.total_won').html((result.total_won / 100000000).toFixed(8));


			$('#ref_id').html(result.ref_id);



			var chart = $('#container_dice').highcharts();
			chart.series[0].addPoint((result.balance / 100000000));

			showStrategy();

			if (result.email) {


				$('#user_welcome').html(result.name + '(' + result.id + ')');
				$('.welcome').show();


				$('#account_name_change').val(result.name);




				$('#tournament_r').show();
				$('#bonus_r').show();

				if (result.tournament_enabled) {

					$('#tournament_text').show();
					//				start_date = getLocalTime(result.tournament_enabled);

					//alert(new Date(start_date[0]));
					initializeClock('tournament_timer', result.tournament_enabled_sec);


				}


				if (result.tournament_start) {

					$('body').addClass('background-dark');
					$('.top_button_field').hide();
					$('#currency_block_button').remove();
					$('#total_won_span').hide();
					$('#total_bet_span').hide();
					$('.currency_name').html(result.cname);

					house_edge = 0;

					$('#tournament_text_end').show();

					initializeClock('tournament_timer', result.tournament_enabled_sec);

				}

			} else {
				$('#create_account_r').show();
			}


		}
	});
});



// Сброс
$('#amount_reset').click(function (e) {


	$('.bet_input').val(reset_amount);
	calculateProfit();
});



// делим сумму пополам
$('#amount_del_2').click(function (e) {

	var amount = $('.bet_input').val();
	var return_amount = amount / 2;
	return_amount = return_amount.toFixed(8);
	$('.bet_input').val(return_amount);
	calculateProfit();
});

// увеличиваем сумму на 2
$('#amount_x_2').click(function (e) {

	var amount = $('.bet_input').val();
	var return_amount = amount * 2;
	return_amount = return_amount.toFixed(8);

	/*
		var max_amount = (parseInt($('.balance').html()*100000000)/100000000).toFixed(8);
		if(return_amount > max_amount){
			return_amount = max_amount;
		}
		
	*/

	$('.bet_input').val(return_amount);

	calculateProfit();
});


// минимальная сумма ставки
$('#amount_min').click(function (e) {

	return_amount = (0.00000001).toFixed(8);
	$('.bet_input').val(return_amount);
	calculateProfit();
});


// максимальная сумма ставки
$('#amount_max').click(function (e) {

	var amount = (parseInt($('.balance').html() * 100000000) / 100000000).toFixed(8);
	$('.bet_input').val(amount);
	calculateProfit();
});


// делим шанс пополам
$('#chance_del_2').click(function (e) {

	var chance = $('.chance_input').val();
	var return_chance = chance / 2;
	if (return_chance < 1) return_chance = 1;
	return_chance = return_chance.toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// увеличиваем шанс в 2 раза
$('#chance_x_2').click(function (e) {

	var chance = $('.chance_input').val();
	var return_chance = chance * 2;
	if (return_chance > 98) return_chance = 98;
	return_chance = return_chance.toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// минимальный шанс
$('#chance_min').click(function (e) {

	var return_chance = (1).toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// максимальный шанс
$('#chance_max').click(function (e) {
	var return_chance = (98).toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// минус 10%
$('#chance_10_minus').click(function (e) {

	var chance = $('.chance_input').val();
	var return_chance = chance - 5;
	if (return_chance < 1) return_chance = 1;
	return_chance = return_chance.toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// плюс 10%
$('#chance_10_plus').click(function (e) {

	var chance = parseFloat($('.chance_input').val());
	var return_chance = chance + 5;

	if (return_chance > 98) return_chance = 98;
	return_chance = return_chance.toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});

// 50%
$('#chance_50').click(function (e) {

	return_chance = (50).toFixed(3);
	$('.chance_input').val(return_chance);
	calculateProfit();
});




$('.chance_input').change(function (e) {
	calculateProfit();
});

$('.bet_input').change(function (e) {
	calculateProfit();
});






function changeBalance(balance) {

	if (!balance) balance = 0;


	$('.balance').html((balance / 100000000).toFixed(8));


}

function updateChart(balance) {


	if ($("#hide_chart").prop("checked") == false) {


		var chart = $('#container_dice').highcharts();
		chart.series[0].addPoint((balance / 100000000));

		if (chart.series[0].data[0]['y'] == 0) {
			chart.series[0].data[0].remove();
		}

		series = chart.series[0].data.length;
		if (series > 800) {
			chart.series[0].data[0].remove();
		}

	}

}



function calculateProfit() {

	var chance = parseFloat($('.chance_input').val());
	//	var house_edge = 1;
	var amount = $('.bet_input').val();

	var koff = (1 / (chance / 100) * ((100 - house_edge) / 100)) - 1;
	var profit = Math.floor(amount * koff * 100000000);

	if (profit > 10000000 && $('#currency_id').html() == '1_btc') {
		var return_amount = 10000000 / koff - 1;

		$('.bet_input').val((return_amount / 100000000).toFixed(8));
		calculateProfit();
		return;


	}



	koff = (1 + koff).toFixed(4);
	profit2 = (profit / 100000000).toFixed(8);



	$('#chance_koff').html('x' + koff);
	$('#profit').html('+' + profit2);



}

var stop_bet = false;
// кнопка сделать ставку
$('.bet_button').click(function () {

	var button_type = $(this).attr('id');


	if ((button_type == 'low' || button_type == 'high') && $("#autobet").prop("checked") == true) {

		$('#low,#high').hide();
		$('#stop').show();


	}

	if (button_type == 'stop') {
		stop_bet = true;
		return;
	}


	$('#low,#high').attr('disabled', 'disabled');



	playGame(button_type, $('.bet_input').val());

});


function playGame(bet_type, bet_amount) {

	if (stop_bet) {
		stop_bet = false;
		stopGame();
		return;

	}


	var dataStreams = [];
	dataStreams.push({
		"type": bet_type,
		"amount": bet_amount,
		"percent": $('.chance_input').val(),
		"client_seed": $('#client_seed').val(),
		"currency_id": $('#currency_id').html()
	});


	if ($("#microbet").prop("checked") == true) {

		if ($('#micro_loss').val() != 0) {
			dataStreams.push({
				'micro_loss': $('#micro_loss').val(),
				'micro_loss_val': $('#micro_loss_val').val(),
			});

		}

		if ($('#micro_win').val() != 0) {
			dataStreams.push({
				'micro_win': $('#micro_win').val(),
				'micro_win_val': $('#micro_win_val').val(),
			});

		}

		dataStreams.push({
			'micro_stop_amount': $('#micro_stop_amount').val(),
			'micro_stop_action': $('#micro_stop_action').val(),
			'total_microbet': $('#total_microbet').val(),
		});




	}

	$.ajax({
		type: "POST",
		data: {
			dataStreams: dataStreams

		},

		dataType: "html",
		//		async: false,
		url: "ajax/dice.php",


		success: function (data) {


			if (!data) {
				//	stopGame();

				if ($("#autobet").prop("checked") == true) {
					setTimeout(function () {
						playGame(bet_type, bet_amount);
					}, 1000);
				} else {
					stopGame();

				}




				return;
			}


			var result = jQuery.parseJSON(data);


			if (result.ext) {

				$('#hash_server_seed').html(result.hash_server_seed);

			}




			if (result.error) {

				showError(result.error);

			} else if (result.win_type) {




				if (result.win_type == 'win') {

					var bet_color = '#8cbf26';
					var bet_znak = '+';
					increase_bet_type = 'win';
					$('#bet_profit').html(bet_znak + (result.profit).toFixed(8));
					$('#bet_profit').css('color', '#8cbf26');
					$('#bet_profit').css('font-weight', 'bold');

				} else {

					var bet_color = '#eac85e';
					var bet_znak = '-';
					increase_bet_type = 'loss';

					$('#bet_profit').html(bet_znak + (result.profit).toFixed(8));
					$('#bet_profit').css('color', '#FF4D00');
					$('#bet_profit').css('font-weight', 'bold');


				}

				changeBalance(result.balance);



				$('#prev_hash_server_seed').html($('#hash_server_seed').html());
				$('#prev_server_seed').html(result.prev_server_seed);
				$('#prev_client_seed').html($('#client_seed').val());

				$('#hash_server_seed').html(result.hash_server_seed);
				$('#client_seed').val(result.client_seed);





				$('#bet_num').html(result.bet_num);

				$('.total_bet').html(parseInt($('.total_bet').html()) + 1);

				var total_won = parseFloat($('.total_won').html()) + parseFloat(bet_amount);
				$('.total_won').html(total_won.toFixed(8));

				updateChart(result.balance);



				$('#table_check_bet tbody:last-child').prepend('<tr><td><a href="bet.html?bet_id=' + result.bet_id + '" target="_blank">' + result.bet_id + '</a></td><td>' + bet_amount + '</td><td>' + result.bet_rang + '</td><td>' + (result.bet_num) + '</td><td style="color:' + bet_color + '">' + bet_znak + (result.profit).toFixed(8) + '</td></tr>');



				if ($('#table_check_bet tr').length > 100) {
					$('#table_check_bet tr:last').remove();
				}



				if ($("#autobet").prop("checked") == true) {

					var stop_balance = $('#stop_auto_high').val();

					if (stop_balance && stop_balance <= result.balance / 100000000 && stop_balance != 0) {
						stopGame();
						return;
					}


					var stop_loss = $('#stop_auto_low').val();
					if (stop_loss && stop_loss >= result.balance / 100000000 && stop_loss != 0) {
						stopGame();
						return;
					}



					var start_amount = ($('.bet_input').val() * 100000000).toFixed(8);
					var total_bet = parseInt($('#total_bet').val());


					if (total_bet == 1) {

						$('#total_bet').val(0);
						stopGame();
						return;
					}

					if (total_bet > 0) {
						total_bet--;
						$('#total_bet').val(total_bet);
					}


					bet_amount *= 100000000;
					if (result.win_type == 'loss') {

						var increse_percent = $('#auto_loss_val').val();


						if ($('#auto_loss').val() == 1) {
							bet_amount = bet_amount + bet_amount / 100 * increse_percent;
						} else if ($('#auto_loss').val() == 2) {
							bet_amount = bet_amount - bet_amount / 100 * increse_percent;
						} else if ($('#auto_loss').val() == 0) {
							bet_amount = start_amount;
						}


						//bet_amount.toFixed(8);
						//	alert('loss'+'-'+ start_amount +'-'+ $('#auto_loss').val());


					}

					if (result.win_type == 'win') {

						var decrese_percent = $('#auto_win_val').val();


						if ($('#auto_win').val() == 1) {
							bet_amount = bet_amount + bet_amount / 100 * decrese_percent;
						} else if ($('#auto_win').val() == 2) {
							bet_amount = bet_amount - bet_amount / 100 * decrese_percent;
						} else if ($('#auto_win').val() == 0) {
							bet_amount = start_amount;
						}


						//bet_amount.toFixed(8);

						//	alert('win'+'-'+ start_amount +'-'+ $('#auto_win').val());

					}

					if (bet_amount < 0) {

						stopGame();
						return;
					}


					bet_amount = (bet_amount / 100000000).toFixed(8);

					playGame(bet_type, bet_amount);
					return;


				}

			}


			stopGame();

		},
		error: function (xhr, ajaxOptions, thrownError) {
			if ($("#autobet").prop("checked") == true) {
				setTimeout(function () {
					playGame(bet_type, bet_amount);
				}, 1000);
			} else {
				stopGame();

			}
		}



	});
}

function stopGame() {

	$('#low,#high').show();
	$('#stop').hide();
	$('.bet_button').removeAttr('disabled');

}




// депозит
$('#deposit_r').click(function () {

	showModal('Ввод средств', 'show_deposit_r');





	$("#deposit_qr").empty();
	$.ajax({
		type: "POST",
		data: {
			'currency_id': $('#currency_id').html(),
		},

		dataType: "html",
		url: "ajax/get_bitcoin_address.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.error) {

			} else {
				$('#deposit_account').html(result.account);
				$('#deposit_qr').qrcode({
					'text': result.account,

				});
			}

		}
	});

});

$('#withdrawal_r').click(function () {
	showModal('Вывод средств', 'show_withdrawal_r');

});

$('#create_account_r').click(function () {
	showModal('Создать аккаунт', 'show_create_account_r');

});

$('#account_login_r').click(function () {
	showModal('Войти аккаунт', 'show_account_login_r');

});


$('#over_modal').on('hidden.bs.modal', function () {
	$('.modal-body >div').hide();
})


function showError(error) {




	$('#message_text').html(error);
	$('.modal-title').html('Во время операции произошла ошибка');



	$('#message_text').show();
	$('#over_modal').modal('show');

}



function showModal(title, modal_id) {

	$('.modal-title').html(title);
	$('.modal-body >div').hide();


	$('#' + modal_id).show();
	$('#over_modal').modal('show');
};





$('#withdrawal_button_request').click(function () {

	$.ajax({
		type: "POST",
		data: {
			"address": $('.withdrawal_input').val(),
			"amount": $('.withdrawal_amount').val(),
			'currency_id': $('#currency_id').html(),
			'w_to_user': $('#w_to_user').prop('checked'),
		},

		dataType: "html",
		url: "ajax/withdrawal.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.error) {
				showError(result.error);
			} else {


				$('#message_text').show();
				$('#message_text').html(result.message);

				if (result.full_balance >= 0) {

					changeBalance(result.full_balance);

				}
			}

		}
	});


});






$('.currency').click(function (e) {

	$('.currency').css("box-shadow", "none");
	var currency_id = this.id;


	$('#' + currency_id).css("box-shadow", 'rgb(59, 187, 187) 0px 2px 30px 0px inset');
	$('#currency_id').html(currency_id);

	$.ajax({
		type: "POST",
		data: {
			"currency_id": currency_id,
		},

		dataType: "html",
		url: "ajax/change_balance.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);


			$('.total_bet').html(result.total_bet);
			$('.total_won').html((result.total_won / 100000000).toFixed(8));

			changeBalance(result.balance);
			$('.currency_name').html(result.cname);

			$('#ref_hide').hide();

		}
	});


});


$('.select').change(function (e) {
	var id = this.id;

	if ($('#' + id).val() != 0)
		$('#' + id + '_input').show();
	else
		$('#' + id + '_input').hide();

});


$(".autobetcheck").click(function (e) {
	var id = $(this).attr('class').split(' ')[1];


	if ($(".autobetcheck." + id).prop("checked")) {
		$(".or" + id).removeClass("disabledbutton");

		if (id == 1)
			$(".autobet_status").show();
		else if (id == 2)
			$(".microbet_status").show();
	} else {
		$(".or" + id).addClass("disabledbutton");
		if (id == 1)
			$(".autobet_status").hide();
		else if (id == 2)
			$(".microbet_status").hide();
	}

});


$("#ext_settings").click(function (e) {

	$('#ext_settings_field').toggle();

	if ($('#ext_settings_field').css('display') == 'none') {

		$('#ext_settings').html('Расширенные настройки');
	} else {
		$('#ext_settings').html('Скрыть настройки');
	}

});

$('#stop_auto_high,#stop_auto_low').change(function (e) {

	var str = $(this).val();
	str = str.toString().replace(/\,/g, '.');
	$(this).val(str);




	var chart = $('#container_dice').highcharts();

	var take_profit = ($('#stop_auto_high').val());
	var stop_loss = ($('#stop_auto_low').val());

	var balance = parseFloat($('.balance').html());

	if (take_profit.indexOf('%') > 0) {

		var percent = parseInt(take_profit);
		take_profit = balance + balance / 100 * percent;
		$('#stop_auto_high').val(take_profit.toFixed(8));
	}



	if (stop_loss.indexOf('%') > 0) {

		var percent = parseInt(stop_loss);
		stop_loss = balance - balance / 100 * percent;

		$('#stop_auto_low').val(stop_loss.toFixed(8));
	}

	take_profit = parseFloat(take_profit);
	stop_loss = parseFloat(stop_loss);





	var take_profit_chart = null;
	var stop_loss_chart = null;

	chart.yAxis[0].removePlotLine('plot-line-1');
	chart.yAxis[0].removePlotLine('plot-line-2');

	if (take_profit) {


		take_profit_chart = take_profit + take_profit / 100 * 1;


		chart.yAxis[0].addPlotLine({
			value: take_profit,
			color: 'green',
			width: 3,
			id: 'plot-line-1',
			label: {
				text: 'Take Profit',
				align: 'left',
				x: 5,
				y: -5
			}
		});

	}

	if (stop_loss) {


		var stop_loss_chart = stop_loss - stop_loss / 100 * 1;


		chart.yAxis[0].addPlotLine({
			value: stop_loss,
			color: 'red',
			width: 3,
			id: 'plot-line-2',
			label: {
				text: 'Stop Loss',
				align: 'left',
				x: 5,
				y: -5
			}
		});
	}

	chart.yAxis[0].setExtremes(stop_loss_chart, take_profit_chart);

});

$(".autobet_status").click(function (e) {

	$('#autobet').trigger('click');

});

$(".microbet_status").click(function (e) {

	$('#microbet').trigger('click');

});




$("#button_show_ref").click(function (e) {

	$.ajax({
		type: "POST",
		data: {
			"currency_id": $('#currency_id').html(),
		},

		dataType: "html",
		url: "ajax/ref_stat.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);


			$('#table_ref_stat tr:not(:first)').remove();

			if (result.error) {
				showError(result.error);
			} else {


				var currency_name = $('.currency_name').html();


				$('#ref_profit').html((result.total_profit / 100000000).toFixed(8));
				$('#profit_all').html((result.total / 100000000).toFixed(8));


				$.each(result.stat, function (i, val) {

					$('#table_ref_stat tbody:last-child').append('<tr><td>' + i + '</td><td>' + val.total_bet + '</td><td>' + (val.total_won / 100000000).toFixed(8) + ' ' + currency_name + '</td><td>' + (val.total_won / 100000000000).toFixed(8) + ' ' + currency_name + '</td></tr>');

				});

				$('#ref_hide').show();


			}






		}
	});

});


$("#button_ref_move").click(function (e) {

	$.ajax({
		type: "POST",
		data: {
			"currency_id": $('#currency_id').html(),
		},

		dataType: "html",
		url: "ajax/move_ref.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.error) {
				showError(result.error);
			} else {

				if (result > 0) {

					$('#ref_profit').html((0).toFixed(8));


					var balance = $('.balance').html() * 100000000;
					changeBalance(balance + result);
				}

			}


		}
	});

});


$('#micro_stop_amount').change(function (e) {

	var str = $(this).val();
	str = str.toString().replace(/\,/g, '.');
	$(this).val(str);

});


$("#save_strategy,#edit_strategy").click(function (e) {


	var action = this.id;

	var data_form = {};

	data_form['bet_amount'] = $('.bet_input').val();
	data_form['chance'] = $('.chance_input').val();
	data_form['currency'] = $('#currency_id').html();

	if (action == 'edit_strategy') {
		data_form['name'] = $('.strategy_name_edit').val();
		data_form['action'] = 'edit';
		data_form['id'] = edit_id;

	} else {
		data_form['name'] = $('.strategy_name').val();
		data_form['action'] = 'add';
	}


	if ($("#autobet").prop("checked") == true) {

		data_form['autobet'] = true;
		data_form['auto_total_bet'] = $('#total_bet').val();
		data_form['auto_loss'] = $('#auto_loss').val();
		data_form['auto_loss_val'] = $('#auto_loss_val').val();

		data_form['stop_auto_high'] = $('#stop_auto_high').val();
		data_form['auto_win'] = $('#auto_win').val();
		data_form['auto_win_val'] = $('#auto_win_val').val();
		data_form['stop_auto_low'] = $('#stop_auto_low').val();


	}

	if ($("#microbet").prop("checked") == true) {

		data_form['microbet'] = true;

		data_form['total_micro_bet'] = $('#total_microbet').val();

		data_form['micro_loss_val'] = $('#micro_loss_val').val();
		data_form['micro_loss'] = $('#micro_loss').val();

		data_form['micro_win_val'] = $('#micro_win_val').val();
		data_form['micro_win'] = $('#micro_win').val();

		data_form['micro_stop_amount'] = $('#micro_stop_amount').val();
		data_form['micro_stop_action'] = $('#micro_stop_action').val();
	}


	$.ajax({
		type: "POST",
		data: {
			'data_arr': data_form
		},

		dataType: "html",
		url: "ajax/save_strategy.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.error) {
				//				showError(result.error);			
			} else {

				$('#message_text').show();
				$('#message_text').html(result.message);

				showStrategy();

			}


		}
	});

});


var strategy_settings = {};



function showStrategy() {

	$.ajax({
		type: "POST",
		dataType: "html",
		url: "ajax/get_strategy.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);



			if (result.strategy) {


				$(".strategy").remove();
				$(".strategy_edit").remove();

				$.each(result.strategy, function (k, v) {
					var dd = jQuery.parseJSON(v['json']);


					strategy_settings[k] = dd;

					var input = '<button type="button" class="strategy btn btn-transparent ' + k + '">' + dd.name + '</button><span class="btn btn-transparent strategy_edit" id="edit_' + k + '"><i class="fa fa-edit fa-2x"></i></span>';
					$(".strategy_button_field").after(input);


				});

			}




		}
	});

};





$("#save_strategy_r").click(function (e) {
	showModal('Сохранить стратегию', 'show_save_strategy_r');

});








$('body').on('click', '.strategy', function () {

	$("#reset_strategy").trigger('click');


	var strategy_id = $(this).attr('class').split(' ')[3];


	$('.' + strategy_id).css("box-shadow", 'rgb(59, 187, 187) 0px 2px 30px 0px inset');


	var current = strategy_settings[strategy_id];



	$('.bet_input').val((current.bet_amount));
	$('.chance_input').val(current.chance);




	if (current.autobet) {

		if ($('#ext_settings_field').is(':hidden')) {
			$('#ext_settings').trigger('click');
		}

		if ($('#autobet').prop("checked") === false) {
			$('#autobet').trigger('click');
		}


		$('#auto_loss').val(current.auto_loss).change();
		$('#auto_loss_val').val(current.auto_loss_val);

		$('#auto_win').val(current.auto_win).change();
		$('#auto_win_val').val(current.auto_win_val);


		$('#total_bet').val(current.auto_total_bet);


		$('#stop_auto_high').val((current.stop_auto_high)).change();
		$('#stop_auto_low').val((current.stop_auto_low)).change();


	}

	if (current.microbet) {

		if ($('#ext_settings_field').is(':hidden')) {
			$('#ext_settings').trigger('click');
		}

		if ($('#microbet').prop("checked") === false) {
			$('#microbet').trigger('click');
		}


		$('#micro_loss').val(current.micro_loss).change();
		$('#micro_loss_val').val(current.micro_loss_val);

		$('#micro_win').val(current.micro_win).change();
		$('#micro_win_val').val(current.micro_win_val);


		$('#total_microbet').val(current.total_micro_bet);


		$('#micro_stop_amount').val((current.micro_stop_amount)).change();
		$('#micro_stop_action').val(current.micro_stop_action).change();


	}


	//	$('#'+current.currency+'_cur').trigger('click');



});


$("#reset_strategy").click(function (e) {
	$('#ext_settings_field select').val(0).change();
	$('#ext_settings_field :input').val(0).change();

	if ($('#microbet').prop("checked") === true) {
		$('#microbet').trigger('click');
	}

	if ($('#autobet').prop("checked") === true) {
		$('#autobet').trigger('click');
	}

	$('.strategy').css("box-shadow", "none");

});

var edit_id;


$('body').on('click', '.strategy_edit', function () {
	edit_id = $(this).attr('id').split('_')[1];


	var name = $('.strategy.' + edit_id).html();

	showModal('Редактировать стратегию #' + edit_id, 'show_edit_strategy_r');
	$('.strategy_name_edit').val(name);

});

$("#delete_strategy").click(function (e) {

	$.ajax({
		type: "POST",
		dataType: "html",
		data: {
			"strategy_id": edit_id,
		},

		url: "ajax/delete_strategy.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.error) {
				showError(result.error);
			} else {

				$(".strategy." + edit_id).remove();
				$("#edit_" + edit_id).remove();


				$('#message_text').show();
				$('#message_text').html(result.message);

			}


		}
	});

});

$("#create_account").click(function (e) {
	$.ajax({
		type: "POST",
		dataType: "html",
		data: {
			"name": $('#account_name').val(),
			"email": $('#account_email').val(),
			"password": $('#account_pass').val()
		},

		url: "ajax/create_account.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);


			$('#message_text').show();
			$('#message_text').html(result.message);


			if (!result.error) {
				location.reload();
			}


		}
	});

});


$("#login_account").click(function (e) {


	$('#login_account').prop("disabled", true);

	$.ajax({
		type: "POST",
		dataType: "html",
		data: {
			"email": $('#login_email').val(),
			"password": $('#login_pass').val(),
			"googel": grecaptcha.getResponse(widgetId1),
		},

		url: "ajax/login.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (!result.login) {

				$('#login_account').prop("disabled", false);
				$('#message_text').show();
				$('#message_text').html(result.message);

				grecaptcha.reset(widgetId1);

			} else {
				location.reload();
			}


		}
	});

});






$("#tournament_r").click(function (e) {

	$('#tournament_data').hide();
	showModal('Турниры', 'show_tournament_r');

	$.ajax({
		type: "POST",
		dataType: "html",
		data: {

		},

		url: "ajax/tournament.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);
			if (result.error) {

				showError(result.error);

			} else {

				if (result.t) {

					$('#tournament_data').show();

					//					local_time  = getLocalTime(result.t.date_start);



					$('#tournament_start').html(result.t.start_date);
					$('#tournament_after').html(result.t.after);


					/*
					$('#tournament_start').html(new Date(local_time[0]));
					$('#tournament_after').html(local_time[1]);
					
					var duration = Math.floor((new Date(result.t.date_finish).getTime()-new Date(result.t.date_start).getTime())/60000);
					
					*/

					$('#tournament_duration').html(result.t.duration);
					$('#tournament_max_user').html(result.t.max_user);
					$('#tournament_reg_user').html(result.t.reg_user);





					if (result.t.already) {
						$('#tournament_reg,#tournament_cur').attr('disabled', 'disabled');
						$('#tournament_reg').html('Вы уже учавствуете в турнире');

						$('#tournament_cur').val(result.t.already_currency);


						//$('#tournament_user_del').show();
					} else {
						$('#tournament_reg,#tournament_cur').attr('disabled', false);
						$('#tournament_reg').html('Принять участие');

					}


				}

			}









		}
	});

});


$("#tournament_reg").click(function (e) {

	$.ajax({
		type: "POST",
		dataType: "html",
		data: {
			'currency_id': $('#tournament_cur').val(),
		},

		url: "ajax/tournament_reg.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);
			if (result.error) {

				showError(result.error);

			} else {

				$('#message_text').show();
				$('#message_text').html(result.message);

				location.reload();

			}



		}
	});

});


function getLocalTime(server_date_start) {


	var d = new Date().getTimezoneOffset() * 60000;
	var date_start = new Date(server_date_start).getTime();

	var start_local_date = date_start - d;
	var d2 = new Date().getTime();
	var date_left = Math.floor((start_local_date - d2) / 60000);

	return [start_local_date, date_left];
}



function getTimeRemaining(endtime) {
	var t = endtime;
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function initializeClock(id, endtime) {

	var timeinterval = setInterval(function () {
		var t = getTimeRemaining(endtime);
		$('.' + id).html(t.minutes + ' минут ' + t.seconds + ' секунд');
		if (t.total <= 0) {
			$('.tournament_timer_block').hide();
			$('.tournament_start_block').show();
			clearInterval(timeinterval);
		}

		endtime = endtime - 1000;

	}, 1000);
}



$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var target = $(e.target).attr("href");

	if (target == '#tournament') {
		//		$('#tournament_graph').highcharts().reflow();

	}

	if (target == '#charts') {
		$('#container_dice').highcharts().reflow();

	}




});


$('#button_reflow_t').click(function (e) {


	//$('#button_reflow_t').prop("disabled", true);


	$.ajax({
		type: "POST",
		dataType: "html",

		url: "ajax/tournament_winner.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.t) {

				$("#table_winner_stat > tbody").empty();
				//$('#table_winner_stat').show();


				//console.log(result);


				$.each(result.t, function (i, val) {

					$('#table_winner_stat tbody:last-child').append('<tr><td>'
						+ i +
						'</td><td>'
						+ val.id +
						'</td><td>'
						+ val.name +
						'</td><td>'
						+ val.percent +
						'% </td><td>'



						+ (val.start_balance) + ' ' + val.cname +
						'</td><td>'
						+ (val.current_balance) + ' ' + val.cname +

						'</td></tr>');

				});




			}




			/*			
						if(result.error){
							
							
							showError(result.error);	
											
						}else{
			
							
							
							
							t_reflow = setInterval(function(){
								$('#button_reflow_t').prop("disabled", false);
			
								},20000);
							
							
							
							
							
							var chart = $('#tournament_graph').highcharts();
							var id;
						
						
							$.each(result.t, function(i, val) {					
							
								
								
								if(id = chart.get('user'+i)){
									chart.series[id['index']].addPoint(val.percent);
								
								}else{
									chart.addSeries({
										id: 'user'+i,
										name: val.name,
										data: [val.percent]
									});
								}
								
								if(val.percent == -100){
									
									var get_id = chart.get('user'+i);
									
									chart.series[get_id['index']].hide ();
								}
							
							
							});
						
						
						}
			*/


		}
	});



});


$('.select_all_amount').click(function (e) {
	var balance = $('.balance').html();
	$('#withdrawal_amount_re').val(balance);
});


$('#bonus_r').click(function () {
	showModal('Получить бонус', 'show_bonus_r');
});


var CaptchaCallback = function () {
	$('.g-recaptcha').each(function (index, el) {
		grecaptcha.render(el, { 'sitekey': '6LfzhhkTAAAAAKmgqaiuSykj9oa4JhL8ngOf74NK' });
	});
};


var widgetId1;
var widgetId2;
var onloadCallback = function () {
	// Renders the HTML element with id 'example1' as a reCAPTCHA widget.
	// The id of the reCAPTCHA widget is assigned to 'widgetId1'.
	widgetId1 = grecaptcha.render('g-recaptcha-login', {
		'sitekey': '6LfzhhkTAAAAAKmgqaiuSykj9oa4JhL8ngOf74NK',
		'theme': 'light'
	});
	widgetId2 = grecaptcha.render('g-recaptcha-bonus', {
		'sitekey': '6LfzhhkTAAAAAKmgqaiuSykj9oa4JhL8ngOf74NK'
	});

};


$('#get_bonus').click(function () {


	$.ajax({
		type: "POST",
		data: {
			"googel": grecaptcha.getResponse(widgetId2),
		},

		dataType: "html",
		url: "ajax/bonus.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			$('#message_text').show();
			$('#message_text').html(result.message);

			grecaptcha.reset(widgetId2);

		}
	});

});

$('#save_account').click(function () {
	$.ajax({
		type: "POST",
		dataType: "html",
		data: {
			'name': $('#account_name_change').val(),
			'new_password': $('#account_pass_change').val(),
			'old_password': $('#account_pass_change_old').val(),
		},
		url: "ajax/save_account.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			$('#account_mess').html(result.message);
			$('#account_mess').show();


		}
	});
});

$('#get_history').click(function () {
	$.ajax({
		type: "POST",
		dataType: "html",

		url: "ajax/get_hitory.php",

		success: function (data) {

			var result = jQuery.parseJSON(data);

			if (result.history) {


				$('#history_table').show();
				$('#table_history_stat > tbody').empty();

				$.each(result.history, function (i, val) {

					$('#table_history_stat tbody:last-child').prepend('<tr><td>' + i + '</td><td>' + (val.amount / 100000000).toFixed(8) + ' ' + val.currency + '</td><td>' + val.desc + '</td><td>' + val.type + '</td><td>' + val.date + '</td></tr>');

				});




			}


		}
	});
});

$('#reset_chart').click(function () {
	var chart = $('#container_dice').highcharts();
	chart.series[0].setData([]);
});
