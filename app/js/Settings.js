class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    this.server_url = 'http://localhost:8080';
    this.digicam_url = 'http://192.168.64.4:5513';

    this.camera = {
      fov: 60
    };
  }
}

const settings = new Settings();
export { settings as Settings };
