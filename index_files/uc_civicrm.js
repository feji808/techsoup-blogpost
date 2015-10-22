/**
 * Ubercart uc_civicrm for TechSoup javascript file
 *
 * This file is based on original ubercart javascript,
 * with some enhancements allowing using own field names/ids.
 */

/**
 * Behavior for preselecting address if there's only one present.
 */
Drupal.behaviors.ucAddressPreSelect = function(context) {
  var fields = new Array(
    'edit-panes-uc-civicrm-billing-billing-address-select',
    'edit-panes-uc-civicrm-delivery-delivery-address-select'
  );
  var select = null;
  var selected_val = null;
  // get div with submit buttons and hidden inputs
  var submit_div = $('#checkout-form-bottom');
  $.each(fields, function(ind,field) {
      select = $('#' + field);
      // delivery pane might be not shown
      if (typeof(select.val()) !== 'undefined') {
          // replace only when single address present
          if ($('option', select).length == 2) {
              // get value of our single address option
              selected_val = $('option:last', select).val();
              // set value of select box and trigger 'onChange' event
              select.val(selected_val).change();
              // create new hidden field as replacement for select
              submit_div.append('<input type="hidden" id="'+field+'" value="" name="'+ select.attr('name') +'" />');
              // remove information 'Choose your billing address and information here.'
              select.parents('fieldset:first').children('div.description').remove();
              // remove select box
              select.parents("tr:first").remove();
              // restore value for new hidden element
              $('#'+field).val(selected_val);
          }
      }
  });
}

/**
 * Behavior for the copy address checkbox.
 *
 * Copy the delivery information to the payment information on the checkout
 * screen if corresponding fields exist.
 *
 * @see uc_cart_copy_address()
 *
 * Modified version to use different field names and ids.
 */
function uc_civicrm_cart_copy_address(checked, source, target, src_type, target_type) {
  if (!checked) {
    $('#' + target + '-pane div.address-pane-table').slideDown();
    copy_box_checked = false;
    return false;
  }

  var src_id_str = 'edit-panes-' + source + '-' + src_type;
  var target_id_str = 'edit-panes-' + target + '-' + target_type;
  var x = src_id_str.length;


  // Hide the target information fields.
  $('#' + target + '-pane div.address-pane-table').slideUp();
  copy_box_checked = true;

  // Copy over the zone options manually.
  if ($('#' + target_id_str + '-zone').html() != $('#' + src_id_str + '-zone').html()) {
    $('#' + target_id_str + '-zone').empty().append($('#' + src_id_str + '-zone').children().clone());
    $('#' + target_id_str + '-zone').attr('disabled', $('#' + src_id_str + '-zone').attr('disabled'));
  }

  // Copy over the information and set it to update if delivery info changes.
  $('#' + source.replace(/-/g, '_') + '-pane input, select, textarea').each(
    function() {
      if (this.id.substring(0, x) === src_id_str) {
        $('#' + target_id_str + this.id.substring(x)).val($(this).val());
        $(this).change(function () {uc_civicrm_update_field(this, src_id_str, target_id_str);});
      }
    }
  );

  return false;
}

/**
 * Apply the selected address to the appropriate fields in the cart form.
 *
 * @see apply_address()
 *
 * Modified version to use different field names and ids.
 */
function uc_civicrm_apply_form_address(type, address_str, subtype) {
  if (address_str == '0') {
    return;
  }

  if (typeof subtype == "undefined") {
    subtype = type;
  }

  eval('var address = ' + address_str + ';');

  if (!address.country_name) {
      alert('Your country for address in ' + address.city + ' is not allowed to place orders in our store. Please provide different address or contact with our staff.');
      return;
  }

  $('#edit-' + subtype + '-first-name').val(address.first_name);
  $('#edit-' + subtype + '-last-name').val(address.last_name);
  $('#edit-' + subtype + '-company').val(address.company);
  $('#edit-' + subtype + '-street1').val(address.street1);
  $('#edit-' + subtype + '-street2').val(address.street2);
  $('#edit-' + subtype + '-city').val(address.city);
  $('#edit-' + subtype + '-country').val(address.country_name);
  $('#edit-' + subtype + '-postal-code').val(address.postal_code);
  $('#edit-' + subtype + '-zone').val(address.zone_name);
  $('#edit-' + subtype + '-phone').val(address.phone);
}


/**
 * Apply the selected address to the appropriate fields in the cart form.
 *
 * @see apply_address()
 *
 * Modified version to use different field names and ids.
 */
function uc_civicrm_apply_address(type, address_str, subtype) {
  if (address_str == '0') {
    return;
  }

  if (typeof subtype == "undefined") {
    subtype = type;
  }

  eval('var address = ' + address_str + ';');

  if (!address.country_name) {
      alert('Your country for address in ' + address.city + ' is not allowed to place orders in our store. Please provide different address or contact with our staff.');
      return;
  }

  $('#' + subtype + '_first_name_display').html(address.first_name);
  $('#' + subtype + '_last_name_display').html(address.last_name);
  $('#' + subtype + '_company_display').html(address.company);
  $('#' + subtype + '_street1_display').html(address.street1);
  $('#' + subtype + '_street2_display').html(address.street2);
  $('#' + subtype + '_city_display').html(address.city);
  $('#' + subtype + '_country_display').html(address.country_name);
  $('#' + subtype + '_postal_code_display').html(address.postal_code);
  $('#' + subtype + '_zone_display').html(address.zone_name);
  $('#' + subtype + '_phone_display').html(address.phone);
}


/**
 * Copy a value from the delivery address to the billing address.
 * 
 * @see update_billing_field()
 *
 * Modified version coming from ubercart uc_cart.js
 */
function uc_civicrm_update_field(field, src_id, trgt_id) {
  if (copy_box_checked) {
    if (field.id.substring(src_id.length) == '-zone') {
      $('#' + trgt_id + '-zone').empty().append($('#' + src_id + '-zone').children().clone());
      $('#' + trgt_id + '-zone').attr('disabled', $('#' + src_id + '-zone').attr('disabled'));
    }

    $('#' + trgt_id + field.id.substring(src_id.length)).val($(field).val()).change();
  }
}



/**
 * Load the address book div on the order edit screen.
 *
 * @see load_address_select()
 *
 * Modified version for CiviCRM addresses.
 */
function uc_civicrm_load_address_select(uid, div, address_type) {
  var options = {
    'uid'  : uid,
    'type' : address_type,
    'func' : "uc_civicrm_apply_form_address('" + address_type + "', this.value, '" + address_type + "');"
  };

  $.post(Drupal.settings.ucURL.ucCivicrm + 'address_book', options,
         function (contents) {
           $(div).empty().addClass('address-select-box').append(contents);
         }
  );
}
