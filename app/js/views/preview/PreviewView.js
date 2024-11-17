import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { PreviewSceneController } from './PreviewSceneController';
import { PreviewTransitionController } from './PreviewTransitionController';

import preview_data from '../../../data/transitions/preview.json';
import { Settings } from '../../Settings';

import { Time, ViewManager } from 'ohzi-core';
import QRCode from 'qrcode';

class PreviewView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.PREVIEW,
      url: SectionsURLs.PREVIEW,
      container: document.querySelector('.preview'),
      transition_data: preview_data
    });

    this.scene_controller = new PreviewSceneController();
    this.transition_controller = new PreviewTransitionController();
  }

  get scene()
  {
    return this.scene_controller.scene;
  }

  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();

    this.revealing = document.querySelector('.preview__revealing');
    this.preview_img = document.querySelector('.preview__img');

    this.qr_container = this.container.querySelector('.preview__qr');

    this.restarting_text = document.querySelector('.preview__restarting-text');
  }

  before_enter()
  {
    super.before_enter();

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();

    this.preview_img.src = `${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`;
    this.create_qr(`${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`);

    this.restarting_t = 0;
    this.restarting_text.innerHTML = '';

    this.preview_image_t = 0;
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
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

    this.update_preview_image();

    this.restarting_t += Time.delta_time;

    if (this.restarting_t > 10)
    {
      this.restarting_text.innerHTML = `Reiniciando en ${Math.floor(21 - this.restarting_t)}...`;

      if (this.restarting_t > 20)
      {
        this.restarting_t = 0;

        ViewManager.go_to_view(Sections.HOME, false);
      }
    }
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.revealing.style.opacity = global_view_data.preview_revealing_opacity;

    this.update_preview_image();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_preview_image()
  {
    this.preview_image_t += Time.delta_time;

    if (this.preview_image_t > 0.5)
    {
      this.preview_image_t = 0;
      this.preview_img.src = `${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`;
    }
  }

  create_qr(url)
  {
    this.qr_container.innerHTML = '';

    QRCode.toDataURL(url)
      .then(url =>
      {
        const img = document.createElement('img');
        img.src = url;

        this.qr_container.appendChild(img);
      })
      .catch(err =>
      {
        console.error(err);
      });
  }
}

export { PreviewView };
