import axios from 'axios'

let url = 'https://maps.googleapis.com/maps/api/geocode/json'

export default function getGoogleAddress(address) {
  const params = {
    address: address,
    key: 'PASTE_API_KEY_HERE',
    projectId: 'fluent-cable-89508',
  }

  // Leave for debugging
  // if (address === ' Asigalio 15 Kaunas 49519') {
  //   url = 'https://api.mocki.io/v1/6075da9f/' // valid
  // } else url = 'https://api.mocki.io/v1/59be3f8c'
  // return axios.get(url)

  return axios.get(url, { params })
}
