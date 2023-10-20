'use strict'


var trebleDurationsSixteenth = document.getElementById("treble_durations_sixteenth")
var trebleDurationsEighth = document.getElementById("treble_durations_eighth")
var trebleDurationsQuarter = document.getElementById("treble_durations_quarter")
var trebleDurationsHalf = document.getElementById("treble_durations_half")
var bassDurationsSixteenth = document.getElementById("bass_durations_sixteenth")
var bassDurationsEighth = document.getElementById("bass_durations_eighth")
var bassDurationsQuarter = document.getElementById("bass_durations_quarter")
var bassDurationsHalf = document.getElementById("bass_durations_half")

var changeScaleMode = document.getElementById("change_scale_mode")
var changeScaleTreble = document.getElementById("change_scale_treble")
var changeScaleBass = document.getElementById("change_scale_bass")

var toggle_chords = document.getElementById("toggle_chords")
var toggle_chords_label = document.getElementById("toggle_chords_label")
toggle_chords.checked = false

var keyChanger = document.getElementById("keyChanger")


var bpmInput = document.getElementById('bpmInput')
var CANVAS = document.getElementById('sheet-music')
var ANIMATION = document.getElementById('animation')
var ctxAnim = ANIMATION.getContext('2d')
var ctx = CANVAS.getContext('2d')
ctx.font = "40px bravura"
// v Initialise font, else glyphs don't load
ctx.fillText("\u0000", 1, 1)

var SOUND

var BUTTON = document.getElementById('sound')

const trebleObject = {}
const bassObject = {}
// const secondBassObject = {}
const songDurations = []
const songNoteNames = []

const noteHead = {
  4: `\ue0a2`,
  2: `\ue0a3`,
  1: `\ue0a4`,
  0.5: `\ue0a4`,
  0.25: `\ue0a4`
}

const timeSigs = {
  4: `\uE084`,
  3: `\uE083`,
  2: `\uE082`,
}

const frequencyNoteMap440 = {
  "C0": 16.35,
  "C#0/Db0": 17.32,
  "D0": 18.35,
  "D#0/Eb0": 19.45,
  "E0": 20.60,
  "F0": 21.83,
  "F#0/Gb0": 23.12,
  "G0": 24.50,
  "G#0/Ab0": 25.96,
  "A0": 27.50,
  "A#0/Bb0": 29.14,
  "B0": 30.87,
  "C1": 32.70,
  "C#1/Db1": 34.65,
  "D1": 36.71,
  "D#1/Eb1": 38.89,
  "E1": 41.20,
  "F1": 43.65,
  "F#1/Gb1": 46.25,
  "G1": 49.00,
  "G#1/Ab1": 51.91,
  "A1": 55.00,
  "A#1/Bb1": 58.27,
  "B1": 61.74,
  "C2": 65.41,
  "C#2/Db2": 69.30,
  "D2": 73.42,
  "D#2/Eb2": 77.78,
  "E2": 82.41,
  "F2": 87.31,
  "F#2/Gb2": 92.50,
  "G2": 98.00,
  "G#2/Ab2": 103.83,
  "A2": 110.00,
  "A#2/Bb2": 116.54,
  "B2": 123.47,
  "C3": 130.81,
  "C#3/Db3": 138.59,
  "D3": 146.83,
  "D#3/Eb3": 155.56,
  "E3": 164.81,
  "F3": 174.61,
  "F#3/Gb3": 185.00,
  "G3": 196.00,
  "G#3/Ab3": 207.65,
  "A3": 220.00,
  "A#3/Bb3": 233.08,
  "B3": 246.94,
  "C4": 261.63,
  "C#4/Db4": 277.18,
  "D4": 293.66,
  "D#4/Eb4": 311.13,
  "E4": 329.63,
  "F4": 349.23,
  "F#4/Gb4": 369.99,
  "G4": 392.00,
  "G#4/Ab4": 415.30,
  "A4": 440.00,
  "A#4/Bb4": 466.16,
  "B4": 493.88,
  "C5": 523.25,
  "C#5/Db5": 554.37,
  "D5": 587.33,
  "D#5/Eb5": 622.25,
  "E5": 659.25,
  "F5": 698.46,
  "F#5/Gb5": 739.99,
  "G5": 783.99,
  "G#5/Ab5": 830.61,
  "A5": 880.00,
  "A#5/Bb5": 932.33,
  "B5": 987.77,
  "C6": 1046.50,
  "C#6/Db6": 1108.73,
  "D6": 1174.66,
  "D#6/Eb6": 1244.51,
  "E6": 1318.51,
  "F6": 1396.91,
  "F#6/Gb6": 1479.98,
  "G6": 1567.98,
  "G#6/Ab6": 1661.22,
  "A6": 1760.00,
  "A#6/Bb6": 1864.66,
  "B6": 1975.53,
  "C7": 2093.00,
  "C#7/Db7": 2217.46,
  "D7": 2349.32,
  "D#7/Eb7": 2489.02,
  "E7": 2637.02,
  "F7": 2793.83,
  "F#7/Gb7": 2959.96,
  "G7": 3135.96,
  "G#7/Ab7": 3322.44,
  "A7": 3520.00,
  "A#7/Bb7": 3729.31,
  "B7": 3951.07,
  "C8": 4186.01,
  "C#8/Db8": 4434.92,
  "D8": 4698.63,
  "D#8/Eb8": 4978.03,
  "E8": 5274.04,
  "F8": 5587.65,
  "F#8/Gb8": 5919.91,
  "G8": 6271.93,
  "G#8/Ab8": 6644.88,
  "A8": 7040.00,
  "A#8/Bb8": 7458.62,
  "B8": 7902.13
}

const frequencyNoteMap432 = {
  "C0": 16.05,
  "C#0/Db0": 17.01,
  "D0": 18.02,
  "D#0/Eb0": 19.09,
  "E0": 20.23,
  "F0": 21.43,
  "F#0/Gb0": 22.70,
  "G0": 24.05,
  "G#0/Ab0": 25.48,
  "A0": 27.00,
  "A#0/Bb0": 28.61,
  "B0": 30.31,
  "C1": 32.11,
  "C#1/Db1": 34.02,
  "D1": 36.04,
  "D#1/Eb1": 38.18,
  "E1": 40.45,
  "F1": 42.86,
  "F#1/Gb1": 45.41,
  "G1": 48.11,
  "G#1/Ab1": 50.97,
  "A1": 54.00,
  "A#1/Bb1": 57.21,
  "B1": 60.61,
  "C2": 64.22,
  "C#2/Db2": 68.04,
  "D2": 72.08,
  "D#2/Eb2": 76.37,
  "E2": 80.91,
  "F2": 85.72,
  "F#2/Gb2": 90.82,
  "G2": 96.22,
  "G#2/Ab2": 101.94,
  "A2": 108.00,
  "A#2/Bb2": 114.42,
  "B2": 121.23,
  "C3": 128.43,
  "C#3/Db3": 136.07,
  "D3": 144.16,
  "D#3/Eb3": 152.74,
  "E3": 161.82,
  "F3": 171.44,
  "F#3/Gb3": 181.63,
  "G3": 192.43,
  "G#3/Ab3": 203.88,
  "A3": 216.00,
  "A#3/Bb3": 228.84,
  "B3": 242.45,
  "C4": 256.87,
  "C#4/Db4": 272.14,
  "D4": 288.33,
  "D#4/Eb4": 305.47,
  "E4": 323.63,
  "F4": 342.88,
  "F#4/Gb4": 363.27,
  "G4": 384.87,
  "G#4/Ab4": 407.75,
  "A4": 432.00,
  "A#4/Bb4": 457.69,
  "B4": 484.90,
  "C5": 513.74,
  "C#5/Db5": 544.29,
  "D5": 576.65,
  "D#5/Eb5": 610.94,
  "E5": 647.27,
  "F5": 685.76,
  "F#5/Gb5": 726.53,
  "G5": 769.74,
  "G#5/Ab5": 815.51,
  "A5": 864.00,
  "A#5/Bb5": 915.38,
  "B5": 969.81,
  "C6": 1027.47,
  "C#6/Db6": 1088.57,
  "D6": 1153.30,
  "D#6/Eb6": 1221.88,
  "E6": 1294.54,
  "F6": 1371.51,
  "F#6/Gb6": 1453.07,
  "G6": 1539.47,
  "G#6/Ab6": 1631.01,
  "A6": 1728.00,
  "A#6/Bb6": 1830.75,
  "B6": 1939.61,
  "C7": 2054.95,
  "C#7/Db7": 2177.14,
  "D7": 2306.60,
  "D#7/Eb7": 2443.76,
  "E7": 2589.07,
  "F7": 2743.03,
  "F#7/Gb7": 2906.14,
  "G7": 3078.95,
  "G#7/Ab7": 3262.03,
  "A7": 3456.00,
  "A#7/Bb7": 3661.50,
  "B7": 3879.23,
  "C8": 4109.90,
  "C#8/Db8": 4354.29,
  "D8": 4613.21,
  "D#8/Eb8": 4887.52,
  "E8": 5178.15,
  "F8": 5486.06,
  "F#8/Gb8": 5812.28,
  "G8": 6157.89,
  "G#8/Ab8": 6524.06,
  "A8": 6912.00,
  "A#8/Bb8": 7323.01,
  "B8": 7758.46
}

const offsetMap = {
  38: ["C0", "C#0"],
  37: ["D0", "D#0", "Db0"],
  36: ["E0", "Eb0"],
  35: ["F0", "F#0"],
  34: ["G0", "G#0", "Gb0"],
  33: ["A0", "A#0", "Ab0"],
  32: ["B0", "Bb0"],
  31: ["C1", "C#1"],
  30: ["D1", "D#1", "Db1"],
  29: ["E1", "Eb1"],
  28: ["F1", "F#1"],
  27: ["G1", "G#1", "Gb1"],
  26: ["A1", "A#1", "Ab1"],
  25: ["B1", "Bb1"],
  24: ["C2", "C#2"],
  23: ["D2", "D#2", "Db2"],
  22: ["E2", "Eb2"],
  21: ["F2", "F#2"],
  20: ["G2", "G#2", "Gb2"],
  19: ["A2", "A#2", "Ab2"],
  18: ["B2", "Bb2"],
  17: ["C3", "C#3"],
  16: ["D3", "D#3", "Db3"],
  15: ["E3", "Eb3"],
  14: ["F3", "F#3"],
  13: ["G3", "G#3", "Gb3"],
  12: ["A3", "A#3", "Ab3"],
  11: ["B3", "Bb3"],
  10: ["C4", "C#4"],
  9: ["D4", "D#4", "Db4"],
  8: ["E4", "Eb4"],
  7: ["F4", "F#4"],
  6: ["G4", "G#4", "Gb4"],
  5: ["A4", "A#4", "Ab4"],
  4: ["B4", "Bb4"],
  3: ["C5", "C#5"],
  2: ["D5", "D#5", "Db5"],
  1: ["E5", "Eb5"],
  0: ["F5", "F#5"],
  "-1": ["G5", "G#5", "Gb5"],
  "-2": ["A5", "A#5", "Ab5"],
  "-3": ["B5", "Bb5"],
  "-4": ["C6", "C#6"],
  "-5": ["D6", "D#6", "Db6"],
  "-6": ["E6", "Eb6"],
  "-7": ["F6", "F#6"],
  "-8": ["G6", "G#6", "Gb6"],
  "-9": ["A6", "A#6", "Ab6"],
  "-10": ["B6", "Bb6"],
  "-11": ["C7", "C#7"],
  "-12": ["D7", "D#7", "Db7"],
  "-13": ["E7", "Eb7"],
  "-14": ["F7", "F#7"],
  "-15": ["G7", "G#7", "Gb7"],
  "-16": ["A7", "A#7", "Ab7"],
  "-17": ["B7", "Bb7"],
  "-18": ["C8", "C#8"],
  "-19": ["D8", "D#8", "Db8"],
  "-10": ["E8", "Eb8"],
  "-21": ["F8", "F#8"],
  "-22": ["G8", "G#8", "Gb8"],
  "-23": ["A8", "A#8", "Ab8"],
  "-24": ["B8", "Bb8"]
}


const keyModes = {
  major: {
    C: [null, 0],
    G: ['SHARP', 1],
    D: ['SHARP', 2],
    A: ['SHARP', 3],
    E: ['SHARP', 4],
    B: ['SHARP', 5],
    F: ['FLAT', 1],
    "A#/Bb": ['FLAT', 2],
    "D#/Eb": ['FLAT', 3],
    "G#/Ab": ['FLAT', 4],
    Db: ['FLAT', 5],
    "F#": ['SHARP', 6],
    Gb: ['FLAT', 6],
    "C#": ['SHARP', 7],
    Cb: ['FLAT', 7]
  },
  minor: {
    A: [null, 0],
    E: ['SHARP', 1],
    B: ['SHARP', 2],
    "F#/Gb": ['SHARP', 3],
    "C#/Db": ['SHARP', 4],
    "G#/Ab": ['SHARP', 5],
    D: ['FLAT', 1],
    G: ['FLAT', 2],
    C: ['FLAT', 3],
    F: ['FLAT', 4],
    Bb: ['FLAT', 5],
    "D#": ['SHARP', 6],
    Eb: ['FLAT', 6],
    "A#": ['SHARP', 7],
    Ab: ['FLAT', 7],
  }
}

var keyObject = keyModes.major

const scaleObject = {
  majorHeptatonic: [0, 2, 4, 5, 7, 9, 11, 12],
  majorPentatonic: [0, 2, 4, 7, 9, 12],
  majorTritonic: [0, 4, 7, 12],
  harmonicHeptatonic: [0, 2, 3, 5, 7, 8, 11, 12],
  minorHeptatonic: [0, 2, 3, 5, 7, 8, 10, 12],
  minorPentatonic: [0, 3, 5, 7, 10, 12],
  minorTritonic: [0, 3, 7, 12]
}

var key = "C"

var bpm = 60
var secondsPerBeat = 60 / bpm


bpmInput.placeholder = bpm
bpmInput.addEventListener("change", (e) => {
  if (!parseInt(e.target.value)) return
  bpm = parseInt(e.target.value);
  bpmInput.placeholder = bpm
  secondsPerBeat = 60 / bpm;
  unitDistance = barWidth / numberOfBeatsPerBar
  stopPlayback();
  animationStopped = false;
  fitToScreen();
})

var numberOfMeasures = 4
var numberOfMeasuresPerBar = 2
var timeSignatureBeats = 4
// timeSignatureUnit = 4
var numberOfBeatsPerBar = numberOfMeasuresPerBar * timeSignatureBeats

var topLine = 50
var distanceBetweenStaves = 160
var startStaffX = 40
var initialOffset = 90 + keyObject[key][1] * 10
var bufferToEnd = 4
var barWidth = (window.innerWidth - 2 * startStaffX - initialOffset - bufferToEnd)
var unitDistance = barWidth / numberOfBeatsPerBar
// p / bar  /  beat / bar = pixels / beat


var rootOctaveTreble = 4
var rootOctaveBass = 2

var scaleTypeTreble = scaleObject.majorHeptatonic
var scaleTypeBass = scaleObject.majorTritonic

var builtScaleTreble
var builtScaleBass

var playChords = false

var durations = [
  0.25, 0.5, 1, 2
]

var trebleDurations = durations.slice(1)

var bassDurations = durations.slice(2)

var minorOrMajor = "major"

changeScaleMode.value = "Major"


function changeKey(el) {
  key = el.value
  initialOffset = 90 + keyObject[key][1] * 10
  buildScale()
  randomise()
}

keyChanger.value = key
document.getElementById("measures").value = numberOfMeasures
document.getElementById("measures_per_bar").value = numberOfMeasuresPerBar
document.getElementById("beats_per_measure").value = timeSignatureBeats
document.getElementById("change_root_octave_treble").value = rootOctaveTreble
document.getElementById("change_root_octave_bass").value = rootOctaveBass
document.getElementById("change_scale_treble").value = Object.keys(scaleObject).find(key => scaleObject[key] === scaleTypeTreble)
document.getElementById("change_scale_bass").value = Object.keys(scaleObject).find(key => scaleObject[key] === scaleTypeBass)


const trebleDurationInclusionArray = [
  trebleDurationsSixteenth,
  trebleDurationsEighth,
  trebleDurationsQuarter,
  trebleDurationsHalf
]
const bassDurationInclusionArray = [
  bassDurationsSixteenth,
  bassDurationsEighth,
  bassDurationsQuarter,
  bassDurationsHalf
]
durations.forEach((duration, index) => {
  trebleDurations.includes(duration) ? trebleDurationInclusionArray[index].checked = true : trebleDurationInclusionArray[index].checked = false
  bassDurations.includes(duration) ? bassDurationInclusionArray[index].checked = true : bassDurationInclusionArray[index].checked = false
})

function toggleOptionsMenu() {
  document.getElementById("options_menu").classList.toggle("options_menu_display")
  document.getElementById("options_menu").classList.toggle("hide")
}

function changeMeasures(el) {
  if (el.value > 0 && el.value <= 12) {
    numberOfMeasures = parseInt(el.value)
    randomise()
  }
}
function changeMeasuresPerBar(el) {
  numberOfMeasuresPerBar = parseInt(el.value)
  numberOfBeatsPerBar = numberOfMeasuresPerBar * timeSignatureBeats
  randomise()
}
function changeBeatsPerMeasure(el) {
  timeSignatureBeats = parseInt(el.value)
  numberOfBeatsPerBar = numberOfMeasuresPerBar * timeSignatureBeats
  randomise()
}
function changeRootOctaveTreble(el) {
  rootOctaveTreble = parseInt(el.value)
  buildScale()
  randomise()
}
function changeRootOctaveBass(el) {
  rootOctaveBass = parseInt(el.value)
  buildScale()
  randomise()
}

function changeKeyMode(el) {
  const mode = el.value.toLowerCase()
  minorOrMajor = mode
  key = Object.keys(keyModes[mode])[Object.keys(keyObject).findIndex(val => val === key)]
  keyObject = keyModes[mode]
  keyChanger.innerHTML = mode === "minor"
    ? `
        <option>A</option>
        <option>E</option>
        <option>B</option>
        <option>F#/Gb</option>
        <option>C#/Db</option>
        <option>G#/Ab</option>
        <option>D</option>
        <option>G</option>
        <option>C</option>
        <option>F</option>
        <option>Bb</option>
        <option>D#</option>
        <option>Eb</option>
        <option>A#</option>
        <option>Ab</option>
        `
    : `
        <option>C</option>
        <option>G</option>
        <option>D</option>
        <option>A</option>
        <option>E</option>
        <option>B</option>
        <option>F</option>
        <option>A#/Bb</option>
        <option>D#/Eb</option>
        <option>G#/Ab</option>
        <option>Db</option>
        <option>F#</option>
        <option>Gb</option>
        <option>C#</option>
        <option>Cb</option>
        `
  keyChanger.value = key

  const trebleChangeTo = `${mode}${changeScaleTreble.value.match(/[A-Z]\w+$/)[0]}`
  const bassChangeTo = `${mode}${changeScaleBass.value.match(/[A-Z]\w+$/)[0]}`

  changeScaleTreble.innerHTML = mode === "major"
    ? `
            <option value="majorHeptatonic">Heptatonic</option>
            <option value="majorPentatonic">Pentatonic</option>
            <option value="majorTritonic">Tritonic</option>
        `
    : `
            <option value="minorHeptatonic">n Heptatonic</option>
            <option value="harmonicHeptatonic">h Heptatonic</option>
            <option value="minorPentatonic">Pentatonic</option>
            <option value="minorTritonic">Tritonic</option>
        `
  changeScaleBass.innerHTML = mode === "major"
    ? `
            <option value="majorHeptatonic">Heptatonic</option>
            <option value="majorPentatonic">Pentatonic</option>
            <option value="majorTritonic">Tritonic</option>
        `
    : `
            <option value="minorHeptatonic">n Heptatonic</option>
            <option value="harmonicHeptatonic">h Heptatonic</option>
            <option value="minorPentatonic">Pentatonic</option>
            <option value="minorTritonic">Tritonic</option>
            `

  changeScaleTreble.value = trebleChangeTo
  changeScaleBass.value = bassChangeTo

  scaleTypeTreble = scaleObject[changeScaleTreble.value]
  scaleTypeBass = scaleObject[changeScaleBass.value]

  buildScale()
  randomise()
}
function changeScale() {
  let trebleVal = changeScaleTreble.value
  let bassVal = changeScaleBass.value
  scaleTypeTreble = scaleObject[trebleVal].slice(0, scaleObject[trebleVal].length)
  scaleTypeBass = scaleObject[bassVal].slice(0, scaleObject[bassVal].length)
  if (!bassVal.match("Tritonic")) {
    toggle_chords_label.classList.add("hide")
  }
  else if (bassVal.match("Tritonic")) {
    toggle_chords_label.classList.remove("hide")
  }
  buildScale()
  randomise()
}
function toggleChords(el) {
  playChords = el.checked
  randomise()
}

function changeTrebleDurations() {
  const inclusionArray = [
    trebleDurationsSixteenth.checked,
    trebleDurationsEighth.checked,
    trebleDurationsQuarter.checked,
    trebleDurationsHalf.checked
  ]
  if (inclusionArray.every(val => !val)) return
  trebleDurations = durations.filter((val, index) => inclusionArray[index])
  buildScale()
  randomise()
}
function changeBassDurations() {
  const inclusionArray = [
    bassDurationsSixteenth.checked,
    bassDurationsEighth.checked,
    bassDurationsQuarter.checked,
    bassDurationsHalf.checked
  ]
  if (inclusionArray.every(val => !val)) return
  bassDurations = durations.filter((val, index) => inclusionArray[index])
  buildScale()
  randomise()
}

function returnScale(initialNote, scaleType = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19]) {
  const notes = Object.keys(frequencyNoteMap440)
  initialNote = notes.find(name => name.includes(initialNote))
  const initialIndex = notes.findIndex((val) => val === initialNote)
  return Array(scaleType.length).fill(null)
    .map((val, index) => notes[initialIndex + scaleType[index]])
}

function buildScale() {
  let initialNoteTreble = key + rootOctaveTreble
  let initialNoteBass = key + rootOctaveBass

  const notes = Object.keys(frequencyNoteMap440)



  if (["A#/Bb", "D#/Eb", "G#/Ab", "F#/Gb", "C#/Db"].some(name => name === key)) {
    initialNoteTreble = initialNoteTreble.replace("/", `${rootOctaveTreble}/`)
    initialNoteBass = initialNoteBass.replace("/", `${rootOctaveBass}/`)
  }

  if (key.includes("b") || key.includes("#")) {
    if (key === "Cb") {
      initialNoteTreble = notes.find(name => name.includes("B" + (rootOctaveTreble - 1)))
      initialNoteBass = notes.find(name => name.includes("B" + (rootOctaveBass - 1)))
    }
    else {
      initialNoteTreble = notes.find(name => name.includes(initialNoteTreble))
      initialNoteBass = notes.find(name => name.includes(initialNoteBass))
    }
  }

  const initialIndexTreble = notes.findIndex((val) => val === initialNoteTreble)
  const initialIndexBass = notes.findIndex((val) => val === initialNoteBass)

  builtScaleTreble = Array(scaleTypeTreble.length).fill(null).map((val, index) => notes[initialIndexTreble + scaleTypeTreble[index]])
  builtScaleBass = Array(scaleTypeBass.length).fill(null).map((val, index) => notes[initialIndexBass + scaleTypeBass[index]])

}

buildScale()

function keySignatures(sharpOrFlat, noOfGlyphs, index) {
  var keySignatureOffset = 70
  var glyphWidthUnit = 10
  var semiToneDistance = 5
  var distanceBetweenTopLines = 12 * semiToneDistance
  var treblePositions, bassPositions
  if (sharpOrFlat === "SHARP") {
    treblePositions = [0, 3, -1, 2, 5, 1, 4]
    bassPositions = [2, 5, 1, 4, 7, 3, 6]
    Array(noOfGlyphs).fill(null).forEach((nothing, ind) => {
      ctx.fillText(`\ue262`,
        startStaffX + keySignatureOffset + glyphWidthUnit * ind - (index ? 15 : 0), // Conditional is shifting key signature on lines that aren't the first, 15 is abritrary for now, fix?
        topLine + semiToneDistance * treblePositions[ind] + index * distanceBetweenStaves)
      ctx.fillText(`\ue262`,
        startStaffX + keySignatureOffset + glyphWidthUnit * ind - (index ? 15 : 0),
        topLine + distanceBetweenTopLines + semiToneDistance * bassPositions[ind] + index * distanceBetweenStaves)
    })
  }
  else if (sharpOrFlat === "FLAT") {
    treblePositions = [4, 1, 5, 2, 6, 3, 7]
    bassPositions = [6, 3, 7, 4, 8, 5, 9]
    Array(noOfGlyphs).fill(null).forEach((nothing, ind) => {
      ctx.fillText(`\ue260`,
        startStaffX + keySignatureOffset + glyphWidthUnit * ind - (index ? 15 : 0),
        topLine + semiToneDistance * treblePositions[ind] + index * distanceBetweenStaves)
      ctx.fillText(`\ue260`,
        startStaffX + keySignatureOffset + glyphWidthUnit * ind - (index ? 15 : 0),
        topLine + distanceBetweenTopLines + semiToneDistance * bassPositions[ind] + index * distanceBetweenStaves)
    })

  }

  // initialOffset += noOfGlyphs * glyphWidthUnit
}

let initialRandomise = 1;

function randomise() {
  SOUND = new AudioContext()

  let currentDistance = 0
  let trebleIndex = 0
  let originalTrebleDurations = trebleDurations
  let originalBassDurations = bassDurations
  let bassIndex = 0

  Object.keys(trebleObject).forEach(noteNumber => delete trebleObject[noteNumber])
  Object.keys(bassObject).forEach(noteNumber => delete bassObject[noteNumber])
  // Object.keys(secondBassObject).forEach(noteNumber => delete bassObject[noteNumber])

  Array(numberOfMeasures).fill(null).forEach((nothing, measure) => {                 // Number of Musical Measures
    while (currentDistance < timeSignatureBeats) {
      const bassNLU = bassDurations[Math.floor(Math.random() * bassDurations.length)]
      const randomlySelectNoteIndex = Math.floor(Math.random() * builtScaleBass.length)

      bassObject[bassIndex] = {
        duration: bassNLU,
        name: builtScaleBass[randomlySelectNoteIndex]
      }

      currentDistance += bassNLU

      const distanceLeft = timeSignatureBeats - currentDistance
      if (bassDurations.at(-1) > distanceLeft) {              // Cut out notes which would exceed bar length
        bassDurations = bassDurations.filter(dur => dur <= distanceLeft)
      }
      bassIndex++
    }
    currentDistance = 0
    bassDurations = originalBassDurations
    while (currentDistance < timeSignatureBeats) {
      const noteLengthUnit = trebleDurations[Math.floor(Math.random() * trebleDurations.length)]



      trebleObject[trebleIndex] = {
        duration: noteLengthUnit,
        name: builtScaleTreble[Math.floor(Math.random() * builtScaleTreble.length)]
      }

      currentDistance += noteLengthUnit
      const distanceLeft = timeSignatureBeats - currentDistance
      if (trebleDurations.at(-1) > distanceLeft) {              // Cut out notes which would exceed bar length
        trebleDurations = trebleDurations.filter(dur => dur <= distanceLeft)
      }
      trebleIndex++
    }
    currentDistance = 0
    trebleDurations = originalTrebleDurations
  })
  var totalSongDistance = Object.values(trebleObject).reduce((a, obj) => a + obj.duration * unitDistance, 0)

  // const distanceDiv = document.getElementById("distance")
  // distanceDiv.innerText = `${totalSongDistance} px`

  fitToScreen()
}


function fitToScreen() {
  CANVAS.width = window.innerWidth
  // CANVAS.height = window.innerHeight * 0.5
  CANVAS.height = topLine * 2 + Math.ceil(numberOfMeasures / numberOfMeasuresPerBar) * 100 + (Math.ceil(numberOfMeasures / numberOfMeasuresPerBar) - 1) * 60
  ANIMATION.width = window.innerWidth
  // ANIMATION.height = window.innerHeight * 0.5
  ANIMATION.height = CANVAS.height
  barWidth = window.innerWidth - 2 * startStaffX - initialOffset - bufferToEnd
  unitDistance = barWidth / numberOfBeatsPerBar
  drawSheet()
}



window.addEventListener('resize', fitToScreen)

function drawSheet() {

  var { width, height } = CANVAS
  ctx.fillStyle = "black"
  ctx.font = "40px bravura"
  // ctx.fillText("\uE084", 0, 0)

  ctx.fillText(timeSigs[timeSignatureBeats], startStaffX + 43, topLine + 10)                                 // Time signatures  - treble
  ctx.fillText("\uE084", startStaffX + 43, topLine + 30)


  ctx.fillText(timeSigs[timeSignatureBeats], startStaffX + 43, topLine + 60 + 10)               //  - bass
  ctx.fillText("\uE084", startStaffX + 43, topLine + 60 + 30)


  // |~~~~~~~~~~~~~~ -- | Note placement | -- ~~~~~~~~~~~~~~| \\

  var halfToneDistance = 5
  var songDistance = 0        // The number of pixels from the start to the current note
  var totalSongDistance = parseInt(Object.values(trebleObject).reduce((a, obj) =>
    a + obj.duration * unitDistance, 0))
  var numberOfStaves = Math.ceil(totalSongDistance / barWidth)

  function drawNotes(songObject, trebleOrBass) {
    Object.values(songObject).forEach((obj, noteNumber) => {
      const noteDuration = obj.duration

      let noteKeyed

      if (obj.name.length === 2) {
        noteKeyed = obj.name
      }
      else if (obj.name.length === 7) {
        if (keyObject[key][0] === "SHARP") {
          noteKeyed = obj.name.slice(0, 3)
        }
        else if (keyObject[key][0] === "FLAT") {
          noteKeyed = obj.name.slice(4)
        }
      }

      // Account for 6 and 7 glyph keys
      if ((key === "Gb" && minorOrMajor === "major") || (key === "Db" && minorOrMajor === "minor")) {
        if (obj.name[0] === "B" && obj.name.length === 2) {
          noteKeyed = "C" + (parseInt(obj.name[1]) + 1)
        }
      }
      else if ((key === "F#" && minorOrMajor === "major") || (key === "D#" && minorOrMajor === "minor")) {
        if (obj.name[0] === "F" && obj.name.length === 2) {
          noteKeyed = "E" + obj.name[1]
        }
      }
      else if ((key === "Cb" && minorOrMajor === "major") || (key === "Ab" && minorOrMajor === "minor")) {
        if (obj.name[0] === "B" && obj.name.length === 2) {
          noteKeyed = "C" + (parseInt(obj.name[1]) + 1)
        }
        else if (obj.name[0] === "E" && obj.name.length === 2) {
          noteKeyed = "F" + obj.name[1]
        }
      }
      else if ((key === "C#" && minorOrMajor === "major") || (key === "A#" && minorOrMajor === "minor")) {
        if (obj.name[0] === "F" && obj.name.length === 2) {
          noteKeyed = "E" + obj.name[1]
        }
        else if (obj.name[0] === "C" && obj.name.length === 2) {
          noteKeyed = "B" + (parseInt(obj.name[1]) - 1)
        }
      }

      let offset = Object.keys(offsetMap)
        .find(offsetKey => offsetMap[offsetKey]
          .some(noteName => new RegExp(noteName)
            .test(noteKeyed)))

      const songDistanceEffective = Math.ceil(songDistance) / barWidth === Math.ceil(songDistance / barWidth) ? Math.ceil(songDistance) : songDistance


      ctx.fillText(noteHead[noteDuration],// Draw note head
        startStaffX + initialOffset + songDistanceEffective % barWidth,
        topLine + 0.5 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth))
      if (noteDuration <= 2) {            // Draw note bars and tails
        if ((trebleOrBass === 'TREBLE' && offset > 4) || (trebleOrBass === 'BASS' && offset > 16)) {               // Note tails that point up
          ctx.fillRect(
            startStaffX + initialOffset + songDistanceEffective % barWidth + 10,
            topLine - 1 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
            2,
            -30)
          if (noteDuration === 0.5) {
            ctx.fillText('\ue240',
              startStaffX + initialOffset + songDistanceEffective % barWidth + 10,
              topLine - 1 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth) - 35)
          }
          else if (noteDuration === 0.25) {
            ctx.fillText('\ue242',
              startStaffX + initialOffset + songDistanceEffective % barWidth + 10,
              topLine - 1 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth) - 35)
          }
        }
        else {
          ctx.fillRect(               // Note tails that point down
            startStaffX + initialOffset + songDistanceEffective % barWidth,
            topLine + 0.5 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
            2,
            30)
          if (noteDuration === 0.5) {
            ctx.fillText('\ue241', startStaffX + initialOffset + songDistanceEffective % barWidth,
              topLine - 1 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth) + 35)
          }
          else if (noteDuration === 0.25) {
            ctx.fillText('\ue243', startStaffX + initialOffset + songDistanceEffective % barWidth,
              topLine - 1 + halfToneDistance * offset + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth) + 35)
          }
        }
      }

      function findOffset(note) {
        return parseInt(Object.keys(offsetMap).find(offset => offsetMap[offset].includes(note)))
      }


      if (noteKeyed === "C4" || noteKeyed === "C#4" || noteKeyed === "Cb4") {            // C4 bar
        ctx.fillRect(
          startStaffX + initialOffset + songDistanceEffective % barWidth - 0.3 * 30,
          topLine + halfToneDistance * findOffset("C4") + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
          30,
          1)
      }

      else if (findOffset(noteKeyed) < findOffset("G5")) {
        ctx.fillRect(
          startStaffX + initialOffset + songDistanceEffective % barWidth - 0.3 * 30,
          topLine + halfToneDistance * findOffset("A5") + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
          30,
          1)
        if (findOffset(noteKeyed) < findOffset("B5")) {
          ctx.fillRect(
            startStaffX + initialOffset + songDistanceEffective % barWidth - 0.3 * 30,
            topLine + halfToneDistance * findOffset("C6") + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
            30,
            1)
        }
      }
      else if (findOffset(noteKeyed) > findOffset("F2")) {
        ctx.fillRect(
          startStaffX + initialOffset + songDistanceEffective % barWidth - 0.3 * 30,
          topLine + halfToneDistance * findOffset("E2") + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
          30,
          1)
        if (findOffset(noteKeyed) > findOffset("D2")) {
          ctx.fillRect(
            startStaffX + initialOffset + songDistanceEffective % barWidth - 0.3 * 30,
            topLine + halfToneDistance * findOffset("C2") + distanceBetweenStaves * Math.floor(songDistanceEffective / barWidth),
            30,
            1)
        }

      }

      songDistance += unitDistance * noteDuration
    })
    songDistance = 0
  }
  drawNotes(trebleObject, 'TREBLE')
  drawNotes(bassObject, 'BASS')




  let secondBassObject = {}
  let thirdBassObject = {}
  if (playChords && changeScaleBass.value.match("Tritonic")[0]) {
    Object.keys(bassObject).forEach(key => secondBassObject[key] = { ...bassObject[key] })
    Object.keys(bassObject).forEach(key => thirdBassObject[key] = { ...bassObject[key] })
    Object.keys(secondBassObject).forEach((noteNumber) => secondBassObject[noteNumber].name = returnScale(key + rootOctaveBass)[returnScale(key + rootOctaveBass).findIndex(val => val === secondBassObject[noteNumber].name) + 2])
    Object.keys(thirdBassObject).forEach((noteNumber) => thirdBassObject[noteNumber].name = returnScale(key + rootOctaveBass)[returnScale(key + rootOctaveBass).findIndex(val => val === thirdBassObject[noteNumber].name) + 4])
    drawNotes(secondBassObject, 'BASS')
    drawNotes(thirdBassObject, 'BASS')
  }


  Array(numberOfStaves).fill(null).forEach((v, index) => {                                    // Number of grand staves
    // console.log(numberOfStaves)
    ctx.font = `100px bravura`
    ctx.fillText("\uE000", 25, topLine + 100 + distanceBetweenStaves * index)               // Staff Bracket
    ctx.font = "40px bravura"
    ctx.fillText("\uE050", startStaffX + 10, topLine + 30 + distanceBetweenStaves * index)  // Treble Clef
    ctx.fillText(`\ue062`, startStaffX + 10, topLine + 70.5 + distanceBetweenStaves * index) // Bass Clef  

    keySignatures(...keyObject[key], index)                                                 // Key Signatures


    const measuresWithNotesLeft = numberOfMeasures - index * numberOfMeasuresPerBar

    Array(numberOfMeasuresPerBar).fill(null).forEach((nothing, measureIndex) => {           // Measure bars
      if (!measureIndex) return

      function drawLine(offset) {
        ctx.fillRect(
          barWidth / (numberOfMeasuresPerBar) * measureIndex + startStaffX + initialOffset - offset,
          topLine + distanceBetweenStaves * index,
          1.5, 100)
      }


      if (measuresWithNotesLeft >= numberOfMeasuresPerBar || (measuresWithNotesLeft < numberOfMeasuresPerBar && measureIndex < measuresWithNotesLeft)) {               // Draw measure line before next note, otherwise draw no line.
        drawLine(8)
      }
      // else if (measuresWithNotesLeft < numberOfMeasuresPerBar && measureIndex >= measuresWithNotesLeft) {
      //     drawLine(-bufferToEnd)
      // } 
    })

    Array(2).fill(null).forEach((v, ind) => {                                   // Treble and Bass staves
      ctx.fillRect(startStaffX + 10, topLine + 50 + distanceBetweenStaves * index, 30, 1) // C4 bar

      ctx.fillRect(startStaffX, topLine + distanceBetweenStaves * index, 2, 100)        // Start Staff

      if (measuresWithNotesLeft > numberOfMeasuresPerBar) {
        ctx.fillRect(width - startStaffX, topLine + distanceBetweenStaves * index, 2, 101)     // End staff
        Array(5).fill(null).forEach((v, i) =>                                               // Staff lines
          ctx.fillRect(startStaffX, (topLine) + 10 * i + 60 * ind + distanceBetweenStaves * index, width - 2 * startStaffX, 1))

      }
      else if (measuresWithNotesLeft <= numberOfMeasuresPerBar) {          // If on the final line and measures don't fill the full width, truncate the bar length
        ctx.fillRect(
          width - 3 - startStaffX - barWidth / (numberOfMeasuresPerBar) * (numberOfMeasuresPerBar - measuresWithNotesLeft),
          topLine + distanceBetweenStaves * index,
          5, 101)                                                              // End staff
        ctx.fillRect(
          width - 7 - startStaffX - barWidth / (numberOfMeasuresPerBar) * (numberOfMeasuresPerBar - measuresWithNotesLeft),
          topLine + distanceBetweenStaves * index,
          1, 101)                                                              // End staff
        Array(5).fill(null).forEach((v, i) =>                                   // Staff lines
          ctx.fillRect(
            startStaffX,
            topLine + 10 * i + 60 * ind + distanceBetweenStaves * index,
            width - 2 * startStaffX - barWidth / (numberOfMeasuresPerBar) * (numberOfMeasuresPerBar - measuresWithNotesLeft),
            1)
        )
      }

    })

  })

}



// |~~~~~~~~~~~~~~ -- | Bar animation | -- ~~~~~~~~~~~~~~| \\

var x = 0
var y = 0
var dir = "FORWARD"
var start = undefined, pauseTime = 0, elapsed
var animationPaused = false
var animationStopped = true
var replay = false
let i = 0

// var songDistance = 0
var currentStaff = 0


function loop(timestamp) {
  if (start === undefined) {
    start = timestamp
    animationStopped = false;
  }
  if (animationPaused) {
    pauseTime = timestamp - start - elapsed
    window.requestAnimationFrame(loop)
    return
  }
  if (animationStopped) {
    x = 0;
    i = 0;
    start = undefined;
    pauseTime = 0;
    ctxAnim.clearRect(0, 0, ANIMATION.width, ANIMATION.height);
    return
  }

  elapsed = timestamp - start - pauseTime

  const totalTimeWhenNextNotePlayed = Object.values(trebleObject).slice(0, i).reduce((a, v) => a + v.duration, 0) * unitDistance / secondsPerBeat

  if (x + barWidth * currentStaff >=
    Object.values(trebleObject)
      .slice(0, i)
      .reduce((a, v) => a + v.duration, 0) * unitDistance / secondsPerBeat
    && i < Object.values(trebleObject).length - 1
  ) i++

  const durationOfNotesPlayed = Object.values(trebleObject).slice(0, i - 1).reduce((a, v) => a + v.duration, 0) * 1000
  const noteElapsed = elapsed - durationOfNotesPlayed
  const noteDuration = trebleObject[i - 1].duration
  // songDistance = Object.values(trebleObject).slice(0,i).reduce((a,obj) => a + obj.duration * unitDistance, 0)


  // x = (durationOfNotesPlayed*0.001 * unitDistance/secondsPerBeat) % (barWidth) + (noteElapsed*0.001/noteDuration) * unitDistance/secondsPerBeat * noteDuration
  x = (durationOfNotesPlayed * 0.001 * unitDistance / secondsPerBeat) % (barWidth) + (noteElapsed * 0.001) * unitDistance / secondsPerBeat




  var offsetToFirstLine = topLine + 1
  var totalSongDistance = Object.values(trebleObject).reduce((a, obj) => a + obj.duration * unitDistance, 0)

  ctxAnim.clearRect(0, 0, ANIMATION.width, ANIMATION.height)

  const numberOfStaves = Math.ceil(totalSongDistance / (barWidth))

  currentStaff = Math.floor(((durationOfNotesPlayed + noteElapsed + 26) * 0.001 * unitDistance / secondsPerBeat) / (barWidth))
  // SMUDGE factor, that 26 is looking 26 milliseconds into the future to determine whether the bar is within 26 milliseconds of the next line's first note. Why 26 ? Not sure, I think and hope that it is just javascript's refresh rate, hopefully it is NOT my buffer end length or my 0.25 ending note... 'cause I can't wrap my head around either of those.
  // 26 milliseconds = 0.026 * unitDistance, unitDistance = 1 beat in pixels, bpm = 30, so 2 seconds per beat, 0.026/2 beats, === 0.013 pixels, Almost certainly nothing to do with the buffer or the ending note
  // logging shows that there is a 16 to 17 ms window between each call, that is 1 / 60th of a second: the framerate.
  // This can vary between screens. Not sure if I can get access to the refresh rate programmatically

  y = distanceBetweenStaves * Math.floor((durationOfNotesPlayed * 0.001 * unitDistance / secondsPerBeat) / (barWidth))
  if (
    (x >= (totalSongDistance % (barWidth) || barWidth) /* - (5 / (secondsPerBeat * 1600 / window.innerWidth)) */
      && y === 160 * (numberOfStaves - 1))
    || y > 160 * (numberOfStaves - 1)) {
    x = 0
    i = 0
    start = undefined
    if (replay) return play();
    document.getElementById("play_image").classList.remove("hide")
    document.getElementById("randomise_image").classList.remove("hide")
    document.getElementById("stop_image").classList.add("hide")
    document.getElementById("pause_image").classList.add("hide")
    SOUND.close().then(() => SOUND = new AudioContext())
    return
  }
  ctxAnim.fillStyle = "black"
  ctxAnim.fillRect(
    startStaffX + initialOffset + 5.5 + x,
    offsetToFirstLine + y,
    1,
    99)
  // if (y === 2 * 160) return

  window.requestAnimationFrame(loop)
}


// |~~~~~~~~~~~~~~ -- | Sound | -- ~~~~~~~~~~~~~~| \\


function playSound(frequency, time, i, noteDuration) {
  const osc = SOUND.createOscillator()
  const gainNode = SOUND.createGain()
  osc.connect(gainNode)
  let gainMultiplier = 1
  if (frequency >= 200) gainMultiplier = 1
  // else if (frequency < 70) gainMultiplier = 2.5
  else if (frequency < 100) gainMultiplier = 2
  else if (frequency < 200) gainMultiplier = 1.5
  gainNode.connect(SOUND.destination)
  gainNode.gain.exponentialRampToValueAtTime(0.1 * gainMultiplier, SOUND.currentTime + time)
  // gainNode.gain.linearRampToValueAtTime(0.00001, SOUND.currentTime + noteDuration + time)
  gainNode.gain.linearRampToValueAtTime(0, SOUND.currentTime + noteDuration + time)
  // gainNode.gain.linearRampToValueAtTime(0, SOUND.currentTime + time + noteDuration + 0.1)
  osc.type = 'triangle'
  osc.frequency.value = frequency
  osc.start(SOUND.currentTime + time)
  // osc.stop(SOUND.currentTime + duration + time)
}

function play() {
  if (start) return
  // Initialisation for animation vVv - watch for namespace issues
  x = 0
  i = 0
  start = undefined
  pauseTime = 0
  animationPaused = false

  // document.getElementById("pause").innerText = "Pause"
  document.getElementById("play_image").classList.add("hide")
  document.getElementById("randomise_image").classList.add("hide")
  document.getElementById("stop_image").classList.remove("hide")
  document.getElementById("pause_image").classList.remove("hide")

  window.requestAnimationFrame(loop)

  for (let i = 0; i < Object.keys(trebleObject).length; i++) {
    const noteName = trebleObject[i].name
    const noteNumber = i
    const noteDuration = trebleObject[i].duration * secondsPerBeat
    const songElapsed = Object.values(trebleObject).slice(0, i).reduce((acc, obj) => acc + obj.duration * secondsPerBeat, 0)
    playSound(frequencyNoteMap440[noteName], songElapsed, noteNumber, noteDuration)
  }
  for (let ind = 0; ind < Object.keys(bassObject).length; ind++) {
    const noteName = bassObject[ind].name
    const noteNumber = ind
    const noteDuration = bassObject[ind].duration * secondsPerBeat
    const songElapsed = Object.values(bassObject).slice(0, ind).reduce((acc, obj) => acc + obj.duration * secondsPerBeat, 0)
    playSound(frequencyNoteMap440[noteName], songElapsed, noteNumber, noteDuration)
    if (playChords && changeScaleBass.value.match("Tritonic")[0]) {
      playSound(frequencyNoteMap440[returnScale(key + rootOctaveBass)[returnScale(key + rootOctaveBass).findIndex(val => val === noteName) + 2]], songElapsed, noteNumber, noteDuration)
      playSound(frequencyNoteMap440[returnScale(key + rootOctaveBass)[returnScale(key + rootOctaveBass).findIndex(val => val === noteName) + 2]], songElapsed, noteNumber, noteDuration)
    }
  }
}

function pausePlayback() {
  if (!SOUND) return
  if (SOUND.state === "running") {
    document.getElementById("pause_image").classList.remove("pauseImage")
    document.getElementById("pause_image").classList.add("playImage")
    SOUND.suspend().then(() => {/* document.getElementById("pause").innerText = "Unpause"; */ animationPaused = true })
  }
  else if (SOUND.state === "suspended") {
    document.getElementById("pause_image").classList.remove("playImage")
    document.getElementById("pause_image").classList.add("pauseImage")
    SOUND.resume().then(() => {/* document.getElementById("pause").innerText = "Pause"; */ animationPaused = false })
  }
  else return
}

function stopPlayback() {
  if (animationStopped) return
  document.getElementById("play_image").classList.remove("hide")
  document.getElementById("randomise_image").classList.remove("hide")
  document.getElementById("stop_image").classList.add("hide")
  document.getElementById("pause_image").classList.add("hide")
  if (SOUND.state === "running") {
    animationStopped = true
    SOUND.close().then(() => { SOUND = new AudioContext() })
  }
  else if (SOUND.state === "suspended") {
    animationPaused = false
    animationStopped = true
    document.getElementById("pause_image").classList.remove("playImage")
    document.getElementById("pause_image").classList.add("pauseImage")
    SOUND.close().then(() => {/* document.getElementById("pause").innerText = "Pause";  */SOUND = new AudioContext() })

  }
  else return
}

function toggleReplay() {
  replay = !replay
  if (replay) {
    // document.getElementById("replay").innerText = "Replay: On"
    document.getElementById("replay_image").innerText = "On"
    document.getElementById("replay_image").classList.add("rotate_replay")
  }
  else if (!replay) {
    // document.getElementById("replay").innerText = "Replay: Off"
    document.getElementById("replay_image").innerText = "Off"
    document.getElementById("replay_image").classList.remove("rotate_replay")
  }
}



function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
// randomise();
delay(100).then(() => randomise());


/* Metronome */

var METRONOME = new AudioContext()
var metronome_bpm = 120
var metronome_milliSecondsPerBeat = (60 / metronome_bpm) * 1000
var metronomeStopped = true
var metronome_start, metronome_toneIndex

var metronomeBPM = document.getElementById('metronomeBPM')
metronomeBPM.placeholder = metronome_bpm
metronomeBPM.addEventListener("change", (e) => {
  if (!parseInt(e.target.value)) return
  metronome_bpm = parseInt(e.target.value);
  metronomeBPM.placeholder = metronome_bpm
  metronome_milliSecondsPerBeat = (60 / metronome_bpm) * 1000;
  if (!metronomeStopped) {
    metronomeStopped = true
    METRONOME.close()
  }
})

function playMetronome(frequency, gainMultiplier) {
  const osc = METRONOME.createOscillator()
  const gainNode = METRONOME.createGain()
  osc.connect(gainNode)
  gainNode.connect(METRONOME.destination)
  // gainNode.gain.exponentialRampToValueAtTime(0.1, METRONOME.currentTime )
  gainNode.gain.linearRampToValueAtTime(0.1 * gainMultiplier, METRONOME.currentTime)
  gainNode.gain.linearRampToValueAtTime(0, METRONOME.currentTime + (metronome_milliSecondsPerBeat / 1000))
  osc.type = 'sine'
  osc.frequency.value = frequency
  osc.start(METRONOME.currentTime)
}

function stopMetronome() {
  if (!metronomeStopped) {
    metronomeStopped = true
    document.getElementById('stop_metronome').classList.add('hide')
    document.getElementById('start_metronome').classList.remove('hide')
    METRONOME.close()
  }
}

function startMetronome() {
  window.requestAnimationFrame((timestamp) => {
    if (metronome_start === undefined) {
      document.getElementById('start_metronome').classList.add('hide')
      document.getElementById('stop_metronome').classList.remove('hide')
      metronomeStopped = false
      metronome_start = timestamp;
      metronome_toneIndex = 0
      playMetronome(frequencyNoteMap440[builtScaleTreble[builtScaleTreble.length - 1]], 0.75)
    }
    if (metronomeStopped) {
      metronome_start = undefined
      METRONOME = new AudioContext()
      window.cancelAnimationFrame(startMetronome)
      return
    }
    var elapsed = timestamp - metronome_start
    if (parseInt(elapsed - metronome_toneIndex * metronome_milliSecondsPerBeat) >= metronome_milliSecondsPerBeat) {
      metronome_toneIndex++
      if (metronome_toneIndex % timeSignatureBeats === 0) {
        playMetronome(frequencyNoteMap440[builtScaleTreble[builtScaleTreble.length - 1]], 0.75)
      }
      else {
        playMetronome(frequencyNoteMap440[builtScaleTreble[0]], 1)
      }
    }
    window.requestAnimationFrame(startMetronome)
  })
}
