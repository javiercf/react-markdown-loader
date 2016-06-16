(function() {
  var composer, constructor, dumper, errors, events, fs, loader, nodes, parser, reader, resolver, scanner, tokens, util;

  composer = require('./composer');

  constructor = require('./constructor');

  dumper = require('./dumper');

  errors = require('./errors');

  events = require('./events');

  loader = require('./loader');

  nodes = require('./nodes');

  parser = require('./parser');

  reader = require('./reader');

  resolver = require('./resolver');

  scanner = require('./scanner');

  tokens = require('./tokens');

  util = require('./util');


  /*
  Scan a YAML stream and produce scanning tokens.
   */

  this.scan = function(stream, Loader) {
    var _loader, results;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    results = [];
    while (_loader.check_token()) {
      results.push(_loader.get_token());
    }
    return results;
  };


  /*
  Parse a YAML stream and produce parsing events.
   */

  this.parse = function(stream, Loader) {
    var _loader, results;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    results = [];
    while (_loader.check_event()) {
      results.push(_loader.get_event());
    }
    return results;
  };


  /*
  Parse the first YAML document in a stream and produce the corresponding
  representation tree.
   */

  this.compose = function(stream, Loader) {
    var _loader;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    return _loader.get_single_node();
  };


  /*
  Parse all YAML documents in a stream and produce corresponding representation
  trees.
   */

  this.compose_all = function(stream, Loader) {
    var _loader, results;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    results = [];
    while (_loader.check_node()) {
      results.push(_loader.get_node());
    }
    return results;
  };


  /*
  Parse the first YAML document in a stream and produce the corresponding
  Javascript object.
   */

  this.load = function(stream, Loader) {
    var _loader;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    return _loader.get_single_data();
  };


  /*
  Parse all YAML documents in a stream and produce the corresponing Javascript
  object.
   */

  this.load_all = function(stream, Loader) {
    var _loader, results;
    if (Loader == null) {
      Loader = loader.Loader;
    }
    _loader = new Loader(stream);
    results = [];
    while (_loader.check_data()) {
      results.push(_loader.get_data());
    }
    return results;
  };


  /*
  Emit YAML parsing events into a stream.
  If stream is falsey, return the produced string instead.
   */

  this.emit = function(events, stream, Dumper, options) {
    var _dumper, dest, event, i, len;
    if (Dumper == null) {
      Dumper = dumper.Dumper;
    }
    if (options == null) {
      options = {};
    }
    dest = stream || new util.StringStream;
    _dumper = new Dumper(dest, options);
    try {
      for (i = 0, len = events.length; i < len; i++) {
        event = events[i];
        _dumper.emit(event);
      }
    } finally {
      _dumper.dispose();
    }
    return stream || dest.string;
  };


  /*
  Serialize a representation tree into a YAML stream.
  If stream is falsey, return the produced string instead.
   */

  this.serialize = function(node, stream, Dumper, options) {
    if (Dumper == null) {
      Dumper = dumper.Dumper;
    }
    if (options == null) {
      options = {};
    }
    return exports.serialize_all([node], stream, Dumper, options);
  };


  /*
  Serialize a sequence of representation tress into a YAML stream.
  If stream is falsey, return the produced string instead.
   */

  this.serialize_all = function(nodes, stream, Dumper, options) {
    var _dumper, dest, i, len, node;
    if (Dumper == null) {
      Dumper = dumper.Dumper;
    }
    if (options == null) {
      options = {};
    }
    dest = stream || new util.StringStream;
    _dumper = new Dumper(dest, options);
    try {
      _dumper.open();
      for (i = 0, len = nodes.length; i < len; i++) {
        node = nodes[i];
        _dumper.serialize(node);
      }
      _dumper.close();
    } finally {
      _dumper.dispose();
    }
    return stream || dest.string;
  };


  /*
  Serialize a Javascript object into a YAML stream.
  If stream is falsey, return the produced string instead.
   */

  this.dump = function(data, stream, Dumper, options) {
    if (Dumper == null) {
      Dumper = dumper.Dumper;
    }
    if (options == null) {
      options = {};
    }
    return exports.dump_all([data], stream, Dumper, options);
  };


  /*
  Serialize a sequence of Javascript objects into a YAML stream.
  If stream is falsey, return the produced string instead.
   */

  this.dump_all = function(documents, stream, Dumper, options) {
    var _dumper, dest, document, i, len;
    if (Dumper == null) {
      Dumper = dumper.Dumper;
    }
    if (options == null) {
      options = {};
    }
    dest = stream || new util.StringStream;
    _dumper = new Dumper(dest, options);
    try {
      _dumper.open();
      for (i = 0, len = documents.length; i < len; i++) {
        document = documents[i];
        _dumper.represent(document);
      }
      _dumper.close();
    } finally {
      _dumper.dispose();
    }
    return stream || dest.string;
  };


  /*
  Register .yml and .yaml requires with yaml-js
   */

  if (typeof require !== "undefined" && require !== null ? require.extensions : void 0) {
    fs = require('fs');
    require.extensions['.yml'] = require.extensions['.yaml'] = function(module, filename) {
      return module.exports = exports.load_all(fs.readFileSync(filename, 'utf8'));
    };
  }

}).call(this);
