
sequence = compile(sequence);

('dialog message thought options title left right music ambient ' +
 'equipment background tooltip my_score opponent_score my_life ' +
 'my_placeholder opponent_placeholder ' +
 'unlocker').split(' ').forEach(function(k) {
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

var wait = function wait(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, time);
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
    if(!scene) return;
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
        //console.log('Background non-present!', url);
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

var opponent_deck = [];
var deck = [];

var make_card = function make_card(src, back_src) {
    var card = document.createElement('div');
    card.classList.add('card');
    var face = new Image();
    face.src = src;
    face.classList.add('face');
    card.appendChild(face);
    var back = new Image();
    back.src = back_src;
    back.classList.add('back');
    card.appendChild(back);
    card.attack = Math.round((Math.random() * 2 - 1) * 3) + 1;
    card.defense = Math.round((Math.random() * 2 - 1) * 3);
    card.precision = - card.attack - card.defense;
    var lock = document.createElement('div');
    lock.classList.add('lock');
    card.appendChild(lock);
    var tooltip = document.createElement('div');
    tooltip.textContent = 'Atak:' + card.attack + '\nObrona:' + card.defense + '\nPrecyzja:' + card.precision;
    tooltip.classList.add('tooltip');
    card.appendChild(tooltip);
    return card;
};

(function() {
    var faces = [
        'karty/tarot_card_0__the_fool_by_rannsama-d4yfak5.png',
        'karty/tarot_card_10__the_wheel_of_fortune_by_rannsama-d4ziaz9.png',
        'karty/tarot_card_118__the_strength_by_rannsama-d4zmcbw.png',
        'karty/tarot_card_12__the_hanged_man_by_rannsama-d4ywhak.png',
        'karty/tarot_card_13__the_death_by_rannsama-d4yy8t9.png',
        'karty/tarot_card_14__the_temperance_by_rannsama-d4yjbg5.png',
        'karty/tarot_card_15__the_devil_by_rann_rann-d50p83x.png',
        'karty/tarot_card_16__the_tower_by_rann_rann-d50dctr.jpg',
        'karty/tarot_card_17__the_star_by_rannsama-d4y2q3z.png',
        'karty/tarot_card_18__themoon_by_rannsama-d4ycalm.png',
        'karty/tarot_card_19__the_sun_by_rann_rann-d50nfo5.png',
        'karty/tarot_card_1__the_magician_by_rannsama-d4rm6ai.png',
        'karty/tarot_card_20__the_judgment_by_rann_rann-d50mqcc.png',
        'karty/tarot_card_21__the_world_by_rannsama-d4p2ixr.png',
        'karty/tarot_card_2__the_high_priestress_by_rannsama-d4s2ob2.png',
        'karty/tarot_card_3__the_empress_by_rannsama-d4sce1w.png',
        'karty/tarot_card_5__the_hierophant_by_rannsama-d4zhus5.png',
        'karty/tarot_card_6__the_lovers_by_rannsama-d4xyqup.png',
        'karty/tarot_card_7__the_chariot_by_rann_rann-d50q6ka.png',
        'karty/tarot_card_8__the_justice_by_rannsama-d4zneq6.png',
        'karty/tarot_card_9__the_hermit_by_rann_rann-d50fr40.png',
        'karty/tarot_card___the_emperor_by_rann_rann-d50qqyz.png',/*
        'karty/tarot_minor_arcana_3_of_swords___by_rann_poisoncage-d6kq8ho.png',
        'karty/tarot_minor_arcana_ace_of_pentacles___by_rann_poisoncage-d6l0hlx.png'*/
    ];
    for(var i = 0; i < 14; ++i) {
        var r = Math.floor(Math.random() * faces.length);
        var face = faces.splice(r, 1);
        var card = make_card(face, 'karty/tarot_minor_arcana_ace_of_pentacles___by_rann_poisoncage-d6l0hlx.png');
        deck.push(card);
    }
    for(var i = 0; i < 8; ++i) {
        var r = Math.floor(Math.random() * faces.length);
        var face = faces.splice(r, 1);
        var card = make_card(face, 'karty/tarot_minor_arcana_3_of_swords___by_rann_poisoncage-d6kq8ho.png');
        card.classList.add('opponent');
        opponent_deck.push(card);
    }
})();

var hovered;
var table = [];

var hover_card = function hover_card(e) {
    var cardWidth = innerWidth * 0.1;
    var cardHeight = cardWidth * 1.6539162112932604;
    if(e.clientY > innerHeight - cardHeight/2) {
        var right = Math.min(deck.length - 1, Math.floor((deck.length-1) * e.clientX / (innerWidth - cardWidth)));
        var left = Math.max(0, Math.ceil((deck.length-1) * (e.clientX - cardWidth) / (innerWidth - cardWidth)));
        for(var i = right; i >= left; --i) {
            if(!deck[i].classList.contains('played')) break;
        }
        if(i < left) {
            
        } else if(hovered != deck[i]) {
            new Audio('211853__nyonk__tic.mp3').play();
            if(hovered) hovered.classList.remove('hovered');
            deck[i].classList.add('hovered');
            hovered = deck[i];
            if(hovered.classList.contains('locked')) {
                unlocker.style.left = hovered.style.left;
                unlocker.style.bottom = innerWidth * 0.19 + 'px';
                unlocker.style['z-index'] = 3;
            } else {
                unlocker.style.left = '';
                unlocker.style.bottom = '50%';
                unlocker.style['z-index'] = 1;
            }
        }
    } else if(e.clientY > innerHeight - cardHeight*1.5) {
        
    } else if(hovered) {
        new Audio('211853__nyonk__tic.mp3').play();
        hovered.classList.remove('hovered');
        hovered = undefined;
        unlocker.style.left = '';
        unlocker.style.bottom = '50%';
        unlocker.style['z-index'] = 1;
    }
};

var calc_points = function calc_points(score, positions) {
    score.classList.add('active');
    var labels = score.querySelectorAll('.labels > div');
    for(var i = 0; i < labels.length; ++i) labels[i].textContent = '0';
    
    var fly = function fly(index) {
        for(var i = 1; i < 7; ++i) {
            score.classList.remove('card' + i);
        }
        score.classList.add('card' + (index + 1));
        new Audio('127197__dave-des__fast-simple-chop-5.mp3').play();
        return wait(1000);
    }
    
    var add = function add(index) {
        labels[0].textContent = Number(labels[0].textContent) + table[index].attack;
        labels[1].textContent = Number(labels[1].textContent) + table[index].defense;
        labels[2].textContent = Number(labels[2].textContent) + table[index].precision;
        new Audio('56240__q-k__gong-center-clear.mp3').play();
        return wait(1000);
    };
    
    var p = Promise.resolve();
    for(var i = 0; i < positions.length - 1; ++i) {
        var index = positions[i];
        if(table[index]) {
            p = p.then(fly.bind(null, index)).then(add.bind(null, index));
        };
    }
    index = positions[positions.length - 1];
    p = p.then(fly.bind(null, index));
    if(table[index]) {
        p = p.then(add.bind(null, index));
    }
    return p;
};

var apply_damage = function apply_damage(attacker_score, defender_score, attacker_life, defender_life) {
    
    var attack = attacker_score.querySelectorAll('.labels > div');
    var defense = defender_score.querySelectorAll('.labels > div');
    
    attack[0].classList.add('raised');
    defense[1].classList.add('raised');
    defender_life.classList.add('raised');
    new Audio('118792__lmbubec__1-knife-slash-a.mp3').play();
    return wait(500).then(function() {
        var dmg = Math.max(0, Number(attack[0].textContent) - Math.max(0, Number(defense[1].textContent)));
        defender_life.textContent = Number(defender_life.textContent) - dmg;
        new Audio('35213__abyssmal__slashkut.mp3').play();
        return wait(1000);
    }).then(function() {
        attack[0].classList.remove('raised');
        defense[1].classList.remove('raised');
        defender_life.classList.remove('raised');
        return (Number(defender_life.textContent) <= 0);
    });
};

var finish_round = function finish_round() {
    return calc_points(my_score, [0, 1, 2]).
        then(calc_points.bind(null, opponent_score, [5, 4, 3])).
        then(apply_damage.bind(null, my_score, opponent_score, my_life, opponent_life)).
        then(function(killed) {
            if(killed) {
                new Audio('90138__pierrecartoons1979__win1.mp3').play();
                return wait(2000).then(end_game.bind(undefined, true));
            }
            return apply_damage(opponent_score, my_score, opponent_life, my_life).then(function(killed) {
                if(killed) {
                    new Audio('175409__kirbydx__wah-wah-sad-trombone.mp3').play();
                    return wait(5000).then(end_game.bind(undefined, false));
                }
                return wait(500).then(function() {
                    my_score.classList.remove('card3');
                    my_score.classList.remove('active');
                    opponent_score.classList.remove('card4');
                    opponent_score.classList.remove('active');
                    new Audio('127197__dave-des__fast-simple-chop-5.mp3').play();
                    return wait(500);
                }).then(function() {
                    for(var i = 0; i < 6; ++i) {
                        var c = table[i];
                        if(c) {
                            c.classList.remove('card' + (i+1));
                            c.classList.remove('played');
                            table[i] = undefined;
                        }
                    }
                    new Audio('201253__empraetorius__card-shuffle.mp3').play();
                    return wait(500);
                }).then(next_stage.bind(undefined, 0, true));
                
            });
        });
};

var get_stack = function get_stack(stage, side) {
    if(side) {
        switch(stage) {
            case 0: return 3;
            case 1: return 5;
            case 2: return 1;
        }
    } else {
        switch(stage) {
            case 0: return 4;
            case 1: return 2;
            case 2: return 6;
        }
    }
}

var next_stage = function next_stage(stage, can_unlock) {
    if(stage >= 3) return finish_round();
    
    if(can_unlock) {
        unlocker.classList.add('active');
    }
    my_placeholder.classList.add('active');
    opponent_placeholder.classList.add('active');
    my_placeholder.classList.add('card' + get_stack(stage, true));
    opponent_placeholder.classList.add('card' + get_stack(stage, false));
    
    var opponent_promise = wait(3000).then(function() {
        var c;
        for(var i = 0; i < opponent_deck.length; ++i) {
            if(opponent_deck[i].classList.contains('played')) continue;
            break;
        }
        c = opponent_deck[i];
        for(; i < opponent_deck.length; ++i) {
            if(opponent_deck[i].classList.contains('played')) continue;
            if(stage == 1) {
                if(opponent_deck[i].attack + opponent_deck[i].defense < c.attack + c.defense)
                    c = opponent_deck[i];
            } else {
                if(opponent_deck[i].attack + opponent_deck[i].defense > c.attack + c.defense)
                    c = opponent_deck[i];
            }
        }
        c.classList.remove('hovered');
        c.classList.add('played');
        c.classList.add('reversed');
        var stack = get_stack(stage, false);
        table[stack - 1] = c;
        c.classList.add('card' + stack);
        new Audio('192277__lebcraftlp__click.mp3').play();
        opponent_placeholder.classList.remove('active');
        return wait(1000);// play(c, 'play_card 1s');
    });
    
    var player_promise = new Promise(function(resolve, reject) {
        var click_card = function click_card(e) {
            if(e.target === my_placeholder) {
                my_placeholder.classList.remove('active');
                document.removeEventListener('click', click_card);
                new Audio('192277__lebcraftlp__click.mp3').play();
                resolve();
            }
            if(hovered) {
                if(hovered.classList.contains('locked')) {
                    if(can_unlock) {
                        unlocker.classList.remove('active');
                        unlocker.style.left = '';
                        unlocker.style.bottom = '';
                        unlocker.style['z-index'] = 1;
                        can_unlock = false;
                        hovered.classList.remove('locked');
                    } else {
                        new Audio('118839__lovepanzer__skrang1.mp3').play();
                        //beep
                        return;
                    }
                }
                my_placeholder.classList.remove('active');
                document.removeEventListener('click', click_card);
                hovered.classList.remove('hovered');
                hovered.classList.add('played');
                var stack = get_stack(stage, true);
                table[stack - 1] = hovered;
                hovered.classList.add('card' + stack);
                play(hovered, 'play_card 1s').then(resolve);
                new Audio('192277__lebcraftlp__click.mp3').play();
                hovered = undefined;
            }
        };
        document.addEventListener('click', click_card);
    });
    
    return Promise.all([player_promise, opponent_promise]).then(wait.bind(undefined, 500)).then(function() {
        new Audio('56240__q-k__gong-center-clear.mp3').play();
        var stack = get_stack(stage, false);
        var card = table[stack - 1];
        if(card) card.classList.remove('reversed');
        
        my_placeholder.classList.remove('card' + get_stack(stage, true));
        opponent_placeholder.classList.remove('card' + get_stack(stage, false));
        
        return wait(500);
    }).then(function() {
        next_stage(stage+1, can_unlock);
    });
};

var start_game = function start_game() {
    
    change_background('wood.jpg');
    var cardWidth = innerWidth * 0.1;
    var cardHeight = cardWidth * 1.6539162112932604;
    
    document.body.classList.add('game');
    //music.set('Zapac_-_Test_Drive.mp3');
    for(var i = 0; i < opponent_deck.length; ++i) {
        var card = opponent_deck[i];
        card.style.left = i/(opponent_deck.length-1) * 90 + '%';
        document.body.appendChild(card);
    }
    for(i = 0; i < deck.length; ++i) {
        deck[i].classList.add('locked');
        document.body.appendChild(deck[i]);
        deck[i].style.left = i/(deck.length-1) * 90 + '%';
    }
    document.addEventListener('mousemove', hover_card);
    
    return next_stage(0, true);
};


var end_game = function end_game() {
    document.removeEventListener('mousemove', hover_card);
    my_score.classList.remove('card3');
    my_score.classList.remove('active');
    opponent_score.classList.remove('card4');
    opponent_score.classList.remove('active');
    for(var i = 0; i < deck.length; ++i) {
        deck[i].classList.remove('locked');
    }
    for(var i = 0; i < 6; ++i) {
        var c = table[i];
        if(c) {
            c.classList.remove('card' + (i+1));
            c.classList.remove('played');
            table[i] = undefined;
        }
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
    //begin();
    document.addEventListener('mousedown', advance, false);
    start_game();
});
