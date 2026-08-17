"use client";

import { useEffect } from "react";

const getWheelDistance = (event: WheelEvent) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
};

export default function PreviewScrollBridge() {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaY) < Math.abs(event.deltaX)
      ) {
        return;
      }

      const scrollElement = document.scrollingElement;

      if (
        !scrollElement ||
        scrollElement.scrollHeight <= scrollElement.clientHeight
      ) {
        return;
      }

      event.preventDefault();
      scrollElement.scrollTop += getWheelDistance(event);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
