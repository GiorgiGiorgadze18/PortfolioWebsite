// One module instance shared by the review entry and the existing showroom.
export let showroomBridge=null;
export function registerShowroomBridge(bridge){showroomBridge=bridge;}
