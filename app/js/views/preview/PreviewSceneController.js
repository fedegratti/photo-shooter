import { SceneManager, ViewManager } from 'ohzi-core';
import { Sections } from '../Sections';

// import { PreviewScene } from '../../scenes/PreviewScene';

class PreviewSceneController
{
  constructor()
  {
  }

  start()
  {
    // Use this line to reuse HomeScene
    this.scene = ViewManager.get(Sections.HOME).scene;

    // Use this line to use own scene
    // this.scene = new PreviewScene();
  }

  before_enter()
  {
    this.scene.setup_camera();

    SceneManager.current = this.scene;
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
    this.scene.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }
}

export { PreviewSceneController };
