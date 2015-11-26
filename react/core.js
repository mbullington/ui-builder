// this file exists because react and react-native currently do not share
// packages, as in React 0.14. It also handles style differently, where
// browser React flattens it to CSS.

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

module.exports = function(React, flattenStyle) {
  flattenStyle = flattenStyle || true;
  var REACT_BUILDER = {
    prop: function(name, value) {
      if(name == 'style') {
        assign(this.propObj.style, name);
        return;
      }
      this.propObj[name] = value;
      return this;
    },
    style: function(name, value) {
      if(value !== undefined) {
        this.propObj.style[name] = value;
      } else {
        assign(this.propObj.style, name);
      }
      return this;
    },
    child: function(child) {
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
        return React.createComponent(this.component, newProps);
      } if(childListLength == 1) {
        return React.createComponent(this.component, newProps, this.childList[0]);
      } if(childListLength > 1) {
        var args = [
          this.component,
          newProps
        ];

        var index = 0;
        var length = this.childList.length;

        for(; index < length; index++) {
          args[index + 2] = this.childList[index];
        }

        return React.createComponent.apply(React, args);
      }
    }
  };

  return {
    R: function(component) {
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
