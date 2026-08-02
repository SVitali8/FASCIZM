document.documentElement.classList.add('onetrust-init');

var settingsLinkProcessed = false;

function OptanonWrapper() {
  var countryCode = OneTrust.getGeolocationData().country;
  dataLayer.push({event:"OneTrustCountry", OneTrustCountryCode: countryCode});

  if (OneTrust.IsAlertBoxClosed() === false) {
    document.documentElement.classList.remove('onetrust-closed');
  } else {
    document.documentElement.classList.add('onetrust-closed');
  }

  window.OneTrust.OnConsentChanged(function (e) {
    var style = document.createElement("style");
    style.innerHTML = ".drift-frame-controller {z-index: 2147483647 !important}";
    document.head.appendChild(style);
    document.documentElement.classList.add('onetrust-closed');

    // Clear anchor
    if (window.location.href.split('#')[1] == 'ot-sdk-btn') {
      var newURL = window.location.href.split('#')[0];
      window.history.pushState(null, null, newURL);
    }
  });

  // Delete cookies
  if (typeof OptanonWrapperCount == "undefined") {
    getInitialGrps();
  }
  deleteCookies(iniGrps);

  function getInitialGrps(){
    OptanonWrapperCount = '';
    iniGrps = OnetrustActiveGroups;
  }

  function deleteCookies(iniOptGrpId) {
    var domainGrps = JSON.parse(JSON.stringify(Optanon.GetDomainData().Groups));
    var deletedGrpIds = getInactiveId(iniOptGrpId, OnetrustActiveGroups);
    if (deletedGrpIds.length !== 0 && domainGrps.length !== 0) {
      for (var i=0; i < domainGrps.length; i++) {
        if (domainGrps[i]['CustomGroupId'] !== '' && deletedGrpIds.includes(domainGrps[i]['CustomGroupId'])) {
          for (var j=0; j < domainGrps[i]['Cookies'].length; j++) {
            deleteCookie(domainGrps[i]['Cookies'][j]['Name']);
          }
        }

        if (domainGrps[i]['Hosts'].length !== 0) {
          for (var j=0; j < domainGrps[i]['Hosts'].length; j++) {
            if (deletedGrpIds.includes(domainGrps[i]['Hosts'][j]['HostId']) && domainGrps[i]['Hosts'][j]['Cookies'].length !== 0) {
              for (var k=0; k < domainGrps[i]['Hosts'][j]['Cookies'].length; k++) {
                deleteCookie(domainGrps[i]['Hosts'][j]['Cookies'][k]['Name']);
              }
            }
          }
        }

      }
    }
    getInitialGrps();
  }

  function getInactiveId(iniGrpId, activeGrp){
    iniGrpId = iniGrpId.split(",");
    iniGrpId = iniGrpId.filter(Boolean);
    activeGrp = activeGrp.split(",");
    activeGrp = activeGrp.filter(Boolean);

    var result=[];
    for (var i=0; i < iniGrpId.length; i++) {
      if (activeGrp.indexOf(iniGrpId[i]) <= -1) {
        result.push(iniGrpId[i]);
      }
    }
    return result;
  }

  function deleteCookie(name) {
    var domain = window.location.hostname.split('.');
    var domainLength = domain.length;

    if (domainLength > 2) {
      domain = domain[domainLength - 2] + '.' + domain[domainLength - 1];
    } else {
      domain = window.location.hostname;
    }

    document.cookie = name+'=; Max-Age=-99999999; Path=/;Domain=' + window.location.hostname;
    document.cookie = name+'=; Max-Age=-99999999; Path=/;Domain=.' + domain;
    document.cookie = name+'=; Max-Age=-99999999; Path=/;Domain=.altium.com';
    document.cookie = name+'=; Max-Age=-99999999; Path=/;';
    localStorage.removeItem(name);
  }

  setTimeout(function () {
    if (!settingsLinkProcessed &&
        ~window.location.href.indexOf('.live.altium.com') &&
        !~window.location.href.indexOf('www.live.altium.com')
    ) {
      createCookieSettingsLink(0, '.footer-v2__nav-list-wrap li a');
    }
    if (~window.location.hostname.indexOf('forum.circuitmaker.com')) {
      createCookieSettingsLinkCM();
    }
  }, 1000);
}

window.addEventListener("load", function() {
  if (~window.location.hostname.indexOf('altium365.com')) {
    createCookieSettingsLink(0, '.l-footer__police-links li a');
  } else {
    createCookieSettingsLink(0, '.footer-v2__nav-list-wrap li a');
  }

  // hide class logic if onetrust closed by geoAPI
  var wrap = document.getElementById('onetrust-banner-sdk');
  if(!wrap || wrap.classList.contains('ot-hide')) {
    document.documentElement.classList.add('onetrust-closed');
  }
});

function createCookieSettingsLink(count, elements) {
  var result = false;
  var linkText = 'Do Not Sell/Share My Personal Information';
  var links = document.querySelectorAll(elements);

  count = count + 1;
  if (settingsLinkProcessed || count === 15) {
    return false;
  }

  if (links.length) {
    for (var link of links) {
      if (~link.href.indexOf('cookie-policy')) {
        var newLi = document.createElement('li');
        var newA = document.createElement('a');
        newA.innerText = linkText;
        newA.setAttribute('class', 'ot-sdk-show-settings');
        newA.setAttribute('style', 'cursor:pointer');
        newLi.appendChild(newA);
        link.closest('li').after(newLi);
        settingsLinkProcessed = true;
        result = true;
      }
    }
  } else {
    setTimeout(function () {
      createCookieSettingsLink(count, elements);
    }, 500);
  }
  return result;
}

function createCookieSettingsLinkCM() {
  var link = document.querySelectorAll('.site-info a[title^="Cookie"]');
  var linkText = 'Do Not Sell/Share My Personal Information';

  if (settingsLinkProcessed) {
    return false;
  }

  if (link.length) {
    var newA = document.createElement('a');
    newA.innerText = linkText;
    newA.setAttribute('class', 'ot-sdk-show-settings');
    newA.insertAdjacentHTML("afterbegin", '&nbsp;/&nbsp;');
    link[0].after(newA);
    settingsLinkProcessed = true;
  }
}
