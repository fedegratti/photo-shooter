import { DrawingUtils, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export class FaceLandmarkerController
{
  constructor(home_view)
  {
    this.runningMode = 'VIDEO';
    this.videoWidth = 350;

    this.faceLandmarker = undefined;
    this.enableWebcamButton = undefined;
    this.webcamRunning = false;
    this.video = undefined;

    this.lastVideoTime = -1;
    this.results = undefined;

    this.home_view = home_view;
  }

  async start()
  {
    await this.createFaceLandmarker();

    await this.faceLandmarker.setOptions({ runningMode: this.runningMode });

    /********************************************************************
    // Demo 2: Continuously grab image from webcam stream and detect it.
    ********************************************************************/

    this.video = document.querySelector('.home__webcam');
    this.canvasElement = document.querySelector('.home__output-canvas');

    const canvasCtx = this.canvasElement.getContext('2d');
    this.drawingUtils = new DrawingUtils(canvasCtx);

    this.videoBlendShapes = document.getElementById('video-blend-shapes');

    // If webcam supported, add event listener to button for when user
    // wants to activate it.
    if (this.hasGetUserMedia())
    {
      this.enableWebcamButton = document.querySelector('.home__webcam-button');
      this.enableWebcamButton.addEventListener('click', this.enableCam.bind(this));
    }
    else
    {
      alert('getUserMedia() is not supported by your browser');
    }
  }

  // Enable the live webcam view and start detection.
  enableCam(event)
  {
    if (!this.faceLandmarker)
    {
      console.log('Wait! faceLandmarker not loaded yet.');
      return;
    }

    if (this.webcamRunning === true)
    {
      this.webcamRunning = false;
      this.enableWebcamButton.innerText = 'ENABLE PREDICTIONS';
    }
    else
    {
      this.webcamRunning = true;
      this.enableWebcamButton.innerText = 'DISABLE PREDICTIONS';
    }

    // getUsermedia parameters.
    const constraints = {
      video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) =>
    {
      this.video.srcObject = stream;
      this.video.addEventListener('loadeddata', this.predictWebcam.bind(this));
    });
  }

  async predictWebcam()
  {
    // const radio = this.video.videoHeight / this.video.videoWidth;
    // this.video.style.width = this.videoWidth + 'px';
    // this.video.style.height = this.videoWidth * radio + 'px';
    // this.canvasElement.style.width = this.videoWidth + 'px';
    // this.canvasElement.style.height = this.videoWidth * radio + 'px';
    this.canvasElement.width = this.video.videoWidth;
    this.canvasElement.height = this.video.videoHeight;
    // Now let's start detecting the stream.
    // if (runningMode === 'IMAGE')
    // {
    //   runningMode = 'VIDEO';
    //   await faceLandmarker.setOptions({ runningMode: runningMode });
    // }
    const startTimeMs = performance.now();
    if (this.lastVideoTime !== this.video.currentTime)
    {
      this.lastVideoTime = this.video.currentTime;
      this.results = this.faceLandmarker.detectForVideo(this.video, startTimeMs);
    }
    // if (this.results.faceLandmarks)
    // {
    //   for (const landmarks of this.results.faceLandmarks)
    //   {
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_TESSELATION,
    //       { color: '#C0C0C070', lineWidth: 1 }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
    //       { color: '#FF3030' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
    //       { color: '#FF3030' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
    //       { color: '#30FF30' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
    //       { color: '#30FF30' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
    //       { color: '#E0E0E0' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_LIPS,
    //       { color: '#E0E0E0' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
    //       { color: '#FF3030' }
    //     );
    //     this.drawingUtils.drawConnectors(
    //       landmarks,
    //       FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
    //       { color: '#30FF30' }
    //     );
    //   }
    // }

    // console.log(this.results.faceBlendshapes);

    const blend = [];

    if (this.results.faceBlendshapes[0])
    {
      this.home_view.set_face_data(this.results.faceBlendshapes[0].categories);
      //   for (let i = 0; i < this.results.faceBlendshapes[0].categories.length; i++)
      //   {
      //     const blendShapes = this.results.faceBlendshapes[0].categories[i];
      //     blend.push(blendShapes.categoryName);
      //   }

    //   console.log(blend);
    }

    // this.drawBlendShapes(this.videoBlendShapes, this.results.faceBlendshapes);

    // Call this function again to keep predicting when the browser is ready.
    if (this.webcamRunning === true)
    {
      window.requestAnimationFrame(this.predictWebcam.bind(this));
    }
  }

  drawBlendShapes(el, blendShapes)
  {
    if (!blendShapes.length)
    {
      return;
    }

    // console.log(blendShapes[0]);

    let htmlMaker = '';
    blendShapes[0].categories.map((shape) =>
    {
      htmlMaker += `
        <li class="blend-shapes-item">
          <span class="blend-shapes-label">${
  shape.displayName || shape.categoryName
}</span>
          <span class="blend-shapes-value" style="width: calc(${
  +shape.score * 100
}% - 120px)">${(+shape.score).toFixed(4)}</span>
        </li>
      `;
    });

    el.innerHTML = htmlMaker;
  }

  // Check if webcam access is supported.
  hasGetUserMedia()
  {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  async createFaceLandmarker()
  {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    );
    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      outputFaceBlendshapes: true,
      runningMode: this.runningMode,
      numFaces: 1
    });
  }
//   createFaceLandmarker();
}
