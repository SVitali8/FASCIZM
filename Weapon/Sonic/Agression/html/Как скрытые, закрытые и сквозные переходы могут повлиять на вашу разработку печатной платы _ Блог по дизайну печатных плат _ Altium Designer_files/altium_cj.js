/**
 * CJ (Commission Junction) affiliate tracking integration with Marketo forms.
 * Injects CJ event data as hidden fields into Marketo forms for conversion attribution.
 *
 * @see https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/javascriptapi/forms-api-reference
 */
(function($, Drupal) {

  var initialized;

  function init() {
    if (!initialized) {
      initialized = true;
      cjInit();
    }
  }

  Drupal.behaviors.altiumCJ = {
    attach: function() {
      //init();
    }
  };

  window.addEventListener('load', function() {
    cjInit();
  });

  function cjInit() {
    var cjeventId = cjUrlParam('cjevent');
    var cjValues = (cjeventId && cjCookie(cjeventId)) || {};

    cjMktoValues(cjValues);
  }

  function cjCookie(id) {
    var result = {};
    var params = id ? '?id=' + id : '';
    var isStage = !!(~window.location.hostname.indexOf('stg'));
    var isCN = !!(~window.location.hostname.indexOf('.com.cn'));
    var hostname = window.location.protocol + '//' + window.location.hostname;

    if (~hostname.indexOf('altium.com')) {
      hostname = isStage ? 'https://stg.altium.com' : 'https://www.altium.com';
    }
    if (isCN) {
      hostname += '.cn';
    }

    $.ajax({
      type: 'GET',
      url: hostname + '/altium-cj/event' + params,
      dataType: 'json',
      cache: false,
      async: false,
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data && data.values && data.values.cjevent) {
          isStage && console.log('cje: ' + data.values.cjevent);
          result = data.values;
        }
      }
    })
    return result;
  }

  function cjMktoValues(data) {
    if (typeof MktoForms2 !== 'undefined') {
      MktoForms2.whenReady(function(form) {
        if (!data.cjevent) {
          data = cjCookie();
        }
        if (data.cjevent) {
          var values = {
            'cJEvent': data.cjevent,
            'cJEventDateFT': data.cjeventft,
            'cJEventDateLT': data.cjeventlt
          }
          form.addHiddenFields(values);
        }
      });
    }
  }

  function cjUrlParam(param) {
    var urlParam = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(window.location.href);
    return (urlParam && urlParam[1]) || undefined;
  }

}(jQuery, Drupal));
