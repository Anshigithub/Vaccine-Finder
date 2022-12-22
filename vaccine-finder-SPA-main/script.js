envURL = 'https://cdn-api.co-vin.in/api/v2/';
getState();

function getState() {
    $.ajax({
    url: envURL + "admin/location/states",
    type: 'GET',
    dataType: 'json',
    success: function(res) {
        $.each(res.states, function (index, item) {
             $('#state').append($('<option></option>').val(item.state_id).html(item.state_name));
         });
    }
});
}

function getDistrict(stateId) {
    $.ajax({
    url: envURL + "admin/location/districts/" + stateId,
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        $('#districts').find('option:not(:first)').remove();
        $.each(res.districts, function (index, item) {
             $('#districts').append($('<option></option>').val(item.district_id).html(item.district_name));
         });
    }
});
}

function getSlots() {
    var contentToRemove = document.querySelectorAll("#center-card");
    $(contentToRemove).remove(); 
    var selectedDistrict = $('#districts').find(":selected").val();
    if(selectedDistrict != 'Select your District')
    {
        var date = new Date().toLocaleDateString();
        var splitDate = date.split('/');
        formatDate = splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2];
        $.ajax({
            url: envURL + "appointment/sessions/public/calendarByDistrict?district_id="+ Number(selectedDistrict) + "&date=" + formatDate,
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res) {
                console.log(res);
                if(res.centers.length > 0)
                {
                    document.getElementById("searchResults").style.display= 'flex';
                    document.getElementById("noSearchResults").style.display= 'none';
                    $.each(res.centers, function(i, v) {
                        $('#slot-content')
                            .append('<div class="m-10" id="center-card"><div class="row center">'+ 
                            '<div class="col-md-12 c-name">' + v.name + '</div>' +
                            '<div class="col-md-12 c-address">' + v.address + '</div>' +
                            '<div class="col-md-12">' + v.from + 'AM - ' + v.to + 'PM' + '</div>' +


                            // dose

                            '<div class="col-md-12"><div class="row dose-info">' +
                            '<div class="col-md-6 vac-1">' + v.sessions[0]?.vaccine + 
                            '<div class="row b-top"><div class="col-md-6 b-right">DOSE1 ' + v.sessions[0]?.available_capacity_dose1 +
                            '</div><div class="col-md-6">DOSE2 ' + v.sessions[0]?.available_capacity_dose2 +
                            '</div></div></div>'+

                            '<div class="col-md-6">' + v.sessions[1]?.vaccine + 
                            '<div class="row b-top"><div class="col-md-6 b-right">DOSE1 ' + v.sessions[1]?.available_capacity_dose1  +
                            '</div><div class="col-md-6">DOSE2 ' + v.sessions[1]?.available_capacity_dose2 +
                            '</div></div></div>'+
                            '</div></div>' +

                            '</div></div>');
                    });
                }
                else {
                    document.getElementById("noSearchResults").style.display= 'flex';
                    document.getElementById("searchResults").style.display= 'none';
                }
            }
        });
    }
    else {
        console.log('Please select district')
    }
}