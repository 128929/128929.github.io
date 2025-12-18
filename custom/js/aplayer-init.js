document.addEventListener('DOMContentLoaded', () => {
  // 检查页面中是否存在APlayer容器
  const aplayerContainer = document.getElementById('aplayer');
  if (aplayerContainer) {
    // 初始化APlayer
    const ap = new APlayer({
      container: aplayerContainer,
      audio: [{
        name: 'Butterfly',
        artist: 'Smile.DK',
        url: '/audio/butterfly.mp3',
        cover: '/custom/images/butterfly-cover.svg'
      }]
    });
  }
});