(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.altiumSuperscriptWrapper = {
    attach: function (context) {
      const regexp = /((?!<sup>\s*))[®©™]((?!\s*<\/sup>))/gi;
      $(once('superscript-wrapper', 'body')).each(function () {
        $('body :not(script,sup)', context).contents().filter(function () {
          if (this.nodeType === 3
            && (regexp.test(this.nodeValue))
            && !$(this).parents('.footer-v2').length) {
            return true;
          }
        }).replaceWith(function () {
          return this.nodeValue.replace(regexp, '<sup>$&</sup>');
        });
      });
    },
  };

})(jQuery, Drupal, drupalSettings);
