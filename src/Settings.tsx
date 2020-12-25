/* eslint-disable jsx-a11y/alt-text */

import Slider from "@material-ui/core/Slider";
import React from "react";

export const Settings = (props: {
  closeSettings: () => void;
  sfx: HTMLAudioElement[];
  ambientSound: HTMLAudioElement;
  backgroundMusic: HTMLAudioElement;
}) => {
  const { closeSettings, sfx, ambientSound, backgroundMusic } = props;
  const [sfxValue, setSfxValue] = React.useState(sfx[0].volume * 100);
  const [ambientSoundValue, setAmbientSoundValue] = React.useState(
    ambientSound.volume * 100
  );
  const [backgroundMusicValue, setBackgroundMusicValue] = React.useState(
    backgroundMusic.volume * 100
  );

  const handleSFXSlider = (
    event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    // @ts-ignore
    setSfxValue(newValue);
    for (const effect of sfx) {
      const ratio = sfxValue / 100 / sfx[0].volume;
      if (isNaN((sfxValue / 100) * ratio)) {
        effect.volume = 0;
      } else {
        effect.volume = Math.min((sfxValue / 100) * ratio, 1);
      }
    }
  };
  const handleAmbientSlider = (
    event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    // @ts-ignore
    setAmbientSoundValue(newValue);
    ambientSound.volume = ambientSoundValue / 100;
  };
  const handleBackgroundMusicSlider = (
    event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    // @ts-ignore
    setBackgroundMusicValue(newValue);
    backgroundMusic.volume = backgroundMusicValue / 100;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="closeInfoPanel">
        <span id="closeSettings" onClick={closeSettings}>
          ✕
        </span>
      </div>
      <img
        className="infoImage"
        src={process.env.PUBLIC_URL + "/images/visuals/drone-swarm.jpg"}
      />
      <h1 style={{ textAlign: "center" }}>SETTINGS</h1>
      <div id="settingsContentContainer">
        <div className="settingItem">
          <span className="settingName">Map</span>
          <span> [dropdown here]</span>
        </div>
        <div className="settingItem">
          <span className="settingName">Sound Effects</span>
          <div className="sliderContainer">
            <Slider
              value={sfxValue}
              onChange={handleSFXSlider}
              aria-labelledby="continuous-slider"
            />
          </div>
        </div>
        <div className="settingItem">
          <span className="settingName">Ambient Sounds</span>

          <div className="sliderContainer">
            <Slider
              value={ambientSoundValue}
              onChange={handleAmbientSlider}
              aria-labelledby="continuous-slider"
            />
          </div>
        </div>
        <div className="settingItem">
          <span className="settingName">Music</span>

          <div className="sliderContainer">
            <Slider
              value={backgroundMusicValue}
              onChange={handleBackgroundMusicSlider}
              aria-labelledby="continuous-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
