(function ($) {

Drupal.jQueryUiFilter = Drupal.jQueryUiFilter || {}
Drupal.jQueryUiFilter.accordionOptions = Drupal.jQueryUiFilter.accordionOptions || {}

/**
 * jQuery UI filter accordion behavior.
 */
Drupal.behaviors.jQueryUiFilterAccordion = function(context) {
  if (Drupal.settings.jQueryUiFilter.disabled) {
    return;
  }

  var headerTag = Drupal.settings.jQueryUiFilter.accordionHeaderTag;

  $('div.jquery-ui-filter-accordion:not(.jquery-ui-filter-accordion-processed)', context).addClass('jquery-ui-filter-accordion-processed').each(function() {
    var options = Drupal.jQueryUiFilter.getOptions('accordion');

    // Look for jQuery UI filter header class.
    options['header'] = '.jquery-ui-filter-accordion-header';
   
    if ($(this).hasClass('jquery-ui-filter-accordion-collapsed')) { // Set collapsed options
      options['collapsible'] = true;
      options['active'] = false;
    }

    // Convert <h*> to div to remove tag and insure the accordion does not use the existing h3 style.
    // Sets active item based on location.hash.
    var index = 0;
    $(this).find(headerTag + '.jquery-ui-filter-accordion-header').each(function(){
      var id = $(this).text().toLowerCase().replace(/[^-a-z0-9]+/gm, '-');
      var hash = '#' + id;

      if (hash == location.hash) {
        options['active'] = index;
      }
      index++;

      $(this).replaceWith('<div class="jquery-ui-filter-header jquery-ui-filter-accordion-header"><a href="' + hash + '">' + $(this).html() + '</a></div>');
    });

    // DEBUG:
    // console.log(options);

    // Init accordion
    $(this).accordion(options);
  });
}

})(jQuery);
