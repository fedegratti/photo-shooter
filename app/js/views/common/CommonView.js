import { ApplicationView } from 'ohzi-core';
import { Settings } from '../../Settings';

class CommonView extends ApplicationView
{
  get_last_pictures()
  {
    fetch(`${Settings.server_url}/session`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow' // manual, *follow, error
    })
      .then(this.on_last_pictures.bind(this))
      .catch(this.on_error.bind(this));
  }

  on_last_pictures(response)
  {

  }

  on_error(error)
  {
    console.error(error);
  }
}

export { CommonView };
