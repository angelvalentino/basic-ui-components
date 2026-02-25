export function handleSwipe(onSwipeLeft, onSwipeRight, minSwipeDistance = 25) {
  let touchStartX = null;
  let touchStartY = null;
  let touchEndX = null;
  let touchEndY = null;

  function handleTouchStart(e) {
    touchStartX = e.targetTouches[0].clientX;
    touchStartY = e.targetTouches[0].clientY;
  }

  function handleTouchMove(e) {
    touchEndX = e.targetTouches[0].clientX;
    touchEndY = e.targetTouches[0].clientY;
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;

    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isRightSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      onSwipeRight();
    }

    if (isLeftSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      onSwipeLeft();
    }

    // Reset touch positions
    touchStartX = null;
    touchStartY = null;
    touchEndX = null;
    touchEndY = null;
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}