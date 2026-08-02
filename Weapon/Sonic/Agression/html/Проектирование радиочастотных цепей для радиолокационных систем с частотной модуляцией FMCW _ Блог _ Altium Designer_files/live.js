window.LiveEvent = function() {
  var $ = jQuery;
  var conf = {
    created: false,
    current: undefined,
    imgUrl: 'https://www.altium.com/resources/events/',
    $elm: undefined,
    $countdown: undefined,
    $title: undefined,
    $speaker: undefined,
    $media: undefined,
    $time: undefined,
    $timeLiveNow: undefined,
    events: undefined
  };

  function init() {
    createStyles();
    checkScripts(function() {
      createHTML();
      $.ajax({
        url: "https://www.altium.com/shared/altium-live-event/live-event.json",
        // url: "./live-event.json",
        dataType: 'json',
        success: (data) => {
          conf.events = data;
          checkEvent();
          setInterval(() => {
            checkEvent();
          }, 1000);
        },
      });
      conf.$btnClose.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        conf.$elm.addClass('_hide');
      });
    });
  }

  function checkScripts(onLoad) {
    createScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.0/moment.min.js', function() {
      createScript('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone-with-data.min.js', function() {
        createScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.countdown/2.2.0/jquery.countdown.min.js', function() {
          onLoad();
        }, typeof $.fn.countdown !== "undefined");
      }, typeof moment.tz !== "undefined");
    }, typeof moment !== "undefined");
  }

  function createScript(url, onLoad, condition) {
    if(condition) {
      onLoad();
      return;
    }

    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.body.appendChild(script)
    script.onload = function() {
      onLoad();
    }
  }

  function createStyles() {
    var elm = '<style>.b-live{display:none;font-family:Arial;line-height:1.4;color:#000}.b-live__countdown{display:flex;align-items:center}.b-live__countdown .countdown__col{margin:0 3px}.b-live *{text-decoration:none}.b-live__title{font-weight:700;color:#fff;font-size:14px;margin-bottom:10px}.b-live__wrap{display:flex;justify-content:center}.b-live__inner{display:flex;align-items:center;text-decoration:none!important;color:#000!important}.b-live__media{min-width:64px;width:64px;height:64px;border-radius:50%;margin-right:4px;background:#c4c4c4;overflow:hidden;position:relative;display:none}.b-live__media img{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:100%;max-height:100%;width:auto!important;height:auto!important}@media (min-width:768px){.b-live__media{display:block}}.b-live__text{background:rgba(244,244,244,.8);border:1px solid #d6d6d6;border-radius:5px;text-align:left;padding:7px 12px;display:flex;align-items:center;width:100%;max-width:365px;position:relative}.b-live__close{position:absolute;right:4px;top:2px;font-size:16px;line-height:1.1;color:#9d9d9d;cursor:pointer}.b-live__info{padding-right:10px}.b-live__info__time{display:none}.b-live__info__name,.b-live__info__time{font-size:10px}.b-live__info__title{font-size:12px}.b-live__info__time{display:flex}.b-live__info__time strong{color:#d60000;margin-right:4px}.b-live__btn{margin-left:auto;border-left:1px solid #9d9d9d;font-weight:700;font-size:14px;color:#54943e;padding:14px 10px 14px 20px;display:block;text-align:center}.b-live._fixed{margin-bottom:0!important;position:fixed;bottom:5px;right:5px;left:5px;z-index:50}@media (min-width:768px){.b-live__info__title{font-size:14px}.b-live._fixed{left:auto;right:5%;bottom:auto;top:260px}}.b-live .countdown__day,.b-live .countdown__day+.countdown__title,.b-live._fixed .b-live__title{display:none}.b-live._hide{display:none!important}</style>';
    $('body').append(elm);
  }

  function createHTML() {
    var elm = '' +
      '<div class="b-live _fixed b-live_processed">' +
        '<div class="b-live__wrap">' +
          '<a target="_blank" href="https://www.altium.com/summit/emea/agenda/" class="b-live__inner">' +
            '<div class="b-live__media"></div>' +
            '<div class="b-live__text">' +
              '<div class="b-live__close">&times;</div>' +
              '<div class="b-live__info">' +
                '<div class="b-live__info__time">' +
                  '<strong>LIVE</strong> in ' +
                  '<div data-days-left="" class="b-live__countdown"></div>' +
                '</div>' +
                '<div class="b-live__info__time _live-now"><strong>LIVE NOW</strong></div>' +
                '<div class="b-live__info__title">Some title</div>' +
                '<div class="b-live__info__name">Some Text</div>' +
              '</div>' +
              '<div class="b-live__btn">JOIN</div>' +
            '</div>' +
          '</a>' +
        '</div>' +
      '</div>';

    $('body').append(elm);
    conf.created = true;
    conf.$elm = $('.b-live');
    conf.$countdown = conf.$elm.find('.b-live__countdown');
    conf.$title = conf.$elm.find('.b-live__info__title');
    conf.$speaker = conf.$elm.find('.b-live__info__name');
    conf.$media = conf.$elm.find('.b-live__media');
    conf.$time = conf.$elm.find('.b-live__info__time');
    conf.$timeLiveNow = conf.$elm.find('.b-live__info__time._live-now');
    conf.$btnClose = conf.$elm.find('.b-live__close');
  }

  function checkEvent() {
    var today = new Date().getTime();
    var startAt = 1000*60*60*2;
    var endAt = 1000*60*15;

    for(let i = 0, l = conf.events.length; i < l; i++) {
      var tmDateStart = moment.tz(conf.events[i].dateStart, "Europe/Berlin");
      var localDateStart = tmDateStart.clone().tz(moment.tz.guess());
      var eventStart = new Date(localDateStart.toDate()).getTime();

      var tmDateEnd = moment.tz(conf.events[i].dateEnd, "Europe/Berlin");
      var localDateEnd = tmDateEnd.clone().tz(moment.tz.guess());
      var eventEnd = new Date(localDateEnd.toDate()).getTime();

      if(today + endAt < eventEnd && (eventStart - today <= startAt)) {
        if(conf.current !== i) {
          conf.$countdown
            .removeClass('countdown_processed')
            .html('')
            .attr('data-days-left', conf.events[i].dateStart);
          conf.$title.text(conf.events[i].title);
          conf.$speaker.text(conf.events[i].speaker);
          conf.$media.html('<img src="' + conf.imgUrl + conf.events[i].imageUrl + '" alt="" />');
          CheckCountDown({
            onFinish: () => {
              conf.$time.hide();
              conf.$timeLiveNow.show();
            },
            onCountDown: (d, h, m, s, event) => {
              if(!parseInt(event.strftime(`${d}`)) && !parseInt(event.strftime(`${h}`)) && parseInt(event.strftime(`${m}`)) < 2) {
                conf.$time.hide();
                conf.$timeLiveNow.show();
              } else {
                conf.$time.show();
                conf.$timeLiveNow.hide();
              }
            }
          });
          conf.$elm.show();
          conf.current = i;
        }
        conf.$elm.show();
        break;
      } else {
        conf.$elm.hide();
      }
    }
  }

  function CheckCountDown(options) {
    conf.$countdown.each((index, item) => {
      var $this = $(item);
      $this.addClass('countdown_processed');
      var tmDateLast = moment.tz($this.attr('data-days-left'), "Europe/Berlin");
      var local = tmDateLast.clone().tz(moment.tz.guess());

      $this
        .countdown(local.toDate())
        // .countdown($this.attr('data-days-left'))
        .on('update.countdown', function(e) {
          options.onCountDown && options.onCountDown('%-D', '%H', '%M', '%S', e);
          $(this).html(getText('%-D', '%H', '%M', '%S', e));
        })
        .on('finish.countdown', function(e) {
          options.onFinish && options.onFinish();
          $(this).html(getText('00', '00', '00', '00', e));
        });
    });
  }

  function getText(d, h, m, s, event) {
    return event.strftime(`
      <div class="countdown__col">
        <span class="countdown__day">${d}</span><span class="countdown__title">d</span>
      </div>
      <div class="countdown__sep">|</div>
			<div class="countdown__col">
				<span class="countdown__hours">${h}</span><span class="countdown__title">h</span>
			</div>
			<div class="countdown__sep">|</div>
			<div class="countdown__col">
				<span class="countdown__minute">${m}</span><span class="countdown__title">m</span>
			</div>
			<div class="countdown__sep">|</div>
			<div class="countdown__col">
				<span class="countdown__minute">${s}</span><span class="countdown__title">s</span>
			</div>
		`);
  }

  // init();
}

new window.LiveEvent();
