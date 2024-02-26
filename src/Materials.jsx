import * as THREE from 'three'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// MeshLambertMaterial is more performant than MeshStandardMaterial
const materials = {
  aqua: new THREE.MeshLambertMaterial({ color: '#1EBF99', toneMapped: false }),
  blue: new THREE.MeshLambertMaterial({ color: '#132BA8', toneMapped: false }),
  aquaLight: new THREE.MeshLambertMaterial({ color: '#65CEB5', toneMapped: false }),
  blueLight: new THREE.MeshLambertMaterial({ color: '#2B53E4', toneMapped: false }),
  white: new THREE.MeshLambertMaterial({ color: '#FFFFFF', toneMapped: false })
}

export { boxGeometry, materials }
