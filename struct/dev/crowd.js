$.extend(window, {
	DATA: {},
	Canvas: {width: 0, height: 0},
	ctx: {},
	Buildings: [],
	clips: [],
});

Canvas.width = 1024


Math.root2 = Math.sqrt(2);
Math.goldenRatio = 1.6180339877;
Math.halfPI = Math.PI / 2;
Math.twoPI = 2*Math.PI;
Math.degreesToRadians = Math.PI / 180.0;
Math.radiansToDegrees = 180.0 / Math.PI;
Math.distance = function(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
};
Math.pointDistance = function(a, b) {
	return Math.sqrt((b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y));
};
Math.center = function(xywh) {
	return {
		x: xywh.x + (xywh.w|xywh.width)/2,
		y: xywh.y + (xywh.h|xywh.height)/2,
	};
},
Math.vector = function(x1, y1, x2, y2) {
	return {
		x: x2 - x1,
		y: y2 - y1,
		distance: Math.distance(x1, y1, x2, y2),
		direction: 0,
	};
};
Math.randInt = function(min, max) {
	if(typeof min != 'number')	min = 0;
	if(typeof max != 'number')	max = 4096;
	return Math.floor(Math.random() * (max - min + 1)) + min;  
};


var Angle = function(from, to) {
	return Math.atan2(to.y-from.y, to.x-from.x);
};


window['ctx'] = {};

var debug = false;
var showTrail = false;


window.Speed = {
	fast: 1.5,
	range: 0.8,
};

(function() {
	var pxw = 2, pxh = 2;
	window.Person = function(ino, dest) {
		var my = {
			x: 0, y:0,
			theta: 0,
			speed: Speed.fast,
			fastest: Speed.fast,
			stepmod: Math.floor(Math.random()*5),
		};
		my.fastest = Math.random()*Speed.fast+Speed.range;
		my.speed = my.fastest;
		var path = {
			destination: false,
			ignore: [],
			targets: [],
		};
		$.extend(my, ino);
		if(dest) {
			path.destination = Zone[dest];
			path.zone = dest;
		}
		var self = this;
		$.extend(self, {
			own: my,
			pth: path,
			routeTo: function(to) {
				// theta: angle from me to target
				var theta = Angle(my, to);

				// inway: array of buildings in my path
				var inway = Detect(my, to);

				var wall, edge, crash, testDistance, wallDistance = Infinity;

				// for every building in my path
				for(var i=0; i<inway.length; i++) {
					// if i am currently getting around the corner of this building, ignore it
					if(path.ignore.indexOf(inway[i].bid)!==-1) {
						//alert('ignoring '+inway[i].name);
						continue;
					}
					// for every edge in this building
					for(var z=0; z<inway[i].arcs.length; z++) {
						edge = inway[i].arcs[z];
						crash = intersectWall(my, to, edge);
						// if i might crash into this wall
						if(crash) {
							testDistance = Math.pointDistance(my, crash);
							// if this wall is closer than any other wall in my path
							if(testDistance < wallDistance) {
								wallDistance = testDistance;
								wall = {
									bid: inway[i].bid,
									edge: edge,
									crash: crash,
									nodes: inway[i].nodes,
								};
							}
						}
					}
				}

				// if there is a wall in my path
				if(wall) {
					// then i intend to get around it, do not check if it is in my way until i reach the corner
					path.ignore.push(wall.bid);
					edge = wall.edge;
					crash = wall.crash;

					var angle,
						minAngle = Math.twoPI, rightNode = false,
						maxAngle = -Math.twoPI, leftNode = false;
					// for every corner (node) in this building the wall belongs to
					for(var z=0; z<wall.nodes.length; z++) {
						var node = wall.nodes[z];
						// get the difference in the angles formed between me, my target, and this corner
						angle = theta - Angle(my, node);
						while(angle < -Math.PI) angle += Math.twoPI;
						while(angle > Math.PI) angle -= Math.twoPI;
						if(angle < minAngle) {
							minAngle = angle;
							rightNode = node;
						}
						else if(angle > maxAngle) {
							maxAngle = angle;
							leftNode = node;
						}
					}
					// woah, big error. I should have find two corners
					if(!rightNode && !leftNode) {
						var ignores = [];
						$.each(path.ignore, function(k,v) {ignores.push(v);});
						alert(wall.bid+': targets:'+path.targets.length+'; ignore:'+ignores);
						return false;
					}
					// take the corner that is closer to my target
					if(rightNode && (!leftNode || (Math.pointDistance(to, rightNode) < Math.pointDistance(to, leftNode)))) {
						my.theta = Angle(my, rightNode);
						path.targets.unshift({
							x: rightNode.x, y: rightNode.y,
							side: 'right',
						});
						return true;
					}
					if(leftNode) {
						my.theta = Angle(my, leftNode);
						path.targets.unshift({
							x: leftNode.x, y: leftNode.y,
							side: 'left',
						});
						return true;
					}
				}
				// there is nothing in my path :)
				my.theta = theta;
				return false;
			},

			draw: function() {
				/**
				frame.push(['{x:',Number(my.x).toPrecision(4),',y:',Number(my.y).toPrecision(4),'},'].join(''));
				/**/
				/**/
				ctx.save();
				//var r = 255*((my.fastest - my.speed) / my.fastest);
				var r = (my.speed !== my.fastest)? 255: 0;
				ctx.fillStyle = ['rgb(',r,',0,0)'].join('');
				ctx.fillRect(my.x, my.y, pxw, pxh);
				ctx.restore();
				/**/
			},

			destine: function(place) {
				path.destination = place;
			},

			move: function() {
				ms = TimeStep;
				if(!showTrail)
					ctx.clearRect(my.x-1,my.y-1,pxw+2,pxh+2);
				// if i don't have a destination, don't move
				if(!path.destination) return self.draw();
				// every so often
				if(path.targets.length && (ms+my.stepmod) % 5 === 0) {
					// check whos in my way
					var buffer = 3, pd;
					var dense = false;
					for(var i=0; i!==People.length; i++) {
						pd = Math.pointDistance(my, People[i].own);
						if(pd <= buffer && People[i].own.speed < my.speed) {
							var angle = my.theta - Angle(my, People[i].own);
							while(angle < -Math.PI) angle += Math.twoPI;
							while(angle > Math.PI) angle -= Math.twoPI;
							if(Math.abs(angle) < Math.PI*.04) {
								dense = true;
							}
						}
					}
					my.speed = my.fastest*(dense?0.5:1);
					if(dense && path.targets.length !== 1) {
						var ang = my.theta + Math.PI / 4;
						my.x += Math.cos(ang)*my.speed;
						my.y += Math.cos(ang)*my.speed;
						return self.draw();
						var nx = path.targets[0].x + Math.sin(my.theta)*5;
						var ny = path.targets[0].y + Math.cos(my.theta)*5;
						if(!Detect(my, {x:nx, y:ny}).length) {
							path.targets[0].x = nx;
							path.targets[0].y = ny;
							my.theta = Angle(my, path.targets[0]);
							return self.draw();
						}
					}
				}
				// if i don't have a target, figure out how i can get to my destination
				if(!path.targets.length) {
					var target = path.destination;
					while(self.routeTo(target)) {
						target = path.targets[0];
					}
					if(!path.targets.length)
						path.targets.push(path.destination);
				}
				// else i must have a target
				else {
					var dx = Math.cos(my.theta)*my.speed;
					var dy = Math.sin(my.theta)*my.speed;
					// if i reach my zone within a buffer distance
					if(Math.pointDistance(my, path.destination) <= 15) {
						path.targets.length = 0;
						path.destination = false;
						my.x = -10; my.y = -10;
						Zone[path.zone].count += 1;
						return self.draw();
					}
					// if i reach my target within the distance of each one of my steps
					if(Math.pointDistance(my, path.targets[0]) <= my.speed) {
						// make sure that i get well past the corner
						my.x += dx;	my.y += dy
						// remove the corner from targets
						path.targets.shift();
						// remove the building from ignore
						path.ignore.shift();
						var targets = [];
						$.each(path.targets, function(h,j) {
							targets.push(j.x+', '+j.y);
						});
						// redirect myself to the next corner
						if(targets.length) {
							my.theta = Angle(my, path.targets[0]);
						}
						//alert(targets.join('\n')+'\n\n'+path.ignore.length);
						// work is done
						return self.draw();
					}
					// else, keep moving
					my.x += dx; my.y += dy;
				};
				return self.draw();
			},
		});
	};
})();

var log = function(c) {
	$('.log').val($('.log').val()+'\n'+(typeof c==='string'?c:c.x+', '+c.y));
};

var People = [
];

var step = 0;

var Detect = function(from, to) {
	var x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
	var found = [], tmp;
	var dx = (x2 - x1)
	var a = (y2 - y1) / (x2 - x1);
	var b = y1 - a*x1;
	for(var i=0; i<clips.length; i++) {
		var clip = clips[i];
		var minX = x1, maxX = x2;
		if(x1 > x2){ minX = x2; maxX = x1; }
		if(maxX > clip.xmax) maxX = clip.xmax;
		if(minX < clip.xmin) minX = clip.xmin;
		if(minX > maxX) continue;
		var minY = y1, maxY = y2;
		if(Math.abs(dx) > 0.0000001) {
			minY = a*minX + b;
			maxY = a*maxX + b;
		}
		if(minY > maxY){ tmp = maxY; maxY = minY; minY = tmp; }
		if(maxY > clip.ymax) maxY = clip.ymax;
		if(minY < clip.ymin) minY = clip.ymin;
		if(minY > maxY) continue;
		found.push(clip);
	}
	return found;
};
var Detect2 = function(from,to) {
	var x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
	var found = [], tmp;
	var gx, gy, lx, ly;
	if(x1>x2){ gx=x1; lx=x2; }
	else     { gx=x2; lx=x1; }
	if(y1>y2){ gy=y1; ly=y2; }
	else     { gy=y2; ly=y1; }
	
	var yd = y2-y1;
	var xd = x1-x2;
	var xy = x2*y1-x1*y2;
	for(var i=0; i<clips.length; i++) {
		var clip = clips[i];
		if( lx > clip.xmax |
			ly > clip.ymax |
			gx < clip.xmin |
			gy < clip.ymin ) continue;
		var Yx = yd*clip.xmin,
			Xy = xd*clip.ymin,
			YX = yd*clip.xmax,
			XY = xd*clip.ymax;
		var ftl = Yx+Xy+xy,
			ftr = YX+Xy+xy,
			fbr = YX+XY+xy,
			fbl = Yx+XY+xy;
		var neg = ftl<0 | ftr<0 | fbr<0 | fbl<0;
		var pos = ftr>0 | ftr>0 | fbr>0 | fbl>0;
		if(neg && pos) {
			found.push(clip);
		}
	}
	return found;
};


var intersectWall = function(a1, a2, b) {
	var b1 = {x:b.x1, y:b.y1},
		b2 = {x:b.x2, y:b.y2};
/*	$('.debug').val(['(',Math.round(a1.x),',',Math.round(a1.y),'),\n(',Math.round(a2.x),',',Math.round(a2.y),'),\n(',
		Math.round(b1.x),',',Math.round(b1.y),'),\n(',Math.round(b2.x),',',Math.round(b2.y),'),'].join(''));*/
	var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
	var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
	var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
	
	if ( u_b != 0 ) {
	var ua = ua_t / u_b;
	var ub = ub_t / u_b;
		
		if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
			return {
				x: a1.x + ua * (a2.x - a1.x),
				y: a1.y + ua * (a2.y - a1.y),
			};
		}
	}
};

var distancePointLine = function(point, lineA, lineB) {
	var rn = (point.x-lineA.x)*(lineB.x-lineA.x) + (point.y-lineA.y)*(lineB.y-lineA.y),
		rd = (lineB.x-lineA.x)*(lineB.x-lineA.x) + (lineB.y-lineA.y)*(lineB.y-lineA.y);
	var s = ((lineA.y-point.y)*(lineB.x-lineA.x)-(lineA.x-point.x)*(lineB.y-lineA.y)) / rd;
	return Math.abs(s)*Math.sqrt(rd);
};


(function() {
	var self = window.World = function() {
		
	};
	var my = {
		north: 0,
		west: 0,
		latSpan: 0,
		lngSpan: 0,
	};
	var rwts = 1,
		strw = 1;
	$.extend(self, {
		defineExtent: function(northWest, southEast) {
			my.north = northWest.lat;
			my.west = northWest.lng;
			my.latSpan = Math.abs(southEast.lat - northWest.lat);
			my.lngSpan = Math.abs(southEast.lng - northWest.lng);
		},
		setScale: function(pixelWidth) {
			rwts = pixelWidth / my.lngSpan;
			strw = 1 / rwts;
			return Math.abs(rwts * my.latSpan);
		},
		latlng2xy: function(latlng) {
			return {x: rwts * (latlng[0] - my.west), y: Math.abs(rwts * (latlng[1] - my.north))};
		},
		xyToLatLng: function(x, y) {
			return {lat: (x * strw) + my.west, lng: (y * strw) + my.north};
		},
	});
})();

var assign = function(un, to) {
	un = String.toUpperCase(un);
	if(unnamed[un] && named[to]) {
		unnamed[un] = to;
		named[to] = un;
		return true;
	}
	return false;
};

window.ParseStructs = function(json) {
	$.each(json, function(i, record) {
		$.each(record, function(j, building) {
			$.each(building.geometry.rings, function(k, ring) {
				var struct = [];
				for(var z=0; z<ring.length; z++) {
					struct.push(World.latlng2xy(ring[z]));
				}
				struct.name = building.attributes.B_Name;
				struct.bid = building.id;
				Buildings.push(struct);
				//named[String.toLowerCase(struct.name)] = true;
			});
		});
	});
	
	for(var i=0; i<Buildings.length; i++) {
		var struct = Buildings[i];
		var id = i;
		var xmin = Infinity; var xmax = -Infinity;
		var ymin = Infinity; var ymax = -Infinity;
		var edge = [];
		for(var k=0; k<Buildings[i].length; k++) {
			xmin = Math.min(struct[k].x, xmin);
			xmax = Math.max(struct[k].x, xmax);
			ymin = Math.min(struct[k].y, ymin);
			ymax = Math.max(struct[k].y, ymax);
			var next = struct[(k+1)%struct.length];
			edge.push({x1: struct[k].x, y1: struct[k].y,
				x2: next.x, y2: next.y});
		}
		clips.push({xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, nodes: struct, arcs: edge, bid: struct.bid, name:struct.name});
	}
};

window.named = {};
window.unnamed = {};

window.Zone = [];

$(document).ready(function(){
	World.defineExtent({lat: 34.419767, lng: -119.856622}, {lat: 34.406247, lng: -119.838444});
	Canvas.height = World.setScale(Canvas.width);
	var canvas = $(['<canvas width="',Canvas.width,'" height="',Canvas.height,'"></canvas>'].join('')).appendTo($('.canvas'));
	window.ctx = canvas[0].getContext('2d');
	ParseStructs(DATA.Buildings);
	ParseSpatial(Exits);
	
	var canvas = $(['<canvas class="foreground" width="',Canvas.width,'" height="',Canvas.height,'"></canvas>'].join('')).appendTo($('.canvas'));
	var fg = $('.foreground')[0].getContext('2d');
	fg.clearRect(0,0,Canvas.width,Canvas.height);
	for(var i=0; i<Buildings.length; i++) {
		var struct = Buildings[i];
		fg.beginPath();
		fg.moveTo(struct[0].x, struct[0].y);
		for(var p=0; p<struct.length; p++) {
			fg.lineTo(struct[p].x, struct[p].y);
		}
		fg.closePath();
		fg.stroke();
	}
	
	$('canvas').click(function(e) {
		var x = e.pageX - $('canvas').offset().left,
			y = e.pageY - $('canvas').offset().top;
		ctx.save();
		ctx.strokeStyle = 'green';
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, Math.twoPI, true);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		Zone.push({
			x: x, y: y, count: 0,
		});
	});
	$('canvas').rightClick(function(e) {
		StepsPerSpawn = Math.round(StepsPerSecond / Number($('.spawnRate').val()));
		Speed.fast = Number($('.fastest').val());
		Speed.range = Number($('.range').val());
		// Monday @ 10am
		Simulation.spawns = Spawn(new Event('M',10*60));
		Step();
	});
});

var ParseSpatial = function(X) {
	for(var h in X) {
		for(var z=0; z!==X[h].length; z++) {
			X[h][z] = World.latlng2xy(X[h][z]);
		}
	}
};

var gridSpawn = function() {
	var c = 0;
	for(var x=120; x<850; x+=20) {
		for(var y=320; y<700; y+= 15) {
			People.push(new Person({
				x: x,
				y: y,
			}));
			c++;
		}
	}
};


var WeightedDestiny = function(from, tos) {
	var sum = 0, pds = [], z;
	for(z in tos) {
		var pd = Math.pointDistance(tos[z], from);
		pds.push(pd); sum += pd;
	}
	var seed = Math.random();
	var ground = 0, growth;
	for(var h in pds) {
		growth = 1 - (pds[h] / sum);
		if(seed < ground + growth) {
			return h;
		}
	}
	return z;
};

var Event = function(d, t) {
	var total = 0;
	var self = this==window? {}: this;
	self.occupancy = {};
	var day = 0, hourStart = 1, hourEnd = 2, bld = 3, size = 4;
	for(var i=0; i!==enrollment.data.length; i++) {
		var nclass = enrollment.data[i];
		if(nclass[day].indexOf(d)!==-1 && t>=nclass[hourStart] && t<nclass[hourEnd]) {
			total += nclass[size];
			var bid = enrollment.nameToBid[nclass[bld]];
			if(!self.occupancy[bid]) self.occupancy[bid] = 0;
			self.occupancy[bid] += nclass[size];
		}
	}
	return self;
};

var Spawn = function(event) {
	var total = 0;
	var spawns = [];
	for(var bid in Exits) {
		var exit = Exits[bid];
		var size = event.occupancy[bid];
		if(!size) continue;
		total += size;
		var ppe = Math.floor(size / exit.length);
		var destine = WeightedDestiny(exit[0], Zone);
		spawns.push({
			point: exit[0],
			size: ppe + size-ppe*exit.length,
			destiny: destine,
		});
		for(var i in exit) {
			destine = WeightedDestiny(exit[i], Zone);
			spawns.push({
				point: exit[i],
				size: ppe,
				destiny: destine,
			});
		}
	}
	return spawns;
}

var Simulation = {};
var SpawnRate = 3.5;
var StepsPerSecond = 20;
var StepsPerSpawn = Math.round(StepsPerSecond / SpawnRate);
var DelayStep = 0;
var TimeStep = 0;

window.frame = [];
window.buffer = [];

window.Step = {};
Step = function() {
	var maxlen = Number($('.limit').val());
	if(TimeStep % StepsPerSpawn === 0) {
		for(var k in Simulation.spawns) {
			if(People.length >= maxlen) break;
			var spawn = Simulation.spawns[k];
			if(spawn.size !== 0) {
				People.push(new Person(spawn.point, spawn.destiny));
				spawn.size -= 1;
			}
		}
	}
	
	
	ctx.save();
	for(var z in Zone) {
		var x = Zone[z].x, y = Zone[z].y;
		ctx.clearRect(x-14,y-14,32,32);
		ctx.strokeStyle = 'green';
		ctx.beginPath();
		ctx.arc(x, y, 12, 0, Math.twoPI, true);
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle='black';
		ctx.fillText(Zone[z].count, x-8, y+3);
	}
	ctx.restore();
	
	for(var h in People) {
		People[h].move();
	}
	
	$('.debug').val(['step: ',TimeStep,'\nsize:',People.length].join(''));
	
	/**
	buffer.push([TimeStep,':[',frame.join(''),'],'].join(''));
	frame.length = 0;
	
	if(TimeStep === 50)
		document.write(buffer.join('<br>'));
	/**/
	
	TimeStep += 1;
	window.setTimeout(Step, DelayStep);
}


var playSaved = function() {
	ctx.clearRect(0,0,900,600);
	var mark = saved[TimeStep];
	for(var h in mark) {
		ctx.fillRect(mark[h].x, mark[h].y, 2, 2);
	}
	TimeStep += 1;
	playSaved.timeout = window.setTimeout(playSaved, 90);
};
playSaved.start = function() {
	TimeStep = 0;
	window.clearTimeout(playSaved.timeout);
	playSaved();
};