// ==UserScript==
// @name          GOLD Data Miner
// @namespace     http://blurcast.com
// @description   Blake Regalia 176C
// @include       https://my.sa.ucsb.edu/gold/*
// ==/UserScript==

var $;

// Add jQuery
(function(){
    if (typeof unsafeWindow.jQuery == 'undefined') {
        var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
            GM_JQ = document.createElement('script');

        GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
        GM_JQ.type = 'text/javascript';
        GM_JQ.async = true;

        GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    }
    GM_wait();
})();

// Check if jQuery's loaded
function GM_wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
        window.setTimeout(GM_wait, 100);
    } else {
        $ = unsafeWindow.jQuery.noConflict(true);
        letsJQuery();
    }
}

// All your GM code must be inside this function
function letsJQuery() {
	var setValue = function(key, val) {
		setTimeout(function() {
			GM_setValue(key, val);
		}, 0);
	};
	var getValue = function(key, call) {
		setTimeout(function() {
			call(GM_getValue(key));
		}, 0);
	};
	var resetAll = function() {
		setTimeout(function() {
			GM_deleteValue('iteration');
			GM_deleteValue('data');
		}, 0);
	};
	$(document).ready(function() {
		if(/ResultsFindCourses.aspx$/.test(window.location.href)) {
			getValue('iteration', function(dept) {
				if(!dept) return;
				var page = [];
				$.each($('[id^="ctl00_pageContent_CourseList_"][id$="_PrimarySections"]'), function() {
					var log = [];
					var sel = $(this).children('tbody').children('tr').find('tr');
					var row, days, time, loc, number, space;
					var mod = 0;
					for(var i=0; i<sel.length; i+= 3) {
						var tmp = 0;
						row = sel.eq(i+tmp).find('td');
						days = row.eq(1+mod+tmp).text();
						if(!/^[\sMTWRF]*$|T\.B\.A\./.test(days)) {
							tmp = -2;
							days = row.eq(1+mod+tmp).text();
						}
						time = row.eq(2+mod+tmp).text();
						loc = row.eq(4+mod+tmp).text();
						number = row.eq(5+mod+tmp).text();
						space = parseInt(row.eq(6+mod+tmp).text());
						if(!isNaN(space))
							number -= space;
						mod = 2;
						log.push(['["',[days,time,loc,number].join('","'),'"]'].join(''));
					}
					page.push(['[',log.join(',<br>'),']'].join(''));
				});
				var data = ['[',page.join(',<br>'),']'].join('');
				getValue('data', function(previous) {
					previous = previous? previous: '';
					setValue('data',[previous,',<br>',data].join(''));
					window.location.href = window.location.href.replace('Results','Basic');
				});
			});
		}
		else if (/BasicFindCourses.aspx$/.test(window.location.href)) {
			var dropDown = $('select[id$="subjectAreaDropDown"]');
			getValue('iteration', function(dept) {
				if(!dept) {
					$(document.body).append($('<div style="position:fixed;top:50pt;width:100%;left:0;background-color:beige;text-align:center;font-size:26pt;color:navy;border:2px solid black;cursor:pointer;">CLICK TO START MINING ENTIRE DATABASE</div>').click(function(){
						setValue('iteration',1);
						window.location.href = window.location.href;
					}));
					return;
				}
				if(dept < dropDown.children().length) {
					setValue('iteration', dept+1);
					dropDown.val(dropDown.children().eq(dept).val());
					$('input#ctl00_pageContent_searchButton').click();
				}
				else {
					$(document.body).append($('<div style="position:fixed;top:50pt;width:100%;left:0;background-color:beige;text-align:center;font-size:26pt;color:navy;border:2px solid black;cursor:pointer;">MINING COMPLETE. EXPORT DATA</div>').click(function(){
						getValue('data', function(data) {
							resetAll();
							setTimeout(function(){
								document.write(data);
							}, 500);
						});
					}));
				}
			});
		}
		else if(/StudentSchedule.aspx$/.test(window.location.href)) {
			$(document.body).append($('<div style="position:fixed;top:50pt;width:100%;left:0;background-color:beige;text-align:center;font-size:26pt;color:navy;border:2px solid black;cursor:pointer;">EXPORT DATA</div>').click(function(){
				getValue('data', function(data) {
					$(document.body).append($('<textarea style="position:fixed;top:80pt;width:80%;left:10%;height:600px;background-color:white;font-size:12pt;border:1px solid black;"></textarea>').text(data));
				});
			}));
		}
	});
}