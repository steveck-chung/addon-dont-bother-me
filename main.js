(function() {
  const DEFAULT_SETTIGNS = {
    'audio.volume.notification': 0,
    'vibration.enabled': false
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
