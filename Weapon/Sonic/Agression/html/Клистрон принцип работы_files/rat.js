function isInteger(num) {
  return (num ^ 0) === num;
}
function stars(st,cl) {
	if(st == 1){
		$("[data-star=1]").addClass(cl);
	}else if(st == 2){
		$("[data-star=1],[data-star=2]").addClass(cl);
	}else if(st == 3){
		$("[data-star=1],[data-star=2],[data-star=3]").addClass(cl);
	}else if(st == 4){
		$("[data-star=1],[data-star=2],[data-star=3],[data-star=4]").addClass(cl);
	}else if(st == 5){
		$("[data-star=1],[data-star=2],[data-star=3],[data-star=4],[data-star=5]").addClass(cl);
	}
}
$(document).ready(function () {

	var rating = $(".rating");
	var dataid = parseFloat(rating.attr("data-id"));
	var datacount = parseFloat(rating.attr("data-count"));
	var datarat = parseFloat(rating.attr("data-rat"));

	$(".rat_star").hover(function(){
		var datastar = $(this).attr('data-star');
		stars(datastar,'rat_star_hover1');
	},function(){
		$(".rat_star").removeClass("rat_star_hover1");
	});

	$(".rat_star").click(function(){
		var datastar = parseFloat($(this).attr("data-star"));
		$.ajax({
                type: 'post',
                url: "/mods/rating/rat_ajax.php",
                data: {'dataid':dataid, 'datastar':datastar},
                response: 'text',
                success: function(data){
                		$(".rating_ok").show();
                		$("#rating_ok").html("Ваш голос учтен, спасибо!");
                   if(data == 1){
                   		var srzn = parseFloat((datacount*datarat+datastar)/(datacount+1)).toFixed(2);
                   		var srzn_pr = parseFloat((datacount*datarat+datastar)/(datacount+1));

                   		$("[itemprop=ratingCount]").html(datacount+1);
                   		$("[itemprop=ratingValue]").html(srzn.replace(".00", ""));
                   		$(".rat_star").removeClass("rat_star_hover");
                   		stars(Math.floor(srzn),'rat_star_hover');
                   		if(!isInteger(srzn_pr)){
                   			$("[data-star="+ (Math.floor(srzn_pr)+1) +"]").addClass("rat_star_pol");
                   		}
                   }else if(data == 2){
                   		alert("Вы уже голосовали");
                   }
                }
		});
	});
});