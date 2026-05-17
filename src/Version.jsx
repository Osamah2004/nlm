const Version = () => {
  const versions = [
    {
      version: "v1.1.1",
      date: "2026/5/17",
      title: "FirstReward support",
      description: "Node enhancement",
      changes: [
        "FirstRewardType + FirstRewardParam support, within Miscellaneous.",
      ],
    },
    {
      version: "v1.1",
      date: "2026/5/17",
      title: "Escalation",
      description: "New node",
      changes: [
        "Added dynamic escalation for difficulties.",
        "Fixed SpawnPlant board to ambush incorrect positioning.",
        "Added an option to remove StandardIntro from module, within All Alone pop up.",
        "Added dynamic pf in waves nodes.",
      ],
    },
    {
      version: "v1.0.1",
      date: "2026/5/16",
      title: "All Alone enhancement",
      description: "Enhancement",
      changes: [
        "Search feature added.",
      ],
    },
    {
      version: "v1.0",
      date: "2026/5/15",
      title: "Miscellaneous",
      description: "NLM Full release.",
      changes: [
        <>
          <p className="text-black font-bold text-3xl mb-4">Miscellaneous</p>
          <div className="space-y-4 *:text-lg">
            <p>
              For other types of modifications in your custom level, this node might come in handy
            </p>
            <p>It comes with the following</p>
              <ol className="list-decimal list-inside *:text-black *:font-medium">
                <li>
                  A debug mode
                  <p>
                    For those who quickly want to test their level, this button changes the first wave delay to be 0 seconds, with 9900 starting sun, and one-hit-kill to preset plants
                  </p>
                </li>
                <li>
                  25 sun meta
                  <p>
                    If you want extra spice to your level, this button is for you
                  </p>
                </li>
                <li>
                  Mini games
                  <p>
                    Air Raid is moved inside Miscellaneous
                  </p>
                  <p>
                    For All Alone, you have to set the plant's position in Initial Board
                  </p>
                  <p>
                    And for cannons away, you have to set the path of each row in Initial Board as well, but you don't have to go into Miscellaneous to enable it, as explained in Board Items
                  </p>
                  <p>
                    You can find Powerder keg's wire in 'Other grid items' under Board Items
                  </p>
                  <p>
                    For bowling, search for 'tool' in conveyor plants, and add them to conveyor's initial plant list
                  </p>
                  <p>
                    To disable beghouled, just clear initial plants
                  </p>
                </li>
                <li>
                  Custom zombosses
                  <p>
                    I tried to make a custom zomboss one time for RFL, and sure as hell it wasn't fun
                    , so why not streamline making him?
                  </p>
                  <p>
                    quickly set up the number of stages your custom zomboss have
                    and quickly set the zombies per each stage.
                  </p>
                </li>
                <li>
                  Custom sun dropper + Sun bomb
                </li>
                <li>
                  Dark Alchemy
                  <p>With plants as potions of course, (I hate how they suddenly appear without an animation).</p>
                </li>
                <li>
                  Custom objective text 
                  <p>can't wait to see brainrot slangs the second i open a gardendless custom level.</p>
                </li>
                <li>
                    Zombies/Plants modifications
                    <p>
                      stats/speed/cost/hp/etc...
                    </p>
                </li>
              </ol>
          </div>
        </>,
        <>
          <p className="text-black font-bold text-3xl mb-4">Page layout</p>
          <div className="text-lg text-black">
            <p>Customize which node appears and which doesn't</p>
            <p>And customize their on page load locations as well</p>
          </div>
        </>,
        <>
          <p className="text-black font-bold text-3xl mb-4">Board Items</p>
          <div className="text-lg text-black">
            <p>Spline Points</p>
            <li>
              <p>
                For zombies who you want to follow a specific path
                Draw the path in Initial Board using SplinePoints,
              </p>
              <p>
                Go to events/ambushes after drawing your path, at the bottom of list of ambushes, you will find a path.
              </p>
              <p>
                Upon selecting the path ambush and pressing 'Board to ambush' button, you will see a WalkingRoute.
              </p>
            </li>
            <p>Cannons Away</p>
            <li>
              <p>Draw your path per each row for cannons away and the level will make your seagulls follow</p>
              <p>And plants a column of coconuts at x1</p>
              <p>Putting a path at x1 or x0 will turn it into something similar to Altroz's Fright Theaters</p>
            </li>
          </div>
        </>,
        <p className="text-lg text-black">VERSION 1.0 AT LASSST (insert celebration voices)</p>,
        <p>ik there's still some missing things, but they are few and will come soon in post v1.0 updates</p>,
        <p>and if you find any bugs, or want any features, go to this <a href="https://discord.com/channels/1265377295846346803/1481226047797198868">this gardendless thread</a></p>,
        <p>or dm me in discord, this is my username: osamah_o</p>
      ],
    },
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
      className="space-y-4 overflow-y-auto p-4 w-5xl nowheel"
    >
      {versions.map((version, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-cyan-50 transition-colors p-4">
          {/* Version number and date */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {version.version}
            </span>
            <span className="text-black">{version.date}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-4xl font-bold mb-3 text-black">
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
                  <span className="text-gray-600 text-lg">{change}</span>
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