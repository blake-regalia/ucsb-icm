// ==UserScript==
// @name          Registrar Data Miner
// @namespace     http://blakeregalia.com
// @description   Blake Regalia - UCSB Interactive Campus Map
// @include       http://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx
// ==/UserScript==


 /** ***************************** **/
 /** *    Copyright (C) 2010     * **/
 /** *      Blake Regalia        * **/
 /** * <blake.regalia@gmail.com> * **/
 /** ***************************** **/
String.empty = '';
Array.cast = function(object) {
	return Array.prototype.slice.call(object);
};
Array.prototype.str = function() {
	if(!arguments.length) return this.join(String.empty);
	this.push(Array.cast(arguments).join(String.empty));
	return this;
};

var splitNonEmpty = function(str, delim) {
	var nonEmpty = [];
	var split = str.split(delim);
	for(var i=0; i!==split.length; i++) {
		if(split[i]!=='') {
			nonEmpty.push(split[i]);
		}
	}
	return nonEmpty;
};

var clean = function(str) {
	return str.replace(/\n/g,'').replace(/^\s+|\s+$/g,'');
};

var e = function(str) {
	return str.replace(/"/g,'\\"');
};
var $;
var DATA = {};
var serialize = function() {
	var b = [];
	for(var course in DATA) {
		for(var code in DATA[course]) {
			var sect = DATA[course][code];
			b.str('"',[course, e(code), sect.days, sect.time, e(sect.location)].join('","'),'"');
			if(code === '#lecture') {
				console.log(sect);
				b.str('"',[e(sect.instructors.join(',')), e(sect.shortTitle), e(sect.fullTitle), e(sect.description), sect.college, e(sect.preReq), sect.units, sect.grading].join('","'),'"');
			}
			b.push('\n');
		}
	}
	return encodeURIComponent(b.str());
};


// Wait for jQuery to load
(function GM_wait() {
	if(typeof unsafeWindow.jQuery == 'undefined') {
		window.setTimeout(GM_wait, 100);
	} else {
		$ = unsafeWindow.jQuery;
		hasJQuery();
	}
})();

// Run script
function hasJQuery() {
	var setValue = function(key, val, done) {
		setTimeout(function() {
			GM_setValue(key, val);
			if(typeof done === 'function') done();
		}, 0);
	};
	var getValue = function(key, call) {
		setTimeout(function() {
			call(GM_getValue(key));
		}, 0);
	};
	var resetAll = function() {
		setTimeout(function() {
			GM_deleteValue('status');
			GM_deleteValue('iteration');
			GM_deleteValue('data');
		}, 0);
	};
	var dataframe = function() {
		return document.getElementsByClassName('gridview')[0].getElementsByTagName('tbody')[0];
	};
	var submitForm = function(a, b, c) {
		if(a >= $('[id$="courseList"]>option').length) {
			setValue('status', 'done');
			window.location = window.location;
			return;
		}
		$('[id$="courseList"]>option').eq(a).attr('selected',true);
		if(b !== null) $('[id$="quarterList"]>option').eq(b).attr('selected',true);
		$('[id$="CourseLevels"]>option').eq(c).attr('selected',true);
		$('[id$="searchButton"]').click();
	};
	var gui = function(msg) {
		$('.content>div')
			.prepend([
				'<center style="margin-left:20%; margin-right:20%; padding-bottom:20px; border:1px solid black;">',
					'<h3>Batch Controls</h3>',
					'<br />',
					'<input id="dataMineCancel" type="button" value="cancel"/>',
					'<div id="dataMineStatus" style="text-align:center;">',
						'<span style="color:maroon;">',msg,'</span>',
					'</div>',
				'</center>'].str())
			.find('input#dataMineCancel').click(function() {
				setValue('status','done');
			});
	};
	var batchControls = function(status) {
		var qrtrOptions = [];
		$('[id$="quarterList"]>option').each(function(index) {
			qrtrOptions.str('<option value="',index,'">',$(this).html(),'</option>');
		});
		var div = $('.content>div')
			.prepend([
				'<center id="dataMineControls" style="margin-left:20%; margin-right:20%; padding-bottom:20px; border:1px solid black;">',
					'<h3>Batch Controls</h3>',
					'<br/>',
					'<select id="dataMineQuarter">',
						qrtrOptions.str(),
					'</select>',
					'<input id="dataMineButton" type="button" value="Mine Data"/>',
					'<br/>',
				'</center>'].str())
			.find('input#dataMineButton').click(function() {
				setValue('status','mining');
				setValue('iteration',0);
				var qrtrIndex = parseFloat($('#dataMineQuarter')[0].value);
				setValue('objective',$('#dataMineQuarter>option').eq(qrtrIndex).html());
				return submitForm(0, qrtrIndex, 2);
			});
	};
	$(document).ready(function() {
		getValue('status', function(status) {
			if(!status) {
				console.log('no status');
				return batchControls();
			}
			if(status === 'done') {
				getValue('iteration', function(dept) {
					getValue('objective', function(desc) {
						batchControls();
						$(['<input type="button" id="dataMineDownload" value="download ',desc,'" />'].str())
							.appendTo($('#dataMineControls'))
							.click(function() {
								var b = ['data:text/csv;charset=US-ASCII,'];
								for(var id=0; id<dept; id++) {
									getValue('DATA::'+id, function(str){
										b.str(str);
									});
								}
								setValue('status',false);
								console.log(unsafeWindow);
								unsafeWindow.open(b.str(),'_blank');
								
								setTimeout(function() {
									document.write(b.str());
								}, 800);
								
							});
					});
				});
			}
			if(status === 'mining') {
				
				gui('mining...');
				
				getValue('iteration', function(dept) {
					
					var reg = /^\s*([^<]*)\s*<.*$/;
					
					$('.CourseInfoRow').each(function() {
						var course = clean(
							$(this).children('#CourseTitle').html()
								.replace(/\n|\s{2,}/g,' ')
								.replace(reg, '$1')
						);
						
						var sectId;
						if(!DATA[course]) {
							DATA[course] = {
								'#lecture':  {
									instructors: splitNonEmpty(
										clean(
											$(this).children().eq(5).html()
										), '<br>'),
									shortTitle: $(this).children().eq(2).text().replace(/\n/g,'').replace(/^\s+|\s+$/,''),
									fullTitle: $(this).children().eq(1).find('[id$="labelTitle"]').text(),
									description: $(this).children().eq(1).find('[id$="labelDescription"]').text(),
									college: $(this).children().eq(1).find('[id$="labelCollege"]').text(),
									preReq: $(this).children().eq(1).find('[id$="labelPreReqComment"]').text(),
									units: $(this).children().eq(1).find('[id$="labelUnits"]').text(),
									grading: $(this).children().eq(1).find('[id$="labelQuarter"]').text(),
								},
							};
							sectId = '#lecture';
							var enrollCode = $(this).children().eq(4).find('a.EnrollCodeLink').text();
							if(enrollCode.length) {
								DATA[course][sectId].enrollCode = enrollCode;
							}
						}
						else {
							sectId = clean(
								$(this).children().eq(4).find('a.EnrollCodeLink').text()
							);
							DATA[course][sectId] = {};
						}
						
						// Time & Space
						$.extend(DATA[course][sectId], {
							days: clean(
								$(this).children().eq(6).html()
									.replace(/\s+/g,'')
							),
							time: clean(
								$(this).children().eq(7).html()
							),
							location: clean(
								$(this).children().eq(8).html()
							),
						});
						console.log(clean(
								$(this).children().eq(7).html()
							));
					});
					
				setValue('status','done');
					
					$('#dataMineStatus').append('<span style="color:green;">done</span><br/>');
					$('#dataMineStatus').append('<span style="color:maroon;">saving to memory..</span>');
					setValue('iteration', dept+1)
					setValue('DATA::'+dept, serialize(), function() {
						$('#dataMineStatus').append('<span style="color:green;">done</span><br/>');
						return submitForm(dept+1, null, 2);
					});
				});
			}
		});
	});
}