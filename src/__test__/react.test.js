// Link.react-test.js
import React from 'react';
import Game from '../Game';
import renderer from 'react-test-renderer';

test('check board looks good', () => {
    const component = renderer.create(
        <Game/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});