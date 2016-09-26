
sequence = compile(sequence);

'dialog message thought options title left right music ambient equipment background'.split(' ').forEach(function(k) {
    this[k] = document.getElementById(k);
});

var scene;

var AudioController = function AudioController(element, maxVolume) {
    element.volume = maxVolume/2;
    element.autoplay = 'autoplay';
    this.audio = element;
    this.maxVolume = maxVolume;
    this.url = '';
    setInterval(this.tick.bind(this), 100);
};

AudioController.prototype.tick = function() {
    var a = this.audio;
    var l = this.url;
    var s = this.maxVolume / 30;
    if(a.volume <= 0) {
        if(l) {
            a.src = l;
            a.volume = s;
        }
    } else if(l && a.currentSrc && (a.currentSrc.indexOf(l) >= 0)) {
        if(a.volume < this.maxVolume) {
            if(a.volume + s >= 1) {
                a.volume = 1;
            } else if(a.volume + s >= this.maxVolume) {
                a.volume = this.maxVolume;
            } else {
                a.volume += s;
            }
        }
    } else if(a.volume > 0) {
        if(a.volume - s < 0) {
            a.volume = 0;
        } else {
            a.volume -= s;
        }
    }
};

AudioController.prototype.set = function(url) {
    this.url = url;
};

music = new AudioController(music, 1);
ambient = new AudioController(ambient, 0.2);

var timeout;

var play = function play(element, animation) {
    return new Promise(function(resolve, reject) {
        if(typeof element.rejectAnimation === 'function') {
            element.rejectAnimation();
            delete element.rejectAnimation;
        }
        element.rejectAnimation = function() {
            //console.log('rejecting promise');
            reject();
        };
        var prop;
        if(typeof element.style.webkitAnimation !== 'undefined') {
            prop = 'webkitAnimation';
        } else if(typeof element.style.MozAnimation !== 'undefined') {
            prop = 'MozAnimation';
        }
        if(prop) {
            $(element).one('webkitAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                element.style[prop] = '';
                delete element.rejectAnimation;
                resolve(element);
            });
            element.style[prop] = animation;
        } else {
            resolve(element);
        }
        
    });
};

var get_item = function get_item(item) {
    var img = document.getElementById(item.id);
    if(!img) {
        img = document.createElement('img');
        img.classList.add('item');
        img.src = item.image;
        img.title = item.title;
        img.id = item.id;
    }
    return img;
};

var add_item = function add_item(item) {
    return new Promise(function(resolve, reject) {
        var img = get_item(item);
        play(img, 'new_item 3s').then(resolve).catch(reject);
        equipment.appendChild(img);
    });
};

var ended = function ended(next_idx) {
    ending = false;
    if(scene.source) {
        var source_div = document.getElementById(scene.source);
        source_div.classList.remove('talking');
    }
    if(scene.fullscreen) document.body.classList.remove('fullscreen');
    
    if(typeof next_idx === 'number') {
        scene_index = next_idx;
    } else if(typeof next_idx === 'string') {
//         console.log('Szukam slajdu', next_idx);
        var ok = false;
        for(var i = 0; i < sequence.length; ++i) {
            if(sequence[i].id === next_idx) {
                scene_index = i;
                ok = true;
//                 console.log('Znalazłem', scene_index);
                break;
            }
        }
        if(!ok) {
            throw 'Slajd z identyfikatorem "' + next_idx + '" nie istnieje.';
        }
    } else {
        throw 'Unknown type of next_idx';
    }
    begin();
};

var ending = false;

var end = function end(next_idx) {
    if(ending) return;
    ending = true;
    if(timeout) {
        clearTimeout(timeout);
        timeout = 0;
    }
    var queue = Promise.resolve();
    if(scene.end_fun) {
        //queue = queue.then(scene.end_fun);
        scene.end_fun();
    }
    if(scene.exit) {
        queue = queue.then(play.bind(undefined, dialog, scene.exit));
    }
    queue.then(ended.bind(undefined, next_idx));
};

var began = function began() {
    if(scene.timeout) {
        if(timeout) {
            clearTimeout(timeout);
            timeout = 0;
        }
        timeout = setTimeout(function() {
            timeout = undefined;
            end(scene_index + 1);
        }, scene.timeout * 1000);
    }
};

var advance = function advance() {
    if(document.body.classList.contains('active')) {
        if(scene.next) {
            new Audio('83541__zgump__bell-0104.mp3').play();
            end(scene.next);
        } else if(scene_index + 1 < sequence.length) {
            new Audio('83541__zgump__bell-0104.mp3').play();
            end(scene_index+1);
        }
    }
};

var entering = {};
var animate_characters = function animate_characters(root, def) {
    var present = {};
    if(def) {
        for(var i = 0; i < 10; ++i) {
            if(!def[i]) break;
            var id = def[i].id;
            present[id] = true;
            var div = document.getElementById(id);
            if(!div) {
                div = document.createElement('div');
                div.id = id;
                div.title = def[i].title;
                div.style.backgroundImage = 'url(' + def[i].image + ')';
                entering[id] = div;
                play(div, 'slide_from_left 1s');
                root.appendChild(div);
            } else if(!div.rejectAnimation)
                root.appendChild(div);
            if(div.sliding_out) {
                div.rejectAnimation();
                div.sliding_out = false;
            }
        }
    }
    var children = root.childNodes;
    for(i = 0; i < children.length; ++i) {
        var child = children[i];
        if(present[child.id]) {
            // cool
        } else {
            child.sliding_out = true;
            play(child, 'slide_to_left 1s').then(function(elem) {
                root.removeChild(elem);
            });
        }
    }
}

var fabs = function fabs(a, b) {
    if(a < b) {
        return b / Math.max(0.001, a);
    } else {
        return a / Math.max(0.001, b);
    }
};

var make_line = function make_line(words, parent, width, max_ratio) {
    //console.log(words, parent, width, max_ratio);
    var div = document.createElement('div');
    div.classList.add('oneline');
    div.textContent = words.join(' ');
    parent.appendChild(div);
    div.style.fontSize = Math.min(max_ratio, width / div.offsetWidth) + 'em';
    if((words.length > 1) && (fabs(width, div.offsetWidth) < 1.6)) {
        div.style.wordSpacing = (width - div.offsetWidth) / (words.length-1) + 'px';
    }
    div.classList.remove('oneline');
    div.style.whiteSpace = 'nowrap';
}

var fill_text = function fill_text(element, height) {
    var width = element.offsetWidth;
    var perfectRatio = width / height;
    
    element.classList.add('oneline');
    var textWidth = element.offsetWidth;
    var lineHeight = element.offsetHeight;
    element.classList.remove('oneline');
    
    var lastResult = fabs(textWidth / lineHeight, perfectRatio);
    
    //console.log(1, lastResult);
    for(var lines = 2; lines < 15; ++lines) {
        var testWidth = textWidth / lines;
        var testHeight = lineHeight * lines;
        var testRatio = testWidth / testHeight;
        
        var result = fabs(testRatio, perfectRatio);
        //console.log(lines, result);
        if(result > lastResult) {
            --lines;
            break;
        }
        if(testHeight * width / testWidth > height) {
            --lines;
            break;
        }
        lastResult = result;
    }
    //console.log('Found perfect number of lines:', lines);
    
    var text = element.textContent;
    var bestCharsPerLine = text.length / lines;
    //console.log("We have", text.length, 'chars');
    //console.log("Each line should have", bestCharsPerLine);
    var words = text.split(' ');
    element.innerHTML = '';
    for(var line = 0; line + 1 < lines; ++line) {
        var char_count = 0;
        for(var word_count = 0; word_count < words.length; ++word_count) {
            var current_error = fabs(char_count, bestCharsPerLine);
            var next_error = fabs(char_count + words[word_count].length + 1, bestCharsPerLine);
            if(next_error > current_error) break;
            char_count += words[word_count].length + 1;
        }
        //console.log('Adding line', line + 1, 'with', char_count, 'characters');
        make_line(words.splice(0, word_count), element, width, height / lineHeight);
    }
    //console.log('Adding line', line + 1, 'with', words.join(' ').length, 'characters');
    make_line(words, element, width, height / lineHeight);
};

var layout_timeout;
onresize = function() {
    if(layout_timeout) {
        clearTimeout(layout_timeout);
        layout_timeout = 0;
    }
    layout_timeout = setTimeout(function() {
        message.innerHTML = scene.message;
        thought.innerHTML = scene.thought;
        do_layout();
    }, 100);
};

var do_layout = function do_layout() {
    layout_timeout = undefined;
    var freeHeight = window.innerHeight * 0.4;
    if(document.body.classList.contains('fullscreen')) {
        freeHeight = window.innerHeight * 0.9;
    }
    freeHeight -= options.childNodes.length * 30;
    if(options.childNodes.length) freeHeight -= window.innerHeight * 0.02;
    if(scene.thought) freeHeight -= 30;
    if(scene.message) freeHeight -= 30;
    if(scene.thought && scene.message) freeHeight -= window.innerHeight * 0.02;
    freeHeight = Math.max(0, freeHeight);
    
    if(scene.thought) {
        var ratio = scene.thought.length / (scene.thought.length + scene.message.length);
        fill_text(thought, 30 + freeHeight * ratio);
    }
    if(scene.message) {
        var ratio = scene.message.length / (scene.thought.length + scene.message.length);
        fill_text(message, 30 + freeHeight * ratio);
    };
    
};

var change_background = function change_background(url) {
    var present = false;
    for(var i = 0; i < background.childNodes.length; ++i) {
        var child = background.childNodes[i];
        if(child.style.backgroundImage.indexOf(url) >= 0) {
            present = true;
        } else if(!child.rejectAnimation) {
            play(child, 'slide_to_left 1s').then(background.removeChild.bind(background));
        }
    }
    if(!present && url && url !== 'black') {
        console.log('Background non-present!', url);
        var div = document.createElement('div');
        div.style.backgroundImage = 'url(' + url + ')';
        play(div, 'slide_from_right 1s');
        background.appendChild(div);
    }
};

var begin = function begin() {
    if(scene_index > sequence.length) return;
    scene = sequence[scene_index];
    if(!scene) return;
    if(scene.sound) {
        for(var i = 0; i < 10; ++i) {
            setTimeout(function() {
                music.audio.volume = 0.1;
                ambient.audio.volume = 0.1;
            }, i * 150);
        }
        new Audio(scene.sound).play();
    }
    change_background(scene.background);
    entering = {};
    animate_characters(left, scene.left);
    animate_characters(right, scene.right);

    options.innerHTML = '';
    for(var i = 0; i < 10; ++i) {
        if(scene[i]) {
            $(options).append('<li>' + scene[i].text + '</li>');
            options.childNodes[i].addEventListener('mouseover', function() {
                new Audio('211853__nyonk__tic.mp3').play();
            });
            options.childNodes[i].addEventListener('mousedown', function(next) {
                return function(e) {
                    new Audio('192277__lebcraftlp__click.mp3').play();
                    end(next);
                    e.stopPropagation();
                }
            }(scene[i].next || (scene_index + 1)));
        } else {
            break;
        }
    }
    if(scene['0'] || (sequence.length <= scene_index + 1)) {
        document.body.classList.remove('active');
    } else {
        document.body.classList.add('active');
    }
    scene.message = scene.message || '';
    scene.thought = scene.thought || '';
    message.innerHTML = scene.message;
    thought.innerHTML = scene.thought;
    
    if(scene.fullscreen) document.body.classList.add('fullscreen');
    
    do_layout();
    
    if(scene.source) {
        document.body.classList.add('discussion');
        var source_div = document.getElementById(scene.source);
        source_div.classList.add('talking');
        title.innerHTML = source_div.title;
    } else {
        document.body.classList.remove('discussion');
        title.innerHTML = '';
    }
    if(scene.enter) {
        play(dialog, scene.enter).then(function() {
            began();
        });
    } else if(entering[scene.source]) {
        var s = entering[scene.source];
        play(dialog, s.parentNode === left ? 'slide_from_left 1s' : 'slide_from_right 1s').then(function() {
            began();
        });
    } else {
        began();
    }
    
    music.set(scene.music);
    ambient.set(scene.ambient);
    
    if(scene.start_fun) {
        //queue = queue.then(scene.end_fun);
        scene.start_fun();
    }
    
};

$(function() {
    (function() {
        var promises = [];
        var added = { black: true };
        var search = function(obj) {
            for(var key in obj) {
                var val = obj[key];
                if(typeof val === 'object') {
                    search(val)
                } else if(typeof val === 'string') {
                    if(key === 'image' || key === 'background') {
                        if(!added[val]) {
                            added[val] = true;
                            promises.push(new Promise(function(resolve, reject) {
                                var img = new Image();
                                img.onload = function() { resolve() };
                                img.src = val;
                            }));
                        }
                    }
                }
            }
        }
        search(sequence);
        
    })();
    begin();
    document.addEventListener('mousedown', advance, false);
});
