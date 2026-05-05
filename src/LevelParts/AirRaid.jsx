import { useState, useEffect } from "react";
import Checkbox from "../Inputs/CheckboxInput";
import NumberInput from "../Inputs/NumberInput";
import TextInput from "../Inputs/TextInput";

const getFromStorage = (key) => JSON.parse(localStorage.getItem(key));
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const FighterItem = ({ fighter, index, onFullPointChange, onDelete }) => {
    return (
        <div className="flex items-center gap-2 bg-white rounded p-2 shadow-sm border border-cyan-200 mb-2">
            <span className="font-medium text-cyan-800 min-w-25">{fighter.Type}</span>
            <div className="ml-auto mr-1 space-x-1 flex">
                <NumberInput
                    label={`FullPoint`}
                    step={500}
                    default={fighter.FullPoint || 1000}
                    setter={(val) => onFullPointChange(index, Number(val))}
                    small
                    />
                <button
                    onClick={() => onDelete(index)}
                    className="text-red-500 cursor-pointer hover:text-red-700 text-sm px-2 rounded bg-red-50 hover:bg-red-100 transition-colors"
                    >
                    ✕
                </button>
            </div>
        </div>
    );
};

const TeamCard = ({ team, teamIndex, onUpdateFighter, onDeleteFighter, onUpdateName, onUpdateDifficulty, isSelected, onSelect }) => {
    return (
        <div
            className={`border rounded-lg p-3 transition-all cursor-pointer ${isSelected ? 'border-cyan-500 bg-cyan-300/50 shadow-md' : 'border-cyan-400 bg-white hover:bg-cyan-100/50'}`}
            onClick={onSelect}
        >
            <div className="flex flex-wrap gap-3 mb-3 items-end">
                <TextInput
                    label={`Team ${teamIndex + 1} name`}
                    default={team.Name?.en || ''}
                    setter={(val) => onUpdateName(teamIndex, val)}
                />
                <NumberInput
                    label={`Team ${teamIndex + 1} difficulty`}
                    default={team.Difficulty || 1}
                    min={1}
                    setter={(val) => onUpdateDifficulty(teamIndex, Number(val))}
                />
            </div>
            <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-cyan-700">Fighters:</span>
                </div>
                <div className="max-h-48 overflow-y-auto nowheel">
                    {team.Members?.map((fighter, idx) => (
                        <FighterItem
                            key={idx}
                            fighter={fighter}
                            index={idx}
                            onFullPointChange={(fIdx, val) => onUpdateFighter(teamIndex, fIdx, val)}
                            onDelete={(fIdx) => onDeleteFighter(teamIndex, fIdx)}
                        />
                    ))}
                    {(!team.Members || team.Members.length === 0) && (
                        <>
                            <div className="text-gray-400 text-sm italic p-2">Emtpy teams will not be added in code.</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const getTeamName = (i) => sessionStorage.getItem(`Team ${i} name`) || `Team ${i}`

const AirRaid = () => {
    const [customPlants, setCustomPlants] = useState(getFromStorage('customPlants') || []);
    const [teams, setTeams] = useState([
        { Difficulty: 1, Name: { en: getTeamName(1), zh: "队伍 1" }, Members: [] },
        { Difficulty: 1, Name: { en: getTeamName(2), zh: "队伍 2" }, Members: [] },
        { Difficulty: 1, Name: { en: getTeamName(3), zh: "队伍 3" }, Members: [] }
    ]);
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [targetPoint, setTargetPoint] = useState(10000);
    const [atNight, setAtNight] = useState(false);

    // Load saved teams from sessionStorage on mount
    useEffect(() => {
        const savedTeams = sessionStorage.getItem('airRaidTeams');
        if (savedTeams) {
            try {
                const parsed = JSON.parse(savedTeams);
                if (parsed && parsed.length === 3) setTeams(parsed);
            } catch (e) {}
        }
        const savedTarget = sessionStorage.getItem('TargetPoint');
        if (savedTarget) setTargetPoint(Number(savedTarget));
        const savedNight = sessionStorage.getItem('AtNight');
        if (savedNight !== null) setAtNight(savedNight === 'true');
    }, []);

    // Save teams to sessionStorage whenever they change
    useEffect(() => {
        sessionStorage.setItem('airRaidTeams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        sessionStorage.setItem('TargetPoint', targetPoint);
    }, [targetPoint]);

    useEffect(() => {
        sessionStorage.setItem('AtNight', atNight);
    }, [atNight]);

    const addFighterToTeam = (teamIndex, fighterType) => {
        setTeams(prev => {
            const newTeams = [...prev];
            const newFighter = {
                Type: fighterType,
                FullPoint: 1000
            };
            newTeams[teamIndex] = {
                ...newTeams[teamIndex],
                Members: [...(newTeams[teamIndex].Members || []), newFighter]
            };
            return newTeams;
        });
    };

    const updateFighterFullPoint = (teamIndex, fighterIndex, fullPoint) => {
        setTeams(prev => {
            const newTeams = [...prev];
            const updatedMembers = [...(newTeams[teamIndex].Members || [])];
            updatedMembers[fighterIndex] = {
                ...updatedMembers[fighterIndex],
                FullPoint: fullPoint
            };
            newTeams[teamIndex] = {
                ...newTeams[teamIndex],
                Members: updatedMembers
            };
            return newTeams;
        });
    };

    const deleteFighter = (teamIndex, fighterIndex) => {
        setTeams(prev => {
            const newTeams = [...prev];
            const updatedMembers = [...(newTeams[teamIndex].Members || [])];
            updatedMembers.splice(fighterIndex, 1);
            newTeams[teamIndex] = {
                ...newTeams[teamIndex],
                Members: updatedMembers
            };
            return newTeams;
        });
    };

    const updateTeamName = (teamIndex, name) => {
        setTeams(prev => {
            const newTeams = [...prev];
            newTeams[teamIndex] = {
                ...newTeams[teamIndex],
                Name: { en: name, zh: name }
            };
            return newTeams;
        });
    };

    const updateTeamDifficulty = (teamIndex, difficulty) => {
        setTeams(prev => {
            const newTeams = [...prev];
            newTeams[teamIndex] = {
                ...newTeams[teamIndex],
                Difficulty: difficulty
            };
            return newTeams;
        });
    };

    return (
        <>
            <header className="text-2xl bg-cyan-500 font-bold text-black p-1">
                Air Raid
            </header>
            <div className="flex gap-6 w-250 text-black">
                {/* LEFT SIDE - Custom Plants Palette */}
                <div className="w-96 shrink-0">
                        <Checkbox
                            label="Enable air raid"
                            checked={sessionStorage.getItem('Enable air raid') == 'true'}
                            />
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-cyan-800">Custom Plants</h3>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-0.5 mb-4">
                        <div className="grid grid-cols-2 gap-2 p-0.5 max-h-92 overflow-y-auto nowheel">
                            {customPlants.map((plant, idx) => (
                                <button
                                key={idx}
                                    onClick={() => {
                                        if (selectedTeam !== null) {
                                            addFighterToTeam(selectedTeam, plant);
                                        } else {
                                            alert("Please select a team first by clicking on its card.");
                                        }
                                    }}
                                    className="button"
                                    >
                                    {plant}
                                </button>
                            ))}
                            {customPlants.length === 0 && (
                                <p className="text-gray-400 w-80 italic p-2">
                                    Empty custom plant list, go to seedbank node to add custom plants
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 italic">
                        Click a team card to select it, then click any plant above to add it to that team.
                    </div>
                </div>

                {/* RIGHT SIDE - Teams */}
                <div className="flex-1 min-w-0">
                    <div className="mb-3 flex items-center gap-4">
                        <Checkbox
                            label='AtNight'
                            checked={atNight}
                            onChange={setAtNight}
                            />
                        <NumberInput
                            label={"TargetPoint"}
                            step={500}
                            default={10000}
                            value={targetPoint}
                            setter={setTargetPoint}
                            />
                        Team: {selectedTeam + 1}
                    </div>
                    <div className="space-y-3">
                        {teams.map((team, idx) => (
                            <TeamCard
                            key={idx}
                            team={team}
                            teamIndex={idx}
                            onUpdateFighter={updateFighterFullPoint}
                            onDeleteFighter={deleteFighter}
                            onUpdateName={updateTeamName}
                            onUpdateDifficulty={updateTeamDifficulty}
                            isSelected={selectedTeam === idx}
                            onSelect={() => setSelectedTeam(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AirRaid;