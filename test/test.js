import test from 'ava';

import cheerio from 'cheerio';
import { renderToStaticMarkup } from 'react-dom/server';

import { R } from '../react';

let c = R('div')
  .style('backgroundColor', 'red')
  ('style', {
    color: 'blue'
  })
  ({
    style: {
      borderColor: 'white'
    }
  })
  ('className', 'test')
  .prop('className', 'test2')
  .child(R('span').child('Hello World!'))
  .children([
    'Test'
  ]);

c = c.build();

let str = renderToStaticMarkup(c);
let $ = cheerio.load(str);

var test2 = $('.test2');

test('react#prop', t => {
  t.same(test2.hasClass('test2'), true);
});

test('react#style', t => {
  t.same(test2.css('background-color'), 'red');
  t.same(test2.css('color'), 'blue');
  t.same(test2.css('border-color'), 'white');
});

test('react#child/#children', t => {
  t.same(test2.children().length, 1);
  t.same(test2.children().first().is('span'), true);

  t.same(test2.children().first().children().length, 0);
  t.same(test2.children().first().text(), 'Hello World!');
  t.same(test2.text(), 'Hello World!Test');
});

test('react.isBuilder', t => {
  t.same(R('div').isBuilder, 'react');
});
