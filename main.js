(function() {
  const DEFAULT_SETTIGNS = {
    'audio.volume.notification': 0,
    'vibration.enabled': false
  }

  function isScreenDown(beta, gamma) {
    return (Math.abs(beta) > 170 && Math.abs(gamma) < 10);
  }

  function resumeSettings() {
    var results = JSON.parse(localStorage.getItem('settings-keys'));
    navigator.mozSettings.createLock().set({
      'audio.volume.notification': results[0],
      'vibration.enabled': results[1]
    });
  }

  function dontBotherMe() {
    var settingsPromises = Object.keys(DEFAULT_SETTIGNS).map(
      (key) => navigator.mozSettings.createLock().get(key)
    );

    Promise.all(settingsPromises).then((values) =>
      localStorage.setItem('settings-keys', JSON.stringify(values))
    ).then(() => {
      navigator.mozSettings.createLock().set(DEFAULT_SETTIGNS);
    });

  }

  function handleOrientation(event) {
    var beta = event.beta;
    var gamma = event.gamma;

    console.log('@@@ beta :' + beta);
    console.log('@@@ gamma :' + gamma);
    if (isScreenDown(beta, gamma)) {
      console.log('@@@ isScreenDown :');
      // dontBotherMe();
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }

  function checkDeviceOrientation() {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }

  if (document.readyState !== 'loading') {
    console.log('@@@ not loading');
    checkDeviceOrientation();
  } else {
    document.addEventListener('readystatechange',
      function readyStateChange() {
        if (document.readyState == 'interactive') {
          console.log('@@@ interactive');
          document.removeEventListener('readystatechange', readyStateChange);
          checkDeviceOrientation();
        }
      });
  }
})();
