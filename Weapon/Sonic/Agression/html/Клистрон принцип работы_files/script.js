$(document).ready(function(){
		$(".opros_otvet").click(function(){
			var th = $(this);
			var otvet = th.next().attr("data-id");
			var opros = th.parents(".opros").attr("data-id");
			 $.ajax({
                    type: "POST",
                    url: "/mods/opros/ajax.php",
                    data: { otvet: otvet, opros: opros}
                })
                    .done(function(json) {
                         var obj = JSON.parse(json);
                         if(obj.success == 0){
                            alert('Вы уже голосовали!');
                         }else if(obj.success == 1){
                            for (var key in obj.dan) {
							    var mas = obj.dan[key].split("|");
							    th.parents(".opros").find(".opros_otvet").addClass("opros_otvet_select");
							    th.parents(".opros").find(".opros_vopros span").text("(Кол-во голосов: "+ obj.col +")");
							    th.parents(".opros").find(".opros_info").text("Ваш голос учтен, спасибо!");
							    th.parents(".opros").find(".opros_fon,.opros_shkala").show();
							    th.parents(".opros").find(".opros_resultat").hide();
							    th.parents(".opros").find(".opros_shkala[data-id="+ key +"]").animate({width: mas[0] + '%'});
							    th.parents(".opros").find(".opros_shkala[data-id="+ key +"]").prev().find("span").text(mas[1]).show();
							}
                         }
                    });
		});
		$(".opros_resultat").click(function(){
			var th = $(this);
			var datagolos = th.attr("data-golos");
			var opros = th.parents(".opros").attr("data-id");

			if(datagolos == 1){
				th.removeAttr("data-golos").html("Результаты");
				th.parents(".opros").find(".opros_otvet").removeClass("opros_otvet_select");
				th.parents(".opros").find(".opros_fon,.opros_shkala,.opros_otvet span").hide();	
				th.parents(".opros").find(".opros_shkala").css("width",'0px');
			}else{
				$.ajax({
	                    type: "POST",
	                    url: "/mods/opros/ajax.php",
	                    data: { otvet: 0, opros: opros}
	                })
	                    .done(function(json) {
	                         var obj = JSON.parse(json);
	                         if(obj.success == 0){
	                            alert('Вы уже голосовали!');
	                         }else if(obj.success == 1){
	                            for (var key in obj.dan) {
								    var mas = obj.dan[key].split("|");
								    th.html("Проголосовать").attr("data-golos","1");
								    th.parents(".opros").find(".opros_otvet").addClass("opros_otvet_select");
								    th.parents(".opros").find(".opros_fon,.opros_shkala").show();
								    th.parents(".opros").find(".opros_shkala[data-id="+ key +"]").animate({width: mas[0] + '%'});
								    th.parents(".opros").find(".opros_shkala[data-id="+ key +"]").prev().find("span").text(mas[1]).show();
								}
	                         }
	                    });
			
	        }
		});
});