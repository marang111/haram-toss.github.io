$(function(){
    document.body.style.cursor = 'none';

    const joystick = document.querySelector('.joystick');
    const joystickScale = document.querySelector('.joystick-scale');
    const joystickContainer = document.querySelector('.joystick-container');
    const contentParagraphs = document.querySelectorAll('.content p');

    let isDragging = false;
    let isLocked = false;
    let zoomLevel = 0;
    let centerX, centerY, startX, startY;
    const maxDistance = 30;
    let currentDistance = 0;

    // 마우스 이벤트
    joystick.addEventListener('mousedown', (event) => {
      startDrag(event.clientX, event.clientY);
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onStopDrag);
    });

    // 터치 이벤트
    joystick.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    });

    function startDrag(x, y) {
      if (isLocked) {
        isLocked = false;
        joystickContainer.classList.remove('locked');
        resetJoystick();
        return;
      }

      isDragging = true;
      centerX = joystickContainer.offsetLeft + joystickContainer.offsetWidth / 2;
      centerY = joystickContainer.offsetTop + joystickContainer.offsetHeight / 2;
      startX = x;
      startY = y;
    }

    function handleDrag(x, y) {
      const dx = x - startX;
      const dy = y - startY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxDistance) distance = maxDistance;

      currentDistance = distance;

      const angle = Math.atan2(dy, dx);
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      joystick.style.transform = `translate(${moveX}px, ${moveY}px)`;

      let newSize = 40 + (distance / maxDistance) * 60;
      joystickScale.style.width = `${newSize}px`;
      joystickScale.style.height = `${newSize}px`;

      const newZoomLevel = Math.max(0, Math.min(100, (distance / maxDistance) * 100));
      const numVisibleParagraphs = Math.floor((newZoomLevel / 100) * contentParagraphs.length);

      contentParagraphs.forEach((p, index) => {
        p.style.maxHeight = index < numVisibleParagraphs ? "50px" : "0";
      });

      zoomLevel = newZoomLevel;
    }

    function onDrag(event) {
      if (!isDragging || isLocked) return;
      handleDrag(event.clientX, event.clientY);
    }

    function onTouchMove(event) {
      if (!isDragging || isLocked) return;
      event.preventDefault(); // 터치스크롤 방지
      const touch = event.touches[0];
      handleDrag(touch.clientX, touch.clientY);
    }

    function onStopDrag() {
      endDrag();
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onStopDrag);
    }

    function onTouchEnd() {
      endDrag();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }

    function endDrag() {
      if (!isDragging) return;

      isDragging = false;

      if (currentDistance >= maxDistance) {
        isLocked = true;
        joystickContainer.classList.add('locked');
      } else {
        resetJoystick();
      }
    }

    function resetJoystick() {
      joystick.style.transform = "translate(0, 0)";
      joystickScale.style.width = "40px";
      joystickScale.style.height = "40px";
      zoomLevel = 0;

      contentParagraphs.forEach(p => p.style.maxHeight = "0");
    }

    // 커서 관련 (생략하지 않고 포함)
    $(document).on("mousemove", function (e) {
        $(".custom-cursor").css({
            top: e.clientY + "px",
            left: e.clientX + "px",
        });
    });

    $(document).on("mousedown", function () {
        $(".custom-cursor").addClass("held");
    });

    $(document).on("mouseup", function () {
        $(".custom-cursor").removeClass("held");
    });

    const cursor = document.querySelector(".custom-cursor");

    document.addEventListener("mousedown", () => {
        cursor.classList.add("held");
    });
    document.addEventListener("mouseup", () => {
        cursor.classList.remove("held");
    });

    document.addEventListener("touchstart", () => {
        cursor.classList.add("held");
    });
    document.addEventListener("touchend", () => {
        cursor.classList.remove("held");
    });
});
