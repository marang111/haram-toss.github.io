$(function(){
    document.body.style.cursor = 'none';
    let zIndexCounter = 1000; // z-index 초기값

    $(".con").on("dragend", function () {
        $(".popup").hide();

        let popupId = $(this).data("popup"); // 해당 요소의 data-popup 값 가져오기
        let $popup = $("#" + popupId); // 해당하는 팝업 요소

      // 팝업 열기
    $popup.slideDown();
    let originalPosition = {}; // 초기 위치를 저장할 변수
    let isNearParent = false;  // 부모 영역에 가까운지 확인하는 플래그
    let distance = 0; // distance 변수를 외부에서 선언

    // 팝업을 드래그 가능하게 설정
    $popup.draggable({
        start: function () {
            // 드래그 시작 시 초기 위치 저장
            originalPosition = {
                top: $(this).position().top,
                left: $(this).position().left
            };
        },
        drag: function (event) {
            // 마우스 위치 추적
            let mouseX = event.clientX;

            // 부모 요소의 오른쪽 끝 (부모의 왼쪽 + 부모의 너비)
            let parentRightEdge = $(this).parent().offset().left + $(this).parent().outerWidth();
            
            // 마우스와 부모의 오른쪽 끝 사이의 거리 계산
            distance = parentRightEdge - mouseX;

            // 부모 영역과의 거리 조건에 따라 스타일 변경
            if (distance >= 80) {
                $(this).css({
                    "background-color": "",
                    "border": "",
                    "opacity": ""
                }).removeClass("popup-drag");

                isNearParent = true; // 원래 팝업창 유지
            } 

            if (distance <= 80) {
                $(this).css({
                    "background-color": "midnightblue",
                    "opacity": "",
                    "transform": ""
                }).addClass("popup-drag");

                isNearParent = true; // 탐색바 띄울 준비
            } 
            
            if (distance <= 50) {
                $(this).css({ 
                    "background-color": "black",
                    "opacity": "10%"
                });
 
                isNearParent = false; // 사라질 준비
            }
        },
        stop: function () {
            if (distance <= 50) {
                // 사라지기
                $(this).animate({ 
                    "transform": "scale(0)",
                    "opacity":0,
                }, 200);

            } else if (distance <= 80) {
                // 상단에 탐색창 열기
                $(this).animate({
                    top: originalPosition.top,
                    left: originalPosition.left
                }).css({
                    "background-color": "midnightblue"

                }).removeClass("popup-drag").addClass("popup-navi");
                $(".subtt").addClass("subtitle");
                $(".popup-img").hide();

            } else {
                // 원래로 유지하기
                $(this).animate({
                    top: originalPosition.top,
                    left: originalPosition.left
                }).css({
                    "background-color": ""
                }).removeClass("popup-drag");
            }
        }
    });




   // z-index를 가장 높게 설정
        zIndexCounter++;
        $popup.css("z-index", zIndexCounter);
    });

    $("#mobile").on("scroll", function () {
        $(".popup").css("top", $(this).scrollTop() + 44 + "px");

        let opacity = 1 - $(this).scrollTop() / 200; // 스크롤할수록 투명해짐
          $(".popup").css({
            "opacity": opacity < 0.3 ? 0.3 : opacity, // 최소 투명도 0.3 유지
          });


        let containerHeight = $("#mobile").height(); // #mobile 높이
        let centerY = containerHeight / 2; // #mobile 중앙 좌표

        $(".con").each(function () {
           let contentTop = $(this).offset().top - $(window).scrollTop(); // 요소의 위치
           let distance = Math.abs(centerY - (contentTop + $(this).outerHeight() / 2)); // 중앙과의 거리

           let scale = 1.06 - Math.min(distance / centerY, 0.2); // 중앙에 가까울수록 커지고, 멀어질수록 작아짐
           scale = Math.max(scale, 1); // 최소 크기 제한

           $(this).css("transform", `scale(${scale})`);
       });
    });

   

    

    

    // // 팝업 마우스 위치에 다르게 생기게 하기 
    // $(".con").on("dragend", function (e) {
    //   let popupId = $(this).data("popup"); // data-popup 값 가져오기
    //   let $popup = $("#" + popupId); // 해당 popup 요소 선택

    //   $popup.css({
    //     position: "fixed", // 화면에 고정
    //     top: e.clientY + "px", // 마우스 위치 기준
    //     left: e.clientX + "px",
    //     display: "none" // 처음에는 숨김
    //   }).slideDown(); // 부드럽게 나타남
    // });


    $(".con").on("dragstart", function () {
       $(this).css("background-color", "white");
    });

    $(document).on("mousemove", function (e) {
       $(".custom-cursor").css({
         top: e.clientY + "px",
         left: e.clientX + "px",
       });
    });
});