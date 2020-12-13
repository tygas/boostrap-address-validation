import axios from 'axios'

const url = 'https://maps.googleapis.com/maps/api/geocode/json'

export default function getGoogleAddress(address) {
  const params = {
    address: address,
    key: 'PASTE_API_KEY_HERE',
    projectId: 'fluent-cable-89508',
  }

  // Leave for debugging
  if (params.key === 'PASTE_API_KEY_HERE') {
    return address === ' Asigalio 15 Kaunas 49519'
      ? axios.get('https://api.mocki.io/v1/6075da9f/')
      : axios.get('https://api.mocki.io/v1/59be3f8c/')
  }

  return axios.get(url, { params })
}
