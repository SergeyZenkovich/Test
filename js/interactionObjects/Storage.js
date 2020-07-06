import InteractionObject from './InteractionObject';

const textConfig = {
  fontFamily: 'font1',
  fontSize: 6,
};

export default class Storage extends InteractionObject {
  constructor(config) {
    super(config);
    this.items = config.items;

    const offset = (this.afterActionImage.width - this.width) / 2;
    this.afterActionImage.setX(this.x + offset);
    this.interactionInfo.type = 'storage';
    this.interactionInfo.items = config.items;
  }

  generateText() {
    const items = this.items.reduce((res, item) => `${res + item.name}\n`, '');
    const quantities = this.items.reduce((res, item) => `${res + this.generateQuantityText(item)}\n`, '');
    const itemsText = this.scene.add.text(0, 0, items, textConfig);
    itemsText.setResolution(10);
    itemsText.setOrigin(0.5);
    const quantityText = this.scene.add.text(
      itemsText.width, 0, quantities, textConfig,
    );
    quantityText.setResolution(10);
    quantityText.setOrigin(0.5);
    return [itemsText, quantityText];
  }


  // eslint-disable-next-line class-methods-use-this
  generateQuantityText(item) {
    if (item.unit) {
      return item.unit.position === 'before' ? item.unit.sign + item.quantity
        : item.quantity + item.unit.sign;
    }
    return item.quantity;
  }

  interact() {
    const info = this.interactionInfo;
    if (this.afterActionImage) {
      this.afterActionImage.setVisible(true);
    }

    const textItems = this.generateText();
    const container = this.scene.add.container(this.x, this.y - 10, textItems);
    const timeline = this.scene.tweens.createTimeline();

    timeline.add({
      targets: container,
      y: container.y - 20,
      duration: 500,
    });
    timeline.add({
      targets: container,
      alpha: 0,
      duration: 500,
      delay: 2000,
    });

    timeline.play();
    timeline.onComplete = () => { container.destroy(); };

    this.destroy(this.scene);
    return info;
  }
}
