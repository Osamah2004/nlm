import { useEffect, useState } from "react";
import Checkbox from "./Inputs/CheckboxInput";
import NumberInput from "./Inputs/NumberInput";
import zombies from './assets/ZombieFeatures.json'
import { Editor } from "@monaco-editor/react";
import JSZip from "jszip";

/*
  "#modifications": {
    "25 Sun meta": true,
    "garg escalation": true,
    "no pf": true,
    "slower conveyor": true,
    "no power tiles": true,
    "no gold tiles": true,
    "no lily pads": true,
    "replace graves": true,
    "randomize plants": true,
    "disable sun dropper": true,
    "escalation points": 1,
    "seedpackets": 4,
    "conveyor delay": 1,
    "puffshroom lifespan": 60,
    "new icecubed plant": "tutorial"
  }
*/

const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadZip = async (files) => {
  const zip = new JSZip();
  
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'campaign_levels.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

{/*             
            <details className="details">
              <summary className="summary">egypt</summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 35 }).map((e, i) => (
                  <button
                    className="button"
                    onClick={() =>
                      handleFileClick("egypt", `egypt${i + 1}.json`)
                    }
                  >
                    egypt{i + 1}.json
                  </button>
                ))}
                <button
                  className="button"
                  onClick={() => handleFileClick("egypt", `egypt20_1.json`)}
                >
                  egypt20_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("egypt", `egypt21_1.json`)}
                >
                  egypt21_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("egypt", `egypt22_1.json`)}
                >
                  egypt22_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("egypt", `egypt24_1.json`)}
                >
                  egypt24_1.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">pirate</summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 35 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("pirate", `pirate${i + 1}.json`)
                    }
                    className="button"
                  >
                    pirate{i + 1}.json
                  </button>
                ))}
                <button
                  className="button"
                  onClick={() => handleFileClick("pirate", "pirate18_1.json")}
                >
                  pirate18_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("pirate", "pirate20_1.json")}
                >
                  pirate20_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("pirate", "pirate22_1.json")}
                >
                  pirate22_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("pirate", "pirate23_1.json")}
                >
                  pirate23_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("pirate", "pirate24_1.json")}
                >
                  pirate24_1.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">cowboy</summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 35 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("cowboy", `cowboy${i + 1}.json`)
                    }
                    className="button"
                  >
                    cowboy{i + 1}.json
                  </button>
                ))}
                <button
                  className="button"
                  onClick={() => handleFileClick("cowboy", "cowboy12_1.json")}
                >
                  cowboy12_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("cowboy", "cowboy18_1.json")}
                >
                  cowboy18_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("cowboy", "cowboy22_1.json")}
                >
                  cowboy22_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("cowboy", "cowboy23_1.json")}
                >
                  cowboy23_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("cowboy", "cowboy24_1.json")}
                >
                  cowboy24_1.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">future </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 35 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("future", `future${i + 1}.json`)
                    }
                    className="button"
                  >
                    future{i + 1}.json
                  </button>
                ))}
                <button
                  className="button"
                  onClick={() => handleFileClick("future", `future10_1.json`)}
                >
                  future10_1.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("future", `future10_2.json`)}
                >
                  future10_2.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("future", `future10_3.json`)}
                >
                  future10_3.json
                </button>
                <button
                  className="button"
                  onClick={() => handleFileClick("future", `future10_4.json`)}
                >
                  future10_4.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">dark </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 30 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("dark", `dark${i + 1}.json`)}
                    className="button"
                  >
                    dark{i + 1}.json
                  </button>
                ))}
                <button
                  className="button"
                  onClick={() => handleFileClick("dark", `dark18_1.json`)}
                >
                  dark18_1.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">beach </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 42 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("beach", `beach${i + 1}.json`)
                    }
                    className="button"
                  >
                    beach{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">iceage </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 40 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("iceage", `iceage${i + 1}.json`)
                    }
                    className="button"
                  >
                    iceage{i + 1}.json
                  </button>
                ))}
                <button
                  onClick={() => handleFileClick("iceage", `iceage24_B.json`)}
                  className="button"
                >
                  iceage24_B.json
                </button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">lostcity </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 42 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("lostcity", `lostcity${i + 1}.json`)
                    }
                    className="button"
                  >
                    lostcity{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">kongfu </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 48 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("kongfu", `kongfu${i + 1}.json`)
                    }
                    className="button"
                  >
                    kongfu{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">eighties </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 32 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("eighties", `eighties${i + 1}.json`)
                    }
                    className="button"
                  >
                    eighties{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">dino </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 42 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("dino", `dino${i + 1}.json`)}
                    className="button"
                  >
                    dino{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">sky </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 16 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("sky", `sky${i + 1}.json`)}
                    className="button"
                  >
                    sky{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">bank_theft </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 5 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("bank_theft", `bank_theft${i + 1}.json`)}
                    className="button"
                  >
                    bank_theft{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">modern </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 44 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("modern", `modern${i + 1}.json`)
                    }
                    className="button"
                  >
                    modern{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">flowerpot </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 3 }).map((e, i) => (
                  <button
                    onClick={() =>
                      handleFileClick("flowerpot", `flowerpot${i + 1}.json`)
                    }
                    className="button"
                  >
                    flowerpot{i + 1}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">ghostpepper </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 4 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("ghostpepper", `ghostpepper${i}.json`)}
                    className="button"
                  >
                    ghostpepper{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">parsnip </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 8 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("parsnip", `parsnip${i}.json`)}
                    className="button"
                  >
                    parsnip{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
            <summary className="summary">enlighten</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 16 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("enlighten", `enlighten${i}.json`)}
                  className="button"
                >
                  enlighten{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">gloomshroom</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 16 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("gloomshroom", `gloomshroom${i}.json`)}
                  className="button"
                >
                  gloomshroom{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">goldbloom</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 8 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("goldbloom", `goldbloom${i}.json`)}
                  className="button"
                >
                  goldbloom{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">icebloom</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("icebloom", `icebloom${i}.json`)}
                  className="button"
                >
                  icebloom{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">iceshroom</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("iceshroom", `iceshroom${i}.json`)}
                  className="button"
                >
                  iceshroom{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">meteorflower</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 8 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("meteorflower", `meteorflower${i}.json`)}
                  className="button"
                >
                  meteorflower{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">parsnip</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("parsnip", `parsnip${i}.json`)}
                  className="button"
                >
                  parsnip{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">plantern</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("plantern", `plantern${i}.json`)}
                  className="button"
                >
                  plantern{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">reinforce</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 24 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("reinforce", `reinforce${i}.json`)}
                  className="button"
                >
                  reinforce{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">sapfling</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 16 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("sapfling", `sapfling${i}.json`)}
                  className="button"
                >
                  sapfling{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">seashooter</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 8 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("seashooter", `seashooter${i}.json`)}
                  className="button"
                >
                  seashooter{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">solartomato</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("solartomato", `solartomato${i}.json`)}
                  className="button"
                >
                  solartomato{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">squash</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 8 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("squash", `squash${i}.json`)}
                  className="button"
                >
                  squash{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">strawburst</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 16 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("strawburst", `strawburst${i}.json`)}
                  className="button"
                >
                  strawburst{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">sweetpotato</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 12 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("sweetpotato", `sweetpotato${i}.json`)}
                  className="button"
                >
                  sweetpotato{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">umbrellaleaf</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 24 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("umbrellaleaf", `umbrellaleaf${i}.json`)}
                  className="button"
                >
                  umbrellaleaf{i}.json
                </button>
              ))}
            </div>
          </details>

          <details className="details">
            <summary className="summary">vamporcini</summary>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 8 }).map((e, i) => (
                <button
                  onClick={() => handleFileClick("vamporcini", `vamporcini${i}.json`)}
                  className="button"
                >
                  vamporcini{i}.json
                </button>
              ))}
            </div>
          </details>
            <details className="details">
              <summary className="summary">iceshroom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 12 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("iceshroom", `iceshroom${i}.json`)}
                    className="button"
                  >
                    iceshroom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">icebloom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 12 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("icebloom", `icebloom${i}.json`)}
                    className="button"
                  >
                    icebloom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">goldbloom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 8 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("goldbloom", `goldbloom${i}.json`)}
                    className="button"
                  >
                    goldbloom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">gloomshroom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 16 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("gloomshroom", `gloomshroom${i}.json`)}
                    className="button"
                  >
                    gloomshroom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">enlighten </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 16 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("enlighten", `enlighten${i}.json`)}
                    className="button"
                  >
                    enlighten{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">gloomshroom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 4 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("gloomshroom", `gloomshroom${i}.json`)}
                    className="button"
                  >
                    gloomshroom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">epic_beghouled </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("epic_beghouled", `epic_beghouled${i}.json`)}
                    className="button"
                  >
                    epic_beghouled{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">electriccurrant </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("electriccurrant", `electriccurrant${i}.json`)}
                    className="button"
                  >
                    electriccurrant{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">doomshroom </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("doomshroom", `doomshroom${i}.json`)}
                    className="button"
                  >
                    doomshroom{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">conceal </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 12 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("conceal", `conceal${i}.JSON`)}
                    className="button"
                  >
                    conceal{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">buttercup </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("buttercup", `buttercup${i}.json`)}
                    className="button"
                  >
                    buttercup{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">bloominghearts </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("bloominghearts", `bloominghearts${i}.json`)}
                    className="button"
                  >
                    bloominghearts{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">aloe </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("aloe", `aloe${i}.json`)}
                    className="button"
                  >
                    aloe{i}.json
                  </button>
                ))}
              </div>
            </details>
            <details className="details">
              <summary className="summary">appease </summary>
              <div className="grid grid-cols-3 gap-0.5">
                <button onClick={() => handleFileClick('appea1', `appea1_1.json`)} className="button">appea1_1.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_2.json`)} className="button">appea1_2.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_3.json`)} className="button">appea1_3.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_4.json`)} className="button">appea1_4.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_5.json`)} className="button">appea1_5.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_6.json`)} className="button">appea1_6.json</button>
                <button onClick={() => handleFileClick('appea1', `appea1_7.json`)} className="button">appea1_7.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_1.json`)} className="button">appea2_1.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_2.json`)} className="button">appea2_2.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_3.json`)} className="button">appea2_3.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_4.json`)} className="button">appea2_4.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_5.json`)} className="button">appea2_5.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_6.json`)} className="button">appea2_6.json</button>
                <button onClick={() => handleFileClick('appea2', `appea2_7.json`)} className="button">appea2_7.json</button>
              </div>
            </details>
            <details className="details">
              <summary className="summary">atombomb </summary>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 7 }).map((e, i) => (
                  <button
                    onClick={() => handleFileClick("atombomb", `atombomb${i}.json`)}
                    className="button"
                  >
                    atombomb{i}.json
                  </button>
                ))}
              </div>
            </details> */}

// Add this configuration at the top of your Campaign component or in a separate file
const CAMPAIGN_FOLDERS = {
  // Main campaign worlds (starting from 1)
  egypt: { count: 35, startFrom: 1, specialFiles: ['egypt20_1.json', 'egypt21_1.json', 'egypt22_1.json', 'egypt24_1.json'] },
  pirate: { count: 35, startFrom: 1, specialFiles: ['pirate18_1.json', 'pirate20_1.json', 'pirate22_1.json', 'pirate23_1.json', 'pirate24_1.json'] },
  cowboy: { count: 35, startFrom: 1, specialFiles: ['cowboy12_1.json', 'cowboy18_1.json', 'cowboy22_1.json', 'cowboy23_1.json', 'cowboy24_1.json'] },
  future: { count: 35, startFrom: 1, specialFiles: ['future10_1.json', 'future10_2.json', 'future10_3.json', 'future10_4.json'] },
  dark: { count: 30, startFrom: 1, specialFiles: ['dark18_1.json'] },
  beach: { count: 42, startFrom: 1, specialFiles: [] },
  iceage: { count: 40, startFrom: 1, specialFiles: ['iceage24_B.json'] },
  lostcity: { count: 42, startFrom: 1, specialFiles: [] },
  kongfu: { count: 48, startFrom: 1, specialFiles: [] },
  eighties: { count: 32, startFrom: 1, specialFiles: [] },
  dino: { count: 42, startFrom: 1, specialFiles: [] },
  sky: { count: 16, startFrom: 1, specialFiles: [] },
  modern: { count: 44, startFrom: 1, specialFiles: [] },
  bank_theft: { count: 5, startFrom: 1, specialFiles: [] },
  flowerpot: { count: 3, startFrom: 1, specialFiles: [] },
  
  // Plant-specific folders (starting from 0)
  ghostpepper: { count: 4, startFrom: 0, specialFiles: [] },
  parsnip: { count: 6, startFrom: 0, specialFiles: [] },
  enlighten: { count: 8, startFrom: 0, specialFiles: [] },
  gloomshroom: { count: 8, startFrom: 0, specialFiles: [] },
  goldbloom: { count: 4, startFrom: 0, specialFiles: [] },
  icebloom: { count: 6, startFrom: 0, specialFiles: [] },
  iceshroom: { count: 6, startFrom: 0, specialFiles: [] },
  meteorflower: { count: 4, startFrom: 0, specialFiles: [] },
  plantern: { count: 6, startFrom: 0, specialFiles: [] },
  reinforce: { count: 12, startFrom: 0, specialFiles: [] },
  sapfling: { count: 8, startFrom: 0, specialFiles: [] },
  seashooter: { count: 4, startFrom: 0, specialFiles: [] },
  solartomato: { count: 6, startFrom: 0, specialFiles: [] },
  squash: { count: 4, startFrom: 0, specialFiles: [] },
  strawburst: { count: 8, startFrom: 0, specialFiles: [] },
  sweetpotato: { count: 6, startFrom: 0, specialFiles: [] },
  umbrellaleaf: { count: 12, startFrom: 0, specialFiles: [] },
  vamporcini: { count: 4, startFrom: 0, specialFiles: [] },
  
  // Epic/minigame folders
  epic_beghouled: { count: 6, startFrom: 0, specialFiles: [] },
  electriccurrant: { count: 6, startFrom: 0, specialFiles: [] },
  doomshroom: { count: 6, startFrom: 0, specialFiles: [] },
  conceal: { count: 12, startFrom: 0, specialFiles: [], fileExtension: '.JSON' },
  buttercup: { count: 6, startFrom: 0, specialFiles: [] },
  bloominghearts: { count: 6, startFrom: 0, specialFiles: [] },
  aloe: { count: 6, startFrom: 0, specialFiles: [] },
  atombomb: { count: 7, startFrom: 0, specialFiles: [] },
  
  // Special appease folders (different naming pattern)
  appea1: { isSpecial: true, buttons: Array.from({ length: 7 }, (_, i) => `appea1_${i + 1}.json`) },
  appea2: { isSpecial: true, buttons: Array.from({ length: 7 }, (_, i) => `appea2_${i + 1}.json`) },
};

// Create a reusable FolderSection component
const FolderSection = ({ folderName, config, onFileClick }) => {
  const { count, startFrom = 0, specialFiles = [], fileExtension = '.json', isSpecial, buttons } = config;
  
  if (isSpecial) {
    return (
      <details className="details">
        <summary className="summary">{folderName}</summary>
        <div className="grid grid-cols-3 gap-0.5">
          {buttons.map((fileName) => (
            <button
              key={fileName}
              onClick={() => onFileClick(folderName, fileName)}
              className="button"
            >
              {fileName}
            </button>
          ))}
        </div>
      </details>
    );
  }
  
  return (
    <details className="details">
      <summary className="summary">{folderName}</summary>
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: count }).map((_, i) => {
          const fileName = `${folderName}${i + startFrom}${fileExtension}`;
          return (
            <button
              key={fileName}
              onClick={() => onFileClick(folderName, fileName)}
              className="button"
            >
              {fileName}
            </button>
          );
        })}
        {specialFiles.map((fileName) => (
          <button
            key={fileName}
            onClick={() => onFileClick(folderName, fileName)}
            className="button"
          >
            {fileName}
          </button>
        ))}
      </div>
    </details>
  );
};

const Campaign = () => {
    const [modifications,setModifications] = useState({})
    const [monacoObject, setMonacoObject] = useState({})
    const [fileName,setFilename] = useState('')
    const [isDownloadingZip, setIsDownloadingZip] = useState(false)
    const zombieList = zombies['ZOMBIES'].map(e => e.CODENAME)

    const handleModificationChange = (level,stage) => {
        let monacoCopy = level || ({...monacoObject})
        let modules = monacoCopy.objects[0].objdata['Modules']
        if (modifications['25 sun meta']) {
            modules.push("RTID(PlantModifications@CurrentLevel)")
            monacoCopy['objects'].push({
      "aliases": [
        "PlantModifications"
      ],
      "objclass": "PlantModifierProperties",
      "objdata": {
        "HidePlantfood": true,
        "SuppressParticle": true,
        "List": [
          {
            "Type": "primalsunflower",
            "NewObjdata": {
              "SunValue": [
                37.5
              ]
            }
          },
          {
            "Type": "enlightenmint",
            "NewObjdata": {
              "SunProduction": [
                75
              ]
            }
          },
          {
            "Type": "sunflower",
            "NewObjdata": {
              "SunValue": [
                25
              ]
            }
          },
          {
            "Type": "solartomato",
            "NewObjdata": {
              "SunValuePerZombie": [
                25
              ]
            }
          },
          {
            "Type": "marigold_yellow",
            "NewObjdata": {
              "SunDropValue": [
                75
              ]
            }
          },
          {
            "Type": "twinsunflower",
            "NewObjdata": {
              "SunValue": [
                50
              ]
            }
          },
          {
            "Type": "shinevine",
            "NewObjdata": {
              "ProduceSunValue": [
                25
              ]
            }
          },
          {
            "Type": "solarsage",
            "NewObjdata": {
              "EnlightenSunValue": [
                25
              ]
            }
          },
          {
            "Type": "toadstool",
            "NewObjdata": {
              "SunProducePerZombie": [
                25
              ]
            }
          },
          {
            "Type": "toadstool",
            "NewObjdata": {
              "SunProducePerZombie": [
                25
              ]
            }
          },
          {
            "Type": "toadstool",
            "NewObjdata": {
              "SunProducePerZombie": [
                25
              ]
            }
          },
          {
            "Type": "sunshroom",
            "NewObjdata": {
              "SunValue": 12.5,
              "SunValueList": [
                12.5,
                25,
                37.5
              ]
            }
          },
          {
            "Type": "goldbloom",
            "NewObjdata": {
              "SunCost": 0,
              "ProduceValue0": 50,
              "ProduceValue1": 62.5,
              "ProduceValue2": 75
            }
          }
        ]
      }
                })
            if (modules.some(e => e === 'RTID(DefaultSunDropper@LevelModules)')) {
                modules.splice(
                    modules.findIndex(f => f === 'RTID(DefaultSunDropper@LevelModules)'),
                    1,
                    "RTID(DefaultSunDropper@CurrentLevel)"
                )
                monacoCopy['objects'].push(...[{
      "objclass": "SunDropperProperties",
      "aliases": [
        "DefaultSunDropper"
      ],
      "objdata": {
        "InitialSunDropDelay": 2,
        "SunCountdownBase": 6,
        "SunCountdownRange": 3,
        "SunCountdownIncreasePerSun": 0.1,
        "SunCountdownMax": 12,
        "Value": 25
      }
    }])
            }
        }
        if (modifications['garg escalation']){
            if (monacoCopy['objects'][0].objdata.FirstRewardParam === 'worldkey') {
                const newWavesIndex = monacoCopy['objects'].slice(1).findIndex(f => f?.aliases[0] === 'NewWaves') + 1;
                monacoCopy['objects'][newWavesIndex]['objdata']['DynamicZombies'][4]['ZombiePool'].push(`RTID(${stage}_gargantuar@ZombieTypes)`)
                monacoCopy['objects'][newWavesIndex]['objdata']['DynamicZombies'][5]['ZombiePool'].push(`RTID(${stage}_gargantuar@ZombieTypes)`)
                monacoCopy['objects'][newWavesIndex]['objdata']['DynamicZombies'][6]['ZombiePool'].push(`RTID(${stage}_gargantuar@ZombieTypes)`)
            }
        }
        if (modifications['no pf']) {
            monacoCopy['objects'].forEach((e,i) => {
                if (e.objclass === 'SpawnZombiesJitteredWaveActionProps') {
                    monacoCopy['objects'][i]['objdata'].AdditionalPlantfood = 0
                    monacoCopy['objects'][i]['objdata'].DynamicPlantfood = [
          1,
          1,
          1,
          0,
          0,
          0,
          0
        ]
                }
            })
        }
        if (modifications['no power tiles']) {
            const futureLinkedTiles = modules.findIndex(f => f === "RTID(FutureLinkedTileGroups@CurrentLevel)")
            const powerTileTutorial = modules.findIndex(f => f === "RTID(FutureLinkedTileGroups@CurrentLevel)")
            futureLinkedTiles !== -1 ?
            modules.splice(futureLinkedTiles,1) : '';
            powerTileTutorial !== -1 ?
            modules.splice(powerTileTutorial,1) : '';
        }
        if (modifications['no gold tiles']) {
            const goldTiles = modules.findIndex(f => f === 'RTID(GoldTiles@CurrentLevel)')
            goldTiles !== -1 ?
            modules.splice(goldTiles,1) : '';
        }
        if (modifications['no lily pads']) {
            const lilyPads = modules.findIndex(f => f === 'RTID(LilypadPlacement@CurrentLevel)')
            lilyPads !== -1 ? modules.splice(lilyPads,1) : ''
        }
        if (modifications['disable sun dropper']) {
            const dropper = modules.findIndex(f => f.includes('DefaultSunDropper'))
            dropper !== -1 ? modules.splice(dropper,1) : ''
        }
        if (modifications['escalation points']) {
            const waveManagerProps = monacoCopy['objects'].findIndex(f => f.objclass === 'WaveManagerProperties');
            const waveManagerObjdata = monacoCopy['objects'][waveManagerProps]['objdata']
            if (waveManagerObjdata['WaveSpendingPointIncrement']){
              waveManagerObjdata.WaveSpendingPointIncrement = waveManagerObjdata.WaveSpendingPointIncrement * modifications['escalation points']
            }
        }
        if (modifications['replace graves']) {
          console.log('test2')
          const graveProps = monacoCopy['objects'].findIndex(f => f.objclass === 'GravestoneProperties')
          if (graveProps !== -1) {
            monacoCopy['objects'][graveProps]['objdata']['ForceSpawnData'] =
            monacoCopy['objects'][graveProps]['objdata']['ForceSpawnData'].map(e => ({...e,TypeName:'gravestone_dark'}));
            console.log('test')
            monacoCopy['objects'].forEach((e,i) => {
              if (e.objclass === 'SpawnGravestonesWaveActionProps') {
                const isGravestoneDark = e['objdata']['GravestonePool'][0].Type === 'RTID(gravestone_dark@GridItemTypes)'
                isGravestoneDark ?
                e['objdata']['GravestonePool'].forEach(grave => grave.Type = 'RTID(gravestone_dark@GridItemTypes)') : ''
              }
            })
          }
        }
        if (modifications['no mowers']) {
          const mowerIndex = modules.findIndex(f => f.includes('Mowers'))
          mowerIndex !== -1 ? modules.splice(mowerIndex,1) : ''
        }
        if (modifications['seedpackets']) {
          const seedbankIndex = monacoCopy['objects'].findIndex(f => f.objclass === 'SeedBankProperties');
          seedbankIndex !== -1 ? monacoCopy['objects'][seedbankIndex].objdata.OverrideSeedSlotsCount = modifications['seedpackets'] : ''
        }
        if (modifications['conveyor delay']) {
          const conveyorIndex = monacoCopy['objects'].findIndex(f => f.objclass === 'ConveyorSeedBankProperties')
          if (conveyorIndex !== -1) {
            let dropDelay = monacoCopy['objects'][conveyorIndex].objdata.DropDelayConditions;
            dropDelay.forEach((e,i) => {
              e.Delay *= modifications['conveyor delay']
            })
          }
        }
        if (modifications['puffshroom lifespan']) {
          modules.push('RTID(puffshroomLifespan@CurrentLevel)')
          monacoCopy['objects'].push({
            aliases:['puffshroomLifespan'],
            objclass: "PlantModifierProperties",
            objdata: {
              HidePlantfood: true,
              SuppressParticle: true,
              List:[{
                "Type": "puffshroom",
                "NewObjdata": {
                  "LifeSpan": [
                    modifications['puffshroom lifespan']
                  ]
                }
              }]
            }
        })
        }
        if (modifications['troglobite iceblock']) {
          monacoCopy = JSON.stringify(monacoCopy)
          if (monacoCopy.includes('RTID(iceage_troglobite@ZombieTypes)')) {
            
            monacoCopy = monacoCopy.replaceAll("RTID(iceage_troglobite@ZombieTypes)","RTID(iceage_troglobite@CurrentLevel)")
            monacoCopy = JSON.parse(monacoCopy)
          
            monacoCopy['objects'].push([
  {
    "objclass": "ZombieType",
    "aliases": [
      "iceage_troglobite"
    ],
    "objdata": {
      "Properties": "RTID(iceage_troglobite@.)",
      "ZombieBasedOn": "iceage_troglobite"
    }
  },
  {
    "objclass": "ZombieProperties",
    "aliases": [
      "iceage_troglobite"
    ],
    "objdata": {
      "ChillInsteadOfFreeze": true,
      "NumberOfIceblocksToSpawnWith": 3,
      "WalkSPS": 0.185,
      "EatDPS": 100,
      "Toughness": 470,
      "WavePointCost": 600,
      "Weight": 3500,
      "HitRect": "RTID(BullyHitRect@RectangleProps)",
      "AttackRect": "RTID(BullyAttackRect@RectangleProps)",
      "ImpTypes": [
        modifications['troglobite iceblock']
      ]
    }
  }
            ])
          }
          else monacoCopy = JSON.parse(monacoCopy)
        }
        if (modifications['new icecubed plant']) {
          const newIcecube = modifications['new icecubed plant']
          const plantIceblockIndex = modules.findIndex(f => f === 'RTID(FrozenPlantPlacement@CurrentLevel)')
          const frozenPlantObjdataIndex = monacoCopy['objects'].findIndex(f => f.objclass === "InitialPlantProperties")
          let initialFrozenPlants = monacoCopy['objects'][frozenPlantObjdataIndex];
          initialFrozenPlants.objclass = 'InitialZombieProperties'
          newIcecube === 'remove' ? monacoCopy['objects'][0]['objdata']['Modules'].splice(plantIceblockIndex,1) : '';
          if (newIcecube !== '-') {
            initialFrozenPlants['objdata']['InitialPlantPlacements'].forEach(e => e.TypeName = modifications['new icecubed plant'])
            initialFrozenPlants['objdata']['InitialZombiePlacements'] = initialFrozenPlants['objdata']['InitialPlantPlacements']
            delete initialFrozenPlants['objdata']['InitialPlantPlacements']
          }
        }
        return monacoCopy
    }

    useEffect(() => {
        let temp = ({...monacoObject})
        if (temp.objects) {
            temp['#modifications'] = modifications
        }
        else temp['#comment'] = 'objects key not found';
    },[modifications])

    const handleCheckbox = (checked,label) => {
        let temp = ({...modifications})
        temp[label] = checked
        Object.keys(temp).forEach(e => {
            if (temp[e] === false) {
                delete temp[e]
            }
        })
        console.log(temp)
        setModifications(temp)
    }

    const handleNumber = (key,value) => {
        let temp = ({...modifications})
        temp[key] = value
        setModifications(temp)
    }

    const handleFileClick = (world, filename) => {
        setFilename(filename)
        fetch(`${world}/${filename}`)
        .then(r => r.json())
        .then(data => {
            let temp = ({...data})
            temp['#modifications'] = modifications
            let objects = temp.objects
            delete temp.objects
            delete temp.version
            temp.objects = objects
            temp.version = 1
            setMonacoObject(handleModificationChange(temp,world))
        })
    }

    const handleDownloadCurrent = () => {
  if (!fileName) {
    alert('No file loaded. Please select a level first.');
    return;
  }
  
  const jsonContent = JSON.stringify(monacoObject, null, 2);
  downloadFile(jsonContent, fileName);
};

const handleDownloadAll = async () => {
    setIsDownloadingZip(true);
    
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed bottom-20 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50';
    loadingToast.textContent = 'Generating zip file...';
    document.body.appendChild(loadingToast);
    
    try {
        const allLevels = {};
        let totalFiles = 0;
        let processedFiles = 0;
        
        // Capture current modifications at the start
        const currentModifications = { ...modifications };
        
        // Calculate total files to fetch
        const fetchTasks = [];
        
        for (const [folderName, config] of Object.entries(CAMPAIGN_FOLDERS)) {
            const { count, startFrom = 1, specialFiles = [], fileExtension = '.json', isSpecial, buttons } = config;
            
            if (isSpecial && buttons) {
                for (const button of buttons) {
                    totalFiles++;
                    fetchTasks.push({ folderName, fileName: button });
                }
            } else {
                // Regular numbered files
                for (let i = 0; i < count; i++) {
                    const fileName = `${folderName}${i + startFrom}${fileExtension}`;
                    totalFiles++;
                    fetchTasks.push({ folderName, fileName });
                }
                
                // Special files
                for (const specialFile of specialFiles) {
                    totalFiles++;
                    fetchTasks.push({ folderName, fileName: specialFile });
                }
            }
        }
        
        // Create a wrapper function that uses the captured modifications
        const applyModifications = (level, stage) => {
            // Temporarily replace the component's modifications with our captured ones
            const originalModifications = modifications;
            const tempModifications = { ...currentModifications };
            
            // Manually apply modifications since we can't change state in a loop
            let monacoCopy = JSON.parse(JSON.stringify(level));
            let modules = monacoCopy.objects[0].objdata['Modules'];
            
            if (tempModifications['25 sun meta']) {
                modules.push("RTID(PlantModifications@CurrentLevel)");
                monacoCopy['objects'].push({
                    "aliases": ["PlantModifications"],
                    "objclass": "PlantModifierProperties",
                    "objdata": {
                        "HidePlantfood": true,
                        "SuppressParticle": true,
                        "List": [
                            { "Type": "primalsunflower", "NewObjdata": { "SunValue": [37.5] } },
                            { "Type": "enlightenmint", "NewObjdata": { "SunProduction": [75] } },
                            { "Type": "sunflower", "NewObjdata": { "SunValue": [25] } },
                            { "Type": "solartomato", "NewObjdata": { "SunValuePerZombie": [25] } },
                            { "Type": "marigold_yellow", "NewObjdata": { "SunDropValue": [75] } },
                            { "Type": "twinsunflower", "NewObjdata": { "SunValue": [50] } },
                            { "Type": "shinevine", "NewObjdata": { "ProduceSunValue": [25] } },
                            { "Type": "solarsage", "NewObjdata": { "EnlightenSunValue": [25] } },
                            { "Type": "toadstool", "NewObjdata": { "SunProducePerZombie": [25] } },
                            { "Type": "toadstool", "NewObjdata": { "SunProducePerZombie": [25] } },
                            { "Type": "toadstool", "NewObjdata": { "SunProducePerZombie": [25] } },
                            { "Type": "sunshroom", "NewObjdata": { "SunValue": 12.5, "SunValueList": [12.5, 25, 37.5] } },
                            { "Type": "goldbloom", "NewObjdata": { "SunCost": 0, "ProduceValue0": 50, "ProduceValue1": 62.5, "ProduceValue2": 75 } }
                        ]
                    }
                });
                
                if (modules.some(e => e === 'RTID(DefaultSunDropper@LevelModules)')) {
                    const dropperIndex = modules.findIndex(f => f === 'RTID(DefaultSunDropper@LevelModules)');
                    modules[dropperIndex] = "RTID(DefaultSunDropper@CurrentLevel)";
                    monacoCopy['objects'].push({
                        "objclass": "SunDropperProperties",
                        "aliases": ["DefaultSunDropper"],
                        "objdata": {
                            "InitialSunDropDelay": 2,
                            "SunCountdownBase": 6,
                            "SunCountdownRange": 3,
                            "SunCountdownIncreasePerSun": 0.1,
                            "SunCountdownMax": 12,
                            "Value": 25
                        }
                    });
                }
            }
            
            if (tempModifications['garg escalation'] && monacoCopy['objects'][0].objdata.FirstRewardParam === 'worldkey') {
                const newWavesIndex = monacoCopy['objects'].slice(1).findIndex(f => f?.aliases[0] === 'NewWaves') + 1;
                if (newWavesIndex > 0) {
                    for (let i = 4; i <= 6; i++) {
                        if (monacoCopy['objects'][newWavesIndex]['objdata']['DynamicZombies'][i]) {
                            monacoCopy['objects'][newWavesIndex]['objdata']['DynamicZombies'][i]['ZombiePool'].push(`RTID(${stage}_gargantuar@ZombieTypes)`);
                        }
                    }
                }
            }
            
            if (tempModifications['no pf']) {
                monacoCopy['objects'].forEach((e, i) => {
                    if (e.objclass === 'SpawnZombiesJitteredWaveActionProps') {
                        monacoCopy['objects'][i]['objdata'].AdditionalPlantfood = 0;
                        monacoCopy['objects'][i]['objdata'].DynamicPlantfood = [1, 1, 1, 0, 0, 0, 0];
                    }
                });
            }
            
            if (tempModifications['no power tiles']) {
                const tileIndex = modules.findIndex(f => f === "RTID(FutureLinkedTileGroups@CurrentLevel)");
                if (tileIndex !== -1) modules.splice(tileIndex, 1);
            }
            
            if (tempModifications['no gold tiles']) {
                const goldIndex = modules.findIndex(f => f === 'RTID(GoldTiles@CurrentLevel)');
                if (goldIndex !== -1) modules.splice(goldIndex, 1);
            }
            
            if (tempModifications['no lily pads']) {
                const lilyIndex = modules.findIndex(f => f === 'RTID(LilypadPlacement@CurrentLevel)');
                if (lilyIndex !== -1) modules.splice(lilyIndex, 1);
            }
            
            if (tempModifications['disable sun dropper']) {
                const dropperIndex = modules.findIndex(f => f.includes('DefaultSunDropper'));
                if (dropperIndex !== -1) modules.splice(dropperIndex, 1);
            }
            
            if (tempModifications['escalation points']) {
                const waveManagerIndex = monacoCopy['objects'].findIndex(f => f.objclass === 'WaveManagerProperties');
                if (waveManagerIndex !== -1 && monacoCopy['objects'][waveManagerIndex]['objdata']['WaveSpendingPointIncrement']) {
                    monacoCopy['objects'][waveManagerIndex]['objdata']['WaveSpendingPointIncrement'] *= tempModifications['escalation points'];
                }
            }
            
            if (tempModifications['no mowers']) {
                const mowerIndex = modules.findIndex(f => f.includes('Mowers'));
                if (mowerIndex !== -1) modules.splice(mowerIndex, 1);
            }
            
            if (tempModifications['seedpackets']) {
                const seedbankIndex = monacoCopy['objects'].findIndex(f => f.objclass === 'SeedBankProperties');
                if (seedbankIndex !== -1) {
                    monacoCopy['objects'][seedbankIndex].objdata.OverrideSeedSlotsCount = tempModifications['seedpackets'];
                }
            }
            
            if (tempModifications['conveyor delay']) {
                const conveyorIndex = monacoCopy['objects'].findIndex(f => f.objclass === 'ConveyorSeedBankProperties');
                if (conveyorIndex !== -1 && monacoCopy['objects'][conveyorIndex].objdata.DropDelayConditions) {
                    monacoCopy['objects'][conveyorIndex].objdata.DropDelayConditions.forEach(condition => {
                        condition.Delay *= tempModifications['conveyor delay'];
                    });
                }
            }
            
            if (tempModifications['puffshroom lifespan']) {
                modules.push('RTID(puffshroomLifespan@CurrentLevel)');
                monacoCopy['objects'].push({
                    aliases: ['puffshroomLifespan'],
                    objclass: "PlantModifierProperties",
                    objdata: {
                        HidePlantfood: true,
                        SuppressParticle: true,
                        List: [{
                            "Type": "puffshroom",
                            "NewObjdata": {
                                "LifeSpan": [tempModifications['puffshroom lifespan']]
                            }
                        }]
                    }
                });
            }
            
            if (tempModifications['troglobite iceblock']) {
                let stringified = JSON.stringify(monacoCopy);
                if (stringified.includes('RTID(iceage_troglobite@ZombieTypes)')) {
                    stringified = stringified.replaceAll("RTID(iceage_troglobite@ZombieTypes)", "RTID(iceage_troglobite@CurrentLevel)");
                    monacoCopy = JSON.parse(stringified);
                    monacoCopy['objects'].push([
                        {
                            "objclass": "ZombieType",
                            "aliases": ["iceage_troglobite"],
                            "objdata": {
                                "Properties": "RTID(iceage_troglobite@.)",
                                "ZombieBasedOn": "iceage_troglobite"
                            }
                        },
                        {
                            "objclass": "ZombieProperties",
                            "aliases": ["iceage_troglobite"],
                            "objdata": {
                                "ChillInsteadOfFreeze": true,
                                "NumberOfIceblocksToSpawnWith": 3,
                                "WalkSPS": 0.185,
                                "EatDPS": 100,
                                "Toughness": 470,
                                "WavePointCost": 600,
                                "Weight": 3500,
                                "HitRect": "RTID(BullyHitRect@RectangleProps)",
                                "AttackRect": "RTID(BullyAttackRect@RectangleProps)",
                                "ImpTypes": [tempModifications['troglobite iceblock']]
                            }
                        }
                    ]);
                }
            }
            
            if (tempModifications['new icecubed plant']) {
                const newIcecube = tempModifications['new icecubed plant'];
                const plantIceblockIndex = modules.findIndex(f => f === 'RTID(FrozenPlantPlacement@CurrentLevel)');
                const frozenPlantObjdataIndex = monacoCopy['objects'].findIndex(f => f.objclass === "InitialPlantProperties");
                let initialFrozenPlants = monacoCopy['objects'][frozenPlantObjdataIndex];
                initialFrozenPlants.objclass = 'InitialZombieProperties';
                if (newIcecube === 'remove') {
                    monacoCopy['objects'][0]['objdata']['Modules'].splice(plantIceblockIndex, 1);
                }
                if (newIcecube !== '-') {
                    initialFrozenPlants['objdata']['InitialPlantPlacements'].forEach(e => e.TypeName = newIcecube);
                    initialFrozenPlants['objdata']['InitialZombiePlacements'] = initialFrozenPlants['objdata']['InitialPlantPlacements'];
                    delete initialFrozenPlants['objdata']['InitialPlantPlacements'];
                }
            }
            
            return monacoCopy;
        };
        
        // Fetch all files with progress tracking
        const fetchPromises = fetchTasks.map(async ({ folderName, fileName }) => {
            try {
                const response = await fetch(`${folderName}/${fileName}`);
                if (!response.ok) {
                    console.warn(`Failed to fetch ${folderName}/${fileName}`);
                    return null;
                }
                
                let data = await response.json();
                
                // Apply modifications using the captured function
                const modifiedData = applyModifications(data, folderName);

                // Create a new object with #modifications first
                const finalData = {
                    '#modifications': currentModifications,
                    ...modifiedData
                };

                allLevels[`${folderName}/${fileName}`] = JSON.stringify(finalData, null, 2);
                
                processedFiles++;
                loadingToast.textContent = `Processing: ${processedFiles}/${totalFiles} files...`;
                
                return true;
            } catch (error) {
                console.error(`Error processing ${folderName}/${fileName}:`, error);
                return null;
            }
        });
        
        await Promise.all(fetchPromises);
        
        // Download the zip file
        await downloadZip(allLevels);
        
        loadingToast.textContent = `Complete! Downloaded ${processedFiles} files.`;
        setTimeout(() => loadingToast.remove(), 3000);
        
    } catch (error) {
        console.error('Error generating zip:', error);
        loadingToast.textContent = 'Error generating zip file.';
        setTimeout(() => loadingToast.remove(), 3000);
    } finally {
        setIsDownloadingZip(false);
    }
};



    return (
      <div className="w-[90vw] text-black">
        <header className="header">Campaign Levels</header>
        <div className="flex">
          <div className="w-1/3 overflow-y-auto h-[75vh]">
            <details className="details space-y-1">
              <summary className="summary">Modifiers</summary>
              <label htmlFor="25 Sun meta">
                25 Sun meta
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "25 sun meta")
                  }
                  type="checkbox"
                  id="25 Sun meta"
                />
              </label>

              <label htmlFor="add garg to garg levels escalation">
                add garg to garg levels escalation
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "garg escalation")
                  }
                  type="checkbox"
                  id="add garg to garg levels escalation"
                />
              </label>
              <label htmlFor="remove pf entirely">
                remove pf entirely
                <input
                  onChange={(e) => handleCheckbox(e.target.checked, "no pf")}
                  type="checkbox"
                  id="remove pf entirely"
                />
              </label>
              <label htmlFor="remove power tiles from far future">
                remove power tiles from far future
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "no power tiles")
                  }
                  type="checkbox"
                  id="remove power tiles from far future"
                />
              </label>
              <label htmlFor="remove gold tiles from lost city">
                remove gold tiles from lost city
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "no gold tiles")
                  }
                  type="checkbox"
                  id="remove gold tiles from lost city"
                />
              </label>
              <label htmlFor="remove starting lily pads from big waves beach">
                remove starting lily pads from big waves beach
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "no lily pads")
                  }
                  type="checkbox"
                  id="remove starting lily pads from big waves beach"
                />
              </label>
              <label htmlFor="replace sun/pf graves with normal graves in dark ages">
                replace sun/pf graves with normal graves in dark ages
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "replace graves")
                  }
                  type="checkbox"
                  id="replace sun/pf graves with normal graves in dark ages"
                />
              </label>

              <label htmlFor="disable mowers">
                disable mowers
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "no mowers")
                  }
                  type="checkbox"
                  id="disable mowers"
                />
              </label>

              <label htmlFor="disable sun dropper">
                disable sun dropper
                <input
                  onChange={(e) =>
                    handleCheckbox(e.target.checked, "disable sun dropper")
                  }
                  type="checkbox"
                  id="disable sun dropper"
                />
              </label>

              <label className="group">
                escalation points increment multiplier:
                <input
                  onChange={(e) =>
                    handleNumber("escalation points", Number(e.target.value))
                  }
                  defaultValue={1}
                  min={0}
                  step={0.25}
                  type="number"
                  name=""
                />
              </label>
              <label className="group">
                seedpacket limit:
                <input
                  onChange={(e) =>
                    handleNumber("seedpackets", Number(e.target.value))
                  }
                  defaultValue={4}
                  min={1}
                  type="number"
                />
              </label>
              <label className="group">
                conveyor delay multiplier:
                <input
                  onChange={(e) =>
                    handleNumber("conveyor delay", Number(e.target.value))
                  }
                  defaultValue={1}
                  min={0}
                  step={0.25}
                  type="number"
                />
              </label>
              <label className="group">
                puffshroom lifespan:
                <input
                  onChange={(e) =>
                    handleNumber("puffshroom lifespan", Number(e.target.value))
                  }
                  defaultValue={60}
                  min={1}
                  type="number"
                />
              </label>
              <label
                title="try clicking the first character of the zombie you want"
                className="group"
                htmlFor="troglobite"
              >
                Replace troglobite's iceage_imp with:
                <select
                  onChange={(e) =>
                    handleNumber("troglobite iceblock", e.target.value)
                  }
                  id="troglobite"
                  className="select w-40"
                >
                  {zombieList.map((e) => (
                    <option value={e}>{e}</option>
                  ))}
                </select>
              </label>
              <label
                title="try clicking the first character of the zombie you want"
                className="group"
                htmlFor="plant_iceblock"
              >
                Replace icecubed plants with:
                <select
                  onChange={(e) =>
                    handleNumber("new icecubed plant", e.target.value)
                  }
                  id="troglobite"
                  className="select w-40"
                >
                  <option value={"-"}>keep them</option>
                  <option value={"remove"}>remove them</option>
                  {zombieList.map((e) => (
                    <option value={e}>{e}</option>
                  ))}
                </select>
              </label>
            </details>
            
            {Object.entries(CAMPAIGN_FOLDERS).map(([folderName, config]) => (
              <FolderSection
                key={folderName}
                folderName={folderName}
                config={config}
                onFileClick={handleFileClick}
              />
            ))}

          </div>
          <div className="w-2/3 h-[75vh]">
            <Editor
              height={"100%"}
              language="json"
              value={JSON.stringify(monacoObject, null, 2)}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 18,
              }}
            />
          </div>
        </div>
        <footer className="bg-cyan-600 text-xl p-1">
          <div className="space-x-1">
            <button 
              className={`button text-lg ${fileName.length === 0 && 'disabled'}`} 
              onClick={handleDownloadCurrent}
              disabled={fileName.length === 0}
            >
              Download {fileName || 'File'}
            </button>
            <button 
                className={`button text-lg ${isDownloadingZip && 'opacity-50 cursor-not-allowed'}`} 
                onClick={handleDownloadAll}
                disabled={isDownloadingZip}
            >
                {isDownloadingZip ? 'Generating ZIP...' : 'Download zip'}
            </button>
          </div>
        </footer>
      </div>
    );
}

export default Campaign;