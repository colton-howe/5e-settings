import { RegisterHook, HookRegistrant } from "../Models";
import { LongRestResult } from "./Models";
import Table from "./Table";

const filterPreparedSpells = (html: HTMLElement) => {
    $('tr.prepared-spell-row').show();
    const selectedLevel: string = $(html).find(':selected').val() as string;
    if (selectedLevel != "All") {
        $('tr.prepared-spell-row[data-spell-level!=' + selectedLevel + ']').hide();
    }
};

(window as any).filterPreparedSpells = filterPreparedSpells;

class SpellPreparer implements HookRegistrant {
    
    public name = () => {
        return "SpellPreparer";
    }
    
    public register = () => {
        Hooks.on("restCompleted", (actor: Actor5e, result: LongRestResult) => {
            if (!result.longRest) {
                return true;
            }

            const preparedActorSpells: Item5e[] = actor.data.items.filter(item => item.data.type === "spell" && item.data.data.preparation.mode === "prepared");
            if (preparedActorSpells.length === 0) {
                return true;
            }

            const buildTableHeader = (): string => "<tr><th>Prepared</th><th>Level</th><th>Spell Name</th></tr>";
            const buildTableRow = (item: Item5e): string =>  {
                const itemData = (item.data as data5e.SpellDataSource).data;
                return `<tr class="prepared-spell-row" data-spell-level=${itemData.level}>
                    <td style="text-align: center;"><input type="checkbox" id="${item.id}" ${itemData.preparation.prepared ? "checked" : ""} data-selected="${itemData.preparation.prepared}" onchange="$(this).attr('data-selected', $(this).prop('checked'))"></td>
                    <td style="text-align: center;">${itemData.level}</td>
                    <td>${item.data.name}</td>
                </tr>`;
            };
            const preparedSpellTable: Table<Item5e> = Table.builder(buildTableRow, buildTableHeader);
            
            preparedSpellTable.addColumn({width: "78px"}).addColumn({width: "45px"}).addColumn({width: "255px"});
            preparedActorSpells.sort(this.orderSpellsByLevel).forEach(spell => preparedSpellTable.addRow(spell));

            new Dialog({
                title: "Prepare Spells",
                content: this.buildDialog(preparedSpellTable),
                buttons: {
                    ok: {
                        label: "Change Prepared Spells",
                        callback: (jQuery: JQuery) => {
                            const newPreparedSpellIds: string[] = [];
                            jQuery.find("input[data-selected=true]").each((i, input) => { newPreparedSpellIds.push(input.id) });
                            this.prepareSpells(actor, preparedActorSpells, newPreparedSpellIds);
                        }
                    }
                },
                default: "ok"
            }, {
                tabs: [{navSelector: ".tabs"}]
            }).render(true);

            return true;
        });
    }

    public registerWhen = () => {
        return RegisterHook.SETUP;
    }
    
    public dependsOn = () => {
        return [];
    }

    private orderSpellsByLevel = (spell1: Item5e, spell2: Item5e): number => {
        const spell1Data = (spell1.data as data5e.SpellDataSource).data;
        const spell2Data = (spell2.data as data5e.SpellDataSource).data;
        return spell1Data.level - spell2Data.level;
    }

    private buildDialog = (table: Table<Item5e>): string => {
        return `<div>
            <div>
                <label for="spell-level">Spell Level: </label>
                <select name="spell-level" id="spell-level-selector" onchange="filterPreparedSpells(this)"/>
                    <option value="All">All</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                    <option value="5">5th</option>
                    <option value="6">6th</option>
                    <option value="7">7th</option>
                    <option value="8">8th</option>
                    <option value="9">9th</option>
                </select>
            </div>    
            <div class="table-wrapper" style="height: 400px; overflow-y: auto;">
                ${table.build()}
            </div>
        </div>`;
    }

    private prepareSpells = (actor: Actor5e, allPreperationSpells: Item5e[], spellIdsToPrepare: string[]) => {
        const updates: Record<string, any>[] = [];
        allPreperationSpells.forEach(spell => {
            const itemData = (spell.data as data5e.SpellDataSource).data;
            const newPreparedStatus = spellIdsToPrepare.includes(spell.id!);
            if (itemData.preparation.prepared !== newPreparedStatus) {
                updates.push({"data.preparation.prepared": newPreparedStatus, "_id": spell.id});
            }
        });
        Item.updateDocuments(updates, {parent: actor});
    }
}

export default new SpellPreparer();