(function ($, Drupal) {

  Drupal.behaviors.altiumAdvBackendCountries = {
    attach: function (context, settings) {
      var self = this;
      $(once('altiumAdvBackendCountries', 'body', context)).each(function () {
        self.requestGeoIp('https://www.altium.com/geoip.php', function(data) {
          if (data && data.hasOwnProperty('success') && data.success) {
            var session = sessionStorage.getItem('geoip');
            if (!session && data.hasOwnProperty('geoip_code')) {
              sessionStorage.setItem('geoip', JSON.stringify(data));
            }
            if (data.hasOwnProperty('geoip_code') && data.geoip_code) {
              document.querySelector("body").dataset.userCountry = data.geoip_code;
            }
            else if (data.hasOwnProperty('code') && data.code) {
              document.querySelector("body").dataset.userCountry = data.code;
            }
          }
          var countryCode = self.getUserCountry();
          $(once('altiumAdvBackendCountries', '.adv-backend-tile')).each(function () {
            self.setBlockVisibility(this, countryCode);
          });
        });
      });

      $(once('altiumAdvBackendCountries', '.adv-backend-tile', context)).each(function () {
        self.setBlockVisibility(this, self.getUserCountry());
      });
    },

    requestGeoIp: function (url, clb) {
      var session = sessionStorage.getItem('geoip');
      var sessionRegion = sessionStorage.getItem('geoip_region');
      if (session) {
        console.log("session");
        console.log(session);
        session = JSON.parse(session);
        session.success = true;
        clb(session);
      }
      else if (sessionRegion) {
        console.log("sessionRegion");
        console.log(sessionRegion);
        sessionRegion = JSON.parse(sessionRegion);
        sessionRegion.success = true;
        clb(sessionRegion);
      } else {
        $.ajax({
          url: url
        }).done(function(data) {
          console.log("data");
          console.log(data);
          clb(data);
        });
      }
    },

    getUserCountry: function() {
      var data = document.querySelector("body").dataset;
      if (data.hasOwnProperty("userCountry")) {
        return data.userCountry;
      }
      return "";
    },

    setBlockVisibility: function(element, country) {
      var innerElement = element.querySelector("a");
      var countriesOnly = innerElement.dataset.countriesOnly;
      var countriesExcept = innerElement.dataset.countriesExcept;
      var countries = [];
      if (countriesOnly) {
        countries = countriesOnly.split(',');
        if (!countries.includes(country)) {
          $(element).hide();
        }
      }
      if (countriesExcept) {
        countries = countriesExcept.split(',');
        if (countries.includes(country)) {
          $(element).hide();
        }
      }
    }
  }
})(jQuery, Drupal);
