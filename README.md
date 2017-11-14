# TMNT React

[TMNT React](https://suhanw.github.io/tmnt_react)

This game is a simplified version of TMNT 4: Turtles in Time, a classic "beat 'em up" 2D scroller game on SNES. I utilized Redux to track character states, React and CSS to animate sprites and program the motion of characters.

## How to Play
Click [here](https://suhanw.github.io/tmnt_react). Press 'RIGHT' to move forward, 'UP' to jump, and 'SPACE' to attack.

## Features and Implementation

### Viewport that Centers on Turtle
![viewport](docs/readme/viewport.gif)

I used three components to setup the display frame:

- `Game` creates a `div` to define the frame width and height.
- `Viewport` is positioned `absolute` relative to `Game`
- `Stage` is a child of `Viewport`, renders the location/environment and is sized with the full width of the stage level (i.e., the full distance that the turtle may potentially travel). This is where the `Turtle` component lives.

Moving the `Turtle` is simply updating its absolute `left` position relative to `Stage`, which is tracked via Redux. `Viewport` listens for changes to the turtle's `left` value, and sets its own `left` position as the negative of the turtle's position, when the `Turtle` reaches at least 1/4 through the `Game` frame width. Because `Viewport` is positioned `absolute`, a negative `left` position would place it to the left of the `Game` frame, creating the illusion of panning from left to right. When the `Viewport` changes its position as the turtle changes its position, it "follows" the turtle.

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

To accomplish a combo attack, I use an array that tracks the number of times a player presses the 'attack' key. The `Turtle` component renders the appropriate sprites based on a set of conditions to determine if it's a combo attack.

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
    // resets if the subsequent keydown is not within half sec of the prev keydown
    attackSprite = 'attack-1';
    this.combo = [];
  }
  return attackSprite;
}
```

### Foot Soldier

While the event handlers for controls are defined in the `Turtle` component, the logic for the interaction between the `Turtle` and `Foot` soldiers lives in the `Foot` component. `Foot` is a Redux container that listens for changes to `Turtle` position and actions (i.e., move or attack). This would minimize the number of operations in the game as the `Turtle` does not have to keep track of all the `Foot` soldiers in front of it, and only the `Foot` nearest to the turtle would update and re-render.

![foot response](docs/readme/foot-response.gif)
- when `Turtle` approaches within a certain distance of a `Foot`, `Foot` is "activated" by moving forward and attacking.
- only the nearest `Foot` responds and re-renders when the `Turtle` approaches
- additionally, while every `Foot` listens for `Turtle` changes, any change to `Turtle` state does not cause a re-render to `Foot`
```JavaScript
shouldComponentUpdate(nextProps, nextState) {
  //re-render only if foot React state VALUES changed (i.e., ignore turtle state changes)
  if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
    return true;
  }
  return false;
}
```

![turtle attack](docs/readme/turtle-attack.gif)
- `Foot` listens for `Turtle` attacks, and reduces health when the attack lands within the `Foot`'s hitbox
```JavaScript
if (turtle.doing.includes('attack') && hasHorizontalCollision(turtle, foot)) {
  playSound("strike");
  if (this.timeout) {
    clearTimeout(this.timeout); //stops foot from 'recovering from punch'
    this.timeout = null;
  }
  if (this.footAttackInterval) {
    clearTimeout(this.footAttackInterval); //stops foot from attacking
    this.footAttackInterval = null;
  }
  if (this.footWalkingInterval) {
    clearTimeout(this.footWalkingInterval); //stops foot from walking forward
    this.footWalkingInterval = null;
  }
  newFoot = merge({}, foot);
  if (newFoot.health > 0) { // to stop reducing health after foot's health is negative
    newFoot.health -= TURTLE_ATTACK_DAMAGE;
  }
  this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
  this.setState(newFoot); //reduce foot's React health
}
```

## Future Directions
- Add option to select any of the 4 turtles
- Jump attack
- Boss level
