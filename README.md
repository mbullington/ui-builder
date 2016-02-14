ui-builder [![Build Status](https://travis-ci.org/mbullington/ui-builder.svg?branch=master)](https://travis-ci.org/mbullington/ui-builder)
===

```js
import React, { Component } from 'react';
import { R } from 'ui-builder';

export class TestComponent extends Component {
  render() {
    return R('div')
      // function call is same as .prop
      ('className', 'my-little-div-test')
      // .style is automatically passed to component as style prop
      .style('color', 'red')
      .child(R('span')
        .child('Hello World!'))
      // build only needs to be called on top level
      .build();
  }
}
```

ui-builder is an implementation of the Builder pattern to create UI elements for
React, React Native, and vanilla DOM (in the future).

When used with React, Builders provide beyond a suitable replacement for JSX,
but also a new paradigm that can be used to supercharge your application.

A builder, as specified by the builder pattern, is completely mutable. You
can change it's properties, styles, or children at any time. However, once you
build a builder, the built object is immutable. This has an incredible amount
of real world opportunities inside applications using a React workflow, where
you can "lazily" load in properties, or load in properties as they are scoped,
in the case of something like a router.

ui-builder is optimized to be fast, and tries to contain as lightweight of a
footprint as possible, citing only React and React Native as peer dependencies
(it's assumed if you are using ui-builder, you'll have one of these included
with your project as well).

Inspired by, obviously, the builder pattern. Not directly inspired by Uber's
[r-dom](https://github.com/uber/r-dom), but somewhat similar in syntax.
