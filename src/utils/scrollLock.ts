// Keep scroll-driven effects at the same position while a modal fixes the body.
export function getPageScrollY() {
  const lockedY = document.documentElement.dataset.scrollLockY;
  return lockedY === undefined ? window.scrollY : Number(lockedY);
}

export function lockPageScroll() {
  const root = document.documentElement;
  const body = document.body;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const previous = {
    rootOverflow: root.style.overflow,
    gutter: root.style.scrollbarGutter,
    bodyOverflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    width: body.style.width,
    lockedY: root.dataset.scrollLockY,
  };

  root.dataset.scrollLockY = String(scrollY);
  root.style.scrollbarGutter = 'stable';
  root.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = `-${scrollX}px`;
  body.style.width = '100%';

  return () => {
    root.style.overflow = previous.rootOverflow;
    root.style.scrollbarGutter = previous.gutter;
    body.style.overflow = previous.bodyOverflow;
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.left = previous.left;
    body.style.width = previous.width;
    if (previous.lockedY === undefined) delete root.dataset.scrollLockY;
    else root.dataset.scrollLockY = previous.lockedY;
    // Never animate restoration: the background must remain visually stationary.
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
  };
}
