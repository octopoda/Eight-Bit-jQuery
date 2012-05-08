$(function () {
	var _currentColor = '#000000';
	var _charName = '';
	var _columns = 16;
	var _rows = 22;
	var _dev = false;

	
	

	if (_dev) {
		$('.tableWrapper').html(buildTable(16, 22));
		$('.wrapper').height($('.tableWrapper').outerHeight()+20);
		$('.createForm').slideToggle();
		$('.currentColor').slideToggle();
		$('.directions').slideToggle();
		initTable('click');
	} else {
		//Setting up the table
		$('#gridSubmit').on('click', function () {
			_columns = $('input[name="cols"]').val();
			_rows = $('input[name="rows"]').val();
			_charName = $('input[name="character"]').val();
			$('.tableWrapper').html(buildTable(_columns, _rows));
			if (_columns < 60) {
				$('article').addClass('side');
			} else {
				$('article').addClass('under');
			}
			$('#finish').show();
			$('.wrapper').addClass('active');
			
			$('.createForm, .currentColor, .directions').slideToggle(500);
			/* */

			initTable('click');
			
		});
	}


	function initTable(_hover) {
		//Table Clicking
		switch (_hover) {
			case 'click':
			console.log('click mode');
			
			$('.tableWrapper table tr td').click(function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					$(this).css({backgroundColor: ''});
				} else {
					$(this).css({backgroundColor : _currentColor});
					$(this).addClass('active');
				}
			});
			
			$('.tableWrapper table tr td').unbind('mouseover');

			break;
			case 'hover':
			console.log('hoverMode');
			$('.tableWrapper table tr td').mouseover(function () {
					$(this).css({backgroundColor : _currentColor});
					$(this).addClass('active');
			});
			$('.tableWrapper table tr td').unbind('click');

			break;
			case 'erase':
			console.log('eraseMode');
			$('.tableWrapper table tr td').mouseover(function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					$(this).css({backgroundColor: ''});
				}
			});
			$('.tableWrapper table tr td').unbind('click');
			break;
		}
	}

	$('#cols').on('focusout', function () {
		_message = null;

		if ($(this).val() === '') {
			_message = "This value is required";
		}

		if (_message) {
			errorPaint($(this), _message);
		}
		
		return;
	});

	$('#rows, #character').on('focusout', function () {
		if ($(this).val() === '') {
			errorPaint($(this), 'This field is required');
		}
	});



	$('#cols, #rows, #character').on('focus', function () {
		if ($(this).hasClass('error')) {
			removeError($(this));
		}
		return;
	});

	//Validations
	function validate(obj) {
		if (obj.val() === '') {
			return true;
		}
		return false;
	}

	function errorPaint(obj, _message) {
		obj.addClass('error');
		obj.after('<span class="hasError">'+_message+'</span>');
		$('.submit').attr('disabled', 'disabled');
	}

	function removeError(obj) {
		obj.removeClass('error');
		obj.next('.hasError').remove();
		$('.submit').removeAttr('disabled', '');
	}


	//Setting the color
	$('#hex').on('focusout', function () {
		_currentColor = $(this).attr('value');
	});

	//setting the character
	$('#character').on('focusout', function () {
		_charName = $(this).val();
	});

	//Hover Paint
	$('#hoverPaint').on('change', function (e) {
		_hover = 'click';
		if ($(this).is(":checked")) {
			_hover = 'hover';
		}

		if ($('#hoverErase').is(":checked")) {
			$('#hoverErase').removeAttr('checked');
		}
		initTable(_hover);
	});

	//Hover Erase
	$('#hoverErase').on('change', function (e) {
		_hover = 'click';

		if ($(this).is(':checked')) {
			_hover = 'erase';
		}

		if ($('#hoverPaint').is(':checked')) {
			$('#hoverPaint').removeAttr('checked');
			_hover = 'erase';
		}

		initTable(_hover);
	});

	//Building the table
	function buildTable(_c, _r) {
		_c++;
		_r++;
		

		
		var _table = '<h5>The Grid</h5><table id="creator" cellspacing=0 cellpadding="0" width="'+_c*20+'px">';
		for (_i = 1; _i < _r; _i++) {
			_table += '<tr data-row="'+_i+'">';
			for (_j = 1; _j < _c; _j++) {
				_table += '<td data-col="'+_j+'"></td>';
			}
			_table += '</tr>';
		}

		_table += '</table>';
		return _table;
	}

	$('#finish').on('click', function (e) {
		e.preventDefault();

		_height = $(window).scrollTop();

		$('.mask').css({
			height: $(document).height(),
			width: $(document).width()
		});

		$('.dialog').css({
			top: (($(window).height()/2) - ($('.dialog').height()/2)) + _height,
			left: ($(window).width()/2) - ($('.dialog').width()/2)
		});
       
		


		
		if (validate($('#character'))) {
			errorPaint($('#character'), 'This field is required');
		}

		jsCSS = $('input[name="jsCSS"]:checked').val();

		if (jsCSS == 'js') {
			_code = buildDictionary();	
		} else {
			_code = buildCSS();
		}
		$('.dialog .code').html(_code);
		$('.dialog, .mask').fadeIn(500);
	});

	$('.mask, .close').on('click', function () {
		$('.mask, .dialog').hide();
		$('.dialog .code').html('');
	});

	function buildDictionary() {
		var _code = 'var '+ _charName + ' = new Object({';
				_code += 'columns: '+_columns+', ';
				_code += 'rows: '+_rows+', ';
				_code += iterateRows();
		_code += '});';
		return _code;
	}

	


	function iterateRows () {
		var _code = '';
		$('table tr').each(function () { //Go through each row and name
			_code += ' row'+ $(this).attr('data-row')+': { color: [';
			$(this).children('td').each( function () { //Go through each column and build the arrays
				if ($(this).hasClass('active')) {
					_hex = colorToHex($(this).css('backgroundColor'));
					_code += '\''+_hex+'\'';
				} else	{
					_code += "'none'";
				}
				if (!$(this).is(':last-child')) {
					_code += ', ';
				}
			});

			_code += ']}';
			if (!$(this).is(':last-child')) {
				_code += ', ';
			}
		});

		return _code;
	}


	//Build CSS
	function buildCSS() {
		var _code = '.' + _charName + '{';
			_code += 'width: 4em;';
			_code += 'height: 4em;';
			_code += 'box-shadow: '+iterateCSS();
			
		_code += ';}';

		return _code;
	}


	function iterateCSS() {
		var _code = '';
		$('table tr').each(function () { //Go through each row and _charName
			_tr = $(this);
			_c = $(this).attr('data-row');
			for (_i = 0; _i < $(this).children('td').length; _i++) {
				_this = _tr.children('td[data-col='+_i+']');
				
				if (_this.hasClass('active')) {
					_r = _this.attr('data-col');
					_hex = colorToHex(_this.css('backgroundColor'));
					_code += _r+'em '+ _c +'em 0 '+ _hex + ',';
				} else {
					_code += '';
				}
			}
		});
		_strLen = _code.length;
		_code = _code.slice(0, _strLen-1);
		return _code;
	}

	
	function colorToHex(color) {
		if (color.substr(0, 1) === '#') {
			return color;
		}
		
		var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

		var red = parseInt(digits[2]);
		var green = parseInt(digits[3]);
		var blue = parseInt(digits[4]);

		return '#' + toHex(red)+toHex(green)+toHex(blue);
	}

	
	function toHex(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
	}
	

});



