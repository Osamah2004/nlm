import pTypes from './assets/PlantTypes.json'
import pProps from './assets/PlantProps.json'
import zTypes from './assets/ZombieTypes.json'
import zProps from './assets/ZombieProps.json'
import PlantList from './SeedBank/PlantList'

import ptog from './assets/PlantTypes_original.json'
import ppog from './assets/PlantProps_original.json'
import paog from './assets/PlantAlmanac_original.json'

const getSession = (key) => {return sessionStorage.getItem(key)}
const getLocal = (key) => {return localStorage.getItem(key)}

/**
 * 
    let newTypes = []
    ptog.objects.forEach(e => newTypes.push(e))
    
    newTypes.forEach((e,i) => {
        newTypes[i].objdata.Properties = `RTID(${e.aliases[0]}@.)`,
        newTypes[i].objdata.ShiftedPlantFeatures = {
            ALMANAC: `RTID(${e.aliases[0]}@.)`,
            NAME: {en:e.aliases[0],zh:'...'}
        }
    })

    let newTypes = []
    ppog.objects.forEach(e => newTypes.push(e))
    
    newTypes.forEach((e,i) => {
        newTypes[i].objdata.AlwaysShoots = false;
        newTypes[i].objdata.SpawnedScale = 1;
    })
 */

const GenerateLevel = () => {

    const wave = Number(getSession('Wave Count')) || 10
    const interval = Number(getSession('Flag Interval')) || 5
    const name = getSession('Name')  || 'blank'
    const description = getSession('Description') || 'blank'
    const stage = getSession('Stage')
    const slotCount = getSession('OverrideSeedSlotsCount') || 0
    const author = getSession('Author') || 'blank'
    const initialTide = getSession('InitialTide') || -1
    const isPinata = JSON.parse(getSession('Enable Pinata Party')) || false
    const pointIncrement = Number(getSession('Point increment')) || 0
    const initialPoints = Number(getSession('Starting points')) || 0
    const pfCount = Number(getSession('Pf to spawn count')) || 0
    const mowers = getSession('Mower') || 'TutorialMowers'

    const presetPlants = JSON.parse(getLocal('presetSelectedPlants'))?.map(e => ({PlantType:e,Level:-1})) || []
    const includePlants = JSON.parse(getLocal('includeSelectedPlants')) || []
    const excludePlants = JSON.parse(getLocal('excludeSelectedPlants')) || []
    const customPlants = JSON.parse(getLocal('customPlantsIds')) || []
    const unlockAll = JSON.parse(getLocal('UnlockAll')) || false
    
    let planks =  [
            getSession('row1') == 'true' ? 1-1 : -1,
            getSession('row2') == 'true' ? 2-1 : -1,
            getSession('row3') == 'true' ? 3-1 : -1,
            getSession('row4') == 'true' ? 4-1 : -1,
            getSession('row5') == 'true' ? 5-1 : -1
        ]
    
    planks = planks.filter(e => e !== -1)
    
    const isPreset = getLocal('Locked and loaded') == 'true'
    let isSeedbank = true
    const debug = JSON.parse(getSession("debug mode"))
    
    let seedBank = {
                "aliases": [
                    "SeedBank"
                ],
                "objclass": "SeedBankProperties",
                "objdata": {
                    UnlockAll: unlockAll,
                    "SelectionMethod": isPreset ? 'preset' : 'chooser',
                    ...(slotCount > 0 && {"OverrideSeedSlotsCount":slotCount}),
                    "PresetPlantList": presetPlants,
                    "PlantExcludeList": excludePlants
                }
            }
    if (getLocal('add one hit kill') == 'true' || debug){
        seedBank.objdata['PresetPlantList'].unshift({"PlantType":"one-hit-kill",Level:-1})
    }
    if (includePlants.length > 0){
        seedBank.objdata.PlantIncludeList = includePlants
    }

    const eStarter = (e) => e.slice(0,e.indexOf('_'))

    const conveyorArray = JSON.parse(getLocal('conveyor')) || []
    let isConveyor = conveyorArray[0].objdata.InitialPlantList?.length > 0

    if (isConveyor) isSeedbank = false;

    let modules = [
        `RTID(${isPinata ? 'LevelOfTheDayIntro' : 'StandardIntro'}@LevelModules)`,
        "RTID(ZombiesDeadWinCon@LevelModules)",
        `RTID(${isConveyor ? 'Conveyor' : 'SeedBank'}@CurrentLevel)`,
        "RTID(DefaultZombieWinCondition@LevelModules)",
        "RTID(NewWaves@CurrentLevel)",
    ]

    if (mowers !== 'none') modules.push(`RTID(${mowers}@LevelModules)`)

    
    const sunDropper = sessionStorage.getItem('SunDropper') || 'DefaultSunDropper';
    if (sunDropper !== 'none' && !isConveyor) {
        modules.push(`RTID(${sunDropper}@LevelModules)`);
    }
    
    if (isPinata) {
        modules.unshift("RTID(LevelOfTheDayModule@CurrentLevel)")
    }
    
    const board = JSON.parse(localStorage.getItem('initialBoard'))
    let boardItems = []
    let otherGi = []
    let powertiles = []
    let frozenPlants = []
    let endangeredPlants = []
    let initialPlants = []
    let frozenZombies = []
    let rails = {}
    let carts = {}
    let otherObjects = []

    if (isConveyor) otherObjects.push(...conveyorArray)

    if (initialTide !== -1){
        modules.push('RTID(Tide@.)')
        otherObjects.push({
      "aliases": [
        "Tide"
      ],
      "objclass": "TideProperties",
      "objdata": {
        "StartingWaveLocation": initialTide
      }
    })
    }
    if (stage === 'PirateStage'){
        modules.push("RTID(Planks@.)")
        otherObjects.push({
            "aliases": [
                "Planks"
                ],
            "objclass": "PiratePlankProperties",
            "objdata": {
                "PlankRows": planks || []
                }
            })
    }

    const potions = JSON.parse(getSession('enable potions')) ?? false

    const pushModuleObject = (alias,objclass,objdata) => {
        modules.push(`RTID(${alias}@CurrentLevel)`);
        otherObjects.push({'aliases':[alias],'objclass':objclass,'objdata':objdata})
    }
    if (potions) pushModuleObject('potions','ZombiePotionModuleProperties',
        {
            InitialPotionCount: Number(getSession('InitialPotionCount')) || 2,
            MaxPotionCount: Number(getSession('MaxPotionCount')) || 5,
            PotionSpawnTimer: {
                Max: Number(getSession('PotionSpawnTimerMax')) || 3,
                Min: Number(getSession('PotionSpawnTimerMin')) || 1,
            },
            PotionTypes: JSON.parse(getLocal('potions')) || []
        }
    )
    const boardListToOtherObjects = (list,alias,objclass,objdata) => {
        if(list.length > 0){
            pushModuleObject(alias,objclass,objdata)
        }
    }

    let molds = Array.from({length:5}).map(e => Array.from({length:9}).map(e => "0"))
    let isMold = false

    Object.keys(board).forEach(e => {
        boardItems.push(...board[e].map(f=>({'x':e.at(2),'y':e.at(0),'name':f})))
    })
    boardItems.forEach(e => {
        const gridType = eStarter(e.name)
        switch(gridType){
            case 'powertile':powertiles.push({"Group":e.name.slice(10),'Location':{'mX':e.x,'mY':e.y},"PropagationDelay":0.2});break;
            case 'rail':(rails[`${e.name}-${e.x}`] ||= []).push(e.y);break;
            case 'railcart':(carts[e.name] ||= []).push({Column:e.x,Row:e.y});break;
            case 'FZ':frozenZombies.push({'TypeName':e.name.slice(3),'GridX':e.x,'GridY':e.y,'Condition':'icecubed'});break;
            case 'SOS':endangeredPlants.push({'PlantType':e.name.slice(4),'GridX':e.x,'GridY':e.y,'Level':'0'});break;
            case 'F':frozenPlants.push({'TypeName':e.name.slice(2),'GridX':e.x,'GridY':e.y,'Condition':'icecubed'});break;
            case 'P':initialPlants.push({'TypeName':e.name.slice(2),'GridX':e.x,'GridY':e.y,});break;
            case 'molds':molds[e.y][e.x] = '1';isMold = true;break;
            default: otherGi.push({'GridX':e.x,'GridY':e.y,'TypeName':e.name})
        }
    })
    molds = molds.map(e => e.join(""))
    Object.keys(rails).forEach(e=>{
        if(rails[e].length === 4 && !(rails[e].includes(2))){
            rails[e] = [
                {'Column':e.at(-1),'RowStart':0,'RowEnd':1},
                {'Column':e.at(-1),'RowStart':3,'RowEnd':4}
            ]
        }
        else rails[e] = ({'Column':e.at(-1),'RowStart':Math.min(...rails[e].map(Number)),'RowEnd':Math.max(...rails[e].map(Number))})
    })
const _upperFirst = (string) =>string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
  
    const _snakeToPascal = (string) => {
        return string.split('_').map((str) => {
            return _upperFirst(
                str.split('/')
                .map(_upperFirst)
                .join('/'));
        }).join('');
    }
    Object.keys(carts).forEach(e => {
        modules.push(`RTID(${_snakeToPascal(e)}@CurrentLevel)`)
        otherObjects.push({
            'aliases':[_snakeToPascal(e)],
            'objclass':'RailcartProperties',
            'objdata': {
                'RailcartType':e,
                'Railcarts':carts[e],
                'Rails':Object.keys(rails).filter(f=>f.includes(e.slice(e.indexOf('_')+1))).map(f => rails[f]).flat()
            }
        })
    })

    boardListToOtherObjects(powertiles,'PowerTiles',
    'PowerTileProperties',{'LinkedTiles':powertiles})

    const plants = initialPlants.concat(frozenPlants)

    boardListToOtherObjects(plants,'InitialPlants',
    'InitialPlantProperties',{'InitialPlantPlacements':plants})

    boardListToOtherObjects(endangeredPlants,'SOS',
    'ProtectThePlantChallengeProperties',{'Plants':endangeredPlants})

    boardListToOtherObjects(frozenZombies,'InitialZombies',
    'InitialZombieProperties',{'InitialZombiePlacements':frozenZombies})

    boardListToOtherObjects(otherGi,'GI',
    'InitialGridItemProperties',{'InitialGridItemPlacements':otherGi})

    if (isMold) pushModuleObject('molds','MoldColonyChallengeProps',{MoldMatrix:molds})

    let challenges = []

if (getLocal('Add challenge to level moduels') == 'true'){
        modules.push("RTID(Challenges@CurrentLevel)")

        const sunProductionTarget = getSession('Sun production target');
        if(sunProductionTarget != 0 && sunProductionTarget !== null){
            challenges.push("RTID(ProduceSunChallenge@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "ProduceSunChallenge"
            ],
            "objclass": "StarChallengeSunProducedProps",
            "objdata": {
                "TargetSun": getSession('Sun production target')
            }
        }
            )
        }

        const sunSpendingLimit = getSession('Sun spending limit');
        if(sunSpendingLimit != 0 && sunSpendingLimit !== null){
            challenges.push("RTID(SunLimit@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "SunLimit"
            ],
            "objclass": "StarChallengeSunUsedProps",
            "objdata": {
                "MaximumSun": getSession('Sun spending limit')
            }
        }
            )
        }

        const sunHoldoutSeconds = getSession('Sun holdout seconds');
        if(sunHoldoutSeconds != 0 && sunHoldoutSeconds !== null){
            challenges.push("RTID(SunHoldout@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "SunHoldout"
            ],
            "objclass": "StarChallengeSpendSunHoldoutProps",
            "objdata": {
                "HoldoutSeconds": getSession('Sun holdout seconds')
            }
        }
            )
        }

        const maxPlantLoss = getSession('Max plant loss');
        if(maxPlantLoss != 0 && maxPlantLoss !== null){
            challenges.push("RTID(PlantsLost@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "PlantsLost"
            ],
            "objclass": "StarChallengePlantsLostProps",
            "objdata": {
                "MaximumPlantsLost": getSession('Max plant loss')
            }
        }
            )
        }

        const plantLimit = getSession('Plant limit');
        if(plantLimit != 0 && plantLimit !== null){
            challenges.push("RTID(SimultaneousPlants@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "SimultaneousPlants"
            ],
            "objclass": "StarChallengeSimultaneousPlantsProps",
            "objdata": {
                "MaximumPlants": getSession('Plant limit')
            }
        }
            )
        }

        const flowerColumn = getSession('Flower column');
        if(flowerColumn != 0 && flowerColumn !== null){
            challenges.push("RTID(FlowerLine@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "FlowerLine"
            ],
            "objclass": "StarChallengeZombieDistanceProps",
            "objdata": {
                "TargetDistance": getSession('Flower column')
            }
        }
            )
        }

        const zombiesToKill = getSession('Zombies to kill');
        if(zombiesToKill != 0 && zombiesToKill !== null){
            challenges.push("RTID(KillZombiesTimer@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "KillZombiesTimer"
            ],
            "objclass": "StarChallengeKillZombiesInTimeProps",
            "objdata": {
                "Time": getSession('Time'),
                "ZombiesToKill": getSession('Zombies to kill')
            }
        }
            )
        }

        const startingPf = getSession('Starting pf');
        if(startingPf != 0 && startingPf !== null){
            challenges.push("RTID(LastStand@CurrentLevel)")
            otherObjects.push(
        {
            "aliases": [
                "LastStand"
            ],
            "objclass": "LastStandMinigameProperties",
            "objdata": {
                "StartingSun": getSession('Starting sun'),
                "StartingPlantfood": getSession('Starting pf')
            }
        }
            )
        }

        const challengeModule = {
            "aliases": [
                "Challenges"
            ],
            "objclass": "StarChallengeModuleProperties",
            "objdata": {
                "Challenges": [
                    challenges
                ],
                "ChallengesAlwaysAvailable": true
            }
        }

        otherObjects.push(challengeModule)
    }
    
    const pool = JSON.parse(getSession('zombiePool')) || [];
    pool.forEach(e => {
        if (e.timestamp){
            const x = JSON.parse(getLocal(e.code))
            if (x) otherObjects.push(...x)
        }
    })
    
    // Create the base level object
    customPlants.forEach(e => otherObjects.push(...JSON.parse(getLocal(`customPlant-${e}`))))

    //Air Raid
    let skyMiniGame = {
        'objclass':'SkyMiniGameProperties',
        'aliases': ['SkyMiniGame'],
        'objdata':{
            'TargetPoint':getSession('TargetPoint') || 10000,
            'Teams': JSON.parse(getSession('airRaidTeams'))?.filter(e => e.Members.length > 0) || []
        }
    }

    let stageModule = "LevelModules"
    

    if (getLocal('Enable air raid') == 'true'){
        isSeedbank = false
        modules.push(...[
            'RTID(SkyMiniGame@.)',
            "RTID(//LevelOfTheDayIntro@LevelModules)",
            "RTID(AutoCollect@LevelModules)",
            "RTID(AirRaidZombieWinCondition@LevelModules)",
        ])
        stageModule = '.'
        modules = modules.filter(e => !e.includes('Mowers'))
        modules = modules.filter(e => !e.includes('SunDropper'))
        modules = modules.filter(e => !e.includes('StandardIntro'))

        otherObjects.push(...[
    skyMiniGame,
    {
      "objclass": "LawnType",
      "aliases": [
        `${stage}`
      ],
      "objdata": {
        "LawnBaseOn": `SkyShipless${getSession('AtNight') == 'true' ? 'Night' : ''}Stage`,
        "Properties": "RTID(AirRaidStage_P@CurrentLevel)"
      }
    },
    {
      "objclass": "LawnProperties",
      "aliases": [
        "AirRaidStage_P"
      ],
      "objdata": {
        "RailCart": "railcart_sky",
        "Music": "Sky",
        "IsAtNight": false,
        "Basic_Zombie": [
          "sky_t"
        ],
        "Flag_Zombie": [
          "sky_flag_t"
        ],
        "Rally_Zombie": [
          "sky_flag_t"
        ],
        "Armor1_Zombie": [
          "sky_armor1_t"
        ],
        "Armor2_Zombie": [
          "sky_armor2_t"
        ],
        "Armor3_Zombie": [
          "sky_armor2_t"
        ],
        "Armor4_Zombie": [
          "sky_armor2_t"
        ],
        "Gravestone": [
          "gravestone_tutorial"
        ]
      }
    },
    ])
    }

    if (getLocal('Enable custom ship') == 'true'){
        otherObjects.push({
        "objclass": "SkyCityShipProperties",
        "aliases": [
            "SkyCityShipDefault"
        ],
        "objdata": {
            "Toughness": getSession('Toughness') || 20000,
            "ToughnessShield": getSession('ToughnessShield') || 10000,
            "ForceShielded": JSON.parse(getSession('ForceShielded')) || false,
            "ForceUnshielded": JSON.parse(getSession('ForceUnshielded')) || false,
            "BloverDPS": getSession('BloverDPS') || 3500,
            "BloverSPS": getSession('BloverSPS') || 3,
            "EdgeX": getSession('EdgeX') || 2.5,
            }
        })
        modules.push('RTID(SkyCityShipDefault@.)')
    }

    if (isSeedbank) otherObjects.push(seedBank)

    let introNarrative = JSON.parse(getLocal('introNarrative')) || []

    if (introNarrative.length > 0){
        introNarrative = introNarrative.map(e => 
            (e.Action !== "NPC_ENTER" && e.Action !== "NPC_EXIT")
                ? { ...e, Lines: { en: getSession(`intro-${e.id}`), zh: '...' } }
                : e
        );

        // Mutates the original objects
        introNarrative.forEach(obj => {
            delete obj.id;
        });

        otherObjects.push({
            "aliases": [
                "INTRO"
            ],
            "objclass": "NarrativeProperties",
            "objdata": {
                "Flow": introNarrative
            }
        })
    }

    let outroNarrative = JSON.parse(getLocal('outroNarrative')) || []

    if (outroNarrative.length > 0){
        outroNarrative = outroNarrative.map(e => 
            (e.Action !== "NPC_ENTER" && e.Action !== "NPC_EXIT")
                ? { ...e, Lines: { en: getSession(`outro-${e.id}`), zh: '...' } }
                : e
        );

        // Mutates the original objects
        outroNarrative.forEach(obj => {
            delete obj.id;
        });

        otherObjects.push({
            "aliases": [
                "OUTRO"
            ],
            "objclass": "NarrativeProperties",
            "objdata": {
                "Flow": outroNarrative
            }
        })
    }

    let wavesArray = Array.from({ length: wave ? wave : 10 }, (_, i) => [`RTID(Wave${i + 1}@.)`])
    const pickedAmbushes = JSON.parse(getLocal('pickedAmbushes'))
    pickedAmbushes?.forEach(e => {
        let f = JSON.parse(getLocal(`${e.id}-${e.ambushName}`))
        if (f){
            f.aliases = [`Ambush${e.id}-${e.ambushName}`]
            otherObjects.push({
                aliases: f.aliases,
                objclass: f.objclass,
                objdata: f.objdata
            })
        }
    })

    wavesArray.forEach((e,i) => {
        const waveAmbush = JSON.parse(getLocal(`wave${i+1}-ambushes`))
        // console.log(`wave ${i+1}`)
        waveAmbush?.forEach((f) => {
            // const foundAmbush = JSON.parse(getLocal(`${f.id}-${f.ambushName}`))
            e.push(`RTID(Ambush${f.id}-${f.ambushName}@.)`)
        })
    })

    const conveyorModifications = conveyorArray.map(e => e.aliases[0])

    if (conveyorModifications.length > 1) {
        conveyorModifications.slice(1).forEach(e => {
            wavesArray[Number(e.slice(9))-1].push(`RTID(${e}@.)`)
        })
    }

    let usedTideChanges = Array.from({length:9}).fill(-1)
    let nonZombies = []

    let wavesData = Array.from({length:wave}).map((_,i) => JSON.parse(getLocal(`wave-${i+1}-data`)))
    wavesData.forEach((e,i) => {
        const {pf,tide,jam,MustKillAllToNextWave} = JSON.parse(getLocal(`wave-${i+1}-lookupValues`))
        const temp = e.objdata.Zombies;
        delete e.objdata.Zombies

        if (pf > 0) e.objdata.AdditionalPlantfood = pf
        if (jam !== 'none') e.objdata.NotificationEvents = [jam]
        if (MustKillAllToNextWave) e.objdata.MustKillAllToNextWave = true
        if (tide !== -1) {
            usedTideChanges[tide] = tide;
            wavesArray[i].push(`RTID(TideTo${tide}@.)`)
        }
        e.objdata.Zombies = temp.filter(f => {
            const isItem = f.Type.includes('$')
            if (isItem){
                nonZombies.push({item:f.Type,wave:i,row:f.Row})
            }
            return !isItem
        })
    })

    let hasFrostWinds = false;
    let hasDino = false

    let poolAmbushesSet = new Set()

    const processSandstorm = (e) => {
        const end = Number(e.at(-1))
        const start = Number(e.at(-3))
        const count = Number(e.at(3))
        const zombie = e.slice(5,-5)
        otherObjects.push({
aliases:[e],
"objclass": "StormZombieSpawnerProps",
"objdata": {
    "ColumnEnd": end,
    "ColumnStart": start,
    "GroupSize": 1,
    "TimeBetweenGroups": 0.25,
    "Type": "sandstorm",
    "Zombies": Array.from({length:count}).map(_ => ({Type:zombie}))
}
})
    }

    const raidParty = (c,t,e) => (
{
  aliases:[e],
  "objclass": "RaidingPartyZombieSpawnerProps",
  "objdata": {
    "GroupSize": 1,
    "SwashbucklerCount": c,
    "TimeBetweenGroups": t
  }
})


    const spiderRain = (c,t,b,s,e,a,n) => (
{
  aliases:[a],
  "objclass": n == 'SR' ? 'SpiderRainZombieSpawnerProps' : 'ParachuteRainZombieSpawnerProps',
  "objdata": {
    "ColumnEnd": e,
    "ColumnStart": s,
    "GroupSize": 1,
    "SpiderCount": c,
    "SpiderZombieName": n == 'SR' ? 'future_imp' : 'lostcity_lostpilot',
    "TimeBeforeFullSpawn": 10,
    "TimeBetweenGroups": t,
    "WaveStartMessage": n == 'SR' ? '[WARNING_SPIDERRAIN]' : '[WARNING_PARACHUTERAIN]',
    "ZombieFallTime": b
  }
})

    let hasRaidParty = false
    let hasSpiderRain = false
    let hasParachuteRain = false

    const processSlicedItem = (e) => {
        const ambushName = e.slice(0,2)
        switch (ambushName) {
            case 'SS':
                processSandstorm(e)
                break;
            case 'RP':
                if (hasRaidParty) return
                otherObjects.push(raidParty(3,1.34,'RP_3'))
                otherObjects.push(raidParty(5,1,'RP_5'))
                otherObjects.push(raidParty(10,0.5,'RP_10'))
                otherObjects.push(raidParty(15,0.3,'RP_15'))
                hasRaidParty = true
                break;
            case 'SR':
                if (hasSpiderRain) return
                otherObjects.push(spiderRain(3 ,1.34,2  ,6,8,'SR_3_c6_8',ambushName))
                otherObjects.push(spiderRain(5 ,1   ,1.5,5,7,'SR_5_c5_7',ambushName))
                otherObjects.push(spiderRain(10,0.5 ,1  ,4,7,'SR_10_c4_7',ambushName))
                otherObjects.push(spiderRain(13,0.25,0.5,3,6,'SR_13_c3_6',ambushName))
                hasSpiderRain = true
                break;
            case 'PR':
                if (hasParachuteRain) return
                otherObjects.push(spiderRain(3 ,1.34,2  ,6,8,'PR_3_c6_8',ambushName))
                otherObjects.push(spiderRain(5 ,1   ,1.5,5,7,'PR_5_c5_7',ambushName))
                otherObjects.push(spiderRain(10,0.5 ,1  ,4,7,'PR_10_c4_7',ambushName))
                otherObjects.push(spiderRain(13,0.25,0.5,3,6,'PR_13_c3_6',ambushName))
                hasParachuteRain = true
                break;
            default:
                break;
        }
    }

    nonZombies.forEach(e => {
        const slicedItem = e.item.slice(e.item.indexOf('$') + 1,e.item.indexOf('@'))
        switch (slicedItem) {
            case 'left_winds':
                wavesArray[e.wave].push(`RTID(LeftWindRow${e.row}@.)`)
                hasFrostWinds = true;
                break;
            case 'right_winds':
                wavesArray[e.wave].push(`RTID(RightWindRow${e.row}@.)`)
                hasFrostWinds = true;
                break;
            case 'raptor':
                wavesArray[e.wave].push(`RTID(raptor${e.row}@.)`)
                hasDino = true;
                break;
            case 'ptero':
                wavesArray[e.wave].push(`RTID(ptero${e.row}@.)`)
                hasDino = true;
                break;
            case 'stego':
                wavesArray[e.wave].push(`RTID(stego${e.row}@.)`)
                hasDino = true;
                break;
            case 'tyranno':
                wavesArray[e.wave].push(`RTID(tyranno${e.row}@.)`)
                hasDino = true;
                break;
            case 'ankylo':
                wavesArray[e.wave].push(`RTID(ankylo${e.row}@.)`)
                hasDino = true;
                break;
            default:
                poolAmbushesSet.add(slicedItem)
                wavesArray[e.wave].push(`RTID(${slicedItem}@.)`)
                break;
        }
    })

    poolAmbushesSet.forEach(e => processSlicedItem(e))

    if (hasDino) {
        for (let i = 0; i < 5; i++) {
            otherObjects.push(...[ 
                                {
                                "aliases":[`raptor${i+1}`], 
                                "objclass": "DinoWaveActionProps",
                                "objdata": {
                                    DinoRow:i,
                                    DinoType:'raptor'
                                    }
                                }, 
                                {
                                "aliases":[`ptero${i+1}`], 
                                "objclass": "DinoWaveActionProps",
                                "objdata": {
                                    DinoRow:i,
                                    DinoType:'ptero'
                                    }
                                },
                                {
                                "aliases":[`stego${i+1}`], 
                                "objclass": "DinoWaveActionProps",
                                "objdata": {
                                    DinoRow:i,
                                    DinoType:'stego'
                                    }
                                }, 
                                {
                                "aliases":[`tyranno${i+1}`], 
                                "objclass": "DinoWaveActionProps",
                                "objdata": {
                                    DinoRow:i,
                                    DinoType:'tyranno'
                                    }
                                }, 
                                {
                                "aliases":[`ankylo${i+1}`], 
                                "objclass": "DinoWaveActionProps",
                                "objdata": {
                                    DinoRow:i,
                                    DinoType:'ankylo'
                                    }
                                }
                            ])
        }
    }

    if (hasFrostWinds) {
        for (let i = 0; i < 5; i++) {
            otherObjects.push(...[ 
                                {
                                "aliases":[`RightWindRow${i+1}`], 
                                "objclass": "FrostWindWaveActionProps",
                                "objdata": {
                                "Winds": [{"Direction": "right", "Row": i}]}
                                }, 
                                {
                                "aliases":[`LeftWindRow${i+1}`], 
                                "objclass": "FrostWindWaveActionProps",
                                "objdata": {
                                "Winds": [{"Direction": "left", "Row": i}]}
                                }
                            ])
        }
    }

    usedTideChanges.filter(e => e !== -1).forEach(e => otherObjects.push(
        {
        "aliases": [`TideTo${e}`],
        "objclass": "TidalChangeWaveActionProps",
        "objdata": {
            "TidalChange": {
            "ChangeAmount": e,
            "ChangeType": "absolute"
            }
        }
        }))

    otherObjects.push(...wavesData)


    if (getLocal('add one hit kill') == 'true' || debug){
        otherObjects.push(...[
  {
    "objclass": "PlantType",
    "aliases": [
      "one-hit-kill"
    ],
    "objdata": {
      "PlantBasedOn": "peashooter",
      "Properties": "RTID(one-hit-kill@.)",
      "ShiftedPlantFeatures": {
        "ALMANAC": "RTID(one-hit-kill@.)",
        "NAME": {
          "en": "one-hit-kill",
          "zh": "..."
        }
      }
    }
  },
  {
    "objclass": "PlantProperties",
    "aliases": [
      "one-hit-kill"
    ],
    "objdata": {
      "AlwaysShoots": true,
      "SpawnedScale": 2,
      "ShootInterval": 1,
      "ShootIntervalAdditional": 0.15,
      "PlantfoodPeaCount": 60,
      "Cooldown": 0,
      "CooldownFrom": 0,
      "SunCost": 0,
      "BeghouledCost": 1000,
      "Toughness": 300,
      "PeaType": "pea",
      "PeaTypePlantfood": "pea",
      "Family": "Peashooter",
      "MintBoostedProps": {
        "ResistanceMult": 1,
        "SpeedMult": 2,
        "Plantfood": false
      }
    }
  },
  {
    "objclass": "PlantAlmanacProperties",
    "aliases": [
      "one-hit-kill"
    ],
    "objdata": {
      "BriefIntroduction": {
        "en": "One hits zombies, for debugging purposes",
        "zh": "向僵尸发射豌豆子弹"
      }
    }
  },
  {
    "objclass": "ProjectileType",
    "aliases": [
      "pea"
    ],
    "objdata": {
      "MintBoostedType": "pea2",
      "ProjectileBasedOn": "coconut",
      "Props": "RTID(pea@.)",
      "//ProjectileRedirection": [
        {
          "Type": "coconut_pf",
          "Weight": 1
        },
        {
          "Type": "coconut",
          "Weight": 1
        }
      ]
    }
  },
  {
    "objclass": "ProjectileProperties",
    "aliases": [
      "pea"
    ],
    "objdata": {
      "Damage": 9000,
      "ShakesScreenOnImpact": true,
      "SpeedMult": 4,
      "SplashDamage": [
        {
          "Damage": 300,
          "Range": {
            "w": 3,
            "h": 3
          }
        }
      ],
      "Size": {
        "w": 18,
        "h": 18
      }
    }
  }
])
    }


    if (isPinata) {
        otherObjects.push({
            "aliases": [
                "LevelOfTheDayModule"
			],
			"objclass": "LevelOfTheDayModuleProperties",
			"objdata": {
                "FlagCount": wave / interval,
				"PlantfoodToSpawnCount": pfCount,
				"PointIncrementPerWave": pointIncrement,
				"StartingPoints": initialPoints,
				"WaveManagerProps": "RTID(WaveManagerProps@CurrentLevel)",
				"WavesPerFlag": interval,
				"ZombiePool": JSON.parse(getSession('zombiePool')).map(e => `RTID(${e.code}@ZombieTypes)`)
			}
		})
    }

    const veteranFlagOverride = getSession('Veteran flag override')?.split("").map(e => Number(e)) || []
    let startSun = getSession("StartingSun") || 50
    if (debug) startSun = 9900
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = now.getFullYear();

    const tf = key => JSON.parse(getSession(key)) === true

    const checkNum = key => 
        sessionStorage.getItem(key) !== null &&
        sessionStorage.getItem(key) !== "1";

    let plantModifications = [
        checkNum('plant health multiplier'),
        checkNum('plant recharge multiplier'),
        tf('2x sun cost')
    ]

    const hasPlantModifications = plantModifications.some(e => e === true)

    if (hasPlantModifications) {
        let list = [...pProps.objects].map(e => ({
                    Type:e.aliases[0],
                    NewObjdata:{
                        ...(plantModifications[0] && {Toughness:e.objdata.Toughness * Number(getSession('plant health multiplier'))}),
                        ...(plantModifications[1] && {Cooldown:e.objdata.Cooldown * Number(getSession('plant recharge multiplier'))}),
                        ...(plantModifications[2] && {SunCost:e.objdata.SunCost * 2}),
                    }
                }))

        // to do: 25 sun meta for sun producers when there's a plant modification ticked

        // list.forEach((e,i) => {
        //     const plant = e.Type
        //     switch (plant) {
        //         case 'goldbloom':
        //             list[i].NewObjdata.ProduceValue0 = 50;
        //             list[i].NewObjdata.ProduceValue1 = 62.5;
        //             list[i].NewObjdata.ProduceValue2 = 75;
        //             break;
        //         case 'sunshroom':list[i].NewObjdata.SunValue = 12.5; list[i].NewObjdata.SunValueList=[12.5,25,37.5]; break;
        //         case 'primalsunflower':list[i].NewObjdata.SunValue = 37.5;break;
        //         case 'enlightenmint':list[i].NewObjdata.SunProduction = 75;break;
        //         case 'sunflower':list[i].NewObjdata.SunValue = 25;break;
        //         case 'solartomato':list[i].NewObjdata.SunValuePerZombie = 25;break;
        //         case 'marigold_yellow':list[i].NewObjdata.SunValuePerZombie = 25;break;
        //         case 'twinsunflower':list[i].NewObjdata.SunValue = 50;break;
        //         case 'shinevine':list[i].NewObjdata.ProduceSunValue = 25;break;
        //         case 'solarsage':list[i].NewObjdata.EnlightenSunValue = 25;break;
        //     }
        // })
        let PlantModifications = {
            "HidePlantfood": true,
            "SuppressParticle": true,
            "List": list
                
                // {
                //     "Type": "sunflower",
                //     "NewObjdata": {
                //         "SunValue": 25
                //     }
                // }
        }
        pushModuleObject('PlantModifications','PlantModifierProperties',PlantModifications)
    }

    let zombieModifications = [
        tf('invisi goul'),
        tf('big trouble little zombies'),
        checkNum('zombie health multiplier'),
        checkNum('zombie speed multiplier'),
        checkNum('zombie eatDPS multiplier'),
    ]

    const hasZombieModifications = zombieModifications.some(e => e === true)

    if (hasZombieModifications) {
        const regularZombies = 
            JSON.parse(sessionStorage.getItem('zombiePool'))
            ?.filter(f => !f.timestamp && !f.code.startsWith('$')).map(e => e.code) || [];
        
        regularZombies.forEach(e => {
            let zombie = [
                structuredClone(zTypes.objects.find(f => f.aliases[0] === e)),
                structuredClone(zProps.objects.find(f => f.aliases[0] === e)),
                ]
            zombie[0].objdata.Properties = zombie[0].objdata.Properties.replace('ZombieProps','CurrentLevel');
            if (zombieModifications[0]) {
                zombie[1].objdata.SpawnedScale = 0.01
                zombie[1].objdata.HitRect = "RTID(InvisHitRect@CurrentLevel)";
            };
            if (zombieModifications[1]) {
                zombie[1].objdata.SpawnedScale = 0.7
                zombie[1].objdata.WalkSPS = zombie[1].objdata.WalkSPS * 1.2
            }
            if (zombieModifications[2]) {
                zombie[1].objdata.Toughness = zombie[1].objdata.Toughness * Number(getSession('zombie health multiplier'))
            }
            if (zombieModifications[3]) {
                zombie[1].objdata.WalkSPS = zombie[1].objdata.WalkSPS * Number(getSession('zombie speed multiplier'))
            }
            if (zombieModifications[4]) {
                zombie[1].objdata.EatDPS = zombie[1].objdata.EatDPS * Number(getSession('zombie eatDPS multiplier'))
            }
            otherObjects.push(...zombie)
        })
        if (zombieModifications[0]) otherObjects.push(...[{
  "objclass": "RectangleType",
  "aliases": [
    "InvisHitRect"
  ],
  "objdata": {
    "Properties": "RTID(InvisHitRect@CurrentLevel)"
  }
},
    {
      "objclass": "RectangleProps",
      "aliases": [
        "InvisHitRect"
      ],
      "objdata": {
        "Values": {
          "x": 0,
          "y": 72,
          "w": 4800,
          "h": 9600
        }
      }
    }])
    }

    let CustomDescription = getSession('Custom objective text')
    const toArray = CustomDescription.split('\\n').map(e => e.trim())
    if (CustomDescription) pushModuleObject('BeatTheLevel','StarChallengeBeatTheLevelProps',{
        Descriptions:toArray,
        DescriptionsMultiLanguage:[{
            en:CustomDescription,
            zh:'...'
        }]
    })
    //version
    let level = {
        ...(isPinata ? {"#comment": "Level Of The Day",} : {[`#${name} by ${author}`]: 'NLM v 0.9.2'}),
        ...(debug && {"Debug mode":true}),
        "Information": {
            Author:author,
            Introduction:description,
            Version:1,
            CreatedAt:`${dd}/${mm}/${yyyy}`
        },
        "objects": [
            {
                "objclass": "LevelDefinition",
                "objdata": {
                    "Name": name,
                    "Description": description,
                    "StageModule": stage ? `RTID(${stage}@${stageModule})` : 'RTID(TutorialStage@LevelModules)',
                    "LevelNumber": 1,
                    "Loot": "RTID(DefaultLoot@LevelModules)",
                    "Modules": modules,
                    StartingSun: Number(startSun),
                    "NormalPresentTable": "egypt_normal_01",
                    "ShinyPresentTable": "egypt_shiny_01",
                    "WritenBy": author,
                    ...(isPinata && {"VictoryModule": "RTID(LevelOfTheDayOutro@LevelModules)"}),
                    ...(isPinata && {"IsLevelOfTheDay": true}),
                    ...(introNarrative.length > length && {'FirstIntroNarrative':'INTRO'}),
                    ...(outroNarrative.length > length && {'FirstOutroNarrative':'OUTRO'}),
                }
            },
            {
                "aliases": [
                    "NewWaves"
                ],
                "objclass": "WaveManagerModuleProperties",
                "objdata": {
                    "WaveManagerProps": "RTID(WaveManagerProps@CurrentLevel)"
                }
            },
            {
                "aliases": [
                    "WaveManagerProps"
                ],
                "objclass": "WaveManagerProperties",
                "objdata": {
                    "FlagWaveInterval": interval ? interval : 5,
                    "WaveCount": wave ? wave : 10,
                    ...(veteranFlagOverride.length > 0 && {"FlagWaveVeteranOverrideTypes":veteranFlagOverride}),
                    ...(JSON.parse(getSession('SuppressFlagZombie')) && {"SuppressFlagZombie": true}),
                    "Waves": wavesArray
                }
            },
            ...otherObjects
        ]
    }

    const firstCountdown = parseInt(sessionStorage.getItem('First wave countdown')) ?? false;
    const waveProps = level.objects.find(e => e.objclass === "WaveManagerProperties");

    if (firstCountdown === 0 || debug) {
            waveProps.objdata["ZombieCountdownFirstWaveSecs"] = 0.1;
        }
    if (firstCountdown > 0) {
            waveProps.objdata["ZombieCountdownFirstWaveSecs"] = firstCountdown;
    }

    if (hasZombieModifications) {
        level = JSON.stringify(level)
        level = level.replaceAll('ZombieTypes','CurrentLevel')
        level = JSON.parse(level)
    }

    return level
}

export default GenerateLevel;