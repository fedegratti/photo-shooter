import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { HomeSceneController } from './HomeSceneController';
import { HomeTransitionController } from './HomeTransitionController';

import { ViewManager } from 'ohzi-core';
import home_data from '../../../data/transitions/home.json';
import { FaceLandmarkerController } from '../../components/FaceLandmarkerController';
import { Input } from '../../components/Input';
import { SmileDetector } from '../../components/SmileDetector';
import { Settings } from '../../Settings';

export class HomeView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.HOME,
      url: SectionsURLs.HOME,
      container: document.querySelector('.home'),
      transition_data: home_data
    });

    this.scene_controller = new HomeSceneController();
    this.transition_controller = new HomeTransitionController();
  }

  get scene()
  {
    return this.scene_controller.scene;
  }

  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();

    this.face_landmarker_controller = new FaceLandmarkerController(this);
    this.face_landmarker_controller.start();

    this.webcam = document.querySelector('.home__webcam');
    this.webcam_overlay = document.querySelector('.home__output-canvas');

    this.modal = document.querySelector('.home__modal');

    this.previous_pictures = document.querySelector('.home__previous-pictures-list');

    this.start_button = document.querySelector('.home__webcam-button');
  }

  before_enter()
  {
    super.before_enter();

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();

    this.get_last_pictures();
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();

    this.start_button.click();
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

    if (SmileDetector.smiling)
    {
      ViewManager.go_to_view(Sections.SHOOTING, false);
    }

    if (Input.keyboard.is_key_released('Enter') ||
        Input.keyboard.is_key_released('Space') ||
        Input.keyboard.is_key_released('ArrowRight') ||
        Input.keyboard.is_key_released('ArrowLeft') ||
        Input.clicked)
    {
      ViewManager.go_to_view(Sections.SHOOTING, false);
    }
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  set_face_data(data)
  {
    SmileDetector.set_data(data);
  }

  begin()
  {
    this.modal.classList.add('hidden');

    this.webcam.classList.remove('hidden');
    this.webcam_overlay.classList.remove('hidden');

    // More stuff is happening on FaceLandmarkerController
  }

  on_last_pictures(response)
  {
    response.json().then((body) =>
    {
      console.log(body);
      this.previous_pictures.innerHTML = '';

      for (let i = body.Files.length - 1; i >= body.Files.length - 3; i--)
      {
        const file = body.Files[i];

        const picture_container = document.createElement('div');
        picture_container.classList.add('home__previous-pictures-item');

        const picture = document.createElement('img');
        picture.src = `${Settings.digicam_url}/thumb/large/${file.Id}.jpg`;
        picture.style.transform = `rotate(${file.RotationAngle}deg)`;
        picture_container.appendChild(picture);

        this.previous_pictures.appendChild(picture_container);
      }
    });
  }
}
