(function (Drupal, $) {
  'use strict';

  Drupal.behaviors.altiumNbsp = {
    attach: function (context, settings) {
      var names = drupalSettings.altiumNbsp.names;
      var tags = drupalSettings.altiumNbsp.tags;

      $.each(tags, function(index, tag) {
        $(once('altiumNbsp', tag, context)).each(function() {
          $(this).find(':not(iframe)').addBack().contents().each(function() {
            if (this.nodeType === 3) { // Node.TEXT_NODE
              var nodeVal = this.nodeValue;
              $.each(names, function(index, name) {
                var nameTrimmed = name.trim();
                var replacement = nameTrimmed.replace(/ /g, '\u00A0'); // non-breaking space
                var regex = new RegExp(nameTrimmed, "g");
                if (regex.test(nodeVal)) {
                  nodeVal = nodeVal.replace(regex, replacement);
                }
              });
              this.nodeValue = nodeVal;
            }
          });
        });
      });
    }
  };
})(Drupal, jQuery);
