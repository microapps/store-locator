export function loadScript(src) {
  return new Promise((resolve, reject) => {
    let s, r, t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        return resolve();
      }
      return reject();
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  });
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject('no geolocation support');
    navigator.geolocation.getCurrentPosition(
      p => {
        resolve({lat: p.coords.latitude, lng: p.coords.longitude});
      },
      () => {
        reject('user denied request for position');
      }
    );
  });
}
