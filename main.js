(function() {
  const DEFAULT_SETTIGNS = {
    'audio.volume.notification': 0,
    'vibration.enabled': false
  }

  function isScreenDown(beta, gamma) {
    retrun (Math.abs(beta) < 10 && Math.abs(gamma) > 170);
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

    Promise,all(settingsPromises).then((values) =>
      localStorage.setItem('settings-keys', JSON.stringify(values));
    ).then(() => {
      navigator.mozSettings.createLock().set(DEFAULT_SETTIGNS);
    });

  }

  function handleOrientation(event) {
    var beta = event.beta;
    var gamma = event.gamma;

    if (isScreenDown(beta, gamma)) {
      dontBotherMe();
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }

  function checkDeviceOrientation() {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }

  if (document.readyState !== 'loading') {
    dontBotherMe();
  } else {
    document.addEventListener('readystatechange',
      function readyStateChange() {
        if (document.readyState == 'interactive') {
          document.removeEventListener('readystatechange',
            readyStateChange);
          dontBotherMe();
        }
      });
  }
})();
