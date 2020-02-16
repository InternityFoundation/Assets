const createAjax = (data) => {
    $.ajax({
        url: '/artToken/create',
        type: 'POST',
        data,
        cache: false,
        headers: { 'cache-control': 'no-cache' },
        success(data) {
            if (data.status) {
                window.location = data.url;
            } else {
                $('#invalidLoginPrompt').removeClass('display-none');
            }
        },
        error(data) {
            $('#invalidLoginPrompt').removeClass('display-none');
        },
    });
}
$('#create').click(() => {
    console.log($('#assetPrice').val());
    const tokenDetails = {
        assetName: $('#assetName').val(),
        assetDescription: $('#assetDescription').val(),
    }
    const to = ethereum.selectedAddress;
    createAjax({
        to,
        tokenDetails,
        price: $('#assetPrice').val()
    })
})