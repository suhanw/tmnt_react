# TMNT React

[TMNT React](https://suhanw.github.io/tmnt_react)

This game is a simplified version of TMNT 4: Turtles in Time, which is a classic "beat 'em up" 2D scroller game on SNES. It utilizes Redux to track character states, React and CSS to animate sprites and program the motion of characters.

## How to Play
Click [here](https://suhanw.github.io/tmnt_react). Press 'RIGHT' to move forward, 'UP' to jump, and 'SPACE' to attack.

## Features and Implementation

### Viewport that follows Turtle
![viewport](docs/readme/viewport.gif)
I used three components to setup the display frame:

- `Game` creates a `div` sized with the frame width and height.
- `Viewport` is positioned `absolute` relative to `Game`
- `Stage` is a child of `Viewport`, and is sized with the full width of the stage level (i.e., the full distance that the turtle may potentially travel). This is where the `Turtle` component lives.

Moving the `Turtle` is simply updating its absolute `x` position relative to `Stage`, which is tracked via Redux. `Viewport` listens for changes to the Redux `x` value, and subtracts it against its own absolute `x` position relative to `Game`, when the `Turtle` reaches at least 1/4 through the `Game` frame. As a result, the `Viewport` "follows" the turtle.

```ruby
componentWillReceiveProps(newProps) {
  const {turtle: {pos: {left}}} = newProps;
  let newLeft;
  // viewport only starts panning when turtle is 1/4 into the viewport
  if (left > (FRAME_WIDTH / 4)) {
    newLeft = left * (-1) + (FRAME_WIDTH / 4);
  }
  this.setState({left: newLeft});
}
```

### Combo Attack
![combo attack](docs/readme/combo-attack.gif)



## Future Directions
- Add option to select any of the 4 turtles
- Jump attack
- Boss level
