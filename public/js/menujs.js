/**
 * Created by NGOCHUNG on 3/20/2017.
 */
$(document).ready(function () {
    innit();
    function innit() {
        menu_active();
        menu_action();
    }
    function menu_active() {
        if ($('#menu_home').hasClass('active')){
            $("#zoo_home").show();
            $("#zoo_friend").hide();
            $("#zoo_invitation").hide();
        }

        $('.nav li a').click(function(e) {
            $('.nav li').removeClass('active');
            var $parent = $(this).parent();
            if (!$parent.hasClass('active')) {
                $parent.addClass('active');
            }
            e.preventDefault();
        });
    }

    function menu_action() {
        $("#menu_home").unbind();
        $("#menu_home").click(function (event) {
            event.preventDefault();
            $("#zoo_home").show();
            $("#zoo_friend").hide();
            $("#zoo_invitation").hide();
        });

        $("#menu_friend").unbind();
        $("#menu_friend").click(function (event) {
            event.preventDefault();
            $("#zoo_home").hide();
            $("#zoo_friend").show();
            $("#zoo_invitation").hide();
        });

        $("#menu_invitation").unbind();
        $("#menu_invitation").click(function (event) {
            event.preventDefault();
            $("#zoo_home").hide();
            $("#zoo_friend").hide();
            $("#zoo_invitation").show();
        });
        $("#menu_logout").unbind();
        $("#menu_logout").click(function (event) {
            event.preventDefault();
            $("#zoo_home").hide();
            $("#zoo_friend").hide();
            $("#zoo_invitation").hide();
        });
    }
    
});