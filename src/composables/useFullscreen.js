// Composable for fullscreen functionality
import { onMounted, onUnmounted } from "vue";

export function useFullscreen() {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "F11") {
      event.preventDefault();
      toggleFullscreen();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyPress);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyPress);
  });

  return {
    toggleFullscreen,
  };
}
