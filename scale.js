/**
 * @author bbezine
 */

String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}

Key.abcmapping = [
	'C2',
	'^C2',
	'D2',
	'^D2',
	'E2',
	'F2',
	'^F2',
	'G2',
	'^G2',
	'A2',
	'^A2',
	'B2'
]

ScalesApp = Ember.Application.create();

ScalesApp.Scale = Ember.Object.extend({
	name: null,
	steps: null
});

ScalesApp.Mapping = Ember.Object.extend({
	name: null,
	sharpNames: null
});

ScalesApp.Configuration = Ember.Object.extend({
	keyMapping: null,
	scale: null,
	key: null,
});
	
ScalesApp.allMappings =  Ember.ArrayController.create({content: [
	ScalesApp.Mapping.create({
		name: 'English',
		sharpNames: Ember.ArrayController.create({content: [
			{id:0, name:'C'},
			{id:1, name:'C#'},
			{id:2, name:'D'},
			{id:3, name:'D#'},
			{id:4, name:'E'},
			{id:5, name:'F'},
			{id:6, name:'F#'},
			{id:7, name:'G'},
			{id:8, name:'G#'},
			{id:9, name:'A'},
			{id:10, name:'A#'},
			{id:11, name:'B'}
		]})
	}),
	ScalesApp.Mapping.create({
		name: 'Southern Europe',
		sharpNames: Ember.ArrayController.create({content: [
			{id:0, name:'Do'},
			{id:1, name:'Do#'},
			{id:2, name:'Re'},
			{id:3, name:'Re#'},
			{id:4, name:'Mi'},
			{id:5, name:'Fa'},
			{id:6, name:'Fa#'},
			{id:7, name:'Sol'},
			{id:8, name:'Sol#'},
			{id:9, name:'La'},
			{id:10, name:'La#'},
			{id:11, name:'Si'}
		]})
	}),
	ScalesApp.Mapping.create({
		name: 'Northern Europe',
		sharpNames: Ember.ArrayController.create({content: [
			{id:0, name:'C'},
			{id:1, name:'C#'},
			{id:2, name:'D'},
			{id:3, name:'D#'},
			{id:4, name:'E'},
			{id:5, name:'F'},
			{id:6, name:'F#'},
			{id:7, name:'G'},
			{id:8, name:'G#'},
			{id:9, name:'A'},
			{id:10, name:'A#'},
			{id:11, name:'H'}
		]})
	})
]});
	
ScalesApp.allScales = Ember.ArrayController.create({content: [
	ScalesApp.Scale.create({
		name: 'Minor blues', steps: [3, 2, 1, 1, 3/*, 2*/]
	}),
	ScalesApp.Scale.create({
		name: 'Major blues', steps: [2, 1, 1, 3, 2/*, 3*/]
	})
]});

ScalesApp.configurationController = ScalesApp.Configuration.create({
	keyMapping: ScalesApp.allMappings.get('content')[0],
	scale: ScalesApp.allScales.get('content')[0],
	key: ScalesApp.allMappings.get('content')[0].sharpNames.get('content')[0],
});

function showScore() {
	var getKey = ScalesApp.configurationController.get('key');
	if (getKey) {
		var key = new Key(parseInt(ScalesApp.configurationController.get('key').id), 0);
		var g = new Scale(key, ScalesApp.configurationController.get('scale').steps);
		g.show('score');
	}
}

ScalesApp.configurationController.addObserver('scale', showScore);
ScalesApp.configurationController.addObserver('key', showScore);


function Key(n, oct) {
	var key = n;
	var octave = oct;

	this.addHalfTones = function(diff) {
		var newKey = key + diff;
		var newOctave = octave + Math.floor(newKey / Key.abcmapping.length);
		newKey = newKey % Key.abcmapping.length;
		
		return new Key(newKey, newOctave);
	}
	
	this.getKey = function() {
		return key;
	}
	
	this.getABCString = function() {
		var abc = Key.abcmapping[key];
		if (octave >= 1) {
			abc = abc.toLowerCase();
			if (octave > 1) {
				abc += "'".repeat(octave - 1);
			}
		} else if (octave < 0) {
			abc += ",".repeat(-octave);
		}
		
		return abc;
	}
}


function Scale(k, s) {
	var key = k;
	var structure = s;
	
	function makeScaleString() {
		var g = makeArrayScale();
		var abc = $.map(g, function (k) { return k.getABCString(); });
		return abc.join();
		
		//return "X:1\nM: 4/4\nL: 1/8\nK: Emin\n|:D2|EB{c}BA B2 EB|\n";
	}
	
	function makeArrayScale() {
		var g = [];
		
		g.push(key);
		var next = key;
		
		for (var i=0; i<structure.length; i++) {
			next = next.addHalfTones(structure[i]);
			g.push(next);
		}

		return g;
	}
	
	this.show = function(targetDiv) {
		var abcString = makeScaleString();
		ABCJS.renderAbc(targetDiv, abcString);
	}
};

$(document).ready(function(){

});
