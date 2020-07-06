import Door from '../interactionObjects/Door';
import Storage from '../interactionObjects/Storage';
import Lid from '../interactionObjects/Lid';


import { interactionObjectsData } from '../data/level0';

const setInteractionObjects = (context) => {
  // eslint-disable-next-line no-unused-vars
  let object = new Door({
    scene: context, x: 189, y: 178, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 278, y: 193, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 398, y: 193, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 525, y: 193, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 526, y: 251, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 419, y: 251, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 775, y: 193, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 767, y: 251, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 858, y: 251, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 948, y: 280, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 958, y: 330, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Door({
    scene: context, x: 844, y: 330, beforeTexture: 'door', afterTexture: 'door_',
  });
  object = new Lid({
    scene: context, x: 486, y: 206, beforeTexture: 'lid',
  });
  object = new Lid({
    scene: context, x: 791, y: 264, beforeTexture: 'lid',
  });
  object = new Lid({
    scene: context, x: 646, y: 293, beforeTexture: 'lid',
  });
  object = new Storage({
    scene: context, x: 165, y: 175, beforeTexture: 'locker', afterTexture: 'locker_', items: interactionObjectsData.locker1,
  });
  object = new Storage({
    scene: context, x: 360, y: 202, beforeTexture: 'deadBody1', afterTexture: 'deadBody1', items: interactionObjectsData.deadBody1,
  });
  object = new Storage({
    scene: context, x: 1100, y: 360, beforeTexture: 'deadBody2', afterTexture: 'deadBody2', items: interactionObjectsData.deadBody2,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { setInteractionObjects };
