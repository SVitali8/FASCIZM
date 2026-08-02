(function ($, Drupal) {
  Drupal.behaviors.contentQuickAudit = {
    attach: function (context, settings) {
      setTimeout(function () {
        var path = window.location.pathname + window.location.search;
        var isPage = $('body').hasClass('path-node');
        var nodeData = drupalSettings.quickAudit;
        var druEmail = getCookie('DRU_email') || '';
        var isAltiumEmployee = !!(settings.user.uid || ~druEmail.indexOf('altium.com'));
        var $quickAuditForm = $('.quick-audit-form');
        var $quickAuditPath = $quickAuditForm.find('.quick-audit-path');
        var $quickAuditEmail = $quickAuditForm.find('.quick-audit-email');
        var $quickAuditPriority = $quickAuditForm.find('.quick-audit-priority');
        var $quickAuditSubmitter = $quickAuditForm.find('.quick-audit-submitter');
        var $quickAuditComment = $quickAuditForm.find('.quick-audit-comment');
        var $verticalItems = $('.b-tiles__items > div > div > div.b-tiles__item_vertical');
        var $submitBtn = $quickAuditForm.find('.quick-audit-form-submit');
        var $emailInput = $quickAuditEmail.find('.quick-audit-email-list');
        var $closeBtn = $('.quick-audit-modal .ui-dialog-titlebar-close');

        if (!(isAltiumEmployee && nodeData && $quickAuditForm)) {
          $verticalItems.addClass('quick-audit');
          return;
        }

        nodeData.path = encodeURIComponent(path.replaceAll('/', '|'));
        nodeData.isPage = isPage;

        $quickAuditPath.val(nodeData.path);
        if ($quickAuditSubmitter.val() === '') {
          $quickAuditSubmitter.val(getSubmitter());
        } else {
          var submitter = $quickAuditSubmitter.val();
          if (submitter) {
            $quickAuditSubmitter.val(submitter.split('@')[0]);
          }
        }

        $quickAuditEmail.once('quickAuditEmail').find('h3').on('click', function () {
          $quickAuditEmail.toggleClass('_closed')
            .find('.quick-audit-email-list')
            .fadeToggle();
        });

        $quickAuditPriority.once('quickAuditPriority').children().on('click', function () {
          $(this).closest('.quick-audit-priority').children().removeClass('_active');
          $(this).addClass('_active');
          $quickAuditPriority.val($(this).data('priority'));
        });

        $(document).once('quickAuditkey').on('keypress', function(event) {
          if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
            getQuickForm(nodeData);
          }
        });

        $verticalItems
          .once('quickAudit')
          .addClass('quick-audit')
          .html('<img src="https://cdn.files.altium.com/sites/default/files/2023-07/quick-audit-vertical.jpg">')
          .on('click', function () {
            getQuickForm(nodeData);
          });

        $('.b-post__body')
          .once('quickAudit')
          .after($('<div class="quick-audit"><img src="https://cdn.files.altium.com/sites/default/files/2023-07/quick-audit.jpg"></div>')
            .on('click', function () {
            getQuickForm(nodeData);
          }));

        $closeBtn.on('click', function () {
          unblockScrolling()
        })

        $quickAuditComment.on('keyup', function () {
          formValidation();
        });

        $emailInput.on('keyup', function () {
          if (emailValidation($emailInput.val())) {
            $emailInput.css('borderColor', 'inherit');
          } else {
            $emailInput.css('borderColor', 'red');
          }
          formValidation();
        });

        function formValidation() {
          if (commentValidation($quickAuditComment.val()) && emailValidation($emailInput.val())) {
            $submitBtn.removeAttr('disabled');
          } else {
            $submitBtn.prop('disabled', true);
          }
        }
      }, 1000);
    }
  };

  function getQuickForm(nodeData) {
    var ajaxSettings = {
      url: '/content-audit-custom/quick-audit-form/' + nodeData.nid + '/' + nodeData.langcode + '/' + (nodeData.isPage | 0) + '/' + nodeData.path
    };
    var ajaxObject = Drupal.ajax(ajaxSettings);
    ajaxObject.execute().done(function(){
      blockScrolling();
      setTimeout(function () {
        var $form = $('.quick-audit-form');
        var $submitBtn = $form.find('.quick-audit-form-submit');
        var settings = {
          url: $form.attr('action'),
          setClick: true,
          event: 'click',
          base: $submitBtn.attr('id'),
          element: $submitBtn[0],
        };
        Drupal.ajax(settings);
        $form.closest('.quick-audit-modal').next('.ui-widget-overlay').addClass('dark');
      }, 500);
    });
  }

  function getSubmitter() {
    var userEmailCookie = getCookie('DRU_email') || '';
    if (userEmailCookie) {
      userEmailCookie = decodeURIComponent(userEmailCookie);
      userEmailCookie = userEmailCookie.split('@')[0];
    }
    return userEmailCookie;
  }

  function emailValidation(emailInput) {
    var emails = emailInput;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var invalidEmails = [];
    if (emails === '') {
      return true;
    }
    emails = emails.split(",");
    for (var i = 0; i < emails.length; i++) {
      emails[i] = emails[i].trim();
      if ( emails[i] === '' || ! regex.test(emails[i])){
        invalidEmails.push(emails[i]);
      }
    }
    return invalidEmails.length <= 0;
  }

  function commentValidation(commentInput) {
    return commentInput !== '';
  }

  function getCookie(name) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[1] : false;
  }

  function blockScrolling() {
    $('body').addClass('stop-scrolling');
  }

  function unblockScrolling() {
    $('body').removeClass('stop-scrolling');
  }

  window.onkeydown = function(event) {
    if (event.keyCode === 27){
      unblockScrolling();
    }
  };

})(jQuery, Drupal);
