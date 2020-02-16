const switchHome = (hash) => {
    $(`.home`).addClass('display-none');
    $(`#${hash || 'home1'}`).removeClass('display-none');
    switch (hash) {
        case 'home2':
            $('.homeNav').removeClass('active');
            $('.homeNav2').addClass('active');
            break;
        case 'home3':
            $('.homeNav').removeClass('active');
            $('.homeNav3').addClass('active');
            break;
        case 'home4':
            $('.homeNav').removeClass('active');
            $('.homeNav4').addClass('active');
            break;
        default:
            $('.homeNav').removeClass('active');
            $('.homeNav1').addClass('active');
            break;
    }
    document.documentElement.scrollTop = 0; 
}
const navHandler = () => {
    $(".homeNav").click((e) => {
        $('.homeNav').removeClass('active');
        $(e.currentTarget).addClass('active');
        switchHome(e.currentTarget.firstElementChild.hash.substr(1));
    });
};

$(document).ready(() => {
    navHandler();
    const hash = location.hash.substr(1);
    switchHome(hash);
})