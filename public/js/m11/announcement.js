$(document).ready(function() {
    $('.top').click(function() {
        window.open("about:blank", "_self").close()

    })
    $('.button').click(function() {
        if (needSkip == 'true') {
            formSubmit.post(url, arr)
        }
    })
})