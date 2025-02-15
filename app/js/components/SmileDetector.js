import { Time } from 'ohzi-core';

class SmileDetector
{
  constructor()
  {
    // // Visemes properties parameterized with Tasks-Vision Blend Shapes
    // this.visemes_parameterized = {
    //   viseme_sil: ['_neutral'],
    //   viseme_aa: ['jawOpen'],
    //   viseme_O: ['mouthPucker'],
    //   viseme_U: ['mouthFunnel'],
    //   viseme_E: ['mouthSmileLeft', 'mouthSmileRight'],
    //   viseme_I: ['mouthUpperUpLeft', 'mouthUpperUpRight'],
    //   viseme_PP: ['jawForward', 'mouthPressLeft', 'mouthPressRight'],
    //   viseme_FF: ['mouthRollUpper', 'mouthRollLower'],
    //   viseme_TH: ['mouthShrugUpper', 'mouthShrugLower'],
    //   viseme_nn: ['mouthClose'],
    //   viseme_DD: ['mouthLowerDownLeft', 'mouthLowerDownRight'],
    //   viseme_RR: ['mouthStretchLeft', 'mouthStretchRight'],
    //   viseme_SS: ['mouthFrownLeft', 'mouthFrownRight'],
    //   viseme_kk: ['jawLeft', 'jawRight'],
    //   viseme_CH: ['mouthDimpleLeft', 'mouthDimpleRight'],
    //   // mouthOpen: ['jawOpen'],
    //   // mouthSmile: ['mouthSmileLeft', 'mouthSmileRight'],
    //   eyesClosed: ['eyeBlinkLeft', 'eyeBlinkRight'],
    //   eyesLookUp: ['eyeLookUpLeft', 'eyeLookUpRight'],
    //   eyesLookDown: ['eyeLookDownLeft', 'eyeLookDownRight'],

    //   // To rotate camera
    //   headLeft: ['eyeLookInLeft'], //, 'eyeLookOutRight'
    //   headRight: ['eyeLookInRight'] // 'eyeLookOutLeft',
    // };

    this.categories = ['mouthSmileLeft', 'mouthSmileRight'];

    this.data = undefined;
    this.smile_threshold = 0;
    this.smiling = false;
    this.smiling_t = 0;
  }

  set_data(data)
  {
    this.data = data;
  }

  get_data_of_category(tasks_vision_parameter)
  {
    for (let i = 0; i < this.data.length; i++)
    {
      const category = this.data[i];

      if (category.categoryName === tasks_vision_parameter)
      {
        return category.score;
      }
    }

    return 0;
  }

  update()
  {
    if (this.data)
    {
      let smile_threshold = 0;

      for (let i = 0; i < this.categories.length; i++)
      {
        const category = this.categories[i];

        const data = this.get_data_of_category(category);

        smile_threshold += data;
      }

      const normalized_smile_threshold = smile_threshold / this.categories.length;

      // console.log('smile_threshold', normalized_smile_threshold);

      if (!this.smiling)
      {
        if (normalized_smile_threshold > 0.7)
        {
          this.smiling = true;
          this.smiling_t = 0;

          console.log('smiling');
        }
      }

      if (this.smiling)
      {
        this.smiling_t += Time.delta_time;

        if (this.smiling_t > 1)
        {
          this.smiling = false;

          console.log('not smiling');
        }
      }
    }
  }
}

const smile_detector = new SmileDetector();
export { smile_detector as SmileDetector };
