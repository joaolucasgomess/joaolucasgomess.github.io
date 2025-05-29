// Registra o service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(console.error);
}

const btn = document.getElementById('agua-btn');
const popup = document.getElementById('popup');
const closeBtn = popup.querySelector('.close-btn');

btn.addEventListener('click', async () => {
  // Pede permissão para notificações *no clique*
  if (Notification.permission !== 'granted') {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permissão para notificações negada.');
        return;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return;
    }
  }

  // Mostrar popup e desabilitar botão
  popup.classList.remove('hidden');
  btn.disabled = true;

  // Salvar a data da última rega
  localStorage.setItem('ultimaRega', new Date().toISOString());

  // Mostrar notificação via service worker, se possível
  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification('🌿 Obrigado!', {
      body: 'Você registrou que regou sua plantinha.',
      icon: './icons/icon-192.png',
      vibrate: [100, 50, 100],
    });
  }
});

// Botão para fechar o popup
closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Função para checar se já regou hoje
function jaRegouHoje() {
  const ultima = localStorage.getItem('ultimaRega');
  if (!ultima) return false;
  const ultimaData = new Date(ultima);
  const hoje = new Date();
  return (
    ultimaData.getDate() === hoje.getDate() &&
    ultimaData.getMonth() === hoje.getMonth() &&
    ultimaData.getFullYear() === hoje.getFullYear()
  );
}

// Desabilita botão se já regou hoje (ao carregar a página)
if (jaRegouHoje()) {
  btn.disabled = true;
}

// Agenda notificação diária simulada (exemplo com delay de 10 segundos)
navigator.serviceWorker.ready.then(reg => {
  if (!jaRegouHoje()) {
    setTimeout(() => {
      reg.showNotification('🌿 Lembrete', {
        body: 'Hora de regar sua plantinha!',
        icon: './icons/icon-192.png',
        vibrate: [200, 100, 200],
      });
      btn.disabled = false;
    }, 2000);
  }
});
