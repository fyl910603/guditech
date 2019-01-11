export function getAreaData(list, selectedIds: string[] = []) {
  if (list && list.length) {
    list.map(item => {
      const children = item.children;
      if (children && children.length) {
        selectedIds = getAreaData(children, selectedIds);
        if (selectedIds.indexOf(item.key) > -1) {
          selectedIds = selectedIds.filter(id => !children.find(c => c.key === id));
        }
      }
    });
  }
  return selectedIds;
}


