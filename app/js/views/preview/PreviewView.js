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

    this.last_picture_id = 0;
  }

  before_enter()
  {
    super.before_enter();

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();

    // this.preview_img.src = `${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`;
    // this.create_qr(`${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`);

    this.restarting_t = 0;
    this.restarting_text.innerHTML = '';

    this.preview_image_t = 0;

    this.revealing.classList.remove('hidden');
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();

    this.get_last_pictures();
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

    this.revealing.classList.remove('hidden');
  }

  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();

    // this.update_preview_image();

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

    // this.revealing.style.opacity = global_view_data.preview_revealing_opacity;

    // this.update_preview_image();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  // update_preview_image()
  // {
  //   this.preview_image_t += Time.delta_time;

  //   if (this.preview_image_t > 0.5)
  //   {
  //     this.preview_image_t = 0;
  //     this.preview_img.src = `${Settings.digicam_url}/preview.jpg?rand=${Math.random()}`;
  //   }
  // }

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

  on_last_pictures(response)
  {
    response.json().then((body) =>
    {
      const file = body.Files[body.Files.length - 1];

      console.log(file.Id, this.last_picture_id);
      // if (file.Id !== this.last_picture_id)
      // {
      //   this.last_picture_id = file.Id;

      //   setTimeout(() =>
      //   {
      //     this.get_last_pictures();
      //   }, 1000);

      //   return;
      // }

      const image_url = `${Settings.digicam_url}/thumb/large/${file.Id}.jpg`;
      // const image_url_from_server = `${Settings.server_url}/image/${file.Id}`;

      this.preview_img.dataset.src = image_url;
      this.preview_img.src = `${image_url}?rand=${Math.random()}`;

      this.preview_img.onerror = () =>
      {
        // this.preview_img.src = 'images/common/loading.gif';
        // this.revealing.classList.remove('hidden');
        console.log('retrying');

        setTimeout(() =>
        {
          this.preview_img.src = `${image_url}?rand=${Math.random()}`;
        }, 500);
      };

      this.preview_img.onload = () =>
      {
        this.revealing.classList.add('hidden');
      };

      // this.create_qr(image_url);

      // this.imageToBase64(image_url_from_server).then(base64String =>
      // {
      //   console.log(base64String);
      //   this.create_qr(base64String);
      // });
    });
  }

  async imageToBase64(url)
  {
    try
    {
      // Fetch the image as a blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a FileReader to convert the blob to a Base64 string
      const reader = new FileReader();

      // Return a promise that resolves when the image is successfully converted
      return new Promise((resolve, reject) =>
      {
        reader.onloadend = () =>
        {
          // The result is the Base64 string of the image
          resolve(reader.result.split(',')[1]); // Extract Base64 string part
        };

        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    catch (error)
    {
      console.error('Error converting image to Base64:', error);
    }
  }
}

export { PreviewView };
