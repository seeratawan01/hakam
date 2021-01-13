import duasList from './data.js';

$(function () {
    const apiURL = "https://hakam-app.herokuapp.com/";

    // Select2 Plugin
    $("#slct").select2({
        width: 'resolve', // need to override the changed default
    });

    $("#slct").on('select2:select', function (e) {
        var data = e.params.data;
        fetchDua(data.id);
    });

    axios.get(apiURL + "backgrounds?_limit=3&_sort=added_at:DESC").then(response => {
        var images = shuffle(response.data);
        var backgroundImages = [...images];
        activateVegas(backgroundImages)
    }).catch(error => {
        console.error(error)
    })

    function fetchDua(duaName) {
        var duas = duasList[duaName];

        if (duas !== undefined) {

            var duasLength = duas.length;

            $('#slider ul').empty().removeAttr("style");

            duas.forEach(dua => {

                $('<li>', {
                    'class': 'prayer',
                    'html': [$('<span>', {
                        'class': 'dua-title',
                    }).text('"' + dua.title + '"'),
                    $('<span>', {
                        'class': 'dua quranic',
                        'dir': 'rtl',
                    }).text(dua.ayat),
                    $('<span>', {
                        'class': 'dua-translation',
                    }).text(dua.translation),
                    $('<span>', {
                        'class': 'share',
                        'html': [$('<i>', {
                            'class': 'lni lni-facebook-original ml',
                            'data-sharer': 'facebook',
                            'data-dua': dua.id,
                            'data-dua-type': duaName,
                        }).on("click", sharer),
                        $('<i>', {
                            'class': 'lni lni-twitter-original ml',
                            'data-sharer': 'twitter',
                            'data-dua': dua.id,
                            'data-dua-type': duaName,
                        }).on("click", sharer),
                        $('<i>', {
                            'class': 'lni lni-linkedin-original',
                            'data-sharer': 'linkedin',
                            'data-dua': dua.id,
                            'data-dua-type': duaName,
                        }).on("click", sharer)]
                    })],

                }).appendTo('#slider ul');
            });

            activateSlider();

        }

        function activateSlider() {

            // Dua Slider

            var slideCount = $('#slider ul li').length;
            var slideWidth = $('#slider ul li').outerWidth();
            var slideHeight = $('#slider ul li').outerHeight();
            var sliderUlWidth = slideCount * slideWidth;

            if (slideCount === 1) {
                $('a.control_prev, a.control_next').addClass('hide');
            } else {

                $('a.control_prev, a.control_next').removeClass('hide');

                $('#slider').css({ width: slideWidth });

                $('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth, minHeight: slideHeight });

                $('#slider ul li:last-child').prependTo('#slider ul');

                function moveLeft() {
                    $('#slider ul').animate({
                        left: + slideWidth
                    }, 400, function () {
                        $('#slider ul li:last-child').prependTo('#slider ul');
                        $('#slider ul').css('left', '');
                    });
                };

                function moveRight() {
                    $('#slider ul').animate({
                        left: - slideWidth
                    }, 400, function () {
                        $('#slider ul li:first-child').appendTo('#slider ul');
                        $('#slider ul').css('left', '');
                    });
                };
                $('a.control_prev').unbind('click');
                $('a.control_prev').click(function () {
                    moveLeft();
                });

                $('a.control_next').unbind('click');
                $('a.control_next').click(function () {
                    moveRight();
                });
            }
            $(window).on('resize', function () {
                // Reset Values
                activateSlider();
            });
        }
    }

    // Share Button
    $('[data-sharer]').on('click', sharer);

    function sharer() {

        var siteLink = "http://seeratawan.me/hakam/";
        var $ele = $(this);

        var duaType = $ele.attr('data-dua-type');
        var duaId = $ele.attr('data-dua');
        var platform = $ele.attr('data-sharer');

        let dua = {};

        if (duaType !== undefined) {
            var duas = duasList[duaType];
            dua = duas.filter(d => parseInt(d.id) === parseInt(duaId))[0];
        } else {
            duaType = " Feelings";
            dua = {
                title: "Find A Dua For Every Emotion You Feel",
                translation: "These Duas Will Help You Tackle The Different Emotions You Go Through In Life.",
                ayat: ""
            }
        }

        var popWidth = 600,
            popHeight = 480,
            left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
            top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
            popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left


        if (platform === "facebook") {

            var url = "https://www.facebook.com/sharer.php"

            var caption = "Dealing with " + duaType + " | " + dua.title,
                description = dua.ayat + '\n\n"' + dua.translation + '"';

            var shareUrl = `${url}?caption=${encodeURIComponent(caption)}&description=${encodeURIComponent(description)}&u=${encodeURIComponent(siteLink)}`

            var newWindow = window.open(shareUrl, '', popParams);

            if (window.focus) {
                newWindow.focus();
            }
        }

        if (platform === "twitter") {

            var url = "https://twitter.com/intent/tweet"

            var text = "Dealing with " + duaType + " | " + dua.title + '\n\n' + dua.ayat + '\n"' + dua.translation + '"';

            var shareUrl = `${url}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteLink)}`

            var newWindow = window.open(shareUrl, '', popParams);

            if (window.focus) {
                newWindow.focus();
            }
        }
        if (platform === "linkedin") {

            var url = "https://www.linkedin.com/shareArticle"

            var caption = "Dealing with " + duaType + " | " + dua.title,
                description = dua.ayat + '\n\n"' + dua.translation + '"';

            var shareUrl = `${url}?mini=true&title=${encodeURIComponent(caption)}&summary=${encodeURIComponent(description)}&url=${encodeURIComponent(siteLink)}`

            var newWindow = window.open(shareUrl, '', popParams);

            if (window.focus) {
                newWindow.focus();
            }
        }

    }

    function activateVegas(images) {

        // Vegas Plugin
        $("body").vegas({
            slides: [
                { src: images[0].full_image },
                { src: images[1].full_image },
                { src: images[2].full_image }
            ],
            delay: 12000,
            shuffle: true,
            transition: 'fade2',
            animation: ['kenburnsUp', 'kenburnsLeft', 'kenburnsRight'],
            overlay: './assets/02.png',
            walk: function (index, slideSettings) {
                $('.images-credit a').attr("href", images[index].profile_link).text(images[index].username);
                $('.images-credit span:last-of-type').text(images[index].description !== null ? images[index].description : images[index].alt_description);

            }
        });
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    $('.preloader').hide();
});