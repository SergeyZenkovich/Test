import Phaser from 'phaser';
import eventsCenter from '../eventsCenter';

function intrefaceTestInLevel(context) {
  let count = 0;
  let health = 100;
  let bullets = 6;

  context.input.keyboard.on('keydown_SPACE', () => {
    count += 1;
    if (health === 0) {
      health = 100;
    } else {
      health -= 10;
    }
    if (bullets === 0) {
      bullets = 6;
    } else {
      bullets -= 1;
    }
    eventsCenter.emit('update-health', count);
    eventsCenter.emit('update-health-bar', health);
    eventsCenter.emit('update-magazine', bullets);
  });
}

function intarfaceTestInGameBar(context) {
  eventsCenter.on('update-health', context.updateHealth, context);
  eventsCenter.on('update-health-bar', context.updateHealthBar, context);
  eventsCenter.on('update-magazine', context.updateMagazine, context);

  context.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    eventsCenter.off('update-health', this.updateHealth, this);
    eventsCenter.off('update-health-bar', this.updateHealthBar, this);
  });
}

export { intrefaceTestInLevel, intarfaceTestInGameBar };
