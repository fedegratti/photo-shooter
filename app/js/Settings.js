class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    this.server_url = 'http://10.0.0.10:8080';
    this.digicam_url = 'http://10.0.0.18:5513';

    this.camera = {
      fov: 60
    };
  }
}

const settings = new Settings();
export { settings as Settings };
