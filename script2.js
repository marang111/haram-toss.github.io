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

    // $(".joystick-container").draggable();

    joystick.addEventListener('mousedown', (event) => {
      if (isLocked) {
        // 잠금 상태 해제 시 본문 숨김
        isLocked = false;
        joystickContainer.classList.remove('locked');
        resetJoystick();
        return;
      }

      isDragging = true;
      centerX = joystickContainer.offsetLeft + joystickContainer.offsetWidth / 2;
      centerY = joystickContainer.offsetTop + joystickContainer.offsetHeight / 2;
      startX = event.clientX;
      startY = event.clientY;

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onStopDrag);
    });

    function onDrag(event) {
      if (!isDragging || isLocked) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
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

    function onStopDrag() {
      if (!isDragging) return;

      isDragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onStopDrag);

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

      // 본문 내용 다시 숨김
      contentParagraphs.forEach(p => p.style.maxHeight = "0");
    }


///////////마우스 커서

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