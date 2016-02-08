ui-builder
===

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

For convenience, a Builder implementation is also provided for the DOM, however
the immutability of the resulting DOM element cannot be guaranteed or expected.

ui-builder is heavily optimized for speed, and to contain as lightweight of a
footprint as possible, citing only React as it's only dependency, with React
Native being an optional dependency.

Inspired by, obviously, the builder pattern. Not directly inspired by Uber's
[r-dom](https://github.com/uber/r-dom), but somewhat similar in syntax.
