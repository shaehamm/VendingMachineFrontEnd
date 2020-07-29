var userMoney = 0.00;
var userSelection;

$(document).ready(function () {

    getAllItems();

    $('#purchaseButton').on('click', vendAnItem);
    $('#changeButton').on('click', getChange);

});

function addMoney(amount) {
    let toDisplay = (userMoney += amount).toFixed(2);
    $('#displayMoney').html(`<h3>${toDisplay}</h3>`);
    $('#changeDisplay').empty();
}

function getAllItems() {
    $.ajax({
        type: "GET",
        url: "http://tsg-vending.herokuapp.com/items",
        success: function (data) {

            $('#vendItems').empty();
            $('#vendItems').append('<div class="row">');

            $.each(data, function (index, datum) {

                $('#vendItems').append(`<button id="item${datum.id}" type="button" 
                class="btn btn-default" onClick="selectItem(${datum.id})">
                ${datum.id}</br>${datum.name}</br>$${datum.price}</br>Quantity Left: ${datum.quantity}
                </button>`)
                if ((index + 1) % 3 == 0) {
                    $('#vendItems').append('</div><div class="row">');
                }

            });
            $('#vendItems').append('</div>');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong.");
        }
    });


}

function selectItem(id) {

    $('#item').html(`<p>${id}</p>`);
    userSelection = id;
    $('#changeDisplay').empty();

}

function vendAnItem() {

    if (userSelection == null) {
        $('#message').html('<h4>Please make a selection.</h4>');
    } else {
        $.ajax({
            type: "POST",
            url: `http://tsg-vending.herokuapp.com/money/${userMoney.toFixed(2)}/item/${userSelection}`,
            success: function (data) {

                $('#changeDisplay').html(`<p>Quarters: ${data.quarters}, 
                Dimes: ${data.dimes}</br>
                Nickels: ${data.nickels}, 
                Pennies: ${data.pennies}</br>`);
                $('#message').html('<h4>Thank you!</h4>');
                getAllItems();
                userMoney = 0;
                $('#displayMoney').html(`<h3>0.00</h3>`);
                userSelection = null;
                $('#item').empty();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#message').html(`<h4>${jqXHR.responseJSON.message}</h4>`);
                $('#changeDisplay').empty();
            }
        });
    }

}

function getChange() {
    if (userMoney == 0) {
        $('#item').empty();
        $('#message').empty();
        $('#changeDisplay').empty();
    } else {
        let quarters = 0;
        let dimes = 0;
        let nickels = 0;
        let pennies = 0;
        while (userMoney > 0.24) {
            quarters++;
            userMoney -= 0.25;
        }
        while (userMoney > 0.09) {
            dimes++;
            userMoney -= 0.10;
        }
        while (userMoney > 0.04) {
            nickels++;
            userMoney -= 0.05;
        }
        while (userMoney > 0) {
            pennies++;
            userMoney -= 0.01;
        }
        $('#changeDisplay').html(`<p>Quarters: ${quarters}, 
        Dimes: ${dimes}</br>
        Nickels: ${nickels}, 
        Pennies: ${pennies}</br>`);
        $('#message').empty();
        $('#displayMoney').html(`<h3>0.00</h3>`);
        userMoney = 0;
    }
}
