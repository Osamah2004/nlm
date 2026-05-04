const Version = () => {
  const versions = [
    {
      version: "v0.9.2",
      date: "2026/4/30",
      title: "Enhancements",
      description: "Node enhancements",
      changes: [
        <>
          Dark background for light mode users
          <p className="text-gray-400">
            The white background was not intended
          </p>
        </>,
        "You can fetch custom plants in the conveyor after creating them in the seedbank node",
        "More options in Level Definition/Wave Settings",
        "Molds objective, under Other grid items in Board Items",
        "Inital Board will now show what is the board item in it's header",
      ],
    },
    {
      version: "v0.9.1",
      date: "2026/4/28",
      title: "Seedbank rework",
      description: "Node enhancements",
      changes: [
        "Design changes on seedbank node",
        "Custom plants have it's own button now",
        "Custom plants will appear above the regular plants in preset/include Plant lists",
      ],
    },
    {
      version: "v0.9",
      date: "2026/4/25",
      title: "Conveyor",
      description: "New node",
      changes: [
        <>
          Conveyor support
          <p className="text-gray-400">
            Adding one plant into InitialPlantList list will automatically disable seedbank and sundropper.
          </p>
          <p className="text-gray-400">
            Emptying the InitialPlantList will enable seedbank and sundroppers.
          </p>
          </>,
        "Delete button for individual ambushes in picked ambushes",
        "Minor design changes",
      ],
    },
    {
      version: "v0.8.1",
      date: "2026/4/21",
      title: "Pinata",
      description: "New node",
      changes: [
        "Pinata Party support",
      ],
    },
    {
      version: "v0.8",
      date: "2026/4/17",
      title: "Overhaul",
      description: "Node enhancements",
      changes: [
        <>
          <p className="text-black text-2xl mb-4">Events/Ambushes</p>
          <div className="space-y-4">
            <p>
              Selected ambushes in Picked ambushes are followed by '- deselect'
            </p>
            <p>Ambush to waves mapping waves now only display the ambush ID</p>
            <p>
              After selecting a wave in Ambush to waves mapping, you can remove
              it's ambushes from the section below it.
            </p>
            <p>
              'Board to ambush' button, it takes items from initial board and
              modifies the ambush code depending on which ambush you are
              selecting
            </p>
            <p>
              Adding multiple zombies in the initial board then pressing 'Board
              to ambush' will add a LowTide per each zombie in picked ambushes
            </p>
          </div>
        </>,
        <>
          <p className="text-black text-2xl mb-4">Wave Node</p>
          <div className="space-y-4">
            <p>
              Each wave node has it's own pf/tide/jam modifier
            </p>
            <p>
              Alongside a MustKillAllToNextWave checkbox for custom air raid levels
            </p>
          </div>
        </>,
        <>
          <p className="text-black text-2xl mb-4">Zombie Pool</p>
          <div className="space-y-4">
            <p>
              SandStorm/RaidingParty/SpiderRain/ParachuteRain are added as dolar symbol zombies you can add into zombie pool
            </p>
            <p>
              And Dinos/FrostWinds are added as well
            </p>
          </div>
        </>,
        <>
          <p className="text-black text-3xl mb-4">Initial Board</p>
          <div className="space-y-4">
            <p>
            You can now add Zombies into Initial Board using Zombie Hotkeys.
            </p>
            <p>
            Unrecognized Grid Items in Initial Board are replaced by Gravestone tutorial by the game.
            </p>
          </div>
        </>,
      ],
    },
    {
      version: "v0.7",
      date: "2026/4/14",
      title: "Ambush support",
      description: "New node",
      changes: [
        "Ambush node, to manage events and ambushes",
        <>
          Import/Export data button.
          <p className="text-gray-400">
            You can drag and drop the imported file into NLM and all it's data
            will be loaded.
          </p>
        </>,
      ],
    },
    {
      version: "v0.6",
      date: "2026/4/11",
      title: "Aerial Fortress",
      description: "New nodes",
      changes: [
        "Minor spelling mistake fix (Gardenless' code) --> (Gardendless' code)",
        <>
          Hotkeys for header's buttons
          <p className="text-gray-400">
            If the hotkeys doesn't work, press them while holding 'fn'.
          </p>
        </>,
        "Planks and Initial tide are added.",
        "Custom dialogues support with all characters and actions.",
        "Sky stage now available, with the ability to modify the ship's properties",
        <>
          Air Raid node
          <p className="text-gray-400">
            Air raid zombies found in the sky8 are CurrentLevel zombies.
          </p>
          <p className="text-gray-400">
            Which means you must click the plus icon followed by the wrench icon
            and click ctrl+s for the air raid zombie to work in your custom air
            raid level
          </p>
          <p className="text-gray-400">
            for the teams, you should make custom plants in the seedbank node,
            after that press 'Refresh' in order for your custom plants to
            appear.
          </p>
          <p className="text-gray-400">
            enabling air raid will automatically remove Seedbank from the
            level's code.
          </p>
        </>,
      ],
    },
    {
      version: "v0.5",
      date: "2026/3/26",
      title: "Seedbank",
      description: "New node",
      changes: [
        "Plant preset/include/exclude lists support",
        "Custom plant support in preset/include sections",
      ],
    },
    {
      version: "v0.4",
      date: "2026/3/17",
      title: "Custom zombies support + Level objectives",
      description: "Node enhancements + new nodes",
      changes: [
        "Moved Change log and Level Preview into the header to save space",
        "Grid Items -> Board Items, split into categories, initial plants/zombies support, search feature for long categories.",
        <>
          <p>
            Custom zombies support, press the plus icon on selected zombies to
            make a custom variant.
          </p>
          <p className="text-gray-400">
            (don't forget to make a unique alias and props for every custom
            zombie)
          </p>
        </>,
        <>
          <p>An Objective/Challenges node</p>
          <p className="text-gray-400">
            save our seeds doesn't require a challenge module so you don't need
            to tick the checkbox for it
          </p>
        </>,
      ],
    },
    {
      version: "v0.3.1",
      date: "2026/3/11",
      title: "Grit Item fixes",
      description: "Rails and powertiles fix",
      changes: [
        "Rails and carts now work correctly",
        "Powertiles now appear when added in initial grid items",
        "More buttons in the header",
      ],
    },
    {
      version: "v0.3",
      date: "2026/3/7",
      title: "Grid Items",
      description: "New nodes",
      changes: [
        "Initial grid items node",
        "however InitialGridItemProperties doesn't work with rails (pvzge devs plz fix it)",
        "A new button that shows you the latest board items you used",
        "Scroll up/down to switch between the last items after the side bar shows",
        "More features (mower checkbox + Sun drop rate + ZombiCountDownFirstWaveSecs)",
        "Set first wave countdown to -1 if you don't want it added in the level",
        "Clear data button that deletes all stored data and start from fresh",
      ],
    },
    {
      version: "v0.2",
      date: "2026/3/4",
      title: "Level Preview",
      description: "New nodes",
      changes: [
        "A level preview node that allows you to see the code",
        "A change log",
        "Refactors for code base",
      ],
    },
    {
      version: "v0.1",
      date: "2026/3/3",
      title: "Initial Release",
      description:
        "The first version of NLM (it stands for Node Level Manager)",
      changes: [],
    },
  ];

  return (
    <div 
      className="space-y-4 overflow-y-auto p-4 w-3xl nowheel"
    >
      {versions.map((version, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-cyan-100 transition-colors p-4">
          {/* Version number and date */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {version.version}
            </span>
            <span className="text-xs text-gray-500">{version.date}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 text-black">
            {version.title}
          </h3>
          
          {/* Description */}
          <p className="text-lg font-medium text-black mb-2 text-wrap">
            {version.description}
          </p>
          
          {/* Features/changes list */}
          {version.changes && version.changes.length > 0 && (
            <ul className="text-sm space-y-1">
              {version.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-gray-600">{change}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Version;