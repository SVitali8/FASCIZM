$(document).ready(function(){

	$(".c_button").click(function(){
		var name = $("[name=c_imya]");
		var email = $("[name=c_email]");
		var text = $("[name=c_text]");
		var status = 1;

		if(name.val().length > 2){
			name.addClass("c_ok");
			name.removeClass("c_err");
		}else{
			name.addClass("c_err");
			status = 0;
		}

		if(text.val().length > 2){
			text.addClass("c_ok");
			text.removeClass("c_err");
		}else{
			text.addClass("c_err");
			status = 0;
		}

		var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
		if(pattern.test(email.val())){
			email.addClass("c_ok");
			email.removeClass("c_err");
		}else{
			email.addClass("c_err");
			status = 0;
		}

		if(status == 1){

			var divform = $(".comment_form");
			divform.prepend('<div class="c_loading">\
							<div class="c_loading3">\
					            <div></div>\
					            <div></div>\
					            <div></div>\
					            <div></div>\
					            <div></div>\
					        </div>\
						</div>');


			var form = $(".c_form");
			var dd = form.serialize();
			var captcha = grecaptcha.getResponse();
			var level = form.attr("data-level");
			var parent = form.attr("data-parent");
			var statid = form.attr("data-statid");
			
			$.ajax({
			  type: "POST",
			  url: "/mods/comm/comm_ajax.php",
			  data: dd + '&captcha=' + captcha  + '&level=' + level  + '&parent=' + parent  + '&statid=' + statid,
			  dataType: 'text',
			  success: function(data){
			  	var res = data.split('|');
			  	if(res[0] == 1){
			  		var newpost = '\
			  		 	<div class="comment_block comment_'+ level +'" data-id-comment="'+ res[1] +'" data-level="'+ level +'">\
							<div class="comment_block_text">\
								<div class="comment_text">\
									'+ text.val() +'\
								</div>\
								<div class="comment_info">\
									<span class="comm_us_name">'+ name.val() +'</span>, 1 секунда назад\
									<span class="comment_block_otvet">Ответить</span>\
								</div>\
							</div>\
							<div class="cl"></div>\
						</div>\
			  		 ';

			  		 grecaptcha.reset();
			  		 name.val("").removeClass("c_ok");
			  		 email.val("").removeClass("c_ok");
			  		 text.val("").removeClass("c_ok");
			  		 

			  		 divform.before(newpost);
			  		 $(".c_loading").remove();
			  	}else if(res[0] == 2){
			  		alert("Нажмите на галочку, подтвердите, что Вы не робот!");
			  	}
			  	
			  }
			});
		}

	});

	$(".cinput").focus(function(){
		$(this).removeClass("c_err");
		$(this).removeClass("c_ok");
	});
	$(".ctext").focus(function(){
		$(this).removeClass("c_err");
		$(this).removeClass("c_ok");
		$(".cinput,.g-recaptcha").show();

	});
	$('[name=c_imya],[name=c_email]').on("click keyup change blur", function() {
		if($(this).val().length > 50) {
			$(this).val($(this).val().substring(0,50));
		}
	});
	$('[name=c_text]').on("click keyup change blur", function() {
		if($(this).val().length > 2000) {
			$(this).val($(this).val().substring(0,2000));
		}
	});

	$(document).on('click','.comment_block_otvet',function(){ // добавляем блок для ответа на комментарий

		var comment = $(this).parents(".comment_block");
		var divform = $(".comment_form");
		$(".c_otvet").remove();
		

		var form = $(".c_form");
			comment.after(divform);
		var data_id_comment = comment.attr('data-id-comment');
		var data_level = comment.attr('data-level');
		var lvl = parseInt(data_level) + 1;
		var usname = $(this).siblings(".comm_us_name").html();

		if(lvl > 7){lvl = 7;}

			form.attr({"data-parent":data_id_comment, "data-level":lvl});
			divform.attr({"class":"comment_form comment_" + lvl});
			$(".ctext").val(usname + ', ').focus();
			$(".c_form").before('<div class="c_otvet">Ответ '+ usname +' (<span>отменить</span>)</div>');
		width_form(divform);
	});
	$(document).on('click','.c_otvet span',function(){ // добавляем блок для ответа на комментарий

		$(".c_otvet").hide();
		var divform = $(".comment_form");
		var form = $(".c_form");
		$(".comments").append(divform.attr("class","comment_form"));
		form.attr({"data-parent":"0", "data-level":"1"});
		$(".ctext").val("").focus();
	});

	function width_form(data){
		if(data.width() < 350){
			$(".g-recaptcha").addClass("g-recaptcha-mini");
			data.removeClass("comment_2");
			data.removeClass("comment_3");
			data.removeClass("comment_4");
			data.removeClass("comment_5");
			data.removeClass("comment_6");
			data.removeClass("comment_7");
		}
	}
});