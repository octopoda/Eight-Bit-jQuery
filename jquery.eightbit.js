// Eight Bit CSS creator 1.0 / by Zack Davis - Octopodamedia.com / MIT license
(function($){
	$.fn.eightbit = function (options) {
		
		var defaults =  {
			pixel : 10,
			character : ''
		};
		
		options = $.extend(defaults, options);
		_object = $(this);
		_html = '';
		
		function buildCharacter(_char, _obj) {
			_rows = _char.rows;
			for (var _i = 0; _i < _rows; _i++) {
				rowName = 'row'+(parseInt(_i)+1);
				_html += '<div style="height:'+defaults.pixel+'px">';
				_items = _char[rowName];
				for (var e in _items.color) {
					_color = _items.color[e];
					console.log(_color);
					_html += '<div style="background:'+_color+'; width:'+defaults.pixel+'px; height:'+defaults.pixel+'px; float:left"></div>';
				}
				_html += '</div>';
			}
			_obj.html(_html);
		}
		
		function callCharacter(_str, _obj) {
			buildCharacter(window[_str], _obj);
		}

		callCharacter(defaults.character, _object);
	
	};
})(jQuery);

//Add your Eight Bit Generator Code Here















