import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import Checkbox from "../Inputs/CheckboxInput"

const getParsedLocal = key => JSON.parse(localStorage.getItem(key)) || null

const CannonsAway = () => {
    const paths = getParsedLocal('cannonsAwayPaths')?.map(e=>({SplinePoints:e})) || [[],[],[],[],[]]
    const [monacoObject,setMonacoObject] = useState({
      "aliases": [
        "CannonMinigame"
      ],
      "objclass": "CannonMinigameProperties",
      "objdata": {
        "BaseMovementRate": 100,
        "BaseZombieKillScore": 100,
        "BufferDistance": 50,
        "ComboBrackets": [
          {
            "AudioCue": "Play_CrazyDave_Short",
            "Exclamations": [
              "[DAVE_CANNONMINIGAME_3_KILLED_1]",
              "[DAVE_CANNONMINIGAME_3_KILLED_2]",
              "[DAVE_CANNONMINIGAME_3_KILLED_3]"
            ],
            "MessageColor": {
              "mAlpha": 255,
              "mBlue": 220,
              "mGreen": 255,
              "mRed": 220
            },
            "ScoreMultiplier": 2,
            "ZombiesKilled": 3
          },
          {
            "AudioCue": "Play_CrazyDave_Scream",
            "Exclamations": [
              "[DAVE_CANNONMINIGAME_5_KILLED_1]",
              "[DAVE_CANNONMINIGAME_5_KILLED_2]",
              "[DAVE_CANNONMINIGAME_5_KILLED_3]"
            ],
            "MessageColor": {
              "mAlpha": 255,
              "mBlue": 255,
              "mGreen": 220,
              "mRed": 220
            },
            "ScoreMultiplier": 3,
            "ZombiesKilled": 5
          },
          {
            "AudioCue": "Play_CrazyDave_Scream2",
            "Exclamations": [
              "[DAVE_CANNONMINIGAME_8_KILLED_1]",
              "[DAVE_CANNONMINIGAME_8_KILLED_2]",
              "[DAVE_CANNONMINIGAME_8_KILLED_3]"
            ],
            "MessageColor": {
              "mAlpha": 255,
              "mBlue": 220,
              "mGreen": 240,
              "mRed": 255
            },
            "ScoreMultiplier": 4,
            "ZombiesKilled": 8
          },
          {
            "AudioCue": "Play_CrazyDave_Crazy",
            "Exclamations": [
              "[DAVE_CANNONMINIGAME_12_KILLED_1]",
              "[DAVE_CANNONMINIGAME_12_KILLED_2]",
              "[DAVE_CANNONMINIGAME_12_KILLED_3]"
            ],
            "MessageColor": {
              "mAlpha": 255,
              "mBlue": 200,
              "mGreen": 200,
              "mRed": 255
            },
            "ScoreMultiplier": 5,
            "ZombiesKilled": 12
          }
        ],
        "#Comments":"Lanes are automatically obtained from Initial Board.",
        "Lanes": paths,
        "MaxRewardGold": 50,
        "MinRewardGold": 0,
        "MinScore": 30000,
        "ResourceGroupNames": [],
        "RowHasCannon": [
          1,
          1,
          1,
          1,
          1
        ],
        "SlowdownMovementRate": 60
      }
    })
    const setMonaco = (key,value) => {
        let temp = ({...monacoObject})
        temp.objdata[key] = value
        setMonacoObject(temp)
        if (key === 'RowHasCannon') sessionStorage.setItem('RowHasCannon',JSON.stringify(monacoObject.objdata.RowHasCannon))
    }
    const setCannons = e => e ? setMonaco('RowHasCannon',[]) : setMonaco('RowHasCannon',[1,1,1,1,1]);
    return (
        <>
            <header className="header">Cannons away</header>
            <div className="w-275 h-175 text-black flex">
                <div className="w-80 space-y-1">
                    <header className="secondary">Settings</header>
                    <label
                      className="group flex" htmlFor="BaseMovementRate">BaseMovementRate:
                      <input
                        min={0}
                        value={monacoObject.objdata.BaseMovementRate}
                        onChange={(e) => {
                          setMonaco('BaseMovementRate',Number(e.target.value));
                          sessionStorage.setItem('BaseMovementRate',e.target.value);
                        }}
                        id="BaseMovementRate" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="BaseZombieKillScore">BaseZombieKillScore:
                      <input
                        min={0}
                        value={monacoObject.objdata.BaseZombieKillScore}
                        onChange={(e) => {
                          setMonaco('BaseZombieKillScore',Number(e.target.value));
                          sessionStorage.setItem('BaseZombieKillScore',e.target.value);
                        }}
                        id="BaseZombieKillScore" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="BufferDistance">BufferDistance:
                      <input
                        min={0}
                        value={monacoObject.objdata.BufferDistance}
                        onChange={(e) => {
                          setMonaco('BufferDistance',Number(e.target.value));
                          sessionStorage.setItem('BufferDistance',e.target.value);
                        }}
                        id="BufferDistance" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="MaxRewardGold">MaxRewardGold:
                      <input
                        min={0}
                        value={monacoObject.objdata.MaxRewardGold}
                        onChange={(e) => {
                          setMonaco('MaxRewardGold',Number(e.target.value));
                          sessionStorage.setItem('MaxRewardGold',e.target.value);
                        }}
                        id="MaxRewardGold" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="MinRewardGold">MinRewardGold:
                      <input
                        min={0}
                        value={monacoObject.objdata.MinRewardGold}
                        onChange={(e) => {
                          setMonaco('MinRewardGold',Number(e.target.value));
                          sessionStorage.setItem('MinRewardGold',e.target.value);
                        }}
                        id="MinRewardGold" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="MinScore">MinScore:
                      <input
                        min={0}
                        step={500}
                        value={monacoObject.objdata.MinScore}
                        onChange={(e) => {
                          setMonaco('MinScore',Number(e.target.value));
                          sessionStorage.setItem('MinScore',e.target.value);
                        }}
                        id="MinScore" type="number" name="" />
                        </label>
                    
                    <label
                      className="group flex" htmlFor="SlowdownMovementRate">SlowdownMovementRate:
                      <input
                        min={0}
                        value={monacoObject.objdata.SlowdownMovementRate}
                        onChange={(e) => {
                          setMonaco('SlowdownMovementRate',Number(e.target.value));
                          sessionStorage.setItem('SlowdownMovementRate',e.target.value);
                        }}
                        id="SlowdownMovementRate" type="number" name="" />
                        </label>
                </div>
                <div className="w-195">
                    <Editor
                        value={JSON.stringify(monacoObject,null,4)}
                        language="json"
                        theme="vs-dark"
                        options={{
                            readOnly:true,
                            wordWrap:'on'
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default CannonsAway;