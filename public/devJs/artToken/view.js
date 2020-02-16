const viewAjax = (data) => {
    $.ajax({
        url: '/artToken/view',
        type: 'GET',
        data: {
            owner : ethereum.selectedAddress
        },
        cache: false,
        headers: { 'cache-control': 'no-cache' },
        success(data) {
            console.log(data)
        },
        error(data) {
            $('#invalidLoginPrompt').removeClass('display-none');
        },
    });
}

$(document).ready(()=>{

})