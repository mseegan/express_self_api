console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  
  var baseUrl = '/api/vidyas';

  
  var allvidyas = [];

  // element to display list of vidyas
  var $vidyasList = $('#vidyas-list');

  // form to create new vidya
  var $createvidya = $('#create-vidya');


 

  // helper function to render all vidyas to view
  // note: we empty and re-render the collection each time our vidya data changes
  var render = function() {
    // empty existing vidyas from view
    $vidyasList.empty();

    // pass `allvidyas` into the template function
    var vidyasHtml = template({ vidyas: allvidyas });

    // append html to the view
    $vidyasList.append(vidyasHtml);
  };

  // GET all vidyas on page load
  $.get(baseUrl, function (data) {
    console.log(data);

    // set `allvidyas` to vidya data from API
    allvidyas = data.vidyas;

    // render all vidyas to view
    render();
  });

  // listen for submit even on form
  $createvidya.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newvidya = $(this).serialize();

    // POST request to create new vidya
    $.post(baseUrl, newvidya, function (data) {
      console.log(data);

      // add new vidya to `allvidyas`
      allvidyas.push(data);

      // render all vidyas to view
      render();
    });

    // reset the form
    $createvidya[0].reset();
    $createvidya.find('input').first().focus();
  });

  // add event-handlers to vidyas for updating/deleting
  $vidyasList

    // for update: submit event on `.update-vidya` form
    .on('submit', '.update-vidya', function (event) {
      event.preventDefault();
      
      // find the vidya's id (stored in HTML as `data-id`)
      var vidyaId = $(this).closest('.vidya').attr('data-id');

      // find the vidya to update by its id
      var vidyaToUpdate = allvidyas.filter(function (vidya) {
        return vidya._id == vidyaId;
      })[0];

      // serialze form data
      var updatedvidya = $(this).serialize();

      // PUT request to update vidya
      $.ajax({
        type: 'PUT',
        url: baseUrl + '/' + vidyaId,
        data: updatedvidya,
        success: function(data) {
          // replace vidya to update with newly updated version (data)
          allvidyas.splice(allvidyas.indexOf(vidyaToUpdate), 1, data);

          // render all vidyas to view
          render();
        }
      });
    })
    
    // for delete: click event on `.delete-vidya` button
    .on('click', '.delete-vidya', function (event) {
      event.preventDefault();

      // find the vidya's id (stored in HTML as `data-id`)
      var vidyaId = $(this).closest('.vidya').attr('data-id');

      // find the vidya to delete by its id
      var vidyaToDelete = allvidyas.filter(function (vidya) {
        return vidya._id == vidyaId;
      })[0];

      // DELETE request to delete vidya
      $.ajax({
        type: 'DELETE',
        url: baseUrl + '/' + vidyaId,
        success: function(data) {
          // remove deleted vidya from all vidyas
          allvidyas.splice(allvidyas.indexOf(vidyaToDelete), 1);

          // render all vidyas to view
          render();
        }
      });
    });
});
