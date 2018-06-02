import layoutOptions from './layoutOptions';

const flowersTemplate = {
    image: 'flowers.png',
    borderRadius: layoutOptions.frameTypes[3],
    background: layoutOptions.backgroundColors[0],
    class: ''
}

const jimiHendrixTemplate = {
    image: 'jimiHendrix.png',
    borderRadius: layoutOptions.frameTypes[1],
    background: layoutOptions.backgroundColors[1],
    class: 'jimiHendrixTemplate'
}

const jazzTemplate = {
    image: 'jazz.png',
    borderRadius: layoutOptions.frameTypes[2],
    background: layoutOptions.backgroundThemes[0],
    class: 'jazzTemplate'
}

export default {
    templatesList: [flowersTemplate, jimiHendrixTemplate, jazzTemplate],
    backgroundImages: ['rockshow.jpg', 'universe.jpg', 'av2.jpg', 'leafes.jpg', 'city.jpg']
}
