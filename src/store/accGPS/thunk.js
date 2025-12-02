
import {  ApiGPSTrackingAdd } from '../../action/Api';

const fetchAddGPS = (body) => async dispatch => {
  try {
    const { data } = await ApiGPSTrackingAdd(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      // console.log(data.Message);
    } else {
      console.log(data.Message);
    }
  } catch (err) {
    console.log('err', err)
  }
};

export {
  fetchAddGPS
}
