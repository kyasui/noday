/*globals $:false */
/*global Power4: false */
/*global jQuery: false */
/*global window: false */
/*global document: false */
/*global TweenMax: false */


'use strict';

var NODAY = {
  dimensions: {
    wWidth: 0,
    wHeight: 0,
    splashHeight: 0
  },
  ui: {
    $html: $('html'),
    $htmlBody: $('html, body'),
    $win: $(window),
    $body: $('body'),
    $splash: $('.splash'),
    $fixedNav: $('.fixed-nav'),
    $navBarToggle: $('.navbar-toggle'),
    $navMenu: $('.nav-menu')
  },
  utils: {
    throttle: function(callback, limit) {
      var wait = false;                  // Initially, we're not waiting
      return function () {               // We return a throttled function
          if (!wait) {                   // If we're not waiting
              callback.call();           // Execute users function
              wait = true;               // Prevent future invocations
              setTimeout(function () {   // After a period of time
                  wait = false;          // And allow future invocations
              }, limit);
          }
      };
    }
  },
  init: function() {
    this.startSite();
    this.initImageLoad();
    this.setDimensions();
    this.setStickyHeader();
    this.setNavTrigger();
    this.setTicker();
  },
  setDimensions: function() {
    NODAY.ui.$win.on('resize', function() {
      NODAY.dimensions.wWidth = NODAY.ui.$win.outerWidth(true);
      NODAY.dimensions.wHeight = NODAY.ui.$win.outerHeight(true);
      NODAY.dimensions.splashHeight = NODAY.ui.$splash.outerHeight(true);
    }).trigger('resize');
  },
  setStickyHeader: function() {
    if ($('.home-page').length) {
      NODAY.ui.$win.on('scroll', NODAY.utils.throttle(function() {
        if (NODAY.ui.$win.scrollTop() > NODAY.dimensions.splashHeight + 60) {
          NODAY.ui.$body.addClass('is-fixed').addClass('nav-in');
        } else {
          if (NODAY.ui.$body.hasClass('is-fixed') && NODAY.ui.$body.hasClass('nav-in')) {
              NODAY.ui.$body.removeClass('nav-in');
              setTimeout(function() {
                NODAY.ui.$body.removeClass('is-fixed');
              }, 600);
          }
        }
      }, 50)).trigger('scroll');
    }
  },
  setNavTrigger: function() {
    $(document).on('click', '.navbar-toggle', function(e) {
      e.preventDefault();

      var $this = $(this);

      if ($this.hasClass('collapsed')) {
        NODAY.setNavMenu(function() {
          NODAY.ui.$navBarToggle.removeClass('collapsed');
          NODAY.ui.$html.addClass('disable-scroll');
        });
      } else {
        NODAY.setNavMenu(function() {
          NODAY.ui.$navBarToggle.addClass('collapsed');
          NODAY.ui.$html.removeClass('disable-scroll');
        });
      }
    });

    $('.down-arrow').on('click', function(e) {
      e.preventDefault();

      TweenMax.to(window, 0.4, {
        scrollTo:{ y: '#what-we-do', offsetY: -5, ease: Power4.easeOut }
      });
    });
  },
  setNavMenu: function (callback) {
    var $menuContact = $('.menu-contact-section'),
        $menuLinks = $('.menu-link-section'),
        // $menuContactText = $('.contact-text'),
        $menuLinksRows = $('.menu-link-animate');

    if (NODAY.ui.$navMenu.hasClass('is-showing')) {
      TweenMax.staggerFromTo($menuLinksRows, 0.2,
        { x: 0, opacity: 1.0 },
        { x: 30, opacity: 0.0, ease: Power4.easeIn },
        0.05, function() {
          TweenMax.to($menuContact, 0.2, {y: NODAY.dimensions.wHeight * -1, ease: Power4.easeIn});
          TweenMax.to($menuLinks, 0.2, {y: NODAY.dimensions.wHeight, delay: 0.05, ease: Power4.easeIn, onComplete: function() {
            NODAY.ui.$navMenu.removeClass('is-showing');
            callback();
          }
        });
      });

      // TweenMax.fromTo($menuContactText, 0.2,
      //     { x: 0, opacity: 1.0 },
      //     { x: 50, opacity: 0.0, ease: Power4.easeIn});
    } else {
      NODAY.ui.$navMenu.addClass('is-showing');
      TweenMax.fromTo($menuContact, 0.2, {y: NODAY.dimensions.wHeight}, {y: 0, ease: Power4.easeIn});
      TweenMax.fromTo($menuLinks, 0.2, {y: NODAY.dimensions.wHeight * -1}, {y: 0, delay: 0.05, ease: Power4.easeIn, onComplete: function() {
        // TweenMax.fromTo($menuContactText, 0.2,
        //   { x: 50, opacity: 0.0 },
        //   { x: 0, opacity: 1.0, ease: Power4.easeOut });

        TweenMax.staggerFromTo($menuLinksRows, 0.2,
          { x: 30, opacity: 0.0 },
          { x: 0, opacity: 1.0, ease: Power4.easeOut },
          0.05);
        callback();
      }});
    }
  },
  initImageLoad: function() {
    $('.off-load').each(function() {
      var $this = $(this);

      $this.attr('src', $this.data('src'));
      $this[0].onload = function() {
        $this.removeAttr('data-src');
      };
    });
  },
  startSite: function() {
    var $tagLine = $('.animate-tag-line'),
        $illustration = $('.animate-illustration'),
        $navItems = $('.header-nav-item'),
        $downArrow = $('.animate-down-arrow');

    if ($illustration.length) {
      $illustration.attr('src', $illustration.data('img-src'));
      $illustration[0].onload = function() {
        TweenMax.fromTo($illustration, 0.4,
          { x: '50px', opacity: 0.0 },
          { x: 0, opacity: 1.0, ease: Power4.easeOut, onComplete: function() {

            TweenMax.fromTo($tagLine, 0.8,
              { x: '-50px', opacity: 0.0 },
              { x: 0, opacity: 1.0, ease: Power4.easeOut, onComplete: function() {

                TweenMax.fromTo($navItems, 0.5,
                  { y: '-25px', opacity: 0.0 },
                  { y: 0, opacity: 1.0, ease: Power4.easeOut, onComplete: function() {
                    TweenMax.fromTo($downArrow, 0.5,
                      { y: '-50px', opacity: 0.0 },
                      { y: 0, opacity: 0.8, ease: Power4.easeOut});
                  }});

              } });

          } });
      };
    }
  },
  setTicker: function() {
    $('.ticker-content').marquee({
      duration: 30000,
      gap: 0,
      delayBeforeStart: 0,
      direction: 'left',
      duplicated: true
    }).addClass('is-visible');
  }
};

$(function() {
  NODAY.init();

  TweenMax.selector = jQuery;
});