function setupEntityUI({
  client,
  listId,
  createBtnId,
  updateBtnId,
  cancelBtnId,
  fields,
  formatItem,
}) {
  return new CrudUIManager({
    client,
    listElement: document.getElementById(listId),
    formElements: {
      createBtn: document.getElementById(createBtnId),
      updateBtn: document.getElementById(updateBtnId),
      cancelBtn: document.getElementById(cancelBtnId),
    },
    fields,
    formatItem,
  });
}
