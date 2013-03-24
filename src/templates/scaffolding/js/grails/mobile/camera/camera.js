function readURL(input) {
    if (!navigator.camera) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                $(input).parent().css('background-image', "url(" + e.target.result +")");
                $(input).attr('data-value', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);

        }
    } else {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }

    function onSuccess(imageData) {
        $(input).parent().css('background-image', "url(data:image/jpeg;base64," + imageData +")");
        $(input).attr('data-value', "data:image/jpeg;base64," + imageData);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}