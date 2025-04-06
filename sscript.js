$(function () {
    document.body.style.cursor = 'none';
    let zIndexCounter = 1000;

    $(".con").on("dragstart", function () {
        $(this).css("background-color", "white");
    });

    $(".con").on("touchstart", function () {
        $(this).css("background-color", "white");
    });

    $(".con").on("dragend touchend", function (e) {
        let popupId = $(this).data("popup");
        let $popup = $("#" + popupId);

        $popup.slideDown();
        let originalPosition = {};
        let isNearParent = false;
        let distance = 0;

        let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;

        $popup.on("mousedown touchstart", function (event) {
            event.preventDefault();
            dragging = true;

            let pageX = event.pageX || event.originalEvent.touches[0].pageX;
            let pageY = event.pageY || event.originalEvent.touches[0].pageY;

            startX = pageX;
            startY = pageY;

            let pos = $(this).position();
            origX = pos.left;
            origY = pos.top;

            originalPosition = {
                top: pos.top,
                left: pos.left
            };
        });

        $(document).on("mousemove touchmove", function (event) {
            if (!dragging) return;

            let pageX = event.pageX || event.originalEvent.touches[0].pageX;
            let pageY = event.pageY || event.originalEvent.touches[0].pageY;

            let dx = pageX - startX;
            let dy = pageY - startY;

            $popup.css({
                top: origY + dy,
                left: origX + dx,
                transform: "scale(1.05)"
            });

            let parentRightEdge = $popup.parent().offset().left + $popup.parent().outerWidth();
            distance = parentRightEdge - pageX;

            if (distance >= 80) {
                $popup.css({
                    "background-color": "",
                    "border": "",
                    "opacity": ""
                }).removeClass("popup-drag");
                isNearParent = true;
            }

            if (distance <= 80) {
                $popup.css({
                    "background-color": "midnightblue",
                    "opacity": "",
                    "transform": ""
                }).addClass("popup-drag");
                isNearParent = true;
            }

            if (distance <= 50) {
                $popup.css({
                    "background-color": "black",
                    "opacity": "10%"
                });
                isNearParent = false;
            }
        });

        $(document).on("mouseup touchend", function () {
            if (!dragging) return;
            dragging = false;

            $popup.css({ transform: "" });

            if (distance <= 50) {
                $popup.animate({
                    opacity: 0
                }, 200, function () {
                    $(this).hide();
                });

            } else if (distance <= 80) {
                if ($(".popup-navi").length) {
                    let lastNavi = $(".popup-navi").last();
                    let newTop = lastNavi.offset().top + lastNavi.outerHeight() - 39;

                    $popup.animate({
                        top: newTop,
                        left: originalPosition.left
                    }).css({
                        "background-color": "navy"
                    }).removeClass("popup-drag").addClass("popup-navi");
                } else {
                    $popup.animate({
                        top: originalPosition.top,
                        left: originalPosition.left
                    }).css({
                        "background-color": "navy"
                    }).removeClass("popup-drag").addClass("popup-navi");

                    $(".subtt").addClass("subtitle");
                    $(".popup-img").hide();
                }
            } else {
                $popup.animate({
                    top: originalPosition.top,
                    left: originalPosition.left
                }).css({
                    "background-color": ""
                }).removeClass("popup-drag");
            }
        });

        $(".popup").on("mousedown touchstart", function () {
            $(this).css("background-color", "yellow");
        });

        zIndexCounter++;
        $popup.css("z-index", zIndexCounter);
    });

    $("#mobile").on("scroll", function () {
        $(".popup").css("top", $(this).scrollTop() + 44 + "px");

        let opacity = 1 - $(this).scrollTop() / 200;
        $(".popup").css({
            "opacity": opacity < 0.3 ? 0.3 : opacity
        });

        let containerHeight = $("#mobile").height();
        let centerY = containerHeight / 2;

        $(".con").each(function () {
            let contentTop = $(this).offset().top - $(window).scrollTop();
            let distance = Math.abs(centerY - (contentTop + $(this).outerHeight() / 2));
            let scale = 1.06 - Math.min(distance / centerY, 0.2);
            scale = Math.max(scale, 1);

            $(this).css("transform", `scale(${scale})`);
        });
    });

    $(document).on("mousemove touchmove", function (e) {
        let clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let clientY = e.clientY || (e.touches && e.touches[0].clientY);

        $(".custom-cursor").css({
            top: clientY + "px",
            left: clientX + "px",
        });
    });
});
