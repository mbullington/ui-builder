// this file exists because react and react-native currently do not share
// packages, as of React 0.14 (Nov 2015). You could also easily swap in a
// React API compatible alternative, if you'd like.

function forEach(obj, cb) {
  var keys = Object.keys(obj);

  var index = 0;
  var length = keys.length;

  for(; index < length; index++) {
    cb(obj[keys[index]], keys[index]);
  }
}

function assign(dest) {
  var count = 1;
  var length = arguments.length;

  for(; count < length; count++) {
    var arg = arguments[count];

    for(var prop in arg) {
      if(arg.hasOwnProperty(prop)) {
        dest[prop] = arg[prop];
      }
    }
  }
  return dest;
}

function typeOf(value) {
  var returned = Object.prototype.toString.call(value);
  return returned.substring(1, returned.length - 1).split(' ')[1].toLowerCase();
}

module.exports = function(React, flattenStyle) {
  flattenStyle = flattenStyle == null ? false : flattenStyle;
  var REACT_BUILDER = {
    isBuilder: 'react',
    prop: function(name, value) {
      if(!name)
        throw new Error('ui-builder/react#prop called without any arguments!');

      if(name == 'style') {
        assign(this.propObj.style, value);
        return;
      }

      if(value != null) {
        this.propObj[name] = value;
      } else {
        if(typeOf(name) != 'object')
          throw new Error('ui-builder/react#prop has an invalid first argument.');

        if(name.style) {
          assign(this.propObj.style, name.style);
          delete name.style;
        }

        assign(this.propObj, name);
      }

      return this;
    },
    style: function(name, value) {
      if(!name)
        throw new Error('ui-builder/react#style called without any arguments!');

      if(value != null) {
        this.propObj.style[name] = value;
      } else {
        if(typeOf(name) != 'object')
          throw new Error('ui-builder/react#style has an invalid first argument.');
        assign(this.propObj.style, name);
      }

      return this;
    },
    child: function(child) {
      if(!child)
        return this;

      if(arguments.length == 1) {
        this.childList.push(child);
        return this;
      }

      var index = 0;
      var length = arguments.length;
      var args = [];

      for(; index < length; index++) {
        args.push(arguments[index]);
      }

      this.childList = this.childList.concat(args);
      return this;
    },
    children: function(children) {
      if(!children || children.length === 0)
        return this;

      this.childList = this.childList.concat(children);
      return this;
    },
    build: function() {
      var newProps = {};

      forEach(this.propObj, function(value, key) {
        if(key == 'style' && flattenStyle) {
          var newStyle = '';
          forEach(value, function(styleValue, styleKey) {
            newStyle += styleKey + ':' + styleValue + ';';
          });
          newProps[key] = newStyle;
        } else {
          newProps[key] = value;
        }
      });

      var childListLength = this.childList.length;
      if(childListLength == 0) {
        return React.createElement(this.component, newProps);
      } if(childListLength == 1) {
        var el = this.childList[0];
        if(el.isBuilder && el.isBuilder === 'react' && el.build)
          el = el.build();
        return React.createElement(this.component, newProps, el);
      } if(childListLength > 1) {
        var args = [
          this.component,
          newProps
        ];

        var index = 0;
        var length = this.childList.length;

        for(; index < length; index++) {
          var el = this.childList[index];
          if(el.isBuilder && el.isBuilder === 'react' && el.build)
            el = el.build();
          args[index + 2] = el;
        }

        return React.createElement.apply(React, args);
      }
    }
  };

  return {
    R: function(component) {
      if(!component)
        throw new Error("ui-builder/react requires a component in it's constructor!");

      var builder = function(name, value) {
        builder.prop(name, value);
        return builder;
      };

      builder.component = component;
      builder.propObj = {
        style: {}
      };
      builder.childList = [];

      assign(builder, REACT_BUILDER);
      return builder;
    }
  };
};
