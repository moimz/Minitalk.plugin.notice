/**
 * 이 파일은 미니톡 공지사항 플러그인의 일부입니다. (https://www.minitalk.io)
 *
 * 미니톡 채팅위젯 채팅영역에 고정된 메시지를 출력합니다.
 * 
 * @file /plugins/notice/script.js
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @version 1.0.0
 * @modified 2021. 9. 27.
 */
if (Minitalk === undefined) return;

/**
 * 메시지를 설정합니다.
 * 기본적인 HTML 태그를 사용할 수 있습니다.
 */
me.message = "이곳에 고정될 메시지를 입력하세요.<br>줄바꿈을 해서 표시하려면 HTML 태그를 사용하세요.";

/**
 * 고정된 메시지를 닫았을 경우 다시 보이지 않을 시간을 설정합니다.
 * 24 로 설정시 24시간 동안 다시 표시되지 않음, 0 으로 설정시 재접속시마다 보임
 */
me.time = 24;

/**
 * 공지사항 영역의 위치를 조절한다.
 */
me.setPosition = function() {
	var $notice = $("div[data-role=frame] > div[data-role=notice]");
	if ($notice.length == 0) return;
	
	var $chat = $("section[data-role=chat]");
	$notice.css("top",$chat.offset().top);
	$notice.css("left",$chat.offset().left);
	$notice.css("width",$chat.outerWidth());
};

/**
 * 미니톡 채팅서버에 접속하였을 때 채팅영역에 메시지를 출력한다.
 */
Minitalk.on("connect",function(minitalk,channel,user) {
	/**
	 * 재접속시 공지사항이 중복으로 표시되는 것을 막는다.
	 */
	var $notice = $("div[data-role=frame] > div[data-role=notice]");
	if ($notice.length == 1) return;
	
	/**
	 * 특정채널에만 공지사항을 표시하고 싶거나, 특정 채널에 다른 메시지를 보이고자 하는 경우
	 * 아래의 주석을 제거하고 사용자환경에 맞게 수정하여 사용하시면 됩니다.
	 *
	if (minitalk.channel == "example") { // 미니톡 채널이 example 인 경우에 보일 메시지
		me.message = "이 메시지는 example 채널에서 보이게 됩니다.
	}
	
	if (minitalk.channel != "notice") { // 미니톡 채널이 notice 가 아닌 경우에는 공지사항을 출력하지 않는다.
		return;
	}
	 */
	
	/**
	 * 다시 표시되지 않는 시간내라면 표시하지 않는다.
	 */
	if (minitalk.storage("@notice") !== null && minitalk.storage("@notice") > moment().unix()) return;
	
	/**
	 * 채팅위젯 영역에 공지사항 영역을 추가한다.
	 */
	var $frame = $("div[data-role=frame]");
	var $notice = $("<div>").attr("data-role","notice");
	var $message = $("<div>").html(me.message);
	$notice.append($message);
	var $close = $("<button>").attr("type","button").append($("<i>").addClass("mi mi-close"));
	$close.on("click",function() {
		// 닫기 버튼을 클릭하였을 경우
		$("div[data-role=frame] > div[data-role=notice]").remove();
		
		// 다시 보이지 않을 시간을 저장하여 해당 시간동안은 보이지 않도록 한다.
		if (me.time > 0) {
			minitalk.storage("@notice",moment().unix() + 60 * 60 * me.time);
		}
	});
	$notice.append($close);
	$frame.append($notice);
	
	/**
	 * 채팅영역에 표시될 수 있도록 채팅영역의 위치 및 크기에 공지사항 영역을 위치시킨다.
	 */
	me.setPosition();
});

/**
 * 위젯 크기가 조절되었을 때 공지사항 위치를 재정의한다.
 */
$(window).on("resize",function() {
	me.setPosition();
});