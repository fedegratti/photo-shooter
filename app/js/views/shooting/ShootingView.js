import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { ShootingSceneController } from './ShootingSceneController';
import { ShootingTransitionController } from './ShootingTransitionController';

import { Time, ViewManager } from 'ohzi-core';
import shooting_data from '../../../data/transitions/shooting.json';
import { Settings } from '../../Settings';

class ShootingView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.SHOOTING,
      url: SectionsURLs.SHOOTING,
      container: document.querySelector('.shooting'),
      transition_data: shooting_data
    });

    this.scene_controller = new ShootingSceneController();
    this.transition_controller = new ShootingTransitionController();
  }

  get scene()
  {
    return this.scene_controller.scene;
  }

  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();

    this.countdown_text_1 = document.querySelector('.shooting__countdown-text--1');
    this.countdown_text_2 = document.querySelector('.shooting__countdown-text--2');
    this.countdown_text_3 = document.querySelector('.shooting__countdown-text--3');
    this.countdown_text_loading = document.querySelector('.shooting__countdown-text--loading');
  }

  before_enter()
  {
    super.before_enter();

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();

    this.preview_t = 0;
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();

    // RequestManager.get(`${Settings.digicam_url}/?CMD=Capture`, this.on_capture.bind(this));

    fetch(`${Settings.digicam_url}/?CMD=Capture`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow' // manual, *follow, error
    })
      .then(this.on_capture.bind(this))
      .catch(this.on_error.bind(this));
  }

  before_exit()
  {
    super.before_exit();

    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  on_exit()
  {
    super.on_exit();

    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();

    this.preview_t += Time.delta_time;

    if (this.preview_t > 3)
    {
      this.preview_t = 0;

      ViewManager.go_to_view(Sections.PREVIEW, false);
    }
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.countdown_text_1.style.opacity = global_view_data.countdown_text_1_opacity;
    this.countdown_text_2.style.opacity = global_view_data.countdown_text_2_opacity;
    this.countdown_text_3.style.opacity = global_view_data.countdown_text_3_opacity;
    this.countdown_text_loading.style.opacity = global_view_data.countdown_text_loading_opacity;
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  on_capture()
  {
    console.log('capture');
  }

  on_error(response)
  {
    console.warn(response);
  }
}

export { ShootingView };
