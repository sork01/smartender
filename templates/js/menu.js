var scrollW = document.getElementById('wrap-scroll');
var scrollUl = document.getElementById('ul-scroll');
var itemsScrolled, itemsMax, cloned = false;
var listOpts = {
    itemCount: null,
    itemHeight: null,
    items: []
};
function scrollWrap() {
    itemsScrolled = Math.ceil((this.scrollTop + listOpts.itemHeight/2) / listOpts.itemHeight);
    listOpts.items.forEach(function (ele) {
        ele.classList.remove('active');
    });
    if (itemsScrolled < listOpts.items.length) {
        listOpts.items[itemsScrolled].classList.add('active');
    }
    if(itemsScrolled < listOpts.items.length/3) {
        this.scrollTop = this.scrollTop + (listOpts.itemCount/3 * listOpts.itemHeight)
    } else if (itemsScrolled > 2*listOpts.items.length/3) {
        this.scrollTop = this.scrollTop - (listOpts.itemCount/3 * listOpts.itemHeight)
    }
}
function initItems(scrollSmooth, init) {
    listOpts.items = [].slice.call(scrollUl.querySelectorAll('li'));
    listOpts.itemHeight = listOpts.items[0].clientHeight;
    listOpts.itemCount = listOpts.items.length;
    if (!itemsMax) {
        itemsMax = listOpts.itemCount;
    }
    if (scrollSmooth && init) {
        var seamLessScrollPoint = (itemsMax - 4) * listOpts.itemHeight;
        scrollW.scrollTop = seamLessScrollPoint;
    }
}
document.addEventListener('DOMContentLoaded', function (event) {
    initItems(true, true);
    scrollW.onscroll = scrollWrap;
});