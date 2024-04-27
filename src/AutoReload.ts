// LiteLoader-AIDS automatic generated
/// <reference path="i:\Levilamina-Aids/dts/HelperLib-master/src/index.d.ts"/>

interface breakingInfo {
    /**
     * UniqueID of Player
     */
    player: string;
    block: blockInfo;
    mainhandItem: Item;
}

interface blockInfo {
    [key: string]: string | number;
    x: number;
    y: number;
    z: number;
    dimid: number;
    type: string;
}

let breakingList: breakingInfo[] = [];

function reloadItem(pl: Player, it: Item): void {
    if (it.isNull()) {
        return;
    }
    setTimeout(() => {
        if (pl.getHand().isNull()) {
            let invArr = pl.getInventory().getAllItems();
            for (let _it of invArr) {
                if (_it.type !== it.type) {
                    continue;
                }
                if (pl.getHand().isNull()) {
                    pl.getHand().set(_it);
                    _it.setNull();
                    pl.refreshItems();
                    break;
                }
            }
        }
    }, 600);
}

mc.listen("onUseItem", (pl, it) => {
    reloadItem(pl, it);
});

mc.listen("onAte", (pl, it) => {
    reloadItem(pl, it);
});

mc.listen("onConsumeTotem", (pl) => {
    reloadItem(pl, mc.newItem("minecraft:totem_of_undying", 1) as Item);
});

mc.listen("onStartDestroyBlock", (pl, bl) => {
    if (!pl.getHand().isNull()) {
        let info: breakingInfo = {
            player: pl.uniqueId,
            block: {
                x: bl.pos.x,
                y: bl.pos.y,
                z: bl.pos.z,
                dimid: bl.pos.dimid,
                type: bl.type,
            },
            mainhandItem: pl.getHand(),
        };
        breakingList.push(info);
    }
});

mc.listen("onLeft", (pl) => {
    for (let i = 0; i < breakingList.length; i++) {
        if (breakingList[i].player === pl.uniqueId) {
            breakingList.splice(i, 1);
            break;
        }
    }
});

setInterval(() => {
    let deleteIndexArr: number[] = [];
    for (let i = 0; i < breakingList.length; i++) {
        let pl = mc.getPlayer(breakingList[i].player);
        let viewBlock = pl.getBlockFromViewVector();
        if (viewBlock === null) {
            continue;
        }
        let breakingBlockInfo = breakingList[i].block;
        let viewBlockInfo: blockInfo = {
            x: viewBlock.pos.x,
            y: viewBlock.pos.y,
            z: viewBlock.pos.z,
            dimid: viewBlock.pos.dimid,
            type: viewBlock.type,
        };
        let sameBlock = true;
        for (let prop in breakingBlockInfo) {
            if (viewBlockInfo[prop] !== breakingBlockInfo[prop]) {
                sameBlock = false;
                break;
            }
        }
        if (!sameBlock) {
            deleteIndexArr.push(i);
        }
    }
    for (let index of deleteIndexArr) {
        breakingList.splice(index, 1);
    }
}, 800);

mc.listen("onDestroyBlock", (pl, bl) => {
    for (let i = 0; i < breakingList.length; i++) {
        if (breakingList[i].player === pl.uniqueId) {
            let { mainhandItem } = breakingList[i];
            reloadItem(pl, mainhandItem);
            break;
        }
    }
});
