
var compile = function compile(data) {
    if(typeof data === 'object') {
        if(Array.isArray(data)) {
            var compiled = data.map(compile);
            if(Array.isArray(compiled[0])) {
                return Array.prototype.concat.apply([], compiled);
            }
            return compiled;
        } else {
            var array_key;
            for(var key in data) {
                data[key] = compile(data[key]);
                if(Array.isArray(data[key]))
                    array_key = key;
            }
            if(array_key) {
                return data[array_key].map(function assemble(elem) {
                    var r = {};
                    for(var key in data) {
                        if(key.startsWith('_')) {
                            for(var inner_key in elem) {
                                r[inner_key] = elem[inner_key];
                            }
                        } else {
                            r[key] = (key === array_key ? elem : data[key]);
                        }
                    }
                    return r;
                });
            } else {
                return data;
            }
        }
    } else {
        return data;
    }
};
