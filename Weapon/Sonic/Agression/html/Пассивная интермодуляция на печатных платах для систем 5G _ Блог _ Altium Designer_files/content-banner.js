(function ($) {
  var firstTagsIntervalNumber = 5;
  var secondAndMoreTagsIntervalNumber = 5;
  var filterTagsToCount = 'p';
  var showOutsideTags = ['ul', 'ol', 'pre', 'table', 'caption', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  Drupal.behaviors.altiumCustomContentBanner = {
    attach: function (context, settings) {
      $(once('contentBanner', 'body', context)).each(function () {
        var banners = getDescSorted('[data-content-banner]', 'data-content-banner-priority');
        var $bannerArea = $('[data-content-banner-area]');
        var contentAllTags = $bannerArea.find(filterTagsToCount);
        var contentTagsToInsert = [];

        let links = document.querySelectorAll('a[href*="promo_position=resources-mid-content"]');
        links.forEach(function(link, i, links) {
          links[i].setAttribute("href", link.href.replace("promo_position=resources-mid-content", "promo_position=resources-mid-content-" + (i+1)));
        });

        contentAllTags.each(function (i, tag) {

          var parents = $(tag).parents()
          var length = parents.length;

          var showOutOfTag = false;

          for (var delta = 0; delta < length; delta++) {

            var parentTagName = parents[delta].tagName.toLowerCase();
            if (!!~showOutsideTags.indexOf(parentTagName)) {

              var positionInArray = getPositionInColection(contentTagsToInsert, parents[delta]);

              if (positionInArray === -1) {
                contentTagsToInsert.push({element: parents[delta], paragraphs: 1});
              } else {
                ++contentTagsToInsert[positionInArray].paragraphs;
              }

              showOutOfTag = true;
            }
            if (parents[delta].hasAttribute('data-content-banner-area')) {
              break;
            }
          }

          if (!showOutOfTag) {
            contentTagsToInsert.push({element: tag, paragraphs: 1});
          }
        });

        insertBanners(banners, contentTagsToInsert);
      });
    }
  }

  function insertBanners(banners, contentTagsToInsert) {
    var lastInsertedPosition = 0;
    if (banners.length) {
      var length = banners.length;
      var $banner = $(banners[0]);
      for (var delta = 0; delta < length; delta++) {
        var positionToInsert = calculatePositionToInsert(contentTagsToInsert, lastInsertedPosition);

        if (positionToInsert !== false && contentTagsToInsert.length <= firstTagsIntervalNumber) {
          $banner.insertAfter(contentTagsToInsert[positionToInsert].element);
          $banner.removeAttr('style');
          lastInsertedPosition = positionToInsert;
          break;
        }
        else if (positionToInsert !== false && contentTagsToInsert.length >= positionToInsert + 1) {
          $banner = $(banners[delta]);
          $banner.insertAfter(contentTagsToInsert[positionToInsert].element);
          $banner.removeAttr('style');
          lastInsertedPosition = positionToInsert;
        } else {
          break;
        }
      }
    }
  }

  function calculatePositionToInsert(tagsCollection, lastInsertedPosition) {
    var position = false;
    var length = tagsCollection.length;
    var paragraphs = 0;
    if (length) {

      for (var i = lastInsertedPosition + 1; i < length; i++) {
        paragraphs = paragraphs + tagsCollection[i].paragraphs;

        var tagsInsertInterval = (lastInsertedPosition === 0) ? firstTagsIntervalNumber : secondAndMoreTagsIntervalNumber;

        if (paragraphs >= tagsInsertInterval) {
          position = i;
          break;
        }
      }
      if (position === false && length <= firstTagsIntervalNumber){
        position = length-1;
      }
    }

    return position;
  }

  function getPositionInColection(collection, element) {
    var result = -1;
    var length = collection.length;
    if (length) {
      for (var i = 0; i < length; i++) {
        if (collection[i].element === element) {
          result = i;
          break;
        }
      }
    }
    return result;
  }

  function getDescSorted(selector, attrName) {
    return $($(selector).toArray().sort(function (a, b) {
      var aVal = parseInt(a.getAttribute(attrName)),
        bVal = parseInt(b.getAttribute(attrName));
      return bVal - aVal;
    }));
  }
})(jQuery);
