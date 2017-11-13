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

```JavaScript
componentWillReceiveProps(newProps) {
  const {turtle: {pos: {left}}} = newProps;
  let newLeft;
  if (left > (FRAME_WIDTH / 4)) {
    newLeft = left * (-1) + (FRAME_WIDTH / 4);
  }
  this.setState({left: newLeft});
}
```

### Turtle Combo Attack
![combo attack](docs/readme/combo-attack.gif)

To accomplish a combo attack, I use an array that tracks the number of times a player presses the 'attack' key. Then the `Turtle` component renders the appropriate sprites based on a set of conditionals to determine if it's a combo attack.

```JavaScript
setComboAttackSprite() {
  let attackSprite;
  if (this.combo.length === 1) {
    attackSprite = 'attack-1';
  } else if (this.combo.length === 2 &&  
             this.combo[1] - this.combo[0] < 450) {
    // if it's the second keydown & duration betw key presses is less than half sec, render the second attack sprite
    attackSprite = 'attack-2';
  } else if (this.combo.length === 3 &&
             this.combo[2] - this.combo[1] < 450) {
     // if it's the third keydown & duration betw key presses is less than half sec, render the third attack sprite
    attackSprite = 'attack-3';
    this.combo = [];
  } else {
    // resets if the subsequent keydown is not within half sec
    attackSprite = 'attack-1';
    this.combo = [];
  }
  return attackSprite;
}
```

### Foot soldier

While the event handlers for controls are defined in the `Turtle` component, the logic for the interaction between `Turtle` and `Foot` soldiers lives in the `Foot` component. `Foot` is a Redux container that listens for changes to `Turtle` position and actions (i.e., move or attack).

![foot response](docs/readme/foot-response.gif)
- when `Turtle` approaches within a certain distance of a `Foot`, `Foot` is "activated", moves forward, and attacks.
- `Foot` listens for `Turtle` attacks and reduces health when the attack lands within the `Foot` hitbox
- Only the nearest `Foot` responds and re-renders when `Turtle` approaches. Additionally, while every `Foot` listens for `Turtle` changes, every change to `Turtle` does not cause a re-render to `Foot`. 

## Future Directions
- Add option to select any of the 4 turtles
- Jump attack
- Boss level
